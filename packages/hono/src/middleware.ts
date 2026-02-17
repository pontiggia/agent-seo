import type { Context, Next, MiddlewareHandler } from 'hono';
import {
  detectAgent,
  transform,
  generateLlmsTxt,
  buildMarkdownHeaders,
  buildAlternateLinkHeader,
  createCache,
} from '@agent-seo/core';
import type { AgentSeoOptions } from '@agent-seo/core';

export function agentSeo(options: AgentSeoOptions): MiddlewareHandler {
  const cache =
    options.cache?.enabled !== false
      ? createCache({
          maxEntries: options.cache?.maxEntries,
          ttl: options.cache?.ttl,
        })
      : null;

  return async (c: Context, next: Next) => {
    const url = new URL(c.req.url);
    const path = url.pathname;
    const cacheKey = buildCacheKey(c.req.method, url);
    const canCache = Boolean(cache) && isCacheableRequest(c);

    // Route: /llms.txt or /llms-full.txt
    if (path === '/llms.txt' || path === '/llms-full.txt') {
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
      return c.text(
        path === '/llms-full.txt' ? result.llmsFullTxt : result.llmsTxt,
        200,
        {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      );
    }

    // Detect AI bot
    const ua = c.req.header('user-agent');
    const accept = c.req.header('accept');
    const aiCtx = detectAgent(ua, accept);

    // Set Vary header on ALL responses
    c.header('Vary', 'Accept, User-Agent');

    // Add Link alternate header
    c.header('Link', buildAlternateLinkHeader(path));

    if (aiCtx.isAIBot || aiCtx.wantsMarkdown) {
      // Check cache
      if (canCache && cache!.has(cacheKey)) {
        const cached = cache!.get(cacheKey)!;
        const headers = buildMarkdownHeaders(cached, options, path);
        return c.text(
          cached.markdown,
          200,
          headers as unknown as Record<string, string>,
        );
      }

      // Let the route handler run, then intercept
      await next();

      // Get the response body
      const contentType = c.res.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) return;

      const html = await c.res.text();
      const result = await transform(html, {
        url: `${options.baseUrl}${path}`,
        ...options.transform,
      });

      if (canCache && !hasSetCookie(c)) {
        cache!.set(cacheKey, result);
      }
      const headers = buildMarkdownHeaders(result, options, path);
      c.res = new Response(result.markdown, {
        status: 200,
        headers: headers as unknown as Record<string, string>,
      });
      return;
    }

    await next();
  };
}

function buildCacheKey(method: string, url: URL): string {
  return `${method.toUpperCase()}:${url.pathname}${url.search}`;
}

function isCacheableRequest(c: Context): boolean {
  const method = c.req.method.toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') return false;
  const hasAuth = Boolean(c.req.header('authorization') || c.req.header('cookie'));
  return !hasAuth;
}

function hasSetCookie(c: Context): boolean {
  return Boolean(c.res.headers.get('set-cookie'));
}
