import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { extractJsonLdBlocks } from '../json-ld.js';

function createDoc(html: string): Document {
  const dom = new JSDOM(html);
  return dom.window.document;
}

describe('extractJsonLdBlocks', () => {
  it('parses HTML with one JSON-LD block', () => {
    const doc = createDoc(`
      <html><head>
        <script type="application/ld+json">{"@type": "Article", "headline": "Test"}</script>
      </head><body></body></html>
    `);
    const result = extractJsonLdBlocks(doc);
    expect(result).toHaveLength(1);
    expect(result[0]['@type']).toBe('Article');
    expect(result[0]['headline']).toBe('Test');
  });

  it('parses HTML with @graph array', () => {
    const doc = createDoc(`
      <html><head>
        <script type="application/ld+json">
          {"@graph": [{"@type": "Organization", "name": "Test"}, {"@type": "WebPage"}]}
        </script>
      </head><body></body></html>
    `);
    const result = extractJsonLdBlocks(doc);
    expect(result).toHaveLength(2);
    expect(result[0]['@type']).toBe('Organization');
    expect(result[1]['@type']).toBe('WebPage');
  });

  it('handles invalid JSON gracefully', () => {
    const doc = createDoc(`
      <html><head>
        <script type="application/ld+json">{invalid json}</script>
      </head><body></body></html>
    `);
    const result = extractJsonLdBlocks(doc);
    expect(result).toHaveLength(0);
  });

  it('handles no JSON-LD blocks', () => {
    const doc = createDoc('<html><head></head><body></body></html>');
    const result = extractJsonLdBlocks(doc);
    expect(result).toHaveLength(0);
  });

  it('handles multiple JSON-LD blocks', () => {
    const doc = createDoc(`
      <html><head>
        <script type="application/ld+json">{"@type": "Article"}</script>
        <script type="application/ld+json">{"@type": "Organization"}</script>
      </head><body></body></html>
    `);
    const result = extractJsonLdBlocks(doc);
    expect(result).toHaveLength(2);
  });
});
