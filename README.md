# agent-seo

Make any website AI-readable with zero config.

`agent-seo` is an open-source TypeScript library that automatically serves clean Markdown to AI crawlers (GPTBot, ClaudeBot, PerplexityBot, and 15+ others) while serving normal HTML to browsers. It ships adapters for **Next.js**, **Express**, **Fastify**, and **Hono**.

## How It Works

```
Browser → GET /about → HTML (normal)
GPTBot  → GET /about → Markdown (automatic)
Anyone  → GET /about.md → Markdown (explicit)
Anyone  → GET /llms.txt → Site directory for AI agents (llmstxt.org spec)
```

The transform pipeline: **JSDOM → Readability → Sanitize → Turndown → Frontmatter**

## Benchmark Results

| Metric      | HTML          | Markdown     | Improvement          |
| ----------- | ------------- | ------------ | -------------------- |
| Total size  | 96,996 bytes  | 14,604 bytes | **85% smaller**      |
| Token usage | 24,238 tokens | 3,651 tokens | **85% fewer tokens** |

LLM answers from Markdown are more focused, extract content more accurately, and contain fewer hallucinations from HTML noise (nav elements, scripts, metadata).

## Packages

| Package                                    | Description                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| [`@agent-seo/core`](./packages/core)       | Framework-agnostic HTML→Markdown engine, bot detection, route discovery |
| [`@agent-seo/next`](./packages/next)       | Next.js plugin — zero-config `/llms.txt` + auto HTML→Markdown transform |
| [`@agent-seo/express`](./packages/express) | Express middleware adapter                                              |
| [`@agent-seo/fastify`](./packages/fastify) | Fastify plugin adapter                                                  |
| [`@agent-seo/hono`](./packages/hono)       | Hono middleware adapter                                                 |
| [`@agent-seo/cli`](./packages/cli)         | CLI audit tool — AI Visibility Score (0-100)                            |

## Quick Start

### Next.js (Zero Config)

```bash
npm install @agent-seo/next
```

**`next.config.ts`** — wrap your config:

```typescript
import { withAgentSeo } from '@agent-seo/next';

export default withAgentSeo({
  siteName: 'My App',
  siteDescription: 'A brief description for AI systems.',
  baseUrl: 'https://myapp.com',
  sitemap: true, // optional: adds Sitemap directive to robots.txt
})({
  // your existing Next.js config
});
```

**`middleware.ts`** — enable AI bot detection:

