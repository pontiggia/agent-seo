import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Quick Start',
  description: 'Get agent-seo running in minutes with Next.js, Express, Fastify, or Hono.',
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

export default function QuickStart() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Quick Start — agent-seo',
          description: 'Get agent-seo running in minutes.',
        }}
      />

      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Quick Start</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '2.5rem' }}>
        Choose your framework and get AI-readable pages in minutes.
      </p>

      {/* Next.js */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Next.js (Zero Config)</h2>
        <pre style={codeBlock}>npm install @agent-seo/next</pre>

        <p style={{ marginTop: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          <span style={code}>next.config.ts</span>
        </p>
        <pre style={codeBlock}>
{`import { withAgentSeo } from '@agent-seo/next';

export default withAgentSeo({
  siteName: 'My App',
  siteDescription: 'A brief description for AI systems.',
  baseUrl: 'https://myapp.com',
  sitemap: true,
})({
  // your existing Next.js config
});`}
        </pre>

        <p style={{ marginTop: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          <span style={code}>middleware.ts</span>
        </p>
        <pre style={codeBlock}>
{`import { createAgentSeoMiddleware } from '@agent-seo/next/middleware';

export default createAgentSeoMiddleware({
  exclude: ['/dashboard/**', '/admin/**'],
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`}
        </pre>

        <p style={{ color: '#a3a3a3', marginTop: '1rem' }}>
          Two files, ~10 lines. The plugin automatically generates <span style={code}>/llms.txt</span>,
          a transform API route, <span style={code}>robots.txt</span>, detects 19 AI bots,
          handles <span style={code}>.md</span> suffix requests, and injects <span style={code}>Vary</span> headers.
        </p>

        {/* Plugin Options */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
          Plugin Options
        </h3>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th style={th}>Option</th>
                <th style={th}>Type</th>
                <th style={th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['siteName', 'string', 'Your site name (used in llms.txt)'],
                ['siteDescription', 'string', 'Brief description for AI systems'],
                ['baseUrl', 'string', "Your site's public URL"],
                ['sitemap', 'boolean | string', 'Add Sitemap: to robots.txt'],
                ['appDir', 'string', 'Override auto-detected app/ directory'],
                ['exclude', 'string[]', 'Route patterns to exclude from llms.txt'],
              ].map(([opt, type, desc]) => (
                <tr key={opt}>
                  <td style={td}><span style={code}>{opt}</span></td>
                  <td style={{ ...td, color: '#a3a3a3' }}>{type}</td>
                  <td style={{ ...td, color: '#a3a3a3' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Middleware Options */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
          Middleware Options
        </h3>
        <pre style={codeBlock}>
{`createAgentSeoMiddleware({
  exclude: [
    '/dashboard/**',
    '/admin/**',
    '/api/private/**',
  ],
});`}
        </pre>
        <p style={{ color: '#a3a3a3', marginTop: '0.75rem', fontSize: '0.875rem' }}>
          Built-in defaults always excluded: <span style={code}>/api/**</span>, <span style={code}>/_next/**</span>, <span style={code}>/robots.txt</span>, <span style={code}>/sitemap.xml</span>, <span style={code}>/favicon.ico</span>, <span style={code}>/llms.txt</span>.
        </p>
      </section>

      {/* Express */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Express</h2>
        <pre style={codeBlock}>npm install @agent-seo/express</pre>
        <pre style={{ ...codeBlock, marginTop: '1rem' }}>
{`import express from 'express';
import { agentSeo } from '@agent-seo/express';

const app = express();

app.use(
  agentSeo({
    siteName: 'My App',
    siteDescription: 'A brief description for AI systems.',
    baseUrl: 'https://myapp.com',
  }),
);

app.get('/', (req, res) => {
  res.send('<html>...</html>');
});

app.listen(3000);`}
        </pre>
      </section>

      {/* Hono */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Hono</h2>
        <pre style={codeBlock}>npm install @agent-seo/hono</pre>
        <pre style={{ ...codeBlock, marginTop: '1rem' }}>
{`import { Hono } from 'hono';
import { agentSeo } from '@agent-seo/hono';

const app = new Hono();

app.use(
  '*',
  agentSeo({
    siteName: 'My App',
    siteDescription: 'A brief description for AI systems.',
    baseUrl: 'https://myapp.com',
  }),
);`}
        </pre>
      </section>

      {/* Fastify */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Fastify</h2>
        <pre style={codeBlock}>npm install @agent-seo/fastify</pre>
        <pre style={{ ...codeBlock, marginTop: '1rem' }}>
{`import Fastify from 'fastify';
import { agentSeo } from '@agent-seo/fastify';

const app = Fastify();

app.register(agentSeo, {
  siteName: 'My App',
  siteDescription: 'A brief description for AI systems.',
  baseUrl: 'https://myapp.com',
});`}
        </pre>
      </section>
    </>
  );
}
