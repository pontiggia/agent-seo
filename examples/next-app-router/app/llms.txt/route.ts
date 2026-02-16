import { createLlmsTxtHandler } from '@agent-seo/next';
import path from 'node:path';

export const GET = createLlmsTxtHandler({
  siteName: 'My Next.js App',
  siteDescription: 'A demo Next.js application showcasing agent-seo.',
  baseUrl: 'http://localhost:3000',
  appDir: path.resolve(process.cwd(), 'app'),
});
