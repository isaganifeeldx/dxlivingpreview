import { getSiteUrl, isSearchIndexingEnabled } from '@/lib/siteUrl';

export function GET() {
  if (!isSearchIndexingEnabled()) {
    const body = `# Staging / non-production — do not index
User-agent: *
Disallow: /
`;

    return new Response(body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  const siteUrl = getSiteUrl();

  const body = `# AI / LLM context files
# llms.txt: ${siteUrl}/llms.txt
# llms-full.txt: ${siteUrl}/llms-full.txt

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: *
Allow: /
Disallow: /admin
Disallow: /pages/

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
