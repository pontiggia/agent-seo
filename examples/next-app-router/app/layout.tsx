export const metadata = {
  title: 'My Next.js App',
  description: 'A demo Next.js application showcasing agent-seo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
