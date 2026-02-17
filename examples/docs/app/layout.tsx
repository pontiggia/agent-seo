import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: { default: 'agent-seo', template: '%s | agent-seo' },
  description: 'Make any website AI-readable with zero config.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: '#0a0a0a',
          color: '#e5e5e5',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          lineHeight: 1.7,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        <main style={{ flex: 1, maxWidth: '52rem', margin: '0 auto', padding: '2rem', width: '100%', boxSizing: 'border-box' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
