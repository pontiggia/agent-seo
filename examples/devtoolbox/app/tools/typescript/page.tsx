import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'TypeScript: The Complete Guide',
  description:
    'TypeScript is a strongly typed superset of JavaScript. Learn about its type system, generics, utility types, and why it dominates modern web development.',
};

export default function TypeScriptPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'TypeScript: The Complete Guide',
          description:
            'TypeScript is a strongly typed superset of JavaScript. Learn about its type system, generics, utility types, and why it dominates modern web development.',
          author: { '@type': 'Organization', name: 'DevToolbox' },
          datePublished: '2026-01-15',
          dateModified: '2026-02-10',
        }}
      />

      <article>
        <h1>TypeScript: The Complete Guide</h1>

        <p>
          TypeScript is a strongly typed programming language that builds on
          JavaScript. Developed and maintained by Microsoft, TypeScript adds
          optional static typing and class-based object-oriented programming to
          the language. It compiles to plain JavaScript, meaning it runs
          anywhere JavaScript runs — browsers, Node.js, Deno, and Bun.
        </p>

        <h2>Why TypeScript?</h2>

        <p>
          TypeScript catches errors at compile time rather than runtime. This
          means you find bugs before your users do. It also provides better
          editor tooling — autocompletion, refactoring, and inline documentation
          are significantly improved when using TypeScript.
        </p>

        <p>Key benefits include:</p>
        <ul>
          <li>
            <strong>Type Safety</strong>: Catch type errors before they reach
            production
          </li>
          <li>
            <strong>Better IDE Support</strong>: Autocompletion,
            go-to-definition, and refactoring work out of the box
          </li>
          <li>
            <strong>Self-Documenting Code</strong>: Types serve as living
            documentation
          </li>
          <li>
            <strong>Gradual Adoption</strong>: You can adopt TypeScript
            incrementally in any JavaScript project
          </li>
          <li>
            <strong>Large Ecosystem</strong>: DefinitelyTyped has types for over
            10,000 npm packages
          </li>
        </ul>

        <h2>Type System Fundamentals</h2>

        <p>
          TypeScript&apos;s type system is structural (duck typing), not
          nominal. This means two types are compatible if their members are
          compatible, regardless of their names.
        </p>

        <pre>
          <code className="language-typescript">{`// Basic types
let name: string = "Alice";
let age: number = 30;
let isActive: boolean = true;

// Interfaces
interface User {
  name: string;
  age: number;
  email?: string; // optional property
}

// Type aliases
type Status = "active" | "inactive" | "pending";

// Generics
function identity<T>(arg: T): T {
  return arg;
}`}</code>
        </pre>

        <h2>Advanced Types</h2>

        <p>
          TypeScript provides powerful utility types that help you transform and
          manipulate types without writing them from scratch.
        </p>

        <pre>
          <code className="language-typescript">{`// Utility types
type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
type UserKeys = keyof User; // "name" | "age" | "email"

// Conditional types
type IsString<T> = T extends string ? true : false;

// Mapped types
type Optional<T> = {
  [K in keyof T]?: T[K];
};

// Template literal types
type EventName = \`on\$\{Capitalize<string>}\`;`}</code>
        </pre>

        <h2>TypeScript with React</h2>

        <p>
          TypeScript and React work together seamlessly. You can type props,
          state, context, refs, and event handlers for complete type safety
          throughout your UI.
        </p>

        <pre>
          <code className="language-tsx">{`interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button className={variant} onClick={onClick}>
      {label}
    </button>
  );
}`}</code>
        </pre>

        <h2>When to Choose TypeScript</h2>

        <p>TypeScript is the right choice when:</p>
        <ul>
          <li>
            You are building a medium to large application with multiple
            developers
          </li>
          <li>
            You want compile-time error detection and better refactoring support
          </li>
          <li>
            Your project involves complex data structures or API integrations
          </li>
          <li>
            You want self-documenting code that is easier to maintain over time
          </li>
          <li>
            You are building a library or framework that others will consume
          </li>
        </ul>
      </article>
    </>
  );
}
