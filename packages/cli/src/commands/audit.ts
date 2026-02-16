import { transform, estimateTokens } from '@agent-seo/core';
import type { TransformResult } from '@agent-seo/core';

export interface AuditResult {
  url: string;
  score: number;
  checks: AuditCheck[];
  transformResult: TransformResult;
}

export interface AuditCheck {
  name: string;
  passed: boolean;
  score: number;
  maxScore: number;
  message: string;
}

export async function auditUrl(url: string, html: string): Promise<AuditResult> {
  const checks: AuditCheck[] = [];

  const result = await transform(html, { url, extractJsonLd: true, frontmatter: false });

  // 1. Answer Placement (20 pts)
  const firstWords = result.markdown.split(/\s+/).slice(0, 60).join(' ');
  const hasAnswerPlacement = /\b(?:is|are|was|were|means?|refers?\s+to|defined?\s+as)\b/i.test(firstWords);
  checks.push({
    name: 'Answer Placement',
    passed: hasAnswerPlacement,
    score: hasAnswerPlacement ? 20 : 0,
    maxScore: 20,
    message: hasAnswerPlacement
      ? 'A definitional answer appears in the first 60 words.'
      : 'No clear answer found in the first 60 words. Place a direct answer early in the content.',
  });

  // 2. Extractability (15 pts)
  const markdownLength = result.markdown.length;
  const htmlLength = html.length;
  const extractionRatio = markdownLength / htmlLength;
  const goodExtraction = extractionRatio > 0.02 && extractionRatio < 0.5;
  checks.push({
    name: 'Content Extractability',
    passed: goodExtraction,
    score: goodExtraction ? 15 : extractionRatio > 0.01 ? 7 : 0,
    maxScore: 15,
    message: goodExtraction
      ? `Clean extraction achieved (${(extractionRatio * 100).toFixed(1)}% content ratio).`
      : `Extraction ratio is ${(extractionRatio * 100).toFixed(1)}% — content may be hard for AI to extract.`,
  });

  // 3. Token Efficiency (10 pts)
  const htmlTokens = estimateTokens(html);
  const mdTokens = result.tokenEstimate;
  const tokenReduction = 1 - mdTokens / htmlTokens;
  const goodEfficiency = tokenReduction > 0.5;
  checks.push({
    name: 'Token Efficiency',
    passed: goodEfficiency,
    score: goodEfficiency ? 10 : Math.round(tokenReduction * 10),
    maxScore: 10,
    message: `${(tokenReduction * 100).toFixed(0)}% token reduction (${htmlTokens} HTML → ${mdTokens} Markdown).`,
  });

  // 4. Heading Hierarchy (10 pts)
  const headings = result.markdown.match(/^#{1,6}\s/gm) || [];
  const hasH1 = result.markdown.includes('# ');
  const headingCount = headings.length;
  const goodHeadings = hasH1 && headingCount >= 2;
  checks.push({
    name: 'Heading Hierarchy',
    passed: goodHeadings,
    score: goodHeadings ? 10 : hasH1 ? 5 : 0,
    maxScore: 10,
    message: goodHeadings
      ? `Good heading structure (${headingCount} headings found).`
      : 'Improve heading hierarchy — ensure H1 exists and content has nested headings.',
  });

  // 5. Schema.org Data (15 pts)
  const hasJsonLd = result.jsonLd.length > 0;
  const hasRichSchema = result.jsonLd.some(
    (ld) => ['Article', 'Product', 'FAQPage', 'HowTo', 'WebPage'].includes(ld['@type'] as string)
  );
  checks.push({
    name: 'Schema.org Structured Data',
    passed: hasJsonLd,
    score: hasRichSchema ? 15 : hasJsonLd ? 10 : 0,
    maxScore: 15,
    message: hasRichSchema
      ? `Rich Schema.org data found (${result.jsonLd.map((ld) => ld['@type']).join(', ')}).`
      : hasJsonLd
      ? 'Basic JSON-LD found, but consider adding Article, Product, or FAQPage schema.'
      : 'No JSON-LD structured data found. Add Schema.org markup for 58% higher AI visibility.',
  });

  // 6. Meta Completeness (10 pts)
  const hasTitle = result.title.length > 0;
  const hasDescription = result.description.length > 0;
  const metaScore = (hasTitle ? 5 : 0) + (hasDescription ? 5 : 0);
  checks.push({
    name: 'Meta Completeness',
    passed: hasTitle && hasDescription,
    score: metaScore,
    maxScore: 10,
    message: hasTitle && hasDescription
      ? 'Title and meta description present.'
      : `Missing: ${!hasTitle ? 'title' : ''} ${!hasDescription ? 'meta description' : ''}`.trim(),
  });

  // 7. Definitional Syntax (5 pts)
  const hasDefinitional = /\b\w+\s+(?:is|are)\s+(?:a|an|the)\s/i.test(firstWords);
  checks.push({
    name: 'Definitional Syntax',
    passed: hasDefinitional,
    score: hasDefinitional ? 5 : 0,
    maxScore: 5,
    message: hasDefinitional
      ? 'Content uses definitional syntax that AI systems prefer for citations.'
      : 'Consider starting with "X is..." pattern for better AI citation likelihood.',
  });

  // 8. Server Rendering (15 pts)
  const hasSubstantialContent = html.length > 500 && /<(p|h[1-6]|article|main|section)\b/i.test(html);
  const hasOnlyJsShell = /<div\s+id=["'](?:root|app|__next)["']\s*>\s*<\/div>/i.test(html) && !hasSubstantialContent;
  checks.push({
    name: 'Server-Side Rendering',
    passed: !hasOnlyJsShell,
    score: hasOnlyJsShell ? 0 : 15,
    maxScore: 15,
    message: hasOnlyJsShell
      ? 'Page appears to be client-side rendered (empty shell). AI crawlers that do not execute JS will see no content.'
      : 'Page contains server-rendered HTML content.',
  });

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);

  return {
    url,
    score: totalScore,
    checks,
    transformResult: result,
  };
}
