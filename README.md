# agent-seo

Make any website AI-readable with 3 lines of code.

`agent-seo` is a TypeScript monorepo that ships middleware for Express, Fastify, Hono, and Next.js to automatically serve clean Markdown to AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) while serving normal HTML to browsers.

## Packages

| Package | Description |
|---------|-------------|
| [`@agent-seo/core`](./packages/core) | Framework-agnostic HTML-to-Markdown transformation engine |
| [`@agent-seo/express`](./packages/express) | Express middleware adapter |
| [`@agent-seo/fastify`](./packages/fastify) | Fastify plugin adapter |
| [`@agent-seo/hono`](./packages/hono) | Hono middleware adapter |
| [`@agent-seo/next`](./packages/next) | Next.js plugin + Edge middleware |
| [`@agent-seo/cli`](./packages/cli) | CLI audit tool for AI Visibility Scoring |

## Quick Start

### Express

```bash
npm install @agent-seo/express
```

```typescript
import express from 'express';
import { agentSeo } from '@agent-seo/express';

const app = express();

app.use(agentSeo({
  siteName: 'My App',
  siteDescription: 'A brief description for AI systems.',
  baseUrl: 'https://myapp.com',
}));

app.get('/', (req, res) => {
  res.send('<html>...</html>');
});

app.listen(3000);
```

Now GPTBot, ClaudeBot, and other AI crawlers automatically receive clean Markdown instead of HTML.

### Hono

```bash
npm install @agent-seo/hono
```

```typescript
import { Hono } from 'hono';
import { agentSeo } from '@agent-seo/hono';

const app = new Hono();

app.use('*', agentSeo({
  siteName: 'My App',
  siteDescription: 'A brief description for AI systems.',
  baseUrl: 'https://myapp.com',
}));
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

### Next.js

```bash
npm install @agent-seo/next
```

```typescript
// next.config.js
import { withAgentSeo } from '@agent-seo/next';

export default withAgentSeo({
  siteName: 'My App',
  siteDescription: 'A brief description for AI systems.',
  baseUrl: 'https://myapp.com',
})({
  // your existing next config
});
```

```typescript
// app/llms.txt/route.ts
import { createLlmsTxtHandler } from '@agent-seo/next';

export const GET = createLlmsTxtHandler({
  siteName: 'My App',
  siteDescription: 'A brief description for AI systems.',
  baseUrl: 'https://myapp.com',
  llmsTxt: {
    routes: [
      { path: '/docs/intro', title: 'Introduction', section: 'Documentation' },
    ],
  },
});
```

### CLI Audit

```bash
npx @agent-seo/cli audit https://example.com
```

Get an AI Visibility Score (0-100) with actionable recommendations.

## What It Does

1. **Detects AI crawlers** via User-Agent (GPTBot, ClaudeBot, PerplexityBot, etc.) and `Accept: text/markdown`
2. **Transforms HTML to Markdown** using Readability + Turndown with intelligent noise removal
3. **Serves clean Markdown** with proper headers (`Content-Type: text/markdown`, `Vary`, `X-Markdown-Tokens`, `Content-Signal`)
4. **Generates `/llms.txt`** following the [llmstxt.org](https://llmstxt.org) specification
5. **Provides `.md` alternates** for every page (e.g., `/about.md`)
6. **Injects Link headers** so crawlers can discover Markdown alternatives

## Supported AI Bots

| Bot | Operator | Purpose |
|-----|----------|---------|
| GPTBot | OpenAI | Training |
| ChatGPT-User | OpenAI | Agent browsing |
| OAI-SearchBot | OpenAI | Search |
| ClaudeBot | Anthropic | Training |
| Claude-User | Anthropic | Agent browsing |
| PerplexityBot | Perplexity | Search |
| Google-Extended | Google | Training |
| Applebot-Extended | Apple | Training |
| And 10+ more... | | |

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm turbo build

# Run all tests
pnpm turbo test
```

## License

MIT