```typescript
import { createAgentSeoMiddleware } from '@agent-seo/next/middleware';

export default createAgentSeoMiddleware({
  // optional: exclude paths from AI bot rewrites
  exclude: ['/dashboard/**', '/admin/**'],
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

That's it. Two files, ~10 lines total. The plugin automatically:

- **Auto-generates `/llms.txt`** by scanning your `app/` directory for all pages and extracting their `metadata` (title, description)
- **Auto-generates a transform API route** that converts HTML→Markdown on the fly
- **Auto-generates `robots.txt`** with an AI-friendly config and a comment pointing bots to `/llms.txt`
- **Detects 19 AI bots** via User-Agent and rewrites their requests to serve Markdown
- **Handles `.md` suffix** requests (e.g., `/about.md` returns Markdown for any visitor)
- **Injects `Vary: Accept, User-Agent`** headers for correct CDN caching
- **Sets bot-friendly headers** — `Content-Disposition: inline`, `X-Robots-Tag: all`, `Content-Signal`
- **Skips standard files** — `robots.txt`, `sitemap.xml`, `favicon.ico`, `llms.txt` are never rewritten

### Middleware Options

The middleware accepts an `exclude` option for paths that should never be rewritten to Markdown:

```typescript
createAgentSeoMiddleware({
  exclude: [
    '/dashboard/**', // admin panel
    '/admin/**', // internal tools
    '/api/private/**', // private APIs
  ],
});
```

Built-in defaults that are always excluded: `/api/**`, `/_next/**`, `/robots.txt`, `/sitemap.xml`, `/favicon.ico`, `/llms.txt`.

### Plugin Options

| Option            | Type                | Description                                                                               |
| ----------------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `siteName`        | `string`            | Your site name (used in `llms.txt`)                                                       |
| `siteDescription` | `string`            | Brief description for AI systems                                                          |
| `baseUrl`         | `string`            | Your site's public URL                                                                    |
| `sitemap`         | `boolean \| string` | Add `Sitemap:` to `robots.txt`. `true` uses `{baseUrl}/sitemap.xml`, or pass a custom URL |
| `appDir`          | `string`            | Override auto-detected `app/` directory path                                              |
| `exclude`         | `string[]`          | Route patterns to exclude from `llms.txt` discovery                                       |

### Express

```bash
npm install @agent-seo/express
```

```typescript
import express from 'express';
import { agentSeo } from '@agent-seo/express';

const app = express();

app.use(
  agentSeo({
    siteName: 'My App',
    siteDescription: 'A brief description for AI systems.',
    baseUrl: 'https://myapp.com',
  }),
);

app.get('/', (req, res) => {
  res.send('<html>...</html>');
});

app.listen(3000);
```

### Hono

```bash
npm install @agent-seo/hono
```

```typescript
import { Hono } from 'hono';
import { agentSeo } from '@agent-seo/hono';

const app = new Hono();

app.use(
  '*',
  agentSeo({
    siteName: 'My App',
    siteDescription: 'A brief description for AI systems.',
    baseUrl: 'https://myapp.com',
  }),
);
```

### Fastify

```bash
npm install @agent-seo/fastify
```

```typescript
import Fastify from 'fastify';
import { agentSeo } from '@agent-seo/fastify';

const app = Fastify();

app.register(agentSeo, {
  siteName: 'My App',
  siteDescription: 'A brief description for AI systems.',
  baseUrl: 'https://myapp.com',
});
```

### CLI Audit

```bash
npx @agent-seo/cli audit https://example.com
```

Get an AI Visibility Score (0-100) with actionable recommendations.

## What It Does

1. **Detects AI crawlers** — 19 bots recognized via User-Agent pattern matching (GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User, DeepSeekBot, etc.)
2. **Transforms HTML → Markdown** — Readability extracts content, Turndown converts to Markdown, with intelligent noise removal (navs, footers, ads, scripts)
3. **YAML Frontmatter** — Adds structured metadata (title, description, URL, lang, last-modified) as YAML frontmatter
4. **JSON-LD Extraction** — Extracts and appends structured data from `<script type="application/ld+json">` blocks
5. **Generates `/llms.txt`** — Auto-discovers routes and generates a site directory following the [llmstxt.org](https://llmstxt.org) spec
6. **Generates `robots.txt`** — Auto-creates an AI-friendly `robots.txt` with a reference to `/llms.txt` (won't overwrite existing files)
7. **`.md` Alternates** — Any page is available as Markdown by appending `.md` to the URL (e.g., `/about.md`)
8. **Bot-friendly headers** — `Content-Type: text/markdown`, `Content-Disposition: inline`, `X-Robots-Tag: all`, `Content-Signal`
9. **Proper caching** — Sets `Vary: Accept, User-Agent` so CDNs cache AI and browser responses separately
10. **LRU cache** — In-memory caching of transformed Markdown to avoid re-processing

## Response Headers

Every Markdown response includes these headers:

| Header                | Value                                    | Purpose                                                                                                                                      |
| --------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`        | `text/markdown; charset=utf-8`           | Tell bots the content is Markdown                                                                                                            |
| `Content-Disposition` | `inline`                                 | Prevent bots from treating it as a file download                                                                                             |
| `Vary`                | `Accept, User-Agent`                     | Ensure CDNs cache bot and browser responses separately                                                                                       |
| `X-Markdown-Tokens`   | e.g. `378`                               | Estimated token count for the response                                                                                                       |
| `X-Robots-Tag`        | `all`                                    | Explicitly allow all bots to index                                                                                                           |
| `Content-Signal`      | `ai-train=yes, search=yes, ai-input=yes` | Signal AI training/search permissions ([Cloudflare convention](https://blog.cloudflare.com/content-credentials-ai-labeling-with-cloudflare)) |

## Supported AI Bots

| Bot                | Operator     | Purpose        |
| ------------------ | ------------ | -------------- |
| GPTBot             | OpenAI       | Training       |
| ChatGPT-User       | OpenAI       | Agent browsing |
| OAI-SearchBot      | OpenAI       | Search         |
| ClaudeBot          | Anthropic    | Training       |
| Claude-User        | Anthropic    | Agent browsing |
| Claude-SearchBot   | Anthropic    | Search         |
| anthropic-ai       | Anthropic    | Training       |
| PerplexityBot      | Perplexity   | Search         |
| Perplexity-User    | Perplexity   | Agent browsing |
| Google-Extended    | Google       | Training       |
| Applebot-Extended  | Apple        | Training       |
| Meta-ExternalAgent | Meta         | Training       |
| FacebookBot        | Meta         | Search         |
| CCBot              | Common Crawl | Training       |
| cohere-ai          | Cohere       | Training       |
| Amazonbot          | Amazon       | Search         |
| Bytespider         | ByteDance    | Training       |
| YouBot             | You.com      | Search         |
| DeepSeekBot        | DeepSeek     | Training       |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  @agent-seo/core                │
│  detect · transform · llms-txt · discover       │
│  sanitize · markdown · frontmatter · json-ld    │
└─────────┬───────────┬───────────┬───────────┬───┘
          │           │           │           │
    ┌─────┴──┐  ┌─────┴──┐  ┌────┴───┐  ┌────┴──┐
    │  next  │  │express │  │fastify │  │ hono  │
    └────────┘  └────────┘  └────────┘  └───────┘
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm turbo build

# Run all tests (150+)
pnpm turbo test

# Typecheck
pnpm turbo typecheck
```

## Requirements

- Node.js ≥ 20.0.0
- TypeScript ≥ 5.7 (for development)

## License

MIT
