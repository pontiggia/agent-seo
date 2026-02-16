import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import {
  detectAgent,
  transform,
  generateLlmsTxt,
  buildMarkdownHeaders,
  buildAlternateLinkHeader,
  createCache,
} from '@agent-seo/core';
import type { AgentSeoOptions } from '@agent-seo/core';

async function agentSeoPlugin(
  fastify: FastifyInstance,
  options: AgentSeoOptions & FastifyPluginOptions
): Promise<void> {
  const cache = options.cache?.enabled !== false
    ? createCache({ maxEntries: options.cache?.maxEntries, ttl: options.cache?.ttl })
    : null;

  // Register /llms.txt route
  fastify.get('/llms.txt', async (_request, reply) => {
    const routes = options.llmsTxt?.routes || [];
    const result = generateLlmsTxt(
      { siteName: options.siteName, siteDescription: options.siteDescription, baseUrl: options.baseUrl, ...options.llmsTxt },
      routes
    );
    return reply.type('text/plain; charset=utf-8').header('Cache-Control', 'public, max-age=3600').send(result.llmsTxt);
  });

  // Register /llms-full.txt route
  fastify.get('/llms-full.txt', async (_request, reply) => {
    const routes = options.llmsTxt?.routes || [];
    const result = generateLlmsTxt(
      { siteName: options.siteName, siteDescription: options.siteDescription, baseUrl: options.baseUrl, ...options.llmsTxt },
      routes
    );
    return reply.type('text/plain; charset=utf-8').header('Cache-Control', 'public, max-age=3600').send(result.llmsFullTxt);
  });

  // Add Vary header to all responses and transform for AI bots
  fastify.addHook('onSend', async (request, reply, payload) => {
    reply.header('Vary', 'Accept, User-Agent');

    const path = new URL(request.url, 'http://localhost').pathname;
    reply.header('Link', buildAlternateLinkHeader(path));

    const ua = request.headers['user-agent'] as string;
    const accept = request.headers['accept'] as string;
    const aiCtx = detectAgent(ua, accept);

    if ((aiCtx.isAIBot || aiCtx.wantsMarkdown) && typeof payload === 'string') {
      const contentType = (reply.getHeader('content-type') as string) || '';
      if (contentType.includes('text/html')) {
        const result = await transform(payload, {
          url: `${options.baseUrl}${path}`,
          ...options.transform,
        });

        cache?.set(path, result);
        const headers = buildMarkdownHeaders(result, options, path);
        for (const [key, value] of Object.entries(headers)) {
          reply.header(key, value);
        }
        return result.markdown;
      }
    }

    return payload;
  });
}

export const agentSeo = fp(agentSeoPlugin, {
  fastify: '>=5.0.0',
  name: '@agent-seo/fastify',
});
