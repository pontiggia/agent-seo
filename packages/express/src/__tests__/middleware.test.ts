import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { agentSeo } from '../middleware.js';

const HTML_RESPONSE =
  '<html><head><title>Home</title><meta name="description" content="Home page"></head><body><article><h1>Welcome</h1><p>Hello world</p></article></body></html>';

function createApp() {
  const app = express();

  app.use(
    agentSeo({
      siteName: 'Test App',
      siteDescription: 'A test app',
      baseUrl: 'https://example.com',
    })
  );

  app.get('/', (_req, res) => {
    res.type('text/html').send(HTML_RESPONSE);
  });

  app.get('/api/data', (_req, res) => {
    res.json({ hello: 'world' });
  });

  return app;
}

describe('agentSeo express middleware', () => {
  it('serves Markdown to GPTBot user-agent', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/')
      .set('User-Agent', 'GPTBot/1.0');

    expect(res.headers['content-type']).toContain('text/markdown');
  });

  it('serves Markdown when Accept: text/markdown', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/')
      .set('Accept', 'text/markdown');

    expect(res.headers['content-type']).toContain('text/markdown');
    expect(res.text).toContain('Welcome');
  });

  it('serves normal HTML to Chrome browser', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/')
      .set('User-Agent', 'Mozilla/5.0 Chrome/120.0');

    expect(res.headers['content-type']).toContain('text/html');
  });

  it('serves /llms.txt with correct format', async () => {
    const app = createApp();
    const res = await request(app).get('/llms.txt');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('# Test App');
  });

  it('serves /llms-full.txt', async () => {
    const app = createApp();
    const res = await request(app).get('/llms-full.txt');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
  });

  it('sets Vary: Accept, User-Agent on all responses', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/')
      .set('User-Agent', 'Mozilla/5.0 Chrome/120.0');

    expect(res.headers['vary']).toContain('Accept');
    expect(res.headers['vary']).toContain('User-Agent');
  });

  it('sets X-Markdown-Tokens header on markdown responses', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/')
      .set('User-Agent', 'GPTBot/1.0');

    expect(res.headers['x-markdown-tokens']).toBeDefined();
  });

  it('sets Content-Signal header on markdown responses', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/')
      .set('User-Agent', 'GPTBot/1.0');

    expect(res.headers['content-signal']).toBeDefined();
    expect(res.headers['content-signal']).toContain('ai-train=yes');
  });

  it('injects Link alternate header into HTML responses', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/')
      .set('User-Agent', 'Mozilla/5.0 Chrome/120.0');

    expect(res.headers['link']).toContain('.md');
    expect(res.headers['link']).toContain('rel="alternate"');
    expect(res.headers['link']).toContain('type="text/markdown"');
  });

  it('excludes /api/* paths', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/api/data')
      .set('User-Agent', 'GPTBot/1.0');

    expect(res.headers['content-type']).toContain('application/json');
  });
});
