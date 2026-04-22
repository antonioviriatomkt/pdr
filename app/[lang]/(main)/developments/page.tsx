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

export default async function DevelopmentsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [developments, locations, dict] = await Promise.all([
    getAllDevelopments(lang),
    getAllLocations(lang),
    getDictionary(lang),
  ])

  const devCardUi = { priceOnRequest: dict.common.priceOnRequest, featured: dict.common.featured, viewArrow: dict.common.viewArrow, statusLabels: dict.developments.statusLabels, typeLabels: dict.developments.typeLabels, priceLabels: dict.developments.priceLabels, lifestyleTagLabels: dict.developments.lifestyleTagLabels }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.seo.developments.title,
    url: `${BASE_URL}/${lang}/developments`,
    itemListElement: (developments as any[]).map((dev, i) => ({
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
        developments={developments}
        locations={locations}
        lang={lang}
        dict={dict.developments}
        devCardUi={devCardUi}
      />
    </>
  )
}
