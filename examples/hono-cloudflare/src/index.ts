import { Hono } from 'hono';
import { agentSeo } from '@agent-seo/hono';

const app = new Hono();

app.use('*', agentSeo({
  siteName: 'My Hono App',
  siteDescription: 'A demo Hono application on Cloudflare Workers showcasing agent-seo.',
  baseUrl: 'https://my-hono-app.workers.dev',
  llmsTxt: {
    routes: [
      { path: '/', title: 'Home', section: 'Pages' },
      { path: '/about', title: 'About Us', section: 'Pages' },
    ],
  },
}));

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Home - My Hono App</title><meta name="description" content="Welcome to My Hono App running on Cloudflare Workers."></head>
    <body>
      <nav><a href="/">Home</a> | <a href="/about">About</a></nav>
      <article>
        <h1>Welcome to My Hono App</h1>
        <p>This is a Hono application running on Cloudflare Workers with AI-optimized content delivery powered by agent-seo.</p>
        <h2>Features</h2>
        <ul>
          <li>Automatic Markdown serving for AI crawlers</li>
          <li>llms.txt generation</li>
          <li>Edge-native performance</li>
        </ul>
      </article>
      <footer><p>&copy; 2024 My Hono App</p></footer>
    </body>
    </html>
  `);
});

app.get('/about', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head><title>About - My Hono App</title><meta name="description" content="Learn about My Hono App."></head>
    <body>
      <nav><a href="/">Home</a> | <a href="/about">About</a></nav>
      <article>
        <h1>About Us</h1>
        <p>My Hono App is a demonstration of how to use agent-seo with Hono on Cloudflare Workers.</p>
      </article>
      <footer><p>&copy; 2024 My Hono App</p></footer>
    </body>
    </html>
  `);
});

export default app;
