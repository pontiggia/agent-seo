import { withAgentSeo } from '@agent-seo/next';

export default withAgentSeo({
  siteName: 'agent-seo',
  siteDescription:
    'Open-source TypeScript SDK that serves clean Markdown to AI crawlers. Next.js, Express, Fastify, Hono.',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
})({});
