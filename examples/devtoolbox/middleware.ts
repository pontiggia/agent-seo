import { createAgentSeoMiddleware } from '@agent-seo/next/middleware';
import { detectAgent } from '@agent-seo/core/edge';
import type { NextRequest } from 'next/server';

const agentSeo = createAgentSeoMiddleware();

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';

  // Skip logging for static assets
  if (!pathname.startsWith('/_next') && pathname !== '/favicon.ico') {
    const ctx = detectAgent(ua, accept);
    const isMdSuffix = pathname.endsWith('.md');

    const action = isMdSuffix
      ? 'REWRITE (.md)'
      : ctx.isAIBot
        ? 'REWRITE (bot)'
        : 'PASS';

    const botLabel = ctx.bot
      ? `${ctx.bot.name} (${ctx.bot.operator}, ${ctx.bot.purpose})`
      : 'none';

    console.log(
      `[agent-seo] ${request.method} ${pathname}` +
        ` | action=${action}` +
        ` | bot=${botLabel}` +
        ` | wantsMd=${ctx.wantsMarkdown}` +
        ` | UA: ${ua.slice(0, 120)}${ua.length > 120 ? '…' : ''}`,
    );
  }

  return agentSeo(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
