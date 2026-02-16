interface FrontmatterInput {
  title: string;
  description: string;
  url?: string;
  lang?: string | null;
  lastModified?: string | null;
  jsonLd?: Record<string, unknown>[];
}

/**
 * Build a YAML frontmatter block for the Markdown output.
 */
export function buildFrontmatter(input: FrontmatterInput): string {
  const lines: string[] = ['---'];

  if (input.title) lines.push(`title: "${escapeYaml(input.title)}"`);
  if (input.description) lines.push(`description: "${escapeYaml(input.description)}"`);
  if (input.url) lines.push(`url: "${input.url}"`);
  if (input.lang) lines.push(`lang: "${input.lang}"`);
  if (input.lastModified) lines.push(`lastModified: "${input.lastModified}"`);

  // Extract structured data from JSON-LD
  if (input.jsonLd?.length) {
    const primary = input.jsonLd[0];

    const primaryType = primary?.['@type'];
    if (primaryType) {
      lines.push(`schema: "${Array.isArray(primaryType) ? primaryType[0] : primaryType}"`);
    }

    // Author
    const author = primary?.author as Record<string, unknown> | undefined;
    if (author) {
      const authorName = author.name as string | undefined;
      if (authorName) lines.push(`author: "${escapeYaml(authorName)}"`);
    }

    // Dates
    const datePublished = primary?.datePublished as string | undefined;
    if (datePublished) lines.push(`datePublished: "${datePublished}"`);

    const dateModified = primary?.dateModified as string | undefined;
    if (dateModified) lines.push(`dateModified: "${dateModified}"`);
  }

  lines.push('---');
  return lines.join('\n');
}

function escapeYaml(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, ' ');
}
