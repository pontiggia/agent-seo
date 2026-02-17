import { describe, it, expect } from 'vitest';
import { createLlmsTxtHandler } from '../route-handler.js';
import { createAgentSeoMiddleware } from '../middleware.js';

describe('createLlmsTxtHandler', () => {
  it('returns llms.txt content', async () => {
    const handler = createLlmsTxtHandler({
      siteName: 'Test App',
      siteDescription: 'A test app',
      baseUrl: 'https://example.com',
      llmsTxt: {
        routes: [
          { path: '/docs/intro', title: 'Introduction', section: 'Documentation' },
        ],
      },
    });

    const response = await handler();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/plain');

    const body = await response.text();
    expect(body).toContain('# Test App');
    expect(body).toContain('> A test app');
    expect(body).toContain('[Introduction]');
  });

  it('returns llms-full.txt when full=true', async () => {
    const handler = createLlmsTxtHandler({
      siteName: 'Test App',
      siteDescription: 'A test app',
      baseUrl: 'https://example.com',
      full: true,
    });

    const response = await handler();
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain('# Test App');
  });
});

function mockNextRequest(url: string, headers: Record<string, string> = {}) {
  const req = new Request(url, { headers });
  const parsed = new URL(url);
  (req as any).nextUrl = parsed;
  return req;
}

describe('createAgentSeoMiddleware', () => {
  it('rewrites AI bot requests and sets bot-friendly headers', () => {
    const middleware = createAgentSeoMiddleware();
    const request = mockNextRequest('https://example.com/', {
      'user-agent': 'GPTBot/1.0',
    });

    const response = middleware(request as any);
    expect(response.headers.get('Content-Disposition')).toBe('inline');
    expect(response.headers.get('X-Robots-Tag')).toBe('all');
    expect(response.headers.get('Vary')).toContain('Accept');
  });

  it('does not rewrite normal browser requests', () => {
    const middleware = createAgentSeoMiddleware();
    const request = mockNextRequest('https://example.com/', {
      'user-agent': 'Mozilla/5.0 Chrome/120.0',
    });

    const response = middleware(request as any);
    expect(response.headers.get('Content-Disposition')).toBeNull();
    expect(response.headers.get('Vary')).toContain('Accept');
  });
});
