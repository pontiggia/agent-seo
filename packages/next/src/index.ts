export { withAgentSeo } from './plugin.js';
export type { WithAgentSeoOptions } from './plugin.js';
export { createAgentSeoMiddleware } from './middleware.js';
export { createLlmsTxtHandler } from './route-handler.js';
export type { LlmsTxtHandlerOptions } from './route-handler.js';
export {
  generateLlmsTxt,
  discoverNextRoutes,
  transform,
} from '@agent-seo/core';
export type {
  AgentSeoOptions,
  AIRequestContext,
  TransformResult,
  BotInfo,
  BotPurpose,
  LlmsTxtRoute,
  DiscoverOptions,
} from '@agent-seo/core';
