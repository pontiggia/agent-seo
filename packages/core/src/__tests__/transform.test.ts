import { describe, it, expect } from 'vitest';
import { transform } from '../transform.js';

const simpleHtml = `
<html lang="en">
<head>
  <title>Test Page</title>
  <meta name="description" content="A test page for transformation">
  <link rel="canonical" href="https://example.com/test">
</head>
<body>
  <nav>Navigation Links</nav>
  <article>
    <h1>Hello World</h1>
    <p>This is a test paragraph with some content.</p>
    <p>Another paragraph here.</p>
  </article>
  <footer>Footer content</footer>
</body>
</html>
`;

describe('transform', () => {
  it('strips navigation, footer, and sidebar from a blog post', async () => {
    const result = await transform(simpleHtml);
    expect(result.markdown).not.toContain('Navigation Links');
    expect(result.markdown).not.toContain('Footer content');
  });

  it('preserves article body content', async () => {
    const result = await transform(simpleHtml);
    expect(result.markdown).toContain('Hello World');
    expect(result.markdown).toContain('test paragraph');
  });

  it('extracts title from <title> tag', async () => {
    const result = await transform(simpleHtml);
    expect(result.title).toBe('Test Page');
  });

  it('extracts description from meta tag', async () => {
    const result = await transform(simpleHtml);
    expect(result.description).toBe('A test page for transformation');
  });

  it('extracts canonical URL', async () => {
    const result = await transform(simpleHtml);
    expect(result.canonicalUrl).toBe('https://example.com/test');
  });

  it('extracts lang attribute', async () => {
    const result = await transform(simpleHtml);
    expect(result.lang).toBe('en');
  });

  it('generates YAML frontmatter with title and description', async () => {
    const result = await transform(simpleHtml);
    expect(result.markdown).toContain('---');
    expect(result.markdown).toContain('title: "Test Page"');
    expect(result.markdown).toContain('description: "A test page for transformation"');
  });

  it('can disable frontmatter', async () => {
    const result = await transform(simpleHtml, { frontmatter: false });
    expect(result.markdown).not.toMatch(/^---/);
  });

  it('extracts JSON-LD from script tags', async () => {
    const htmlWithJsonLd = `
      <html><head>
        <title>Test</title>
        <script type="application/ld+json">{"@type": "Article", "headline": "Test"}</script>
      </head><body><article><h1>Test</h1><p>Content here.</p></article></body></html>
    `;
    const result = await transform(htmlWithJsonLd);
    expect(result.jsonLd).toHaveLength(1);
    expect(result.jsonLd[0]['@type']).toBe('Article');
  });

  it('enforces token budget by truncating', async () => {
    const result = await transform(simpleHtml, { tokenBudget: 20 });
    expect(result.tokenEstimate).toBeLessThanOrEqual(20);
  });

  it('handles empty HTML gracefully', async () => {
    const result = await transform('');
    expect(result.markdown).toBeDefined();
    expect(result.title).toBe('');
  });

  it('handles HTML with only a JS shell (SPA detection)', async () => {
    const spaHtml = `
      <html><head><title>SPA App</title></head>
      <body><div id="root"></div><script src="/app.js"></script></body></html>
    `;
    const result = await transform(spaHtml);
    expect(result.title).toBe('SPA App');
    // Should still produce some output, even if minimal
    expect(result.markdown).toBeDefined();
  });

  it('handles code blocks with language hints', async () => {
    const htmlWithCode = `
      <html><head><title>Code</title></head>
      <body><article>
        <h1>Code Example</h1>
        <p>Here is some code:</p>
        <pre><code class="language-javascript">const x = 42;</code></pre>
      </article></body></html>
    `;
    const result = await transform(htmlWithCode, { frontmatter: false });
    expect(result.markdown).toContain('```javascript');
    expect(result.markdown).toContain('const x = 42;');
  });

  it('handles tables correctly', async () => {
    const htmlWithTable = `
      <html><head><title>Table</title></head>
      <body><article>
        <h1>Data</h1>
        <table>
          <thead><tr><th>Name</th><th>Value</th></tr></thead>
          <tbody><tr><td>A</td><td>1</td></tr></tbody>
        </table>
      </article></body></html>
    `;
    const result = await transform(htmlWithTable, { frontmatter: false });
    expect(result.markdown).toContain('Name');
    expect(result.markdown).toContain('Value');
  });

  it('returns token estimate', async () => {
    const result = await transform(simpleHtml);
    expect(result.tokenEstimate).toBeGreaterThan(0);
    expect(typeof result.tokenEstimate).toBe('number');
  });
});
