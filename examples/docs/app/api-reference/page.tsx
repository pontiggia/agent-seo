import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'API Reference',
  description: 'Core functions, response headers, and configuration options for agent-seo.',
};

const codeBlock = {
  background: '#1a1a2e',
  padding: '1.25rem',
  borderRadius: '8px',
  overflow: 'auto' as const,
  fontSize: '0.875rem',
  lineHeight: 1.6,
  color: '#d4d4d4',
  border: '1px solid #262626',
};

const code = {
  background: '#1a1a2e',
  padding: '0.2em 0.45em',
  borderRadius: '4px',
  fontSize: '0.9em',
  color: '#93c5fd',
} as const;

const th = {
  textAlign: 'left' as const,
  padding: '0.75rem',
  borderBottom: '1px solid #262626',
  color: '#a3a3a3',
  fontWeight: 600,
};

const td = {
  padding: '0.75rem',
  borderBottom: '1px solid #1a1a1a',
};

export default function ApiReference() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'API Reference — agent-seo',
          description: 'Core functions, response headers, and configuration.',
        }}
      />

      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>API Reference</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '2.5rem' }}>
        Core functions exported from <span style={code}>@agent-seo/core</span>.
      </p>

      {/* What It Does */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>What It Does</h2>
        <ol style={{ paddingLeft: '1.25rem', color: '#a3a3a3', lineHeight: 2 }}>
          <li><strong style={{ color: '#e5e5e5' }}>Detects AI crawlers</strong> — 19 bots recognized via User-Agent pattern matching</li>
          <li><strong style={{ color: '#e5e5e5' }}>Transforms HTML to Markdown</strong> — Readability extracts content, Turndown converts, with noise removal</li>
          <li><strong style={{ color: '#e5e5e5' }}>YAML Frontmatter</strong> — Adds title, description, URL, lang, last-modified</li>
          <li><strong style={{ color: '#e5e5e5' }}>JSON-LD Extraction</strong> — Extracts structured data from script tags</li>
          <li><strong style={{ color: '#e5e5e5' }}>Generates /llms.txt</strong> — Auto-discovers routes following the llmstxt.org spec</li>
          <li><strong style={{ color: '#e5e5e5' }}>Generates robots.txt</strong> — AI-friendly config referencing /llms.txt</li>
          <li><strong style={{ color: '#e5e5e5' }}>.md Alternates</strong> — Any page available as Markdown by appending .md</li>
          <li><strong style={{ color: '#e5e5e5' }}>Bot-friendly headers</strong> — Content-Type, Content-Disposition, X-Robots-Tag</li>
          <li><strong style={{ color: '#e5e5e5' }}>Proper caching</strong> — Vary: Accept, User-Agent for CDN separation</li>
          <li><strong style={{ color: '#e5e5e5' }}>LRU cache</strong> — In-memory caching to avoid re-processing</li>
        </ol>
      </section>

      {/* Core Functions */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Core Functions</h2>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          <span style={code}>transform(html, options)</span>
        </h3>
        <p style={{ color: '#a3a3a3', marginBottom: '0.75rem' }}>
          Transforms an HTML string into clean Markdown with frontmatter.
        </p>
        <pre style={codeBlock}>
{`import { transform } from '@agent-seo/core';

const result = await transform('<html>...</html>', {
  url: 'https://example.com/about',
});

result.markdown;    // Full markdown with YAML frontmatter
result.title;       // Extracted page title
result.description; // Extracted description
result.tokens;      // Estimated token count`}
        </pre>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
          <span style={code}>detectAgent(userAgent, acceptHeader?)</span>
        </h3>
        <p style={{ color: '#a3a3a3', marginBottom: '0.75rem' }}>
          Detect if a request is from an AI bot.
        </p>
        <pre style={codeBlock}>
{`import { detectAgent } from '@agent-seo/core';

const ctx = detectAgent(request.headers.get('user-agent'));
ctx.isAIBot;        // boolean
ctx.bot?.name;      // 'GPTBot'
ctx.bot?.operator;  // 'OpenAI'
ctx.bot?.purpose;   // 'training' | 'search' | 'agent-browsing'
ctx.wantsMarkdown;  // true if Accept: text/markdown`}
        </pre>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
          <span style={code}>shouldServeMarkdown(userAgent, acceptHeader?)</span>
        </h3>
        <p style={{ color: '#a3a3a3', marginBottom: '0.75rem' }}>
          Shorthand — returns <span style={code}>true</span> if the request is from an AI bot or requests <span style={code}>text/markdown</span>.
        </p>
        <pre style={codeBlock}>
{`import { shouldServeMarkdown } from '@agent-seo/core';

if (shouldServeMarkdown(userAgent, acceptHeader)) {
  // serve markdown
}`}
        </pre>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
          <span style={code}>generateLlmsTxt(options, routes)</span>
        </h3>
        <p style={{ color: '#a3a3a3', marginBottom: '0.75rem' }}>
          Generate an llms.txt manifest from discovered routes.
        </p>
        <pre style={codeBlock}>
{`import { generateLlmsTxt, discoverNextRoutes } from '@agent-seo/core';

const routes = discoverNextRoutes('/path/to/app');
const result = generateLlmsTxt({
  siteName: 'My App',
  siteDescription: 'Description.',
  baseUrl: 'https://myapp.com',
}, routes);

result.llmsTxt;     // The llms.txt content
result.llmsFullTxt; // Extended version with descriptions`}
        </pre>
      </section>

      {/* Edge Runtime */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Edge Runtime</h2>
        <p style={{ color: '#a3a3a3', marginBottom: '0.75rem' }}>
          For edge/Cloudflare Workers (no JSDOM), use the lightweight edge export:
        </p>
        <pre style={codeBlock}>
{`import { detectAgent, shouldServeMarkdown } from '@agent-seo/core/edge';`}
        </pre>
      </section>

      {/* Response Headers */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Response Headers</h2>
        <p style={{ color: '#a3a3a3', marginBottom: '1rem' }}>
          Every Markdown response includes these headers:
        </p>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th style={th}>Header</th>
                <th style={th}>Value</th>
                <th style={th}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Content-Type', 'text/markdown; charset=utf-8', 'Tell bots the content is Markdown'],
                ['Content-Disposition', 'inline', 'Prevent file download behavior'],
                ['Vary', 'Accept, User-Agent', 'CDN caches bot and browser responses separately'],
                ['X-Markdown-Tokens', 'e.g. 378', 'Estimated token count'],
                ['X-Robots-Tag', 'all', 'Allow all bots to index'],
                ['Content-Signal', 'ai-train=yes, search=yes, ai-input=yes', 'Signal AI permissions'],
              ].map(([header, value, purpose]) => (
                <tr key={header}>
                  <td style={td}><span style={code}>{header}</span></td>
                  <td style={{ ...td, color: '#a3a3a3' }}>{value}</td>
                  <td style={{ ...td, color: '#a3a3a3' }}>{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
