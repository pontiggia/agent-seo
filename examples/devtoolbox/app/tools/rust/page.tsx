import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Rust: The Complete Guide',
  description:
    'Rust is a systems programming language focused on safety, speed, and concurrency. Learn about ownership, borrowing, and zero-cost abstractions.',
};

export default function RustPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Rust: The Complete Guide',
          description:
            'Rust is a systems programming language focused on safety, speed, and concurrency. Learn about ownership, borrowing, and zero-cost abstractions.',
          author: { '@type': 'Organization', name: 'DevToolbox' },
          datePublished: '2026-01-20',
          dateModified: '2026-02-12',
        }}
      />

      <article>
        <h1>Rust: The Complete Guide</h1>

        <p>
          Rust is a systems programming language that runs blazingly fast,
          prevents segmentation faults, and guarantees thread safety. Developed
          by Mozilla Research and now maintained by the Rust Foundation, it has
          been the most loved programming language in the Stack Overflow
          Developer Survey for eight consecutive years.
        </p>

        <h2>The Ownership Model</h2>

        <p>
          Rust&apos;s most distinctive feature is its ownership system. Every
          value in Rust has a variable that is called its owner, and there can
          only be one owner at a time. When the owner goes out of scope, the
          value is dropped. This eliminates the need for a garbage collector
          while preventing memory leaks and dangling pointers.
        </p>

        <pre>
          <code className="language-rust">{`// Ownership basics
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved to s2, s1 is no longer valid

    // Borrowing with references
    let s3 = String::from("world");
    let len = calculate_length(&s3); // s3 is borrowed, not moved
    println!("Length of '{}' is {}.", s3, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}`}</code>
        </pre>

        <h2>Pattern Matching</h2>

        <p>
          Rust has powerful pattern matching with the <code>match</code>{' '}
          expression. Combined with enums, it provides exhaustive checking — the
          compiler ensures you handle every possible case.
        </p>

        <pre>
          <code className="language-rust">{`enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
    Triangle(f64, f64, f64),
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(radius) => std::f64::consts::PI * radius * radius,
        Shape::Rectangle(w, h) => w * h,
        Shape::Triangle(a, b, c) => {
            let s = (a + b + c) / 2.0;
            (s * (s - a) * (s - b) * (s - c)).sqrt()
        }
    }
}`}</code>
        </pre>

        <h2>Error Handling</h2>

        <p>
          Rust uses the <code>Result</code> and <code>Option</code> types for
          error handling instead of exceptions. This forces you to explicitly
          handle every possible error, making your programs more robust.
        </p>

        <pre>
          <code className="language-rust">{`use std::fs;
use std::io;

fn read_username_from_file() -> Result<String, io::Error> {
    let content = fs::read_to_string("username.txt")?;
    Ok(content.trim().to_string())
}

fn main() {
    match read_username_from_file() {
        Ok(username) => println!("Username: {}", username),
        Err(e) => println!("Error reading file: {}", e),
    }
}`}</code>
        </pre>

        <h2>Concurrency Without Fear</h2>

        <p>
          Rust&apos;s ownership model extends to concurrency. The compiler
          prevents data races at compile time, making concurrent programming
          safe by default.
        </p>

        <pre>
          <code className="language-rust">{`use std::thread;
use std::sync::{Arc, Mutex};

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}`}</code>
        </pre>

        <h2>When to Choose Rust</h2>

        <p>Rust is the right choice when:</p>
        <ul>
          <li>You need maximum performance with minimal memory overhead</li>
          <li>
            You are building systems-level software (OS components, databases,
            game engines)
          </li>
          <li>You need guaranteed memory safety without a garbage collector</li>
          <li>
            You are building WebAssembly modules that need to be fast and small
          </li>
          <li>You want fearless concurrency with compile-time guarantees</li>
          <li>
            You are building CLI tools, embedded systems, or networking software
          </li>
        </ul>
      </article>
    </>
  );
}
