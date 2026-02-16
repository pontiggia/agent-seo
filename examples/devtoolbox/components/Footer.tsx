export default function Footer() {
  return (
    <footer
      style={{
        padding: '2rem',
        borderTop: '1px solid #e5e7eb',
        background: '#f9fafb',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem',
      }}
    >
      <p>
        &copy; 2026 DevToolbox. Built with{' '}
        <a
          href="https://github.com/pontiggia/agent-seo"
          style={{ color: '#3b82f6' }}
        >
          agent-seo
        </a>
        .
      </p>
      <p style={{ marginTop: '0.5rem' }}>
        <a href="/llms.txt" style={{ color: '#3b82f6', marginRight: '1rem' }}>
          llms.txt
        </a>
        <a
          href="https://github.com/pontiggia/agent-seo"
          style={{ color: '#3b82f6' }}
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}
