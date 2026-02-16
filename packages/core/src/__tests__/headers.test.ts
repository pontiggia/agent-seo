import { describe, it, expect } from 'vitest';
import { buildMarkdownHeaders, buildAlternateLinkHeader } from '../headers.js';
import type { TransformResult } from '../types.js';

const mockResult: TransformResult = {
  markdown: '# Test',
  tokenEstimate: 42,
  title: 'Test',
  description: 'A test',
  jsonLd: [],
  canonicalUrl: null,
  lastModified: null,
  lang: null,
};

describe('buildMarkdownHeaders', () => {
  it('includes Content-Type: text/markdown', () => {
    const headers = buildMarkdownHeaders(mockResult, {});
    expect(headers['Content-Type']).toBe('text/markdown; charset=utf-8');
  });

  it('includes Vary: Accept, User-Agent', () => {
    const headers = buildMarkdownHeaders(mockResult, {});
    expect(headers['Vary']).toBe('Accept, User-Agent');
  });

  it('includes X-Markdown-Tokens', () => {
    const headers = buildMarkdownHeaders(mockResult, {});
    expect(headers['X-Markdown-Tokens']).toBe('42');
  });

  it('includes Content-Signal header by default', () => {
    const headers = buildMarkdownHeaders(mockResult, {});
    expect(headers['Content-Signal']).toContain('ai-train=yes');
    expect(headers['Content-Signal']).toContain('search=yes');
    expect(headers['Content-Signal']).toContain('ai-input=yes');
  });

  it('respects custom contentSignal options', () => {
    const headers = buildMarkdownHeaders(mockResult, {
      contentSignal: { aiTrain: false, search: true, aiInput: false },
    });
    expect(headers['Content-Signal']).not.toContain('ai-train');
    expect(headers['Content-Signal']).toContain('search=yes');
    expect(headers['Content-Signal']).not.toContain('ai-input');
  });

  it('includes X-Robots-Tag: all', () => {
    const headers = buildMarkdownHeaders(mockResult, {});
    expect(headers['X-Robots-Tag']).toBe('all');
  });
});

describe('buildAlternateLinkHeader', () => {
  it('appends .md to path', () => {
    const header = buildAlternateLinkHeader('/docs/getting-started');
    expect(header).toContain('/docs/getting-started.md');
    expect(header).toContain('rel="alternate"');
    expect(header).toContain('type="text/markdown"');
  });

  it('handles trailing slash with index.md', () => {
    const header = buildAlternateLinkHeader('/docs/');
    expect(header).toContain('/docs/index.md');
  });

  it('uses custom extension', () => {
    const header = buildAlternateLinkHeader('/page', '.markdown');
    expect(header).toContain('/page.markdown');
  });
});
