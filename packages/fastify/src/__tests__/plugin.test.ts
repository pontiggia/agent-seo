import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';
import { agentSeo } from '../plugin.js';

const HTML_RESPONSE = '<html><head><title>Home</title><meta name="description" content="Home page"></head><body><article><h1>Welcome</h1><p>Hello world</p></article></body></html>';

function createApp() {
  const app = Fastify();

  app.register(agentSeo, {
    siteName: 'Test App',
    siteDescription: 'A test app',
    baseUrl: 'https://example.com',
  });

  app.get('/', async (_request, reply) => {
    return reply.type('text/html').send(HTML_RESPONSE);
  });

  return app;
}

describe('agentSeo fastify plugin', () => {
  it('serves Markdown to GPTBot user-agent', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/',
      headers: { 'user-agent': 'GPTBot/1.0' },
    });

    expect(response.headers['content-type']).toContain('text/markdown');
    expect(response.body).toContain('Welcome');
  });

  it('serves normal HTML to Chrome browser', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/',
      headers: { 'user-agent': 'Mozilla/5.0 Chrome/120.0' },
    });

    expect(response.headers['content-type']).toContain('text/html');
  });

  it('serves /llms.txt', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/llms.txt',
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.body).toContain('# Test App');
  });

  it('serves /llms-full.txt', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/llms-full.txt',
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.body).toContain('# Test App');
  });

  it('sets Vary header on all responses', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/',
      headers: { 'user-agent': 'Mozilla/5.0 Chrome/120.0' },
    });

    expect(response.headers['vary']).toContain('Accept');
    expect(response.headers['vary']).toContain('User-Agent');
  });

  it('sets X-Markdown-Tokens header on markdown responses', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/',
      headers: { 'user-agent': 'GPTBot/1.0' },
    });

    expect(response.headers['x-markdown-tokens']).toBeDefined();
  });
});
