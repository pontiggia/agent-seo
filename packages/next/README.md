# @agent-seo/next

Next.js plugin for AI-readable websites. Zero-config `/llms.txt`, automatic HTML-to-Markdown for AI bots.

## Install

```bash
npm install @agent-seo/next
```

## Quick Start

**`next.config.ts`** — wrap your config:

```typescript
import { withAgentSeo } from '@agent-seo/next';

export default withAgentSeo({
  siteName: 'My App',
  siteDescription: 'A brief description for AI systems.',
  baseUrl: 'https://myapp.com',
  sitemap: true,
})({
  // your existing Next.js config
});
```

**`middleware.ts`** — enable AI bot detection:

```typescript
import { createAgentSeoMiddleware } from '@agent-seo/next/middleware';

export default createAgentSeoMiddleware({
  exclude: ['/dashboard/**', '/admin/**'],
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

That's it. Two files, ~10 lines total.

## What It Does Automatically

- **Auto-generates `/llms.txt`** by scanning your `app/` directory and extracting `metadata` (title, description)
- **Auto-generates a transform API route** that converts HTML to Markdown on the fly
- **Auto-generates `robots.txt`** with an AI-friendly config pointing to `/llms.txt`
- **Detects 19 AI bots** via User-Agent and rewrites their requests to serve Markdown
- **Handles `.md` suffix** requests (e.g., `/about.md` returns Markdown)
- **Injects `Vary: Accept, User-Agent`** headers for correct CDN caching
- **Sets bot-friendly headers** — `Content-Disposition: inline`, `X-Robots-Tag: all`

## How It Works

```
Browser → GET /about → HTML (normal)
GPTBot  → GET /about → Markdown (automatic)
Anyone  → GET /about.md → Markdown (explicit)
Anyone  → GET /llms.txt → Site directory for AI agents
```

## Plugin Options

| Option            | Type                | Description                                                                               |
| ----------------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `siteName`        | `string`            | Your site name (used in `llms.txt`)                                                       |
| `siteDescription` | `string`            | Brief description for AI systems                                                          |
| `baseUrl`         | `string`            | Your site's public URL                                                                    |
| `sitemap`         | `boolean \| string` | Add `Sitemap:` to `robots.txt`. `true` uses `{baseUrl}/sitemap.xml`, or pass a custom URL |
| `appDir`          | `string`            | Override auto-detected `app/` directory path                                              |
| `exclude`         | `string[]`          | Route patterns to exclude from `llms.txt` discovery                                       |

## Middleware Options

```typescript
createAgentSeoMiddleware({
  exclude: [
    '/dashboard/**',
    '/admin/**',
    '/api/private/**',
  ],
});
```

Built-in defaults always excluded: `/api/**`, `/_next/**`, `/robots.txt`, `/sitemap.xml`, `/favicon.ico`, `/llms.txt`.

## License

MIT
