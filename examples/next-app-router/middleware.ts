import { createAgentSeoMiddleware } from '@agent-seo/next/middleware';

export const middleware = createAgentSeoMiddleware();

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};
