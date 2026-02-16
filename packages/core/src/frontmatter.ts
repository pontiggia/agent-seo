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

  // Extract key schema.org type if present
  if (input.jsonLd?.length) {
    const primaryType = input.jsonLd[0]?.['@type'];
    if (primaryType) {
      lines.push(`schema: "${Array.isArray(primaryType) ? primaryType[0] : primaryType}"`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}

function escapeYaml(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, ' ');
}
