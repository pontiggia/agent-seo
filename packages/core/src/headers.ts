import type { TransformResult, AgentSeoHeaders, AgentSeoOptions } from './types.js';

/**
 * Build the response headers for a Markdown response.
 */
export function buildMarkdownHeaders(
  result: TransformResult,
  options: Pick<AgentSeoOptions, 'contentSignal'>,
  originalPath?: string
): AgentSeoHeaders {
  const headers: AgentSeoHeaders = {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Content-Disposition': 'inline',
    'Vary': 'Accept, User-Agent',
    'X-Markdown-Tokens': String(result.tokenEstimate),
  };

  // Content-Signal header (Cloudflare convention)
  const signal = options.contentSignal ?? { aiTrain: true, search: true, aiInput: true };
  const signalParts: string[] = [];
  if (signal.aiTrain !== false) signalParts.push('ai-train=yes');
  if (signal.search !== false) signalParts.push('search=yes');
  if (signal.aiInput !== false) signalParts.push('ai-input=yes');
  if (signalParts.length > 0) {
    headers['Content-Signal'] = signalParts.join(', ');
  }

  // X-Robots-Tag: let all AI bots index
  headers['X-Robots-Tag'] = 'all';

  return headers;
}

/**
 * Build a Link header pointing to the Markdown alternate.
 * This is injected into ALL HTML responses (not just Markdown ones)
 * so crawlers can discover the alternate representation.
 */
export function buildAlternateLinkHeader(path: string, ext: string = '.md'): string {
  // /docs/getting-started → /docs/getting-started.md
  const mdPath = path.endsWith('/') ? `${path}index${ext}` : `${path}${ext}`;
  return `<${mdPath}>; rel="alternate"; type="text/markdown"`;
}
