import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  discoverNextRoutes,
  discoverFilesystemRoutes,
  extractMetadataFromSource,
} from '../discover.js';

const TEST_DIR = join(import.meta.dirname, '__fixtures_discover__');

function setupDir(structure: Record<string, string>) {
  for (const [path, content] of Object.entries(structure)) {
    const fullPath = join(TEST_DIR, path);
    mkdirSync(join(fullPath, '..'), { recursive: true });
    writeFileSync(fullPath, content, 'utf-8');
  }
}

beforeEach(() => {
  if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
});

// ============================================================
// NEXT.JS ROUTE DISCOVERY
// ============================================================

describe('discoverNextRoutes', () => {
  it('discovers a simple app directory structure', () => {
    setupDir({
      'page.tsx': `
        export const metadata = { title: 'Home', description: 'Welcome home' };
        export default function Page() { return <div>Home</div>; }
      `,
      'about/page.tsx': `
        export const metadata = { title: 'About Us', description: 'Learn more about us' };
        export default function Page() { return <div>About</div>; }
      `,
      'docs/intro/page.tsx': `
        export const metadata = { title: 'Introduction', description: 'Getting started guide' };
        export default function Page() { return <div>Intro</div>; }
      `,
    });

    const routes = discoverNextRoutes(TEST_DIR);

    expect(routes).toHaveLength(3);
    expect(routes[0]).toEqual({
      path: '/',
      title: 'Home',
      description: 'Welcome home',
      section: 'Pages',
    });
    expect(routes[1]).toEqual({
      path: '/about',
      title: 'About Us',
      description: 'Learn more about us',
      section: 'About',
    });
    expect(routes[2]).toEqual({
      path: '/docs/intro',
      title: 'Introduction',
      description: 'Getting started guide',
      section: 'Docs',
    });
  });

  it('handles various page file extensions', () => {
    setupDir({
      'page.tsx': 'export default function Page() {}',
      'blog/page.js': 'export default function Page() {}',
      'help/page.mdx': '# Help',
    });

    const routes = discoverNextRoutes(TEST_DIR);
    expect(routes).toHaveLength(3);
    expect(routes.map((r) => r.path)).toEqual(['/', '/blog', '/help']);
  });

  it('skips api directory', () => {
    setupDir({
      'page.tsx': 'export default function Page() {}',
      'api/health/route.ts': 'export async function GET() {}',
    });

    const routes = discoverNextRoutes(TEST_DIR);
    expect(routes).toHaveLength(1);
    expect(routes[0].path).toBe('/');
  });

  it('skips private directories (prefixed with _)', () => {
    setupDir({
      'page.tsx': 'export default function Page() {}',
      '_components/Button.tsx': 'export function Button() {}',
      '_lib/utils.ts': 'export function cn() {}',
    });

    const routes = discoverNextRoutes(TEST_DIR);
    expect(routes).toHaveLength(1);
  });

  it('handles route groups (parenthesized directories)', () => {
    setupDir({
      '(marketing)/page.tsx': `
        export const metadata = { title: 'Marketing Home' };
        export default function Page() {}
      `,
      '(marketing)/pricing/page.tsx': `
        export const metadata = { title: 'Pricing' };
        export default function Page() {}
      `,
      '(auth)/login/page.tsx': `
        export const metadata = { title: 'Login' };
        export default function Page() {}
      `,
    });

    const routes = discoverNextRoutes(TEST_DIR);

    // Route groups should be stripped from the URL
    expect(routes.map((r) => r.path).sort()).toEqual([
      '/',
      '/login',
      '/pricing',
    ]);
  });

  it('handles dynamic segments [slug]', () => {
    setupDir({
      'blog/[slug]/page.tsx': `
        export const metadata = { title: 'Blog Post' };
        export default function Page() {}
      `,
    });

    const routes = discoverNextRoutes(TEST_DIR);
    expect(routes).toHaveLength(1);
    expect(routes[0].path).toBe('/blog/[slug]');
  });

  it('skips catch-all routes [...slug] and [[...slug]]', () => {
    setupDir({
      'page.tsx': 'export default function Page() {}',
      'docs/[...slug]/page.tsx': 'export default function Page() {}',
      'catch/[[...slug]]/page.tsx': 'export default function Page() {}',
    });

    const routes = discoverNextRoutes(TEST_DIR);
    expect(routes).toHaveLength(1);
    expect(routes[0].path).toBe('/');
  });

  it('respects custom exclude patterns', () => {
    setupDir({
      'page.tsx': 'export default function Page() {}',
      'admin/page.tsx': 'export default function Page() {}',
      'admin/settings/page.tsx': 'export default function Page() {}',
      'docs/page.tsx': 'export default function Page() {}',
    });

    const routes = discoverNextRoutes(TEST_DIR, { exclude: ['/admin'] });
    expect(routes).toHaveLength(2);
    expect(routes.map((r) => r.path).sort()).toEqual(['/', '/docs']);
  });

  it('derives sections from top-level directory', () => {
    setupDir({
      'page.tsx': 'export default function Page() {}',
      'docs/getting-started/page.tsx': 'export default function Page() {}',
      'docs/api-reference/page.tsx': 'export default function Page() {}',
      'blog/2024/page.tsx': 'export default function Page() {}',
    });

    const routes = discoverNextRoutes(TEST_DIR);
    expect(routes.find((r) => r.path === '/')?.section).toBe('Pages');
    expect(
      routes.find((r) => r.path === '/docs/getting-started')?.section,
    ).toBe('Docs');
    expect(routes.find((r) => r.path === '/docs/api-reference')?.section).toBe(
      'Docs',
    );
    expect(routes.find((r) => r.path === '/blog/2024')?.section).toBe('Blog');
  });

  it('supports custom section strategy', () => {
    setupDir({
      'page.tsx': 'export default function Page() {}',
      'docs/intro/page.tsx': 'export default function Page() {}',
    });

    const routes = discoverNextRoutes(TEST_DIR, {
      sectionStrategy: (path) =>
        path.startsWith('/docs') ? 'Documentation' : 'Main',
    });

    expect(routes.find((r) => r.path === '/')?.section).toBe('Main');
    expect(routes.find((r) => r.path === '/docs/intro')?.section).toBe(
      'Documentation',
    );
  });

  it('falls back to path-derived title when metadata is missing', () => {
    setupDir({
      'getting-started/page.tsx': 'export default function Page() {}',
    });

    const routes = discoverNextRoutes(TEST_DIR);
    expect(routes[0].title).toBe('Getting Started');
  });

  it('returns empty array for non-existent directory', () => {
    const routes = discoverNextRoutes('/nonexistent/path');
    expect(routes).toEqual([]);
  });

  it('skips llms.txt route handler directories', () => {
    setupDir({
      'page.tsx': 'export default function Page() {}',
      'llms.txt/route.ts': 'export async function GET() {}',
    });

    const routes = discoverNextRoutes(TEST_DIR);
    expect(routes).toHaveLength(1);
    expect(routes[0].path).toBe('/');
  });

  it('sorts routes with homepage first then alphabetically', () => {
    setupDir({
      'zzz/page.tsx': 'export default function Page() {}',
      'aaa/page.tsx': 'export default function Page() {}',
      'page.tsx': 'export default function Page() {}',
      'mmm/page.tsx': 'export default function Page() {}',
    });

    const routes = discoverNextRoutes(TEST_DIR);
    expect(routes.map((r) => r.path)).toEqual(['/', '/aaa', '/mmm', '/zzz']);
  });
});

