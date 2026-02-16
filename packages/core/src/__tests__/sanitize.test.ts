import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '../sanitize.js';

describe('sanitizeHtml', () => {
  it('strips <nav> elements', () => {
    const html = '<nav>Navigation</nav><p>Content</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('Navigation');
    expect(result).toContain('Content');
  });

  it('strips <script> elements', () => {
    const html = '<script>alert("x")</script><p>Content</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('alert');
    expect(result).toContain('Content');
  });

  it('strips <style> elements', () => {
    const html = '<style>.foo{}</style><p>Content</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('.foo');
    expect(result).toContain('Content');
  });

  it('strips .cookie-banner elements', () => {
    const html = '<div class="cookie-banner">Accept cookies</div><p>Content</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('Accept cookies');
    expect(result).toContain('Content');
  });

  it('strips <footer> elements (non-article footer)', () => {
    const html = '<footer>Footer content</footer><p>Content</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('Footer content');
    expect(result).toContain('Content');
  });

  it('preserves <article>, <p>, <h1> content', () => {
    const html = '<article><h1>Title</h1><p>Paragraph</p></article>';
    const result = sanitizeHtml(html);
    expect(result).toContain('Title');
    expect(result).toContain('Paragraph');
  });

  it('preserves <table> elements', () => {
    const html = '<table><tr><td>Cell</td></tr></table>';
    const result = sanitizeHtml(html);
    expect(result).toContain('Cell');
  });

  it('preserves <code> elements', () => {
    const html = '<code>const x = 1;</code>';
    const result = sanitizeHtml(html);
    expect(result).toContain('const x = 1;');
  });

  it('respects preserveSelectors override', () => {
    const html = '<nav class="special-nav">Keep this nav</nav><p>Content</p>';
    const result = sanitizeHtml(html, { preserveSelectors: ['.special-nav'] });
    expect(result).toContain('Keep this nav');
  });

  it('removes empty elements', () => {
    const html = '<div></div><p>Content</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toMatch(/<div>\s*<\/div>/);
  });

  it('cleans non-essential attributes', () => {
    const html = '<a href="/page" class="link" id="mylink" data-track="click">Link</a>';
    const result = sanitizeHtml(html);
    expect(result).toContain('href="/page"');
    expect(result).not.toContain('class=');
    expect(result).not.toContain('id=');
    expect(result).not.toContain('data-track');
  });

  it('applies custom stripSelectors', () => {
    const html = '<div class="custom-remove">Remove me</div><p>Content</p>';
    const result = sanitizeHtml(html, { stripSelectors: ['.custom-remove'] });
    expect(result).not.toContain('Remove me');
    expect(result).toContain('Content');
  });
});
