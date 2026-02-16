import { JSDOM } from 'jsdom';

interface SanitizeOptions {
  stripSelectors?: string[];
  preserveSelectors?: string[];
}

/**
 * Elements that are always removed (noise generators).
 */
const DEFAULT_STRIP_TAGS = [
  'script',
  'style',
  'noscript',
  'iframe',
  'svg',
  'canvas',
  'video',
  'audio',
  'map',
  'object',
  'embed',
  'applet',
  'link[rel="stylesheet"]',
  'meta',
];

/**
 * CSS selectors that match common noise patterns.
 * These are stripped regardless of their tag type.
 */
const DEFAULT_STRIP_SELECTORS = [
  // Navigation & chrome
  'nav',
  'header:not(article header)',
  'footer:not(article footer)',
  '[role="navigation"]',
  '[role="banner"]',
  '[role="contentinfo"]',
  '[role="complementary"]',
  'aside',

  // Ads, cookies, popups
  '.advertisement', '.ad', '.ads', '[class*="ad-"]', '[class*="ad_"]',
  '.cookie-banner', '.cookie-consent', '[class*="cookie"]',
  '.popup', '.modal', '[class*="popup"]', '[class*="modal"]',
  '.overlay',

  // Social & sharing
  '.social-share', '.share-buttons', '[class*="social"]', '[class*="share"]',
  '.follow-us',

  // Comments & forms (not the content)
  '.comments', '#comments', '.comment-form',
  'form:not([class*="search"])',

  // Related content / sidebar noise
  '.related-posts', '.recommended', '.sidebar', '.widget',
  '[class*="related"]', '[class*="sidebar"]', '[class*="widget"]',
  '.newsletter', '.subscribe', '[class*="newsletter"]',
  '.cta', '[class*="cta"]',

  // Visual-only elements
  '.breadcrumb', '.breadcrumbs',
  '.pagination',
  '.skip-link',
  '[aria-hidden="true"]',

  // JS framework artifacts
  '[data-reactroot] > noscript',
  '.hydration-overlay',
];

/**
 * Sanitize HTML by removing noise elements.
 * This is run AFTER Readability extraction (which does the heavy lifting)
 * to catch remaining noise that Readability missed.
 */
export function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
  const { stripSelectors = [], preserveSelectors = [] } = options;

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Build the preserve set first
  const preserveSet = new Set<Node>();
  for (const selector of preserveSelectors) {
    try {
      document.querySelectorAll(selector).forEach((el) => preserveSet.add(el));
    } catch {
      // invalid selector — skip
    }
  }

  // Strip default tags
  for (const tag of DEFAULT_STRIP_TAGS) {
    try {
      document.querySelectorAll(tag).forEach((el) => {
        if (!preserveSet.has(el)) el.remove();
      });
    } catch {
      // skip invalid
    }
  }

  // Strip default selectors + custom selectors
  const allStripSelectors = [...DEFAULT_STRIP_SELECTORS, ...stripSelectors];
  for (const selector of allStripSelectors) {
    try {
      document.querySelectorAll(selector).forEach((el) => {
        if (!preserveSet.has(el)) el.remove();
      });
    } catch {
      // skip invalid
    }
  }

  // Strip elements with zero or near-zero text density
  stripLowDensityElements(document);

  // Remove empty elements left behind
  removeEmptyElements(document);

  // Remove all class/id/style/data-* attributes (noise for Markdown)
  cleanAttributes(document);

  const result = document.body?.innerHTML || '';
  dom.window.close();
  return result;
}

function stripLowDensityElements(document: Document): void {
  const candidates = document.querySelectorAll('div, section, span');
  for (const el of candidates) {
    const textLength = (el.textContent || '').trim().length;
    const childElementCount = el.querySelectorAll('*').length;

    if (childElementCount > 10 && textLength < 50) {
      el.remove();
    }
  }
}

function removeEmptyElements(document: Document): void {
  const candidates = document.querySelectorAll('div, span, p, section, article');
  for (const el of candidates) {
    if (!(el.textContent || '').trim() && !el.querySelector('img, table, pre, code')) {
      el.remove();
    }
  }
}

function cleanAttributes(document: Document): void {
  const all = document.querySelectorAll('*');
  const keepAttrs = new Set(['href', 'src', 'alt', 'title', 'colspan', 'rowspan', 'scope', 'headers', 'lang', 'dir', 'type']);

  for (const el of all) {
    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
      // Preserve class on code elements (needed for language hints like class="language-js")
      if (attr.name === 'class' && el.tagName === 'CODE') continue;
      if (!keepAttrs.has(attr.name)) {
        el.removeAttribute(attr.name);
      }
    }
  }
}
