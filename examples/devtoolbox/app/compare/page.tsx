import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'TypeScript vs Rust: Side-by-Side Comparison',
  description:
    'A detailed comparison of TypeScript and Rust across type systems, performance, ecosystem, learning curve, and ideal use cases.',
};

export default function ComparePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'TypeScript vs Rust: Side-by-Side Comparison',
          description:
            'A detailed comparison of TypeScript and Rust across type systems, performance, ecosystem, learning curve, and ideal use cases.',
        }}
      />

      <article>
        <h1>TypeScript vs Rust: Side-by-Side Comparison</h1>

        <p>
          TypeScript and Rust are both modern languages with strong type
          systems, but they serve very different purposes. This comparison helps
          you understand when to use each.
        </p>

        <h2>Overview</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Feature</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>
                TypeScript
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rust</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>
                <strong>Type System</strong>
              </td>
              <td style={{ padding: '0.75rem' }}>Structural, gradual</td>
              <td style={{ padding: '0.75rem' }}>Nominal, strict</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>
                <strong>Memory Management</strong>
              </td>
              <td style={{ padding: '0.75rem' }}>
                Garbage collected (V8/SpiderMonkey)
              </td>
              <td style={{ padding: '0.75rem' }}>
                Ownership &amp; borrowing (no GC)
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>
                <strong>Performance</strong>
              </td>
              <td style={{ padding: '0.75rem' }}>Good (JIT compiled)</td>
              <td style={{ padding: '0.75rem' }}>
                Excellent (AOT compiled, zero-cost abstractions)
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>
                <strong>Concurrency</strong>
              </td>
              <td style={{ padding: '0.75rem' }}>Event loop, async/await</td>
              <td style={{ padding: '0.75rem' }}>
                Threads, async/await, channels
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>
                <strong>Learning Curve</strong>
              </td>
              <td style={{ padding: '0.75rem' }}>
                Low (if you know JavaScript)
              </td>
              <td style={{ padding: '0.75rem' }}>
                Steep (ownership, lifetimes, borrowing)
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>
                <strong>Error Handling</strong>
              </td>
              <td style={{ padding: '0.75rem' }}>try/catch exceptions</td>
              <td style={{ padding: '0.75rem' }}>
                Result&lt;T, E&gt; and Option&lt;T&gt;
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>
                <strong>Package Manager</strong>
              </td>
              <td style={{ padding: '0.75rem' }}>npm / pnpm / yarn</td>
              <td style={{ padding: '0.75rem' }}>Cargo</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>
                <strong>Null Safety</strong>
              </td>
              <td style={{ padding: '0.75rem' }}>strictNullChecks flag</td>
              <td style={{ padding: '0.75rem' }}>
                No null — uses Option&lt;T&gt;
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>
                <strong>Compilation</strong>
              </td>
              <td style={{ padding: '0.75rem' }}>Transpiles to JavaScript</td>
              <td style={{ padding: '0.75rem' }}>Compiles to native binary</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>
                <strong>Best For</strong>
              </td>
              <td style={{ padding: '0.75rem' }}>Web apps, APIs, full-stack</td>
              <td style={{ padding: '0.75rem' }}>
                Systems, CLI tools, WebAssembly, embedded
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Performance Benchmarks</h2>

        <p>
          In raw computation benchmarks, Rust consistently outperforms
          TypeScript by 10-100x depending on the task. However, for I/O-bound
          web applications, the difference is often negligible because network
          latency dominates.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>
                Benchmark
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>
                TypeScript (Node.js)
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rust</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>Fibonacci(40)</td>
              <td style={{ padding: '0.75rem' }}>~1,200ms</td>
              <td style={{ padding: '0.75rem' }}>~25ms</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>JSON parse (1MB)</td>
              <td style={{ padding: '0.75rem' }}>~15ms</td>
              <td style={{ padding: '0.75rem' }}>~3ms</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>HTTP server (req/s)</td>
              <td style={{ padding: '0.75rem' }}>~50,000</td>
              <td style={{ padding: '0.75rem' }}>~200,000</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>Memory usage (idle)</td>
              <td style={{ padding: '0.75rem' }}>~30MB</td>
              <td style={{ padding: '0.75rem' }}>~1MB</td>
            </tr>
          </tbody>
        </table>

        <h2>Verdict</h2>

        <p>
          <strong>Choose TypeScript</strong> if you are building web
          applications, APIs, or full-stack projects where developer
          productivity and ecosystem breadth matter most.
        </p>
        <p>
          <strong>Choose Rust</strong> if you need maximum performance, memory
          safety without garbage collection, or you are building systems-level
          software, CLI tools, or WebAssembly.
        </p>
        <p>
          Many teams use <strong>both</strong>: TypeScript for the web layer and
          Rust for performance-critical services, CLI tools, or WebAssembly
          modules.
        </p>
      </article>
    </>
  );
}
