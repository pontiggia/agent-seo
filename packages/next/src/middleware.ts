import { detectAgent } from '@agent-seo/core/edge';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Creates a Next.js middleware that:
 * 1. Detects AI bot requests via User-Agent
 * 2. Rewrites AI bot requests to an internal transform API route
 *    that converts HTML → Markdown (runs on Node.js runtime)
 * 3. Handles `.md` suffix requests (e.g. `/about.md` → transform `/about`)
 * 4. Sets `Vary: Accept, User-Agent` on all responses
 */
export function createAgentSeoMiddleware() {
  return function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip internal paths and static assets
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/agent-seo-transform') ||
      pathname === '/favicon.ico' ||
      pathname === '/llms.txt' ||
      pathname === '/llms-full.txt'
    ) {
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
