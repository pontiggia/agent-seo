import express from 'express';
import { agentSeo } from '@agent-seo/express';

const app = express();

// ---------------------------------------------------------------------------
// agent-seo middleware
// ---------------------------------------------------------------------------
app.use(
  agentSeo({
    siteName: 'My Express App',
    siteDescription: 'A demo Express application showcasing agent-seo.',
    baseUrl: 'http://localhost:3000',
    llmsTxt: {
      routes: [
        {
          path: '/',
          title: 'Home',
          description: 'Welcome page and feature overview',
          section: 'Pages',
        },
        {
          path: '/about',
          title: 'About',
          description: 'Learn more about the project and the team',
          section: 'Pages',
        },
        {
          path: '/docs/getting-started',
          title: 'Getting Started',
          description: 'Step-by-step guide to set up your first project',
          section: 'Documentation',
        },
      ],
    },
  }),
);

// ---------------------------------------------------------------------------
// Shared HTML fragments
// ---------------------------------------------------------------------------
const nav = `
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/docs/getting-started">Docs</a>
  </nav>`;

const footer = `
  <footer>
    <p>&copy; 2026 My Express App. Built with agent-seo.</p>
  </footer>`;

function page(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} | My Express App</title>
  <meta name="description" content="${title} - My Express App" />
</head>
<body>
  ${nav}
  <main>
    <article>
      ${body}
    </article>
  </main>
  ${footer}
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get('/', (_req, res) => {
  res.type('text/html').send(
    page(
      'Home',
      `<h1>Welcome to My Express App</h1>
       <p>
         This is a small demo that shows how <strong>agent-seo</strong> works
         with a plain Express server. AI crawlers such as GPTBot and
         ClaudeBot automatically receive a clean Markdown version of every
         page, while regular browsers see the normal HTML.
       </p>
       <p>
         Try visiting <code>/llms.txt</code> to see the machine-readable site
         index, or send a request with a bot user-agent to see the Markdown
         transformation in action.
       </p>`,
    ),
  );
});

app.get('/about', (_req, res) => {
  res.type('text/html').send(
    page(
      'About',
      `<h1>About This Project</h1>
       <p>
         <strong>agent-seo</strong> is a lightweight middleware that makes your
         website accessible to AI agents. It detects known AI crawlers by
         their user-agent string and serves an optimised Markdown
         representation of the page instead of raw HTML.
       </p>
       <p>
         The middleware also generates <code>/llms.txt</code> and
         <code>/llms-full.txt</code> endpoints that follow the
         <a href="https://llmstxt.org">llmstxt.org</a> specification, giving
         language models a structured overview of your site's content.
       </p>`,
    ),
  );
});

app.get('/docs/getting-started', (_req, res) => {
  res.type('text/html').send(
    page(
      'Getting Started',
      `<h1>Getting Started</h1>
       <p>
         Follow the steps below to add <strong>agent-seo</strong> to your
         Express application in under five minutes.
       </p>
       <h2>1. Install the package</h2>
       <p>Run the following command in your project directory:</p>
       <pre><code>npm install @agent-seo/express</code></pre>
       <h2>2. Add the middleware</h2>
       <p>
         Import <code>agentSeo</code> and register it before your routes.
         Pass in your site name, description, and base URL at a minimum.
       </p>
       <h2>3. Define your routes in llmsTxt</h2>
       <p>
         List the pages you want to appear in <code>/llms.txt</code>. Each
         entry needs a <code>path</code>, <code>title</code>, and optionally
         a <code>description</code> and <code>section</code>.
       </p>`,
    ),
  );
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
