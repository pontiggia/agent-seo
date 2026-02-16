export default function Navbar() {
  return (
    <nav
      style={{
        display: 'flex',
        gap: '1.5rem',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb',
      }}
    >
      <a
        href="/"
        style={{
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#111827',
          textDecoration: 'none',
        }}
      >
        🧰 DevToolbox
      </a>
      <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
        <a
          href="/tools/typescript"
          style={{ color: '#4b5563', textDecoration: 'none' }}
        >
          TypeScript
        </a>
        <a
          href="/tools/rust"
          style={{ color: '#4b5563', textDecoration: 'none' }}
        >
          Rust
        </a>
        <a href="/compare" style={{ color: '#4b5563', textDecoration: 'none' }}>
          Compare
        </a>
        <a href="/faq" style={{ color: '#4b5563', textDecoration: 'none' }}>
          FAQ
        </a>
      </div>
    </nav>
  );
}
