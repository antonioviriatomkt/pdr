import { MetadataRoute } from 'next'
import { getAllDevelopments, getAllLocations, getAllArticles } from '@/lib/queries'

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

const LOCALES = ['en', 'pt'] as const

const ARTICLE_CATEGORIES = [
  'architecture',
  'area-guides',
  'branded-residences',
  'new-developments',
  'second-home',
  'investment',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [developments, locations, articles] = await Promise.all([
    getAllDevelopments(),
    getAllLocations(),
    getAllArticles(),
  ])

  const staticRoutes = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/developments', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/journal', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/methodology', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/for-developers', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  ]

  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    staticRoutes.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  )

  const developmentPages: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    (developments as any[]).map(d => ({
      url: `${BASE}/${locale}/developments/${d.slug.current}`,
      lastModified: d.publishedAt ? new Date(d.publishedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: d.isFeatured ? 0.9 : 0.8,
    }))
  )

  const locationPages: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    (locations as any[]).map(l => ({
      url: `${BASE}/${locale}/locations/${l.slug.current}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  const articlePages: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    (articles as any[]).map(a => ({
      url: `${BASE}/${locale}/journal/article/${a.slug.current}`,
      lastModified: a.publishedAt ? new Date(a.publishedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  const categoryPages: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    ARTICLE_CATEGORIES.map(c => ({
      url: `${BASE}/${locale}/journal/category/${c}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  )

  return [...staticPages, ...developmentPages, ...locationPages, ...articlePages, ...categoryPages]
}
