import { createAgentSeoMiddleware } from '@agent-seo/next/middleware';

export default createAgentSeoMiddleware();

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
