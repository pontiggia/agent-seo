import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'agent-seo — Make any website AI-readable',
  description:
    'Open-source TypeScript SDK that serves clean Markdown to AI crawlers while serving HTML to browsers.',
};

const code = {
  background: '#1a1a2e',
  padding: '0.2em 0.45em',
  borderRadius: '4px',
  fontSize: '0.9em',
  color: '#93c5fd',
} as const;

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

const card = {
  background: '#171717',
  border: '1px solid #262626',
  borderRadius: '8px',
  padding: '1.25rem',
  textDecoration: 'none' as const,
  color: '#e5e5e5',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  fontSize: '0.875rem',
};

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

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'agent-seo',
          url: 'https://github.com/pontiggia/agent-seo',
          description: 'Make any website AI-readable with zero config.',
        }}
      />

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          agent-seo
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#a3a3a3', maxWidth: '36rem', margin: '0 auto 1.5rem' }}>
          Make any website AI-readable with zero config.
        </p>
        <pre style={{ ...codeBlock, display: 'inline-block', textAlign: 'left' }}>
          npm install @agent-seo/next
        </pre>
      </section>

      {/* How it works */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>How It Works</h2>
        <pre style={codeBlock}>
{`Browser → GET /about → HTML (normal)
GPTBot  → GET /about → Markdown (automatic)
Anyone  → GET /about.md → Markdown (explicit)
Anyone  → GET /llms.txt → Site directory for AI agents`}
        </pre>
        <p style={{ color: '#a3a3a3', marginTop: '1rem' }}>
          Transform pipeline: <span style={code}>JSDOM</span> → <span style={code}>Readability</span> → <span style={code}>Sanitize</span> → <span style={code}>Turndown</span> → <span style={code}>Frontmatter</span>
        </p>
      </section>

      {/* Benchmark */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Benchmark</h2>
        <div style={{ overflow: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Metric</th>
                <th style={th}>HTML</th>
                <th style={th}>Markdown</th>
                <th style={th}>Improvement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}>Total size</td>
                <td style={td}>96,996 bytes</td>
                <td style={td}>14,604 bytes</td>
                <td style={{ ...td, color: '#4ade80', fontWeight: 600 }}>85% smaller</td>
              </tr>
              <tr>
                <td style={td}>Token usage</td>
                <td style={td}>24,238 tokens</td>
                <td style={td}>3,651 tokens</td>
                <td style={{ ...td, color: '#4ade80', fontWeight: 600 }}>85% fewer tokens</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Packages */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Packages</h2>
        <div style={{ overflow: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Package</th>
                <th style={th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['@agent-seo/core', 'Framework-agnostic HTML→Markdown engine, bot detection, route discovery'],
                ['@agent-seo/next', 'Next.js plugin — zero-config /llms.txt + auto transform'],
                ['@agent-seo/express', 'Express middleware adapter'],
                ['@agent-seo/fastify', 'Fastify plugin adapter'],
                ['@agent-seo/hono', 'Hono middleware adapter'],
                ['@agent-seo/cli', 'CLI audit tool — AI Visibility Score (0-100)'],
              ].map(([pkg, desc]) => (
                <tr key={pkg}>
                  <td style={td}>
                    <a
                      href={`https://www.npmjs.com/package/${pkg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6', textDecoration: 'none' }}
                    >
                      {pkg}
                    </a>
                  </td>
                  <td style={{ ...td, color: '#a3a3a3' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Architecture */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Architecture</h2>
        <pre style={codeBlock}>
{`┌─────────────────────────────────────────────────┐
│                  @agent-seo/core                │
│  detect · transform · llms-txt · discover       │
│  sanitize · markdown · frontmatter · json-ld    │
└─────────┬───────────┬───────────┬───────────┬───┘
          │           │           │           │
    ┌─────┴──┐  ┌─────┴──┐  ┌────┴───┐  ┌────┴──┐
    │  next  │  │express │  │fastify │  │ hono  │
    └────────┘  └────────┘  └────────┘  └───────┘`}
        </pre>
      </section>

      {/* Navigation cards */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Documentation</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { href: '/quickstart', title: 'Quick Start', desc: 'Get up and running in minutes' },
            { href: '/api-reference', title: 'API Reference', desc: 'Functions, options, and headers' },
            { href: '/bots', title: 'Supported Bots', desc: '19 AI crawlers detected' },
            { href: '/cli', title: 'CLI Audit', desc: 'AI Visibility Score (0-100)' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={card}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600 }}>{item.title}</h3>
              <p style={{ margin: 0, color: '#a3a3a3', fontSize: '0.875rem' }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
