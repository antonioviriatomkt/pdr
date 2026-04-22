import { MetadataRoute } from 'next'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Claude-Web',
  'ClaudeBot',
  'anthropic-ai',
  'Applebot',
  'cohere-ai',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'Googlebot',
  'Bingbot',
  'Bytespider',
  'Googlebot-Extended',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/studio/', '/coming-soon'],
      },
      // Explicitly allow known AI crawlers so no security layer blocks them
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/api/', '/studio/', '/coming-soon'],
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
