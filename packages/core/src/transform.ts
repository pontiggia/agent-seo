import { JSDOM } from 'jsdom';
import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { sanitizeHtml } from './sanitize.js';
import { htmlToMarkdown } from './markdown.js';
import { extractJsonLdBlocks } from './json-ld.js';
import { estimateTokens } from './tokens.js';
import { buildFrontmatter } from './frontmatter.js';
import type { TransformOptions, TransformResult } from './types.js';

/**
 * Transform an HTML string into clean, LLM-optimized Markdown.
 *
 * Pipeline: Parse DOM → Extract JSON-LD → Readability extract → Sanitize → Turndown → Frontmatter → Token budget
 */
export async function transform(
  html: string,
  options: TransformOptions = {}
): Promise<TransformResult> {
  const {
    url,
    tokenBudget,
    extractJsonLd = true,
    stripSelectors = [],
    preserveSelectors = [],
    frontmatter = true,
    turndownRules = [],
  } = options;

  // Stage 1: DOM Construction
  const dom = new JSDOM(html, { url: url || 'https://localhost' });
  const document = dom.window.document;

  // Extract metadata before Readability mutates the DOM
  const title =
    document.querySelector('title')?.textContent?.trim() ||
    document.querySelector('h1')?.textContent?.trim() ||
    '';
  const description =
    document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  const canonicalUrl =
    document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null;
  const lang = document.documentElement.getAttribute('lang') || null;
  const lastModified =
    document.querySelector('meta[property="article:modified_time"]')?.getAttribute('content') ||
    document.querySelector('meta[name="last-modified"]')?.getAttribute('content') ||
    null;

  // Stage 2: JSON-LD Extraction
  const jsonLd = extractJsonLd ? extractJsonLdBlocks(document) : [];

  // Stage 3: Content Extraction via Readability
  let contentHtml: string;
  if (isProbablyReaderable(document)) {
    const reader = new Readability(document, { charThreshold: 100 });
    const article = reader.parse();
    contentHtml = article?.content || document.body?.innerHTML || html;
  } else {
    // Page is not article-like (e.g., docs, API reference) — use the body directly
    contentHtml = document.body?.innerHTML || html;
  }

  // Stage 4: HTML Sanitization
  const cleanHtml = sanitizeHtml(contentHtml, {
    stripSelectors,
    preserveSelectors,
  });

  // Stage 5: Markdown Conversion
  let markdown = htmlToMarkdown(cleanHtml, { url, customRules: turndownRules });

  // Stage 6: Add Frontmatter
  if (frontmatter) {
    const fm = buildFrontmatter({ title, description, url, lang, lastModified, jsonLd });
    markdown = fm + '\n\n' + markdown;
  }

  // Stage 7: Token Budget Enforcement
  let tokenEstimate = estimateTokens(markdown);
  if (tokenBudget && tokenEstimate > tokenBudget) {
    markdown = truncateToTokenBudget(markdown, tokenBudget);
    tokenEstimate = estimateTokens(markdown);
  }

  dom.window.close();

  return {
    markdown,
    tokenEstimate,
    title,
    description,
    jsonLd,
    canonicalUrl,
    lastModified,
    lang,
  };
}

/**
 * Intelligent truncation: preserve headings and first sentences of paragraphs,
 * remove later paragraphs.
 */
function truncateToTokenBudget(markdown: string, budget: number): string {
  const lines = markdown.split('\n');
  const result: string[] = [];
  let currentTokens = 0;

  for (const line of lines) {
    const lineTokens = estimateTokens(line);
    if (currentTokens + lineTokens > budget) {
      if (/^#{1,6}\s/.test(line)) {
        result.push(line);
        result.push('\n*[Content truncated for token budget]*\n');
      }
      break;
    }
    result.push(line);
    currentTokens += lineTokens;
  }

  return result.join('\n');
}
