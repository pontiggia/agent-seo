import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'FAQ — Programming Languages',
  description:
    'Frequently asked questions about TypeScript, Rust, choosing the right programming language, and getting started with modern development tools.',
};

const faqs = [
  {
    question: 'What is TypeScript and how is it different from JavaScript?',
    answer:
      'TypeScript is a strongly typed superset of JavaScript developed by Microsoft. It adds optional static typing, interfaces, generics, and other features to JavaScript. All valid JavaScript is valid TypeScript, but TypeScript code must be compiled (transpiled) to JavaScript before it can run. The key benefit is catching type errors at compile time rather than at runtime.',
  },
  {
    question: 'What is Rust used for?',
    answer:
      'Rust is a systems programming language used for building performance-critical software. Common use cases include operating system components, game engines, database engines, web browsers (Firefox is partially written in Rust), CLI tools, WebAssembly modules, embedded systems, and networking infrastructure. Companies like Mozilla, Dropbox, Cloudflare, and Discord use Rust in production.',
  },
  {
    question: 'Should I learn TypeScript or Rust first?',
    answer:
      'If you are interested in web development, APIs, or full-stack applications, start with TypeScript. It builds on JavaScript knowledge and has a gentler learning curve. If you are interested in systems programming, performance optimization, or want a deeper understanding of how memory works, start with Rust. Many developers eventually learn both.',
  },
  {
    question: 'Is TypeScript faster than JavaScript?',
    answer:
      'No. TypeScript compiles to JavaScript, so runtime performance is identical. The benefits of TypeScript are at development time: better tooling, error detection, and code maintainability. The compiled JavaScript output is what actually runs, and it performs the same as hand-written JavaScript.',
  },
  {
    question: 'Why is Rust so hard to learn?',
    answer:
      'Rust has a steep learning curve primarily because of its ownership and borrowing system. Unlike most languages, Rust requires you to explicitly manage how memory is shared and transferred between parts of your program. The compiler enforces strict rules about ownership, lifetimes, and borrowing that prevent bugs but require a different way of thinking about data. Most developers report that after 2-3 months of practice, the concepts become natural.',
  },
  {
    question: 'Can I use TypeScript and Rust together?',
    answer:
      'Yes. A common pattern is to use TypeScript for the web application layer (frontend with React/Next.js, backend with Node.js) and Rust for performance-critical components. Rust can compile to WebAssembly (Wasm) which can be called from TypeScript in the browser or on the server. Tools like napi-rs also let you write native Node.js modules in Rust.',
  },
  {
    question: 'What is the best IDE for TypeScript?',
    answer:
      'Visual Studio Code (VS Code) is widely considered the best IDE for TypeScript development. It is built by the same team at Microsoft and has first-class TypeScript support including intelligent autocompletion, inline errors, refactoring tools, and debugging. Other good options include WebStorm by JetBrains and Neovim with the TypeScript language server.',
  },
  {
    question: 'What is the best IDE for Rust?',
    answer:
      'Visual Studio Code with the rust-analyzer extension is the most popular choice for Rust development. RustRover by JetBrains is another excellent option with deep Rust integration. Neovim and Helix (which is itself written in Rust) are popular among terminal-based developers. All of these provide autocompletion, inline error checking, and code navigation via rust-analyzer.',
  },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />

      <article>
        <h1>Frequently Asked Questions</h1>

        <p>
          Answers to common questions about TypeScript, Rust, choosing the right
          programming language, and getting started with modern development
          tools.
        </p>

        {faqs.map((faq, index) => (
          <section key={index} style={{ marginBottom: '2rem' }}>
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </section>
        ))}
      </article>
    </>
  );
}
