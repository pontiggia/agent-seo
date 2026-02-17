# @agent-seo/express

Express middleware for AI-readable websites. Automatically serves Markdown to AI bots, HTML to browsers.

## Install

```bash
npm install @agent-seo/express
```

## Usage

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

## How It Works

```
Browser → GET /about → HTML (normal)
GPTBot  → GET /about → Markdown (automatic)
Anyone  → GET /about.md → Markdown (explicit)
Anyone  → GET /llms.txt → Site directory for AI agents
```

The middleware detects 19 AI bots via User-Agent, transforms HTML responses to clean Markdown with YAML frontmatter, and serves `/llms.txt` automatically.

## Options

All options from `@agent-seo/core` are supported, plus:

| Option      | Type       | Description                                      |
| ----------- | ---------- | ------------------------------------------------ |
| `cache`     | `boolean`  | Enable in-memory LRU cache (default: `true`)     |
| `cacheSize` | `number`   | Max cached entries (default: `100`)               |
| `exclude`   | `string[]` | URL patterns to skip (default: `["/api"]`)        |

## License

MIT
