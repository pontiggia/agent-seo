import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/quickstart', label: 'Quick Start' },
  { href: '/api-reference', label: 'API' },
  { href: '/bots', label: 'Bots' },
  { href: '/cli', label: 'CLI' },
];

export default function Navbar() {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1rem 2rem',
        borderBottom: '1px solid #262626',
        background: '#111111',
      }}
    >
      <Link
        href="/"
        style={{
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#e5e5e5',
          textDecoration: 'none',
          marginRight: 'auto',
        }}
      >
        agent-seo
      </Link>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            color: '#a3a3a3',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          {link.label}
        </Link>
      ))}
      <a
        href="https://github.com/pontiggia/agent-seo"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#a3a3a3', textDecoration: 'none', fontSize: '0.875rem' }}
      >
        GitHub
      </a>
    </nav>
  );
}
