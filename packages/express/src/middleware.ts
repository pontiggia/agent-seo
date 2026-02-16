import type { Request, Response, NextFunction } from 'express';
import {
  detectAgent,
  transform,
  generateLlmsTxt,
  buildMarkdownHeaders,
  buildAlternateLinkHeader,
  createCache,
} from '@agent-seo/core';
import type {
  AgentSeoOptions,
  TransformResult,
  AIRequestContext,
} from '@agent-seo/core';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      aiContext?: AIRequestContext;
    }
  }
}

export function agentSeo(options: AgentSeoOptions) {
  const cache =
    options.cache?.enabled !== false
      ? createCache({
          maxEntries: options.cache?.maxEntries,
          ttl: options.cache?.ttl,
        })
      : null;

  const excludePatterns = options.exclude || [
    '/api/**',
    '/_next/**',
    '/static/**',
    '/assets/**',
    '/favicon.ico',
  ];

  return async function agentSeoMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const path = req.path;

    // === ROUTE: /llms.txt ===
    if (path === '/llms.txt') {
      serveLlmsTxt(res, options, false);
      return;
    }

    // === ROUTE: /llms-full.txt ===
    if (path === '/llms-full.txt') {
      serveLlmsTxt(res, options, true);
      return;
    }

    // === ROUTE: *.md (Markdown alternate) ===
    if (path.endsWith('.md') && path !== '/llms.txt') {
      const originalPath = path.slice(0, -3);
      req.url = originalPath;
      (req as any).path = originalPath;
      (req as any).aiContext = {
        isAIBot: false,
        bot: null,
        wantsMarkdown: true,
      };
      interceptAndTransform(req, res, next, options, cache);
      return;
    }

    // === DETECT AI BOT ===
    const ua = req.headers['user-agent'] as string | undefined;
    const accept = req.headers['accept'] as string | undefined;
    const aiCtx = detectAgent(ua, accept);
    req.aiContext = aiCtx;

    // If this is an AI bot or client wants Markdown, intercept the response
    if (
      (aiCtx.isAIBot || aiCtx.wantsMarkdown) &&
      !isExcluded(path, excludePatterns) &&
      isIncluded(path, options.include)
    ) {
      interceptAndTransform(req, res, next, options, cache);
      return;
    }

    // Set Vary header on all responses to prevent cache poisoning
    res.setHeader('Vary', 'Accept, User-Agent');

    // Inject Link header to Markdown alternate
    if (!isExcluded(path, excludePatterns)) {
      const linkHeader = buildAlternateLinkHeader(path);
      const existingLink = res.getHeader('Link');
      if (existingLink) {
        res.setHeader('Link', `${existingLink}, ${linkHeader}`);
      } else {
        res.setHeader('Link', linkHeader);
      }
    }

    next();
  };
}

function interceptAndTransform(
  req: Request,
  res: Response,
  next: NextFunction,
  options: AgentSeoOptions,
  cache: ReturnType<typeof createCache> | null,
): void {
  const path = req.path;

  // Check cache first
  if (cache?.has(path)) {
    const cached = cache.get(path)!;
    sendMarkdownResponse(res, cached, options);
    return;
  }

  // Monkey-patch res.write and res.end to capture the HTML output
  const chunks: Buffer[] = [];
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk: any, ...args: any[]): boolean {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return true;
  } as any;

  res.end = function (chunk?: any, ...args: any[]) {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const html = Buffer.concat(chunks).toString('utf-8');

    // Only transform HTML responses
    const contentType = (res.getHeader('content-type') as string) || '';
    if (!contentType.includes('text/html')) {
      originalWrite.call(res, html, 'utf-8');
      return originalEnd.call(res, undefined as any, 'utf-8');
    }

    transform(html, {
      url: `${options.baseUrl}${path}`,
      ...options.transform,
    })
      .then((result) => {
        cache?.set(path, result);

        res.removeHeader('content-type');
        res.removeHeader('content-length');

        const headers = buildMarkdownHeaders(result, options);
        for (const [key, value] of Object.entries(headers)) {
          if (value !== undefined) res.setHeader(key, value);
        }

        res.statusCode = 200;
        originalEnd.call(res, result.markdown, 'utf-8');
      })
      .catch((err) => {
        console.error('[agent-seo] Transform error:', err);
        originalEnd.call(res, html, 'utf-8');
      });
  } as any;

  next();
}

function sendMarkdownResponse(
  res: Response,
  result: TransformResult,
  options: AgentSeoOptions,
): void {
  const headers = buildMarkdownHeaders(result, options);
  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined) res.setHeader(key, value);
  }
  res.status(200).send(result.markdown);
}

function serveLlmsTxt(
  res: Response,
  options: AgentSeoOptions,
  full: boolean,
): void {
  const routes = options.llmsTxt?.routes || [];

  const result = generateLlmsTxt(
    {
      siteName: options.siteName,
      siteDescription: options.siteDescription,
      baseUrl: options.baseUrl,
      ...options.llmsTxt,
    },
    routes,
  );

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(full ? result.llmsFullTxt : result.llmsTxt);
}

function isExcluded(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => matchGlob(pattern, path));
}

function isIncluded(
  path: string,
  include?: string[] | ((path: string) => boolean),
): boolean {
  if (!include) return true;
  if (typeof include === 'function') return include(path);
  return include.some((pattern) => matchGlob(pattern, path));
}

function matchGlob(pattern: string, path: string): boolean {
  const regex = pattern
    .replace(/\*\*/g, '{{DOUBLESTAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/{{DOUBLESTAR}}/g, '.*');
  return new RegExp(`^${regex}$`).test(path);
}
