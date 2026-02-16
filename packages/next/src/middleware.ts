import { detectAgent } from '@agent-seo/core';

export function createAgentSeoMiddleware() {
  return function middleware(request: Request) {
    const ua = request.headers.get('user-agent');
    const accept = request.headers.get('accept');
    const aiCtx = detectAgent(ua, accept);

    const headers = new Headers();
    headers.set('Vary', 'Accept, User-Agent');

    if (aiCtx.isAIBot) {
      headers.set('X-Agent-Bot', aiCtx.bot?.name || 'unknown');
      headers.set('X-Agent-Purpose', aiCtx.bot?.purpose || 'unknown');
    }

    return new Response(null, {
      status: 200,
      headers,
    });
  };
}
