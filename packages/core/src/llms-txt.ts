import type { LlmsTxtOptions, LlmsTxtRoute, LlmsTxtResult } from './types.js';

/**
 * Generate llms.txt and llms-full.txt content from route data.
 *
 * llms.txt format (per spec at llmstxt.org):
 * # Site Name
 * > Site description blockquote
 *
 * ## Section Name
 * - [Page Title](url): Description
 */
export function generateLlmsTxt(
  options: LlmsTxtOptions,
  routes: LlmsTxtRoute[],
  fullTextContents?: Map<string, string>
): LlmsTxtResult {
  const { siteName, siteDescription, baseUrl, markdownExtension = '.md' } = options;

  // Group routes by section
  const sections = new Map<string, LlmsTxtRoute[]>();
  for (const route of routes) {
    const section = route.section || 'Pages';
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section)!.push(route);
  }

  // Build llms.txt
  const lines: string[] = [];
  lines.push(`# ${siteName}`);
  lines.push('');
  lines.push(`> ${siteDescription}`);
  lines.push('');

  for (const [section, sectionRoutes] of sections) {
    lines.push(`## ${section}`);
    lines.push('');
    for (const route of sectionRoutes) {
      const url = `${baseUrl}${route.path}${markdownExtension}`;
      const desc = route.description ? `: ${route.description}` : '';
      lines.push(`- [${route.title}](${url})${desc}`);
    }
    lines.push('');
  }

  const llmsTxt = lines.join('\n').trim() + '\n';

  // Build llms-full.txt (concatenated content of all routes)
  const fullLines: string[] = [];
  fullLines.push(`# ${siteName}`);
  fullLines.push('');
  fullLines.push(`> ${siteDescription}`);
  fullLines.push('');

  if (fullTextContents) {
    for (const route of routes) {
      const content = fullTextContents.get(route.path);
      if (content) {
        fullLines.push(`---`);
        fullLines.push('');
        fullLines.push(`## ${route.title}`);
        fullLines.push(`Source: ${baseUrl}${route.path}`);
        fullLines.push('');
        fullLines.push(content);
        fullLines.push('');
      }
    }
  }

  const llmsFullTxt = fullLines.join('\n').trim() + '\n';

  return {
    llmsTxt,
    llmsFullTxt,
    routeCount: routes.length,
  };
}
