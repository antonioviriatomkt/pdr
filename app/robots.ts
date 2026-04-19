import { MetadataRoute } from 'next'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/studio/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
