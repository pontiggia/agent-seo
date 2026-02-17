import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import type { TurndownRule } from './types.js';

interface MarkdownOptions {
  url?: string;
  customRules?: TurndownRule[];
}

export function htmlToMarkdown(html: string, options: MarkdownOptions = {}): string {
  const { url, customRules = [] } = options;

  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
    strongDelimiter: '**',
    linkStyle: 'inlined',
    hr: '---',
  });

  // Enable GFM (tables, strikethrough, task lists)
  turndown.use(gfm);

  // Custom rule: preserve code block language hints
  turndown.addRule('fencedCodeBlock', {
    filter: (node) => {
      return (
        node.nodeName === 'PRE' &&
        node.firstChild !== null &&
        node.firstChild.nodeName === 'CODE'
      );
    },
    replacement: (_content, node) => {
      const codeEl = node.firstChild as Element;
      const className = codeEl?.getAttribute?.('class') || '';

      // Extract language from class="language-xxx" or "hljs xxx" or "highlight-xxx"
      const langMatch = className.match(
        /(?:language-|lang-|hljs\s+|highlight-)([a-zA-Z0-9_+-]+)/
      );
      const lang = langMatch ? langMatch[1] : '';
      const code = codeEl?.textContent || '';

      return `\n\n\`\`\`${lang}\n${code.replace(/\n+$/, '')}\n\`\`\`\n\n`;
    },
  });

  // Custom rule: images with alt text only (skip decorative images)
  turndown.addRule('meaningfulImages', {
    filter: (node) => node.nodeName === 'IMG',
    replacement: (_content, node) => {
      const el = node as Element;
      const alt = el.getAttribute('alt')?.trim();
      const src = el.getAttribute('src')?.trim();

      // Skip decorative images (no alt text or empty alt)
      if (!alt) return '';

      // Resolve relative URLs
      let resolvedSrc = src || '';
      if (url && src && !src.startsWith('http') && !src.startsWith('data:')) {
        try {
          resolvedSrc = new URL(src, url).href;
        } catch {
          resolvedSrc = src;
        }
      }

      return `![${alt}](${resolvedSrc})`;
    },
  });

  // Custom rule: resolve relative links
  turndown.addRule('resolveLinks', {
    filter: 'a',
    replacement: (content, node) => {
      const el = node as Element;
      const href = el.getAttribute('href');
      if (!href || !content.trim()) return content;

      // Skip anchor-only links
      if (href.startsWith('#')) return content;

      // Strip dangerous protocol links entirely
      if (href.startsWith('javascript:') || href.startsWith('data:text/html')) return '';

      let resolvedHref = href;
      if (url && !href.startsWith('http') && !href.startsWith('mailto:')) {
        try {
          resolvedHref = new URL(href, url).href;
        } catch {
          resolvedHref = href;
        }
      }

      const title = el.getAttribute('title');
      return title
        ? `[${content}](${resolvedHref} "${title}")`
        : `[${content}](${resolvedHref})`;
    },
  });

  // Add user-supplied custom rules
  for (const rule of customRules) {
    turndown.addRule(rule.name, {
      filter: rule.filter as any,
      replacement: rule.replacement as any,
    });
  }

  let markdown = turndown.turndown(html);

  // Post-processing: collapse excessive blank lines
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

  return markdown;
}