// ============================================================
// METADATA EXTRACTION
// ============================================================

describe('extractMetadataFromSource', () => {
  it('extracts metadata with double quotes', () => {
    const source = `
      export const metadata = {
        title: "My Page Title",
        description: "A page about things",
      };
    `;
    const result = extractMetadataFromSource(source);
    expect(result.title).toBe('My Page Title');
    expect(result.description).toBe('A page about things');
  });

  it('extracts metadata with single quotes', () => {
    const source = `
      export const metadata = {
        title: 'My Page',
        description: 'Description here',
      };
    `;
    const result = extractMetadataFromSource(source);
    expect(result.title).toBe('My Page');
    expect(result.description).toBe('Description here');
  });

  it('extracts metadata with template literals', () => {
    const source = `
      export const metadata = {
        title: \`My Page\`,
        description: \`A description\`,
      };
    `;
    const result = extractMetadataFromSource(source);
    expect(result.title).toBe('My Page');
    expect(result.description).toBe('A description');
  });

  it('handles typed metadata with Metadata type annotation', () => {
    const source = `
      import type { Metadata } from 'next';
      export const metadata: Metadata = {
        title: "Typed Page",
        description: "With type annotation",
      };
    `;
    const result = extractMetadataFromSource(source);
    expect(result.title).toBe('Typed Page');
    expect(result.description).toBe('With type annotation');
  });

  it('handles metadata with nested objects', () => {
    const source = `
      export const metadata = {
        title: "My App",
        description: "An app",
        openGraph: {
          title: "OG Title",
          images: ["/og.png"],
        },
      };
    `;
    const result = extractMetadataFromSource(source);
    expect(result.title).toBe('My App');
    expect(result.description).toBe('An app');
  });

  it('returns empty strings when no metadata export exists', () => {
    const source = `
      export default function Page() {
        return <div>Hello</div>;
      }
    `;
    const result = extractMetadataFromSource(source);
    expect(result.title).toBe('');
    expect(result.description).toBe('');
  });

  it('handles metadata with only title', () => {
    const source = `
      export const metadata = { title: "Only Title" };
    `;
    const result = extractMetadataFromSource(source);
    expect(result.title).toBe('Only Title');
    expect(result.description).toBe('');
  });

  it('handles single-line metadata', () => {
    const source = `export const metadata = { title: "Inline", description: "Inline desc" };`;
    const result = extractMetadataFromSource(source);
    expect(result.title).toBe('Inline');
    expect(result.description).toBe('Inline desc');
  });
});

// ============================================================
// FILESYSTEM ROUTE DISCOVERY
// ============================================================

describe('discoverFilesystemRoutes', () => {
  it('discovers HTML files and derives routes', () => {
    setupDir({
      'index.html':
        '<html><head><title>Home</title></head><body>Home</body></html>',
      'about.html':
        '<html><head><title>About</title></head><body>About</body></html>',
      'docs/intro.html':
        '<html><head><title>Introduction</title></head><body>Intro</body></html>',
    });

    const routes = discoverFilesystemRoutes(TEST_DIR);

    expect(routes).toHaveLength(3);
    expect(routes[0]).toEqual({
      path: '/',
      title: 'Home',
      section: 'Pages',
    });
    expect(routes.find((r) => r.path === '/about')?.title).toBe('About');
    expect(routes.find((r) => r.path === '/docs/intro')?.section).toBe('Docs');
  });

  it('returns empty array for non-existent directory', () => {
    const routes = discoverFilesystemRoutes('/nonexistent/path');
    expect(routes).toEqual([]);
  });

  it('falls back to path-derived title when no <title> tag', () => {
    setupDir({
      'my-page.html': '<html><body>No title tag</body></html>',
    });

    const routes = discoverFilesystemRoutes(TEST_DIR);
    expect(routes[0].title).toBe('My Page');
  });
});
