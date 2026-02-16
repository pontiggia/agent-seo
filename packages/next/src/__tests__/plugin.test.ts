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

describe('createAgentSeoMiddleware', () => {
  it('detects AI bots and sets headers', () => {
    const middleware = createAgentSeoMiddleware();
    const request = new Request('https://example.com/', {
      headers: {
        'user-agent': 'GPTBot/1.0',
      },
    });

    const response = middleware(request);
    expect(response.headers.get('X-Agent-Bot')).toBe('GPTBot');
    expect(response.headers.get('X-Agent-Purpose')).toBe('training');
    expect(response.headers.get('Vary')).toContain('Accept');
  });

  it('does not set X-Agent-Bot for normal browsers', () => {
    const middleware = createAgentSeoMiddleware();
    const request = new Request('https://example.com/', {
      headers: {
        'user-agent': 'Mozilla/5.0 Chrome/120.0',
      },
    });

    const response = middleware(request);
    expect(response.headers.get('X-Agent-Bot')).toBeNull();
    expect(response.headers.get('Vary')).toContain('Accept');
  });
});
