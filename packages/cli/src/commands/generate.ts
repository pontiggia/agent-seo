import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, relative, extname, basename } from 'node:path';
import { transform, generateLlmsTxt } from '@agent-seo/core';
import type { LlmsTxtRoute } from '@agent-seo/core';

interface GenerateOptions {
  dir: string;
  out: string;
  siteName: string;
  siteDescription: string;
  baseUrl: string;
}

export async function generateCommand(options: GenerateOptions): Promise<{ routeCount: number }> {
  const { dir, out, siteName, siteDescription, baseUrl } = options;

  // Discover HTML files
  const htmlFiles = findHtmlFiles(dir);

  const routes: LlmsTxtRoute[] = [];
  const fullTextContents = new Map<string, string>();

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, 'utf-8');
    const relativePath = relative(dir, filePath);

    // Convert file path to URL path
    let urlPath = '/' + relativePath
      .replace(/\\/g, '/')
      .replace(/index\.html$/, '')
      .replace(/\.html$/, '');

    // Ensure trailing slash for directories
    if (urlPath !== '/' && !urlPath.endsWith('/')) {
      // Keep as-is
    }

    const result = await transform(html, {
      url: `${baseUrl}${urlPath}`,
      frontmatter: false,
    });

    routes.push({
      path: urlPath,
      title: result.title || basename(filePath, extname(filePath)),
      description: result.description || undefined,
    });

    fullTextContents.set(urlPath, result.markdown);
  }

  // Generate llms.txt files
  const result = generateLlmsTxt(
    { siteName, siteDescription, baseUrl },
    routes,
    fullTextContents
  );

  // Write output
  if (!existsSync(out)) {
    mkdirSync(out, { recursive: true });
  }

  writeFileSync(join(out, 'llms.txt'), result.llmsTxt, 'utf-8');
  writeFileSync(join(out, 'llms-full.txt'), result.llmsFullTxt, 'utf-8');

  return { routeCount: result.routeCount };
}

function findHtmlFiles(dir: string): string[] {
  const results: string[] = [];

  if (!existsSync(dir)) return results;

  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, .git, etc.
      if (['node_modules', '.next', '.git', 'dist', '.turbo'].includes(entry)) continue;
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.endsWith('.html')) {
      results.push(fullPath);
    }
  }

  return results;
}
