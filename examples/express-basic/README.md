# Express Basic Example

A minimal Express application that demonstrates `@agent-seo/express` middleware.

## Setup

```bash
# From the repository root, install all workspace dependencies
pnpm install

# Start the example server
pnpm --filter express-basic-example start
```

## Test it

**Browse normally (HTML):**

```bash
curl http://localhost:3000/
```

**Request as an AI crawler (Markdown):**

```bash
curl -H "User-Agent: GPTBot/1.0" http://localhost:3000/
curl -H "User-Agent: ClaudeBot/1.0" http://localhost:3000/about
```

**Request Markdown via Accept header:**

```bash
curl -H "Accept: text/markdown" http://localhost:3000/docs/getting-started
```

**Fetch the llms.txt site index:**

```bash
curl http://localhost:3000/llms.txt
curl http://localhost:3000/llms-full.txt
```

**Access the Markdown alternate for a page:**

```bash
curl http://localhost:3000/about.md
```
