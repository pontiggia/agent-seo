# Hono + Cloudflare Workers Example

Demonstrates `@agent-seo/hono` middleware on Cloudflare Workers.

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Test

```bash
# Normal HTML response
curl http://localhost:8787/

# Markdown response (AI bot)
curl -H "User-Agent: GPTBot/1.0" http://localhost:8787/

# llms.txt
curl http://localhost:8787/llms.txt
```

## Deploy

```bash
pnpm deploy
```
