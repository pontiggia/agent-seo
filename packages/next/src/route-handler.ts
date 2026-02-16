import { generateLlmsTxt } from '@agent-seo/core';
import type { AgentSeoOptions } from '@agent-seo/core';

export function createLlmsTxtHandler(options: AgentSeoOptions & { full?: boolean }) {
  return async function GET() {
    const routes = options.llmsTxt?.routes || [];
    const result = generateLlmsTxt(
      {
        siteName: options.siteName,
        siteDescription: options.siteDescription,
        baseUrl: options.baseUrl,
        ...options.llmsTxt,
      },
      routes
    );

    const content = options.full ? result.llmsFullTxt : result.llmsTxt;

    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  };
}
