import { detectAgent } from '@agent-seo/core/edge';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface AgentSeoMiddlewareOptions {
  /**
   * Glob patterns for paths that should NEVER be rewritten to Markdown.
   * Merged with built-in defaults (see `DEFAULT_EXCLUDE`).
   *
   * @example ['\/dashboard\/**', '\/admin\/**', '\/api\/private\/**']
   */
  exclude?: string[];
}

/** Paths that are always skipped — framework internals + standard files. */
const ALWAYS_SKIP = new Set([
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
]);

/** Default exclude patterns — users can extend but not remove these. */
const DEFAULT_EXCLUDE: string[] = [
  '/api/**',
  '/_next/**',
];

/**
 * Creates a Next.js middleware that:
 * 1. Detects AI bot requests via User-Agent
 * 2. Rewrites AI bot requests to an internal transform API route
 *    that converts HTML → Markdown (runs on Node.js runtime)
 * 3. Handles `.md` suffix requests (e.g. `/about.md` → transform `/about`)
 * 4. Sets `Vary: Accept, User-Agent` on all responses
 */
export function createAgentSeoMiddleware(options: AgentSeoMiddlewareOptions = {}) {
  const excludePatterns = [...DEFAULT_EXCLUDE, ...(options.exclude || [])];

  return function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip standard files (robots.txt, favicon, llms.txt, etc.)
    if (ALWAYS_SKIP.has(pathname)) {
      return NextResponse.next();
    }

    // Skip excluded patterns (API routes, admin, dashboard, etc.)
    if (isExcluded(pathname, excludePatterns)) {
      return NextResponse.next();
    }

    const ua = request.headers.get('user-agent');
    const accept = request.headers.get('accept');
    const aiCtx = detectAgent(ua, accept);

    // Handle explicit .md suffix requests (e.g. /about.md)
    if (pathname.endsWith('.md')) {
      const originalPath = pathname.slice(0, -3) || '/';
      const transformUrl = new URL('/api/agent-seo-transform', request.url);
      transformUrl.searchParams.set('path', originalPath);
      return setBotHeaders(NextResponse.rewrite(transformUrl));
    }

    // If AI bot, rewrite to transform API
    if (aiCtx.isAIBot) {
      const transformUrl = new URL('/api/agent-seo-transform', request.url);
      transformUrl.searchParams.set('path', pathname);
      return setBotHeaders(NextResponse.rewrite(transformUrl));
    }

    // Normal request — just add Vary header
    const response = NextResponse.next();
    response.headers.set('Vary', 'Accept, User-Agent');
    return response;
  };
}

/**
 * Set clean, bot-friendly headers on a rewrite response.
 * Overrides Next.js RSC-related headers that can confuse AI bots.
 */
function setBotHeaders(response: NextResponse): NextResponse {
  response.headers.set('Content-Disposition', 'inline');
  response.headers.set('Vary', 'Accept, User-Agent');
  response.headers.set('X-Robots-Tag', 'all');
  response.headers.delete('x-nextjs-matched-path');
  return response;
}

function isExcluded(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => matchGlob(pattern, path));
}

function matchGlob(pattern: string, path: string): boolean {
  const regex = pattern
    .replace(/\*\*/g, '{{DOUBLESTAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/{{DOUBLESTAR}}/g, '.*');
  return new RegExp(`^${regex}$`).test(path);
}
