import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'DevToolbox — Developer Tools Compared',
    template: '%s | DevToolbox',
  },
  description:
    'DevToolbox is a developer resource that provides in-depth comparisons, guides, and FAQs about modern programming languages and tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#111827',
        }}
      >
        <Navbar />
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
