import type { NextConfig } from 'next';
import type { AgentSeoOptions } from '@agent-seo/core';

export function withAgentSeo(agentSeoOptions: AgentSeoOptions) {
  return (nextConfig: NextConfig = {}): NextConfig => {
    return {
      ...nextConfig,

      env: {
        ...nextConfig.env,
        __AGENT_SEO_CONFIG: JSON.stringify(agentSeoOptions),
      },

      async rewrites() {
        const existingRewrites = await (nextConfig.rewrites?.() ?? []);
        const agentRewrites = [
          {
            source: '/llms.txt',
            destination: '/api/__agent-seo/llms-txt',
          },
          {
            source: '/llms-full.txt',
            destination: '/api/__agent-seo/llms-full-txt',
          },
        ];

        if (Array.isArray(existingRewrites)) {
          return [...existingRewrites, ...agentRewrites];
        }
        return {
          ...existingRewrites,
          afterFiles: [
            ...(existingRewrites.afterFiles || []),
            ...agentRewrites,
          ],
        };
      },

      async headers() {
        const existingHeaders = await (nextConfig.headers?.() ?? []);
        return [
          ...existingHeaders,
          {
            source: '/((?!api|_next|static|favicon.ico).*)',
            headers: [
              { key: 'Vary', value: 'Accept, User-Agent' },
            ],
          },
        ];
      },
    };
  };
}
