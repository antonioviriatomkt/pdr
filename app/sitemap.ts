import { MetadataRoute } from 'next'
import { demoDevelopments, demoLocations, demoArticles, categoryLabels } from '@/lib/demo-data'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pdr.pt'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/developments`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/journal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/methodology`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/for-developers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const developmentPages: MetadataRoute.Sitemap = demoDevelopments.map(d => ({
    url: `${BASE_URL}/developments/${d.slug.current}`,
    lastModified: new Date(d.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: d.isFeatured ? 0.9 : 0.8,
  }))

  const locationPages: MetadataRoute.Sitemap = demoLocations.map(l => ({
    url: `${BASE_URL}/locations/${l.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const articlePages: MetadataRoute.Sitemap = demoArticles.map(a => ({
    url: `${BASE_URL}/journal/article/${a.slug.current}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const categoryPages: MetadataRoute.Sitemap = Object.keys(categoryLabels).map(c => ({
    url: `${BASE_URL}/journal/category/${c}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...developmentPages, ...locationPages, ...articlePages, ...categoryPages]
}
