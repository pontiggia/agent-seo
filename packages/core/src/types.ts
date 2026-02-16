// ============================================================
// BOT DETECTION
// ============================================================

export type BotPurpose = 'training' | 'search' | 'agent-browsing' | 'unknown';

export interface BotInfo {
  /** The canonical name of the bot (e.g., "GPTBot", "ClaudeBot") */
  name: string;
  /** The organization operating the bot */
  operator: string;
  /** What the bot is doing: training data collection, search indexing, or live agent browsing */
  purpose: BotPurpose;
  /** Whether this bot renders JavaScript */
  rendersJs: boolean;
}

export interface AIRequestContext {
  /** Whether the request comes from a known AI bot */
  isAIBot: boolean;
  /** Details about the detected bot, or null if not an AI bot */
  bot: BotInfo | null;
  /** Whether the client explicitly requested Markdown via Accept header */
  wantsMarkdown: boolean;
}

// ============================================================
// TRANSFORMATION PIPELINE
// ============================================================

export interface TransformOptions {
  /** URL of the page being transformed (used for resolving relative links) */
  url?: string;
  /** Maximum token budget. If exceeded, content is truncated intelligently. Default: no limit */
  tokenBudget?: number;
  /** Extract JSON-LD blocks from the HTML. Default: true */
  extractJsonLd?: boolean;
  /** Additional CSS selectors to strip (merged with defaults) */
  stripSelectors?: string[];
  /** CSS selectors to preserve even if they'd normally be stripped */
  preserveSelectors?: string[];
  /** Whether to include a YAML frontmatter block with metadata. Default: true */
  frontmatter?: boolean;
  /** Custom Turndown rules to add */
  turndownRules?: TurndownRule[];
}

export interface TurndownRule {
  name: string;
  filter: string | string[] | ((node: Node) => boolean);
  replacement: (content: string, node: Node) => string;
}

export interface TransformResult {
  /** The clean Markdown output */
  markdown: string;
  /** Estimated token count (chars / 4 heuristic) */
  tokenEstimate: number;
  /** Page title extracted from <title> or <h1> */
  title: string;
  /** Meta description */
  description: string;
  /** Extracted JSON-LD objects from the page */
  jsonLd: Record<string, unknown>[];
  /** Canonical URL if found */
  canonicalUrl: string | null;
  /** ISO date string of last modification if available */
  lastModified: string | null;
  /** Language of the document */
  lang: string | null;
}

// ============================================================
// LLMS.TXT
// ============================================================

export interface LlmsTxtRoute {
  /** The URL path (e.g., "/docs/getting-started") */
  path: string;
  /** Human-readable title for this page */
  title: string;
  /** One-line description */
  description?: string;
  /** Section grouping (e.g., "Documentation", "API Reference", "Blog") */
  section?: string;
}

export interface LlmsTxtOptions {
  /** Site name (used as H1 in llms.txt) */
  siteName: string;
  /** One-paragraph site description (used as blockquote) */
  siteDescription: string;
  /** The base URL of the site (e.g., "https://example.com") */
  baseUrl: string;
  /**
   * Routes to include in llms.txt.
   * - `LlmsTxtRoute[]`: explicit list of routes
   * - Omit to require routes to be passed to `generateLlmsTxt()` directly
   */
  routes?: LlmsTxtRoute[];
  /** Sections to always exclude from llms.txt (e.g., ["/admin", "/internal"]) */
  excludePatterns?: string[];
  /** File extension for Markdown alternates. Default: ".md" */
  markdownExtension?: string;
}

export interface LlmsTxtResult {
  /** The generated llms.txt content */
  llmsTxt: string;
  /** The generated llms-full.txt content (all pages concatenated) */
  llmsFullTxt: string;
  /** Number of routes included */
  routeCount: number;
}

// ============================================================
// RESPONSE HEADERS
// ============================================================

export interface AgentSeoHeaders {
  'Content-Type': string;
  Vary: string;
  'X-Markdown-Tokens': string;
  'X-Robots-Tag'?: string;
  'Content-Signal'?: string;
  Link?: string;
}

// ============================================================
// MIDDLEWARE OPTIONS (shared across framework adapters)
// ============================================================

export interface AgentSeoOptions {
  /** Site name for llms.txt generation */
  siteName: string;
  /** Brief site description for LLMs */
  siteDescription: string;
  /** Base URL of the site (e.g., "https://example.com") */
  baseUrl: string;

  /**
   * Which paths to transform. Default: all paths.
   * Use glob patterns: ["/docs/**", "/blog/**"]
   * Or a function: (path: string) => boolean
   */
  include?: string[] | ((path: string) => boolean);

  /**
   * Which paths to never transform.
   * Default: ["/api/**", "/_next/**", "/static/**", "/assets/**"]
   */
  exclude?: string[];

  /** Transform pipeline options */
  transform?: Omit<TransformOptions, 'url'>;

  /**
   * llms.txt generation options.
   * Routes can be provided explicitly via `llmsTxt.routes`.
   * For Next.js, use `appDir` on `createLlmsTxtHandler` for automatic route discovery.
   */
  llmsTxt?: Partial<LlmsTxtOptions>;

  /** Cache options */
  cache?: {
    /** Enable caching. Default: true */
    enabled?: boolean;
    /** Cache TTL in milliseconds. Default: 300_000 (5 minutes) */
    ttl?: number;
    /** Max cache entries. Default: 100 */
    maxEntries?: number;
  };

  /** Content-Signal header values. Default: all true */
  contentSignal?: {
    aiTrain?: boolean;
    search?: boolean;
    aiInput?: boolean;
  };
}
