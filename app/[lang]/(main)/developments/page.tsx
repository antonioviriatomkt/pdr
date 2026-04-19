import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DevelopmentsIndex from './DevelopmentsIndex'
import { getAllDevelopments, getAllLocations } from '@/lib/queries'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates } from '@/lib/i18n/metadata'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'New Developments in Portugal',
  description: 'Browse curated new residential developments across Portugal — Lisbon, Porto, Cascais, Algarve, Comporta, and Gaia. Filtered by location, type, and status.',
  alternates: getAlternates('/developments'),
}

export default async function DevelopmentsPage({ params }: PageProps<'/[lang]/(main)/developments'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [developments, locations, dict] = await Promise.all([
    getAllDevelopments(lang),
    getAllLocations(lang),
    getDictionary(lang),
  ])

  const devCardUi = { priceOnRequest: dict.common.priceOnRequest, featured: dict.common.featured, viewArrow: dict.common.viewArrow }

  return (
    <DevelopmentsIndex
      developments={developments}
      locations={locations}
      lang={lang}
      dict={dict.developments}
      devCardUi={devCardUi}
    />
  )
}
