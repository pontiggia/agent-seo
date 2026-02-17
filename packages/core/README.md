# @agent-seo/core

Framework-agnostic HTML-to-Markdown transformation engine for AI-readable websites.

## Install

```bash
npm install @agent-seo/core
```

## What It Does

- **Detects 19 AI bots** via User-Agent (GPTBot, ClaudeBot, PerplexityBot, etc.)
- **Transforms HTML to Markdown** — Readability extracts content, Turndown converts to clean Markdown
- **YAML frontmatter** — title, description, URL, lang, last-modified
- **JSON-LD extraction** — structured data from `<script type="application/ld+json">`
- **Generates `/llms.txt`** — auto-discovers routes following the [llmstxt.org](https://llmstxt.org) spec
- **LRU cache** — in-memory caching of transformed results

## Usage

### Transform HTML to Markdown

```typescript
import { transform } from '@agent-seo/core';

const result = await transform('<html>...</html>', {
  url: 'https://example.com/about',
});

console.log(result.markdown);
// ---
// title: "About Us"
// description: "Learn more about our company"
// url: "https://example.com/about"
// ---
// # About Us
// ...
```

### Detect AI Bots

```typescript
import { detectAgent, shouldServeMarkdown } from '@agent-seo/core';

const ctx = detectAgent(request.headers.get('user-agent'));
if (ctx.isAIBot) {
  console.log(ctx.bot.name);     // 'GPTBot'
  console.log(ctx.bot.operator); // 'OpenAI'
  console.log(ctx.bot.purpose);  // 'training'
}

// Or simply:
if (shouldServeMarkdown(userAgent, acceptHeader)) {
  // serve markdown
}
```

### Generate llms.txt

```typescript
import { generateLlmsTxt, discoverNextRoutes } from '@agent-seo/core';

const routes = discoverNextRoutes('/path/to/app');
const result = generateLlmsTxt({
  siteName: 'My App',
  siteDescription: 'A brief description for AI systems.',
  baseUrl: 'https://myapp.com',
}, routes);

console.log(result.llmsTxt);
```

## Edge Runtime

For edge/Cloudflare Workers (no JSDOM), use the lightweight edge export:

```typescript
import { detectAgent, shouldServeMarkdown } from '@agent-seo/core/edge';
```

## Framework Adapters

Use the framework-specific packages for zero-config integration:

- [`@agent-seo/next`](https://www.npmjs.com/package/@agent-seo/next) — Next.js
- [`@agent-seo/express`](https://www.npmjs.com/package/@agent-seo/express) — Express
- [`@agent-seo/fastify`](https://www.npmjs.com/package/@agent-seo/fastify) — Fastify
- [`@agent-seo/hono`](https://www.npmjs.com/package/@agent-seo/hono) — Hono

## License

MIT
