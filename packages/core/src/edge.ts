/**
 * Edge-compatible exports from @agent-seo/core.
 * This entrypoint only includes modules that work in Edge runtimes
 * (no Node.js-only dependencies like jsdom, stream, etc.)
 */

// Types
export type {
  BotPurpose,
  BotInfo,
  AIRequestContext,
  TransformOptions,
  TransformResult,
  LlmsTxtRoute,
  LlmsTxtOptions,
  LlmsTxtResult,
  AgentSeoHeaders,
  AgentSeoOptions,
} from './types.js';

// Bot Detection (pure regex, no Node.js deps)
export { detectAgent, shouldServeMarkdown, AI_BOT_REGISTRY } from './detect.js';

// Token Estimation (pure math, no Node.js deps)
export { estimateTokens } from './tokens.js';

// Response Headers (pure string manipulation, no Node.js deps)
export { buildMarkdownHeaders, buildAlternateLinkHeader } from './headers.js';

// llms.txt Generation (pure string manipulation, no Node.js deps)
export { generateLlmsTxt } from './llms-txt.js';
