import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import type { LlmsTxtRoute } from './types.js';

// ============================================================
// ROUTE DISCOVERY
// ============================================================

/**
 * Options for route discovery.
 */
export interface DiscoverOptions {
  /**
   * Glob-like patterns to exclude from discovery.
   * Matches against the URL path, e.g. ["/api", "/admin", "/_internal"].
   * Default: ["/api", "/_*"]
   */
  exclude?: string[];

  /**
   * How to derive the section name from a route path.
   * - 'directory': uses the first path segment (e.g., "/docs/intro" → "Docs")
   * - A custom function: (path: string) => string
   * Default: 'directory'
   */
  sectionStrategy?: 'directory' | ((path: string) => string);

  /**
   * Default section name for top-level pages (e.g., "/" or "/about").
   * Default: "Pages"
   */
  defaultSection?: string;
}

// ============================================================
// NEXT.JS APP ROUTER DISCOVERY
// ============================================================

const PAGE_FILE_PATTERNS = [
  'page.tsx',
  'page.ts',
  'page.jsx',
  'page.js',
  'page.mdx',
  'page.md',
];

const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  '.turbo',
  '_components',
  '_lib',
  '_utils',
  '_hooks',
  '_actions',
  'components',
  'lib',
  'utils',
  'hooks',
  'actions',
  'api', // API routes are not pages
]);

/**
 * Scan a Next.js `app/` directory and discover all page routes.
 *
 * For each `page.tsx` found, it:
 * 1. Derives the URL path from the directory structure
 * 2. Attempts to extract `metadata.title` and `metadata.description` from the file
 * 3. Assigns a section based on the top-level directory
 *
 * @param appDir - Absolute path to the `app/` directory
 * @param options - Discovery options
 * @returns Array of discovered routes
 *
 * @example
 * ```ts
 * const routes = discoverNextRoutes('/path/to/app');
 * // [
 * //   { path: '/', title: 'Home', description: '...', section: 'Pages' },
 * //   { path: '/docs/intro', title: 'Introduction', description: '...', section: 'Docs' },
 * // ]
 * ```
 */
export function discoverNextRoutes(
  appDir: string,
  options: DiscoverOptions = {},
): LlmsTxtRoute[] {
  const {
    exclude = ['/api'],
    sectionStrategy = 'directory',
    defaultSection = 'Pages',
  } = options;

  if (!existsSync(appDir)) {
    return [];
  }

  const routes: LlmsTxtRoute[] = [];
  scanAppDir(appDir, appDir, routes, exclude, sectionStrategy, defaultSection);

  // Sort: homepage first, then alphabetically
  routes.sort((a, b) => {
    if (a.path === '/') return -1;
    if (b.path === '/') return 1;
    return a.path.localeCompare(b.path);
  });

  return routes;
}

function scanAppDir(
  rootDir: string,
  currentDir: string,
  routes: LlmsTxtRoute[],
  exclude: string[],
  sectionStrategy: 'directory' | ((path: string) => string),
  defaultSection: string,
): void {
  const entries = readdirSync(currentDir);

  for (const entry of entries) {
    const fullPath = join(currentDir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip private directories (prefixed with _) and known non-page dirs
      const baseName = entry.toLowerCase();
      if (
        baseName.startsWith('_') ||
        baseName.startsWith('.') ||
        SKIP_DIRS.has(baseName)
      )
        continue;

      // Skip route groups like (marketing) — they don't affect the URL path
      // but we still need to scan inside them
      scanAppDir(
        rootDir,
        fullPath,
        routes,
        exclude,
        sectionStrategy,
        defaultSection,
      );
      continue;
    }

    // Check if this is a page file
    if (!PAGE_FILE_PATTERNS.includes(entry)) continue;

    // Derive URL path from directory structure
    const relativePath = currentDir.substring(rootDir.length);
    let urlPath = relativePath.replace(/\\/g, '/');

    // Handle route groups: strip (groupName) segments
    urlPath = urlPath.replace(/\/\([^)]+\)/g, '');

    // Handle dynamic segments: [slug] → keep as-is for now
    // Handle catch-all: [...slug] and [[...slug]] → skip (too dynamic)
    if (urlPath.includes('[...') || urlPath.includes('[[...')) continue;

    // Root page
    if (urlPath === '') urlPath = '/';

    // Ensure leading slash
    if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;

    // Check exclusions
    if (shouldExclude(urlPath, exclude)) continue;

    // Skip llms.txt route handler itself
    if (urlPath === '/llms.txt' || urlPath === '/llms-full.txt') continue;

    // Extract metadata from the page file
    const { title, description } = extractMetadataFromFile(fullPath);

    // Derive section
    const section = deriveSection(urlPath, sectionStrategy, defaultSection);

    routes.push({
      path: urlPath,
      title: title || pathToTitle(urlPath),
      description: description || undefined,
      section,
    });
  }
}

/**
 * Extract metadata.title and metadata.description from a Next.js page file.
 *
 * This uses simple regex parsing — it doesn't evaluate the code.
 * It handles the two common patterns:
 *
 * 1. `export const metadata = { title: "...", description: "..." }`
 * 2. `export const metadata: Metadata = { title: "...", description: "..." }`
 */
