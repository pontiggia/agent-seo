import { describe, it, expect } from 'vitest';
import { auditUrl } from '../commands/audit.js';

const GOOD_HTML = `
<html lang="en">
<head>
  <title>Test Page</title>
  <meta name="description" content="A comprehensive guide to testing">
  <script type="application/ld+json">{"@type": "Article", "headline": "Test Page"}</script>
</head>
<body>
  <article>
    <h1>Test Page</h1>
    <p>Testing is a process that ensures software quality. It is an essential part of development.</p>
    <h2>Types of Testing</h2>
    <p>There are many types of testing including unit testing, integration testing, and end-to-end testing.</p>
    <h3>Unit Testing</h3>
    <p>Unit testing tests individual functions and components.</p>
  </article>
</body>
</html>
`;

const SPA_HTML = `
<html>
<head><title>SPA App</title></head>
<body>
  <div id="root"></div>
  <script src="/app.js"></script>
</body>
</html>
`;

describe('auditUrl', () => {
  it('returns a score between 0 and 100', async () => {
    const result = await auditUrl('https://example.com', GOOD_HTML);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('returns 8 checks', async () => {
    const result = await auditUrl('https://example.com', GOOD_HTML);
    expect(result.checks).toHaveLength(8);
  });

  it('scores well-structured content highly', async () => {
    const result = await auditUrl('https://example.com', GOOD_HTML);
    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it('detects JSON-LD presence', async () => {
    const result = await auditUrl('https://example.com', GOOD_HTML);
    const schemaCheck = result.checks.find((c) => c.name === 'Schema.org Structured Data');
    expect(schemaCheck?.passed).toBe(true);
    expect(schemaCheck?.score).toBeGreaterThan(0);
  });

  it('detects meta completeness', async () => {
    const result = await auditUrl('https://example.com', GOOD_HTML);
    const metaCheck = result.checks.find((c) => c.name === 'Meta Completeness');
    expect(metaCheck?.passed).toBe(true);
    expect(metaCheck?.score).toBe(10);
  });

  it('flags SPA pages with low SSR score', async () => {
    const result = await auditUrl('https://example.com', SPA_HTML);
    const ssrCheck = result.checks.find((c) => c.name === 'Server-Side Rendering');
    expect(ssrCheck?.passed).toBe(false);
    expect(ssrCheck?.score).toBe(0);
  });

  it('includes transform result', async () => {
    const result = await auditUrl('https://example.com', GOOD_HTML);
    expect(result.transformResult).toBeDefined();
    expect(result.transformResult.markdown).toBeDefined();
    expect(result.transformResult.tokenEstimate).toBeGreaterThan(0);
  });

  it('returns the audited URL', async () => {
    const result = await auditUrl('https://example.com/page', GOOD_HTML);
    expect(result.url).toBe('https://example.com/page');
  });
});
