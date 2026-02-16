/**
 * Estimate token count using the chars/4 heuristic.
 * This is the same heuristic used by Cloudflare's X-Markdown-Tokens header.
 * Accurate to within ~10% for English text across GPT and Claude tokenizers.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
