import { describe, it, expect } from 'vitest';
import { htmlToMarkdown } from '../markdown.js';

describe('htmlToMarkdown', () => {
  it('converts headings to ATX style', () => {
    const html = '<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('# Title');
    expect(md).toContain('## Subtitle');
    expect(md).toContain('### Section');
  });

  it('converts code blocks with language hints', () => {
    const html = '<pre><code class="language-typescript">const x = 1;</code></pre>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('```typescript');
    expect(md).toContain('const x = 1;');
    expect(md).toContain('```');
  });

  it('converts tables to GFM format', () => {
    const html = '<table><thead><tr><th>Name</th><th>Age</th></tr></thead><tbody><tr><td>Alice</td><td>30</td></tr></tbody></table>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('Name');
    expect(md).toContain('Age');
    expect(md).toContain('Alice');
    expect(md).toContain('30');
    expect(md).toContain('---'); // table separator
  });

  it('resolves relative links when URL is provided', () => {
    const html = '<a href="/about">About</a>';
    const md = htmlToMarkdown(html, { url: 'https://example.com/page' });
    expect(md).toContain('[About](https://example.com/about)');
  });

  it('preserves absolute links', () => {
    const html = '<a href="https://other.com/page">Link</a>';
    const md = htmlToMarkdown(html, { url: 'https://example.com' });
    expect(md).toContain('[Link](https://other.com/page)');
  });

  it('skips decorative images (no alt text)', () => {
    const html = '<img src="/img.png"><img src="/img2.png" alt="">';
    const md = htmlToMarkdown(html);
    expect(md).not.toContain('![');
  });

  it('includes images with alt text', () => {
    const html = '<img src="/photo.jpg" alt="A photo">';
    const md = htmlToMarkdown(html, { url: 'https://example.com' });
    expect(md).toContain('![A photo](https://example.com/photo.jpg)');
  });

  it('handles nested lists', () => {
    const html = '<ul><li>One<ul><li>Nested</li></ul></li><li>Two</li></ul>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('One');
    expect(md).toContain('Nested');
    expect(md).toContain('Two');
  });

  it('skips anchor-only links', () => {
    const html = '<a href="#section">Section</a>';
    const md = htmlToMarkdown(html);
    expect(md).not.toContain('(#section)');
    expect(md).toContain('Section');
  });

  it('skips javascript: links', () => {
    const html = '<a href="javascript:void(0)">Click</a>';
    const md = htmlToMarkdown(html);
    expect(md).not.toContain('javascript:');
    expect(md).toContain('Click');
  });

  it('collapses excessive blank lines', () => {
    const html = '<p>A</p><br><br><br><br><p>B</p>';
    const md = htmlToMarkdown(html);
    expect(md).not.toMatch(/\n{3,}/);
  });
});
