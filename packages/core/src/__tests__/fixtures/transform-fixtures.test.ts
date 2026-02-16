import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from '../../transform.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIXTURES_DIR = join(__dirname, '../../../../../fixtures');

function readFixture(name: string): string {
  return readFileSync(join(FIXTURES_DIR, name), 'utf-8');
}

describe('fixture: simple-article.html', () => {
  it('transforms to clean markdown', async () => {
    const html = readFixture('simple-article.html');
    const result = await transform(html, {
      url: 'https://devblog.com/typescript-generics',
      frontmatter: false,
    });
    expect(result.markdown).toMatchSnapshot();
    expect(result.title).toBe('Understanding TypeScript Generics - Dev Blog');
  });
});

describe('fixture: blog-with-sidebar.html', () => {
  it('strips sidebar, newsletter, and social share', async () => {
    const html = readFixture('blog-with-sidebar.html');
    const result = await transform(html, {
      url: 'https://engineering.example.com/code-reviews',
      frontmatter: false,
    });
    expect(result.markdown).toMatchSnapshot();
    expect(result.markdown).not.toContain('Subscribe');
    expect(result.markdown).not.toContain('Twitter');
    expect(result.markdown).not.toContain('Sponsored content');
  });
});

describe('fixture: product-page-shopify.html', () => {
  it('extracts product JSON-LD and content', async () => {
    const html = readFixture('product-page-shopify.html');
    const result = await transform(html, {
      url: 'https://techshop.example.com/products/premium-headphones',
      frontmatter: false,
    });
    expect(result.markdown).toMatchSnapshot();
    expect(result.jsonLd.length).toBeGreaterThan(0);
    expect(result.jsonLd[0]['@type']).toBe('Product');
  });
});

describe('fixture: docs-page-with-nav.html', () => {
  it('strips sidebar nav but preserves code blocks and tables', async () => {
    const html = readFixture('docs-page-with-nav.html');
    const result = await transform(html, {
      url: 'https://docs.mylib.dev/getting-started',
      frontmatter: false,
    });
    expect(result.markdown).toMatchSnapshot();
    expect(result.markdown).toContain('npm install mylib');
    expect(result.markdown).toContain('createApp');
  });
});

describe('fixture: page-with-json-ld.html', () => {
  it('extracts multiple JSON-LD blocks', async () => {
    const html = readFixture('page-with-json-ld.html');
    const result = await transform(html, {
      url: 'https://techblog.example.com/deploy-nodejs-aws',
    });
    expect(result.jsonLd.length).toBeGreaterThanOrEqual(2);
    expect(result.jsonLd[0]['@type']).toBe('Article');
    expect(result.jsonLd[1]['@type']).toBe('Organization');
    expect(result.lastModified).toBe('2024-02-20T14:30:00Z');
  });
});

describe('fixture: react-spa-shell.html', () => {
  it('handles empty SPA shell gracefully', async () => {
    const html = readFixture('react-spa-shell.html');
    const result = await transform(html, {
      url: 'https://myapp.com',
      frontmatter: false,
    });
    // SPA shell has minimal content
    expect(result.title).toBe('My React App');
    expect(result.markdown).toBeDefined();
    expect(result.tokenEstimate).toBeGreaterThanOrEqual(0);
  });
});
