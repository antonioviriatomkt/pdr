import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DevelopmentsIndex from './DevelopmentsIndex'
import { getAllDevelopments, getAllLocations } from '@/lib/queries'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'
import { JsonLd } from '@/components/JsonLd'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(hasLocale(lang) ? lang : 'en')
  return {
    title: dict.seo.developments.title,
    description: dict.seo.developments.description,
    alternates: getAlternates('/developments', lang),
    openGraph: { type: 'website', ...getOgLocale(lang) },
  }
}

interface SearchParams {
  location?: string
  type?: string
  status?: string
  sort?: string
}

export default async function DevelopmentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<SearchParams>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const sp = await searchParams

  const [developments, locations, dict] = await Promise.all([
    getAllDevelopments(lang),
    getAllLocations(lang),
    getDictionary(lang),
  ])

  const locationFilter = typeof sp.location === 'string' ? sp.location : ''
  const typeFilter = typeof sp.type === 'string' ? sp.type : ''
  const statusFilter = typeof sp.status === 'string' ? sp.status : ''
  const sort = typeof sp.sort === 'string' ? sp.sort : 'featured'
  const hasFilters = !!(locationFilter || typeFilter || statusFilter)

  let filtered = [...(developments as any[])]
  if (locationFilter) filtered = filtered.filter(d => d.location?.slug?.current === locationFilter)
  if (typeFilter) filtered = filtered.filter(d => d.type === typeFilter)
  if (statusFilter) filtered = filtered.filter(d => d.status === statusFilter)
  if (sort === 'newest') {
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  } else {
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
  }

  const devCardUi = { priceOnRequest: dict.common.priceOnRequest, featured: dict.common.featured, viewArrow: dict.common.viewArrow, statusLabels: dict.developments.statusLabels, typeLabels: dict.developments.typeLabels, priceLabels: dict.developments.priceLabels, lifestyleTagLabels: dict.developments.lifestyleTagLabels }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.seo.developments.title,
    url: `${BASE_URL}/${lang}/developments`,
    itemListElement: filtered.map((dev, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: dev.name,
      url: `${BASE_URL}/${lang}/developments/${dev.slug.current}`,
    })),
  }

  return (
    <>
      <JsonLd data={itemListSchema} />
      <DevelopmentsIndex
        developments={filtered}
        locations={locations}
        lang={lang}
        dict={dict.developments}
        devCardUi={devCardUi}
        hasFilters={hasFilters}
      />
    </>
  )
}
