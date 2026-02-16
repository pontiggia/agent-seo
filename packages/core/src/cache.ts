import { LRUCache } from 'lru-cache';
import type { TransformResult } from './types.js';

export interface CacheOptions {
  /** Max number of entries. Default: 100 */
  maxEntries?: number;
  /** TTL in milliseconds. Default: 300_000 (5 minutes) */
  ttl?: number;
}

export function createCache(options: CacheOptions = {}) {
  const { maxEntries = 100, ttl = 300_000 } = options;

  const cache = new LRUCache<string, TransformResult>({
    max: maxEntries,
    ttl,
  });

  return {
    get: (key: string) => cache.get(key),
    set: (key: string, value: TransformResult) => cache.set(key, value),
    has: (key: string) => cache.has(key),
    clear: () => cache.clear(),
    size: () => cache.size,
  };
}
