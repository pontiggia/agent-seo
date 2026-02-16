import { describe, it, expect } from 'vitest';
import { estimateTokens } from '../tokens.js';

describe('estimateTokens', () => {
  it('estimates tokens for "hello world"', () => {
    // "hello world" = 11 chars → ceil(11/4) = 3
    expect(estimateTokens('hello world')).toBe(3);
  });

  it('returns 0 for empty string', () => {
    expect(estimateTokens('')).toBe(0);
  });

  it('handles longer text', () => {
    const text = 'a'.repeat(100);
    expect(estimateTokens(text)).toBe(25);
  });

  it('rounds up for non-divisible lengths', () => {
    expect(estimateTokens('abc')).toBe(1); // ceil(3/4) = 1
    expect(estimateTokens('abcde')).toBe(2); // ceil(5/4) = 2
  });
});
