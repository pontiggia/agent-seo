import type { AIRequestContext, BotInfo, BotPurpose } from './types.js';

interface BotEntry {
  /** Regex pattern to match against User-Agent string */
  pattern: RegExp;
  /** Bot metadata */
  info: BotInfo;
}

const AI_BOT_REGISTRY: BotEntry[] = [
  // === OpenAI ===
  {
    pattern: /GPTBot/i,
    info: { name: 'GPTBot', operator: 'OpenAI', purpose: 'training', rendersJs: false },
  },
  {
    pattern: /OAI-SearchBot/i,
    info: { name: 'OAI-SearchBot', operator: 'OpenAI', purpose: 'search', rendersJs: false },
  },
  {
    pattern: /ChatGPT-User/i,
    info: { name: 'ChatGPT-User', operator: 'OpenAI', purpose: 'agent-browsing', rendersJs: true },
  },

  // === Anthropic ===
  {
    pattern: /ClaudeBot/i,
    info: { name: 'ClaudeBot', operator: 'Anthropic', purpose: 'training', rendersJs: false },
  },
  {
    pattern: /Claude-User/i,
    info: { name: 'Claude-User', operator: 'Anthropic', purpose: 'agent-browsing', rendersJs: true },
  },
  {
    pattern: /Claude-SearchBot/i,
    info: { name: 'Claude-SearchBot', operator: 'Anthropic', purpose: 'search', rendersJs: false },
  },
  {
    pattern: /anthropic-ai/i,
    info: { name: 'anthropic-ai', operator: 'Anthropic', purpose: 'training', rendersJs: false },
  },

  // === Perplexity ===
  {
    pattern: /PerplexityBot/i,
    info: { name: 'PerplexityBot', operator: 'Perplexity', purpose: 'search', rendersJs: false },
  },
  {
    pattern: /Perplexity-User/i,
    info: { name: 'Perplexity-User', operator: 'Perplexity', purpose: 'agent-browsing', rendersJs: true },
  },

  // === Google ===
  {
    pattern: /Google-Extended/i,
    info: { name: 'Google-Extended', operator: 'Google', purpose: 'training', rendersJs: true },
  },

  // === Apple ===
  {
    pattern: /Applebot-Extended/i,
    info: { name: 'Applebot-Extended', operator: 'Apple', purpose: 'training', rendersJs: true },
  },

  // === Meta ===
  {
    pattern: /meta-externalagent/i,
    info: { name: 'Meta-ExternalAgent', operator: 'Meta', purpose: 'training', rendersJs: false },
  },
  {
    pattern: /FacebookBot/i,
    info: { name: 'FacebookBot', operator: 'Meta', purpose: 'search', rendersJs: false },
  },

  // === Common Crawl ===
  {
    pattern: /CCBot/i,
    info: { name: 'CCBot', operator: 'Common Crawl', purpose: 'training', rendersJs: false },
  },

  // === Cohere ===
  {
    pattern: /cohere-ai/i,
    info: { name: 'cohere-ai', operator: 'Cohere', purpose: 'training', rendersJs: false },
  },

  // === Amazon ===
  {
    pattern: /Amazonbot/i,
    info: { name: 'Amazonbot', operator: 'Amazon', purpose: 'search', rendersJs: false },
  },

  // === Bytedance ===
  {
    pattern: /Bytespider/i,
    info: { name: 'Bytespider', operator: 'ByteDance', purpose: 'training', rendersJs: false },
  },

  // === You.com ===
  {
    pattern: /YouBot/i,
    info: { name: 'YouBot', operator: 'You.com', purpose: 'search', rendersJs: false },
  },

  // === DeepSeek ===
  {
    pattern: /Deepseek/i,
    info: { name: 'DeepSeekBot', operator: 'DeepSeek', purpose: 'training', rendersJs: false },
  },
];

const TOKEN_REGISTRY = AI_BOT_REGISTRY.map((entry) => ({
  entry,
  token: regexToToken(entry.pattern),
}));

/**
 * Detect if an incoming request is from an AI bot.
 *
 * @param userAgent - The User-Agent header value
 * @param acceptHeader - The Accept header value (optional)
 * @returns AIRequestContext with bot detection results
 */
export function detectAgent(
  userAgent: string | null | undefined,
  acceptHeader?: string | null
): AIRequestContext {
  const wantsMarkdown = acceptHeader
    ? /text\/markdown/i.test(acceptHeader)
    : false;

  if (!userAgent) {
    return { isAIBot: false, bot: null, wantsMarkdown };
  }

  const ua = userAgent.toLowerCase();

  // Check against our AI-specific registry first (more precise)
  for (const { entry, token } of TOKEN_REGISTRY) {
    if (token) {
      if (ua.includes(token)) {
        return { isAIBot: true, bot: entry.info, wantsMarkdown };
      }
      continue;
    }
    if (entry.pattern.test(userAgent)) {
      return { isAIBot: true, bot: entry.info, wantsMarkdown };
    }
  }

  // Fallback: we do NOT serve markdown to generic bots — only AI bots get the special treatment
  return { isAIBot: false, bot: null, wantsMarkdown };
}

/**
 * Check if a request should receive Markdown.
 * Returns true if: the request is from a known AI bot OR the Accept header requests text/markdown.
 */
export function shouldServeMarkdown(
  userAgent: string | null | undefined,
  acceptHeader?: string | null
): boolean {
  const ctx = detectAgent(userAgent, acceptHeader);
  return ctx.isAIBot || ctx.wantsMarkdown;
}

export { AI_BOT_REGISTRY };

function regexToToken(pattern: RegExp): string | null {
  const source = pattern.source;
  if (/^[A-Za-z0-9-]+$/.test(source)) return source.toLowerCase();
  return null;
}
