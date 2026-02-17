import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'CLI Audit',
  description: 'Get an AI Visibility Score (0-100) for any website with the agent-seo CLI.',
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

export default function Cli() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'CLI Audit — agent-seo',
          description: 'AI Visibility Score for any website.',
        }}
      />

      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>CLI Audit</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '2.5rem' }}>
        Check how well any website serves AI crawlers. Get an AI Visibility Score from 0 to 100
        with actionable recommendations.
      </p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Usage</h2>
        <pre style={codeBlock}>npx @agent-seo/cli audit https://example.com</pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Install globally</h2>
        <pre style={codeBlock}>npm install -g @agent-seo/cli</pre>
        <pre style={{ ...codeBlock, marginTop: '0.75rem' }}>agent-seo audit https://example.com</pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>What It Checks</h2>
        <ul style={{ paddingLeft: '1.25rem', color: '#a3a3a3', lineHeight: 2.2 }}>
          <li><strong style={{ color: '#e5e5e5' }}>Bot detection</strong> — Does the server recognize AI User-Agents?</li>
          <li><strong style={{ color: '#e5e5e5' }}>Markdown response</strong> — Is clean Markdown served to AI bots?</li>
          <li><strong style={{ color: '#e5e5e5' }}>/llms.txt</strong> — Is a site directory available?</li>
          <li><strong style={{ color: '#e5e5e5' }}>Response headers</strong> — Content-Type, Vary, X-Robots-Tag, Content-Signal</li>
          <li><strong style={{ color: '#e5e5e5' }}>Structured data</strong> — JSON-LD extraction and quality</li>
          <li><strong style={{ color: '#e5e5e5' }}>Frontmatter</strong> — YAML metadata in Markdown responses</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Score Breakdown</h2>
        <p style={{ color: '#a3a3a3', marginBottom: '1rem' }}>
          The AI Visibility Score is a weighted composite of several checks:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { score: '0-30', label: 'Poor', color: '#ef4444', desc: 'No AI optimization' },
            { score: '31-60', label: 'Basic', color: '#f59e0b', desc: 'Some signals present' },
            { score: '61-85', label: 'Good', color: '#3b82f6', desc: 'Well optimized' },
            { score: '86-100', label: 'Excellent', color: '#10b981', desc: 'Fully AI-ready' },
          ].map((tier) => (
            <div
              key={tier.label}
              style={{
                background: '#171717',
                border: '1px solid #262626',
                borderRadius: '8px',
                padding: '1rem',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: tier.color }}>{tier.score}</div>
              <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{tier.label}</div>
              <div style={{ color: '#a3a3a3', fontSize: '0.875rem', marginTop: '0.25rem' }}>{tier.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
