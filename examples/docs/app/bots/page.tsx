import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Supported AI Bots',
  description: 'agent-seo detects 19 AI crawlers including GPTBot, ClaudeBot, PerplexityBot, and more.',
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

const bots = [
  { name: 'GPTBot', operator: 'OpenAI', purpose: 'Training' },
  { name: 'ChatGPT-User', operator: 'OpenAI', purpose: 'Agent browsing' },
  { name: 'OAI-SearchBot', operator: 'OpenAI', purpose: 'Search' },
  { name: 'ClaudeBot', operator: 'Anthropic', purpose: 'Training' },
  { name: 'Claude-User', operator: 'Anthropic', purpose: 'Agent browsing' },
  { name: 'Claude-SearchBot', operator: 'Anthropic', purpose: 'Search' },
  { name: 'anthropic-ai', operator: 'Anthropic', purpose: 'Training' },
  { name: 'PerplexityBot', operator: 'Perplexity', purpose: 'Search' },
  { name: 'Perplexity-User', operator: 'Perplexity', purpose: 'Agent browsing' },
  { name: 'Google-Extended', operator: 'Google', purpose: 'Training' },
  { name: 'Applebot-Extended', operator: 'Apple', purpose: 'Training' },
  { name: 'Meta-ExternalAgent', operator: 'Meta', purpose: 'Training' },
  { name: 'FacebookBot', operator: 'Meta', purpose: 'Search' },
  { name: 'CCBot', operator: 'Common Crawl', purpose: 'Training' },
  { name: 'cohere-ai', operator: 'Cohere', purpose: 'Training' },
  { name: 'Amazonbot', operator: 'Amazon', purpose: 'Search' },
  { name: 'Bytespider', operator: 'ByteDance', purpose: 'Training' },
  { name: 'YouBot', operator: 'You.com', purpose: 'Search' },
  { name: 'DeepSeekBot', operator: 'DeepSeek', purpose: 'Training' },
];

const purposeColor: Record<string, string> = {
  Training: '#f59e0b',
  Search: '#3b82f6',
  'Agent browsing': '#10b981',
};

export default function Bots() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Supported AI Bots — agent-seo',
          description: '19 AI crawlers detected by agent-seo.',
        }}
      />

      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Supported AI Bots</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '2rem' }}>
        agent-seo detects {bots.length} AI crawlers via User-Agent matching and automatically
        serves them clean Markdown.
      </p>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        {Object.entries(purposeColor).map(([purpose, color]) => (
          <span key={purpose} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
            <span style={{ color: '#a3a3a3' }}>{purpose}</span>
          </span>
        ))}
      </div>

      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr>
              <th style={th}>Bot</th>
              <th style={th}>Operator</th>
              <th style={th}>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((bot) => (
              <tr key={bot.name}>
                <td style={{ ...td, fontWeight: 500 }}>{bot.name}</td>
                <td style={{ ...td, color: '#a3a3a3' }}>{bot.operator}</td>
                <td style={td}>
                  <span
                    style={{
                      color: purposeColor[bot.purpose] || '#a3a3a3',
                      fontWeight: 500,
                    }}
                  >
                    {bot.purpose}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