function extractMetadataFromFile(filePath: string): {
  title: string;
  description: string;
} {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return extractMetadataFromSource(content);
  } catch {
    return { title: '', description: '' };
  }
}

/**
 * Parse metadata from source code string.
 * Exported for testing.
 */
export function extractMetadataFromSource(source: string): {
  title: string;
  description: string;
} {
  let title = '';
  let description = '';

  // Match `export const metadata = { ... }` or `export const metadata: Metadata = { ... }`
  // We need to handle multi-line objects, so we find the opening { and match to closing }
  const metadataMatch = source.match(
    /export\s+const\s+metadata[\s:]*(?:Metadata\s*)?=\s*\{/,
  );

  if (!metadataMatch) {
    return { title, description };
  }

  // Extract the object content by counting braces
  const startIdx = metadataMatch.index! + metadataMatch[0].length - 1; // position of {
  const objectStr = extractBalancedBraces(source, startIdx);

  if (!objectStr) {
    return { title, description };
  }

  // Extract title
  const titleMatch = objectStr.match(
    /title\s*:\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`)/,
  );
  if (titleMatch) {
    title = titleMatch[1] || titleMatch[2] || titleMatch[3] || '';
  }

  // Extract description
  const descMatch = objectStr.match(
    /description\s*:\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`)/,
  );
  if (descMatch) {
    description = descMatch[1] || descMatch[2] || descMatch[3] || '';
  }

  return { title, description };
}

/**
 * Extract a balanced brace block starting from position `start` (which should be `{`).
 */
function extractBalancedBraces(source: string, start: number): string | null {
  if (source[start] !== '{') return null;

  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') depth--;

    if (depth === 0) {
      return source.substring(start, i + 1);
    }
  }

  return null;
}

/**
 * Derive a section name from a URL path.
 */
function deriveSection(
  urlPath: string,
  strategy: 'directory' | ((path: string) => string),
  defaultSection: string,
): string {
  if (typeof strategy === 'function') {
    return strategy(urlPath);
  }

  // 'directory' strategy: use the first path segment, capitalize it
  const segments = urlPath.split('/').filter(Boolean);
  if (segments.length === 0) return defaultSection;

  const firstSegment = segments[0];

  // If the first segment contains a dynamic param like [slug], use default
  if (firstSegment.startsWith('[')) return defaultSection;

  // Capitalize and humanize: "tools" → "Tools", "api-reference" → "Api Reference"
  return firstSegment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert a URL path into a human-readable title.
 * "/docs/getting-started" → "Getting Started"
 * "/" → "Home"
 */
function pathToTitle(urlPath: string): string {
  if (urlPath === '/') return 'Home';

  const lastSegment = urlPath.split('/').filter(Boolean).pop() || '';

  // Skip dynamic segments
  if (lastSegment.startsWith('[')) {
    return lastSegment.replace(/^\[|\]$/g, '');
  }

  return lastSegment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Check if a path should be excluded based on patterns.
 */
function shouldExclude(urlPath: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    // Simple prefix matching
    if (pattern.endsWith('/**') || pattern.endsWith('/*')) {
      const prefix = pattern.replace(/\/\*\*?$/, '');
      if (urlPath === prefix || urlPath.startsWith(prefix + '/')) return true;
    } else if (pattern.startsWith('_')) {
      // Exclude paths starting with _
      if (
        urlPath.startsWith('/' + pattern) ||
        urlPath.includes('/' + pattern + '/')
      )
        return true;
    } else if (urlPath === pattern || urlPath.startsWith(pattern + '/')) {
      return true;
    }
  }
  return false;
}

// ============================================================
// FILESYSTEM DISCOVERY (HTML files)
// ============================================================

/**
 * Discover routes by scanning a directory for HTML files.
 * Useful for static sites or build output directories.
 */
export function discoverFilesystemRoutes(
  dir: string,
  options: DiscoverOptions = {},
): LlmsTxtRoute[] {
  const {
    exclude = [],
    sectionStrategy = 'directory',
    defaultSection = 'Pages',
  } = options;

  if (!existsSync(dir)) {
    return [];
  }

  const htmlFiles = findHtmlFiles(dir);
  const routes: LlmsTxtRoute[] = [];

  for (const filePath of htmlFiles) {
    const relativePath = filePath.substring(dir.length);
    let urlPath = relativePath
      .replace(/\\/g, '/')
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '');

    if (urlPath === '') urlPath = '/';
    if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;

    if (shouldExclude(urlPath, exclude)) continue;

    const section = deriveSection(urlPath, sectionStrategy, defaultSection);

    // Try to extract title from HTML
    let title = '';
    try {
      const html = readFileSync(filePath, 'utf-8');
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      title = titleMatch?.[1]?.trim() || '';
    } catch {
      // ignore
    }

    routes.push({
      path: urlPath,
      title: title || pathToTitle(urlPath),
      section,
    });
  }

  routes.sort((a, b) => {
    if (a.path === '/') return -1;
    if (b.path === '/') return 1;
    return a.path.localeCompare(b.path);
  });

  return routes;
}

function findHtmlFiles(dir: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;

  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (['node_modules', '.next', '.git', 'dist', '.turbo'].includes(entry))
        continue;
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.endsWith('.html')) {
      results.push(fullPath);
    }
  }

  return results;
}
