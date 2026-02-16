import { generateLlmsTxt, discoverNextRoutes } from '@agent-seo/core';
import type { AgentSeoOptions, DiscoverOptions } from '@agent-seo/core';

export interface LlmsTxtHandlerOptions extends AgentSeoOptions {
  /** Return llms-full.txt instead of llms.txt */
  full?: boolean;

  /**
   * Absolute path to the Next.js `app/` directory for automatic route discovery.
   * When set, routes for llms.txt are auto-discovered by scanning page.tsx files.
   * Titles and descriptions are extracted from `export const metadata` in each page.
   *
   * @example
   * ```ts
   * appDir: path.resolve(process.cwd(), 'app')
   * ```
   */
  appDir?: string;

  /** Options for route discovery when using appDir */
  discoverOptions?: DiscoverOptions;
}

export function createLlmsTxtHandler(options: LlmsTxtHandlerOptions) {
  return async function GET() {
    // Auto-discover routes from app/ directory if no explicit routes are provided
    let routes = options.llmsTxt?.routes || [];

    if (routes.length === 0 && options.appDir) {
      routes = discoverNextRoutes(options.appDir, {
        exclude: options.exclude || ['/api'],
        ...options.discoverOptions,
      });
    }

    const result = generateLlmsTxt(
      {
        siteName: options.siteName,
        siteDescription: options.siteDescription,
        baseUrl: options.baseUrl,
        ...options.llmsTxt,
      },
      routes,
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
