import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'DevToolbox — Developer Tools Compared',
  description:
    'DevToolbox is a developer resource that provides in-depth comparisons, guides, and FAQs about modern programming languages and tools.',
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'DevToolbox',
          url: 'https://devtoolbox.dev',
          description:
            'DevToolbox is a developer resource that provides in-depth comparisons, guides, and FAQs about modern programming languages and tools.',
        }}
      />

      <article>
        <h1>DevToolbox</h1>
        <p>
          DevToolbox is a developer resource that provides in-depth comparisons,
          guides, and FAQs about modern programming languages and tools. Whether
          you are choosing between TypeScript and Rust or trying to understand
          when to use each, we have you covered.
        </p>

        <h2>Featured Guides</h2>

        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <h3>
              <a href="/tools/typescript">TypeScript: The Complete Guide</a>
            </h3>
            <p>
              TypeScript is a strongly typed superset of JavaScript that
              compiles to plain JavaScript. Learn about its type system, key
              features, and why it has become the standard for large-scale web
              development.
            </p>
          </div>

          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <h3>
              <a href="/tools/rust">Rust: The Complete Guide</a>
            </h3>
            <p>
              Rust is a systems programming language focused on safety, speed,
              and concurrency. Discover how its ownership model eliminates
              entire classes of bugs at compile time.
            </p>
          </div>

          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <h3>
              <a href="/compare">TypeScript vs Rust: Side-by-Side</a>
            </h3>
            <p>
              A detailed comparison table covering type systems, performance,
              ecosystem, learning curve, and ideal use cases for both languages.
            </p>
          </div>

          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <h3>
              <a href="/faq">Frequently Asked Questions</a>
            </h3>
            <p>
              Answers to common questions about choosing programming languages,
              when to use TypeScript vs Rust, and getting started with each.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
