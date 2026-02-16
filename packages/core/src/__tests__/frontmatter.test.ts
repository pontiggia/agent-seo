import { describe, it, expect } from 'vitest';
import { buildFrontmatter } from '../frontmatter.js';

describe('buildFrontmatter', () => {
  it('includes title and description', () => {
    const fm = buildFrontmatter({ title: 'Test Page', description: 'A test page' });
    expect(fm).toContain('---');
    expect(fm).toContain('title: "Test Page"');
    expect(fm).toContain('description: "A test page"');
  });

  it('includes url when provided', () => {
    const fm = buildFrontmatter({ title: 'T', description: 'D', url: 'https://example.com' });
    expect(fm).toContain('url: "https://example.com"');
  });

  it('includes lang when provided', () => {
    const fm = buildFrontmatter({ title: 'T', description: 'D', lang: 'en' });
    expect(fm).toContain('lang: "en"');
  });

  it('includes lastModified when provided', () => {
    const fm = buildFrontmatter({ title: 'T', description: 'D', lastModified: '2024-01-01' });
    expect(fm).toContain('lastModified: "2024-01-01"');
  });

  it('escapes quotes in title', () => {
    const fm = buildFrontmatter({ title: 'He said "hello"', description: 'D' });
    expect(fm).toContain('He said \\"hello\\"');
  });

  it('includes schema type from JSON-LD', () => {
    const fm = buildFrontmatter({
      title: 'T',
      description: 'D',
      jsonLd: [{ '@type': 'Article' }],
    });
    expect(fm).toContain('schema: "Article"');
  });

  it('starts and ends with ---', () => {
    const fm = buildFrontmatter({ title: 'T', description: 'D' });
    expect(fm.startsWith('---')).toBe(true);
    expect(fm.endsWith('---')).toBe(true);
  });
});
