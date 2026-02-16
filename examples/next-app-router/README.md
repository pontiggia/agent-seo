# Next.js App Router Example

Demonstrates `@agent-seo/next` with Next.js App Router.

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
# llms.txt
curl http://localhost:3000/llms.txt

# Check middleware headers
curl -v -H "User-Agent: GPTBot/1.0" http://localhost:3000/
```

## Build

```bash
pnpm build && pnpm start
```
