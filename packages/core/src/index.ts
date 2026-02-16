// Types
export type {
  BotPurpose,
  BotInfo,
  AIRequestContext,
  TransformOptions,
  TurndownRule,
  TransformResult,
  LlmsTxtRoute,
  LlmsTxtOptions,
  LlmsTxtResult,
  AgentSeoHeaders,
  AgentSeoOptions,
} from './types.js';

// Bot Detection
export { detectAgent, shouldServeMarkdown, AI_BOT_REGISTRY } from './detect.js';

// Transformation Pipeline
export { transform } from './transform.js';

// Sanitization
export { sanitizeHtml } from './sanitize.js';

// Markdown Conversion
export { htmlToMarkdown } from './markdown.js';

// Token Estimation
export { estimateTokens } from './tokens.js';

// JSON-LD Extraction
export { extractJsonLdBlocks } from './json-ld.js';

// llms.txt Generation
export { generateLlmsTxt } from './llms-txt.js';

// Response Headers
export { buildMarkdownHeaders, buildAlternateLinkHeader } from './headers.js';

// Cache
export { createCache } from './cache.js';
export type { CacheOptions } from './cache.js';
