import { describe, it, expect } from 'vitest';
import { detectAgent, shouldServeMarkdown } from '../detect.js';

describe('detectAgent', () => {
  it('detects GPTBot', () => {
    const result = detectAgent('Mozilla/5.0 GPTBot/1.0');
    expect(result.isAIBot).toBe(true);
    expect(result.bot?.name).toBe('GPTBot');
    expect(result.bot?.operator).toBe('OpenAI');
    expect(result.bot?.purpose).toBe('training');
  });

  it('detects ClaudeBot', () => {
    const result = detectAgent('ClaudeBot/1.0');
    expect(result.isAIBot).toBe(true);
    expect(result.bot?.name).toBe('ClaudeBot');
    expect(result.bot?.operator).toBe('Anthropic');
  });

  it('detects PerplexityBot', () => {
    const result = detectAgent('PerplexityBot/1.0');
    expect(result.isAIBot).toBe(true);
    expect(result.bot?.name).toBe('PerplexityBot');
    expect(result.bot?.purpose).toBe('search');
  });

  it('detects OAI-SearchBot', () => {
    const result = detectAgent('OAI-SearchBot/1.0');
    expect(result.isAIBot).toBe(true);
    expect(result.bot?.name).toBe('OAI-SearchBot');
    expect(result.bot?.purpose).toBe('search');
  });

  it('detects Applebot-Extended', () => {
    const result = detectAgent('Applebot-Extended/1.0');
    expect(result.isAIBot).toBe(true);
    expect(result.bot?.name).toBe('Applebot-Extended');
    expect(result.bot?.rendersJs).toBe(true);
  });

  it('detects Google-Extended', () => {
    const result = detectAgent('Google-Extended');
    expect(result.isAIBot).toBe(true);
    expect(result.bot?.name).toBe('Google-Extended');
  });

  it('detects ChatGPT-User', () => {
    const result = detectAgent('ChatGPT-User/1.0');
    expect(result.isAIBot).toBe(true);
    expect(result.bot?.name).toBe('ChatGPT-User');
    expect(result.bot?.purpose).toBe('agent-browsing');
    expect(result.bot?.rendersJs).toBe(true);
  });

  it('does NOT flag regular Chrome browser', () => {
    const result = detectAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    expect(result.isAIBot).toBe(false);
    expect(result.bot).toBeNull();
  });

  it('does NOT flag Googlebot (standard)', () => {
    const result = detectAgent('Googlebot/2.1');
    expect(result.isAIBot).toBe(false);
  });

  it('detects Accept: text/markdown header', () => {
    const result = detectAgent('Mozilla/5.0', 'text/markdown, text/html');
    expect(result.isAIBot).toBe(false);
    expect(result.wantsMarkdown).toBe(true);
  });

  it('handles null user-agent gracefully', () => {
    const result = detectAgent(null);
    expect(result.isAIBot).toBe(false);
    expect(result.bot).toBeNull();
  });

  it('handles empty string user-agent', () => {
    const result = detectAgent('');
    expect(result.isAIBot).toBe(false);
    expect(result.bot).toBeNull();
  });
});

describe('shouldServeMarkdown', () => {
  it('returns true for AI bots', () => {
    expect(shouldServeMarkdown('GPTBot/1.0')).toBe(true);
  });

  it('returns true for Accept: text/markdown', () => {
    expect(shouldServeMarkdown('Mozilla/5.0', 'text/markdown')).toBe(true);
  });

  it('returns false for normal browsers', () => {
    expect(shouldServeMarkdown('Mozilla/5.0 Chrome/120.0')).toBe(false);
  });
});
