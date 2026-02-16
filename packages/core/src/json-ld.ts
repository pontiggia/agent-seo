/**
 * Extract all JSON-LD blocks from a document.
 * These are <script type="application/ld+json"> elements.
 */
export function extractJsonLdBlocks(document: Document): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');

  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent || '');
      // Handle @graph arrays
      if (data['@graph'] && Array.isArray(data['@graph'])) {
        results.push(...data['@graph']);
      } else {
        results.push(data);
      }
    } catch {
      // Invalid JSON-LD — skip silently
    }
  }

  return results;
}
