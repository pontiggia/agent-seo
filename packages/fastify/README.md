# @agent-seo/fastify

Fastify plugin for AI-readable websites. Automatically serves Markdown to AI bots, HTML to browsers.

## Install

```bash
npm install @agent-seo/fastify
```

## Usage

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

## How It Works

```
Browser → GET /about → HTML (normal)
GPTBot  → GET /about → Markdown (automatic)
Anyone  → GET /about.md → Markdown (explicit)
Anyone  → GET /llms.txt → Site directory for AI agents
```

The plugin detects 19 AI bots via User-Agent, transforms HTML responses to clean Markdown with YAML frontmatter, and serves `/llms.txt` automatically.

## License

MIT
