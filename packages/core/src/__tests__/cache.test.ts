import { describe, it, expect } from 'vitest';
import { createCache } from '../cache.js';
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

describe('createCache', () => {
  it('set and get work', () => {
    const cache = createCache();
    cache.set('/page', mockResult);
    expect(cache.get('/page')).toEqual(mockResult);
  });

  it('has returns true for cached keys', () => {
    const cache = createCache();
    cache.set('/page', mockResult);
    expect(cache.has('/page')).toBe(true);
    expect(cache.has('/other')).toBe(false);
  });

  it('clear removes all entries', () => {
    const cache = createCache();
    cache.set('/a', mockResult);
    cache.set('/b', mockResult);
    cache.clear();
    expect(cache.size()).toBe(0);
  });

  it('size returns entry count', () => {
    const cache = createCache();
    expect(cache.size()).toBe(0);
    cache.set('/a', mockResult);
    expect(cache.size()).toBe(1);
    cache.set('/b', mockResult);
    expect(cache.size()).toBe(2);
  });

  it('evicts when max entries exceeded', () => {
    const cache = createCache({ maxEntries: 2 });
    cache.set('/a', mockResult);
    cache.set('/b', mockResult);
    cache.set('/c', mockResult);
    expect(cache.size()).toBe(2);
    expect(cache.has('/a')).toBe(false);
  });
});
