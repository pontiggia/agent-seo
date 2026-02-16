import { createLlmsTxtHandler } from '@agent-seo/next';

export const GET = createLlmsTxtHandler({
  siteName: 'My Next.js App',
  siteDescription: 'A demo Next.js application showcasing agent-seo.',
  baseUrl: 'http://localhost:3000',
  llmsTxt: {
    routes: [
      { path: '/', title: 'Home', section: 'Pages' },
      { path: '/about', title: 'About', section: 'Pages' },
    ],
  },
});
