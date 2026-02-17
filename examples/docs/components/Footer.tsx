export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #262626',
        padding: '2rem',
        textAlign: 'center',
        color: '#525252',
        fontSize: '0.875rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>
        <a href="https://github.com/pontiggia/agent-seo" target="_blank" rel="noopener noreferrer" style={{ color: '#737373', textDecoration: 'none' }}>
          GitHub
        </a>
        <a href="https://www.npmjs.com/org/agent-seo" target="_blank" rel="noopener noreferrer" style={{ color: '#737373', textDecoration: 'none' }}>
          npm
        </a>
        <a href="/llms.txt" style={{ color: '#737373', textDecoration: 'none' }}>
          llms.txt
        </a>
      </div>
      <p style={{ margin: 0 }}>MIT License</p>
    </footer>
  );
}
