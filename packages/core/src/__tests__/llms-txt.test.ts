import { describe, it, expect } from 'vitest';
import { generateLlmsTxt } from '../llms-txt.js';

describe('generateLlmsTxt', () => {
  it('generates spec-compliant llms.txt with H1, blockquote, and sections', () => {
    const result = generateLlmsTxt(
      {
        siteName: 'My App',
        siteDescription: 'A great application.',
        baseUrl: 'https://example.com',
      },
      [
        { path: '/docs/intro', title: 'Introduction', section: 'Documentation' },
        { path: '/docs/api', title: 'API Reference', section: 'Documentation', description: 'Full API docs' },
      ]
    );

    expect(result.llmsTxt).toContain('# My App');
    expect(result.llmsTxt).toContain('> A great application.');
    expect(result.llmsTxt).toContain('## Documentation');
    expect(result.llmsTxt).toContain('[Introduction](https://example.com/docs/intro.md)');
    expect(result.llmsTxt).toContain('[API Reference](https://example.com/docs/api.md): Full API docs');
  });

  it('groups routes by section', () => {
    const result = generateLlmsTxt(
      { siteName: 'S', siteDescription: 'D', baseUrl: 'https://example.com' },
      [
        { path: '/a', title: 'A', section: 'Docs' },
        { path: '/b', title: 'B', section: 'Blog' },
        { path: '/c', title: 'C', section: 'Docs' },
      ]
    );

    expect(result.llmsTxt).toContain('## Docs');
    expect(result.llmsTxt).toContain('## Blog');
  });

  it('appends .md extension to links', () => {
    const result = generateLlmsTxt(
      { siteName: 'S', siteDescription: 'D', baseUrl: 'https://example.com' },
      [{ path: '/page', title: 'Page' }]
    );

    expect(result.llmsTxt).toContain('https://example.com/page.md');
  });

  it('generates llms-full.txt with concatenated content', () => {
    const fullText = new Map<string, string>();
    fullText.set('/a', 'Content A');
    fullText.set('/b', 'Content B');

    const result = generateLlmsTxt(
      { siteName: 'S', siteDescription: 'D', baseUrl: 'https://example.com' },
      [
        { path: '/a', title: 'Page A' },
        { path: '/b', title: 'Page B' },
      ],
      fullText
    );

    expect(result.llmsFullTxt).toContain('## Page A');
    expect(result.llmsFullTxt).toContain('Content A');
    expect(result.llmsFullTxt).toContain('## Page B');
    expect(result.llmsFullTxt).toContain('Content B');
  });

  it('handles empty routes array', () => {
    const result = generateLlmsTxt(
      { siteName: 'S', siteDescription: 'D', baseUrl: 'https://example.com' },
      []
    );

    expect(result.llmsTxt).toContain('# S');
    expect(result.routeCount).toBe(0);
  });
});
