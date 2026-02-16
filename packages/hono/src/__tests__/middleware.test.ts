import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { agentSeo } from '../middleware.js';

const HTML = '<html><head><title>Home</title><meta name="description" content="Home page"></head><body><article><h1>Welcome</h1><p>Hello world</p></article></body></html>';

function createApp() {
  const app = new Hono();

  app.use(
    '*',
    agentSeo({
      siteName: 'Test App',
      siteDescription: 'A test app',
      baseUrl: 'https://example.com',
    })
  );

  app.get('/', (c) => {
    return c.html(HTML);
  });

  return app;
}

describe('agentSeo hono middleware', () => {
  it('serves Markdown to GPTBot user-agent', async () => {
    const app = createApp();
    const res = await app.request('/', {
      headers: { 'User-Agent': 'Mozilla/5.0 GPTBot/1.0' },
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/markdown');
  });

  it('serves normal HTML to Chrome browser', async () => {
    const app = createApp();
    const res = await app.request('/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
  });

  it('serves /llms.txt', async () => {
    const app = createApp();
    const res = await app.request('/llms.txt');

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/plain');
    const body = await res.text();
    expect(body).toContain('Test App');
  });

  it('serves /llms-full.txt', async () => {
    const app = createApp();
    const res = await app.request('/llms-full.txt');

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/plain');
  });

  it('sets Vary header', async () => {
    const app = createApp();

    const htmlRes = await app.request('/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    expect(htmlRes.headers.get('vary')).toContain('User-Agent');

    const mdRes = await app.request('/', {
      headers: { 'User-Agent': 'Mozilla/5.0 GPTBot/1.0' },
    });
    expect(mdRes.headers.get('vary')).toContain('User-Agent');
  });
});
