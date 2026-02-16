import { withAgentSeo } from '@agent-seo/next';

const nextConfig = withAgentSeo({
  siteName: 'DevToolbox',
  siteDescription:
    'DevToolbox is a developer resource that provides in-depth comparisons, guides, and FAQs about modern programming languages and tools.',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
})({});

export default nextConfig;
