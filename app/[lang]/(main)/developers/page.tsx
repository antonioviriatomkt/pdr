import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllDevelopers } from '@/lib/queries'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'
import { JsonLd } from '@/components/JsonLd'
import DevelopersGrid from './DevelopersGrid'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(hasLocale(lang) ? lang : 'en')
  const title = dict.seo.developers.title
  const description = dict.seo.developers.description
  return {
    title,
    description,
    alternates: getAlternates('/developers', lang),
    openGraph: { type: 'website', title, description, ...getOgLocale(lang) },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function DevelopersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const [developers, dict] = await Promise.all([
    getAllDevelopers(locale),
    getDictionary(locale),
  ])

  const d = dict.developers

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.home, item: `${BASE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: d.breadcrumbDevelopers, item: `${BASE_URL}/${lang}/developers` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <Link href={`/${lang}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{dict.common.home}</Link>
            <span>›</span>
            <span>{d.breadcrumbDevelopers}</span>
          </nav>
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {d.eyebrow}
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
            {d.indexHeading}
          </h1>
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '680px', margin: '0 0 16px', fontFamily: 'sans-serif' }}>
            {d.indexSubheading}
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', maxWidth: '680px', margin: 0 }}>
            {d.indexIntro}{' '}
            <Link href={`/${lang}/methodology`} style={{ color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
              {dict.common.readMethodology}
            </Link>
          </p>
        </div>
      </section>

      {/* Developer grid */}
      <section style={{ padding: '56px 0' }}>
        <div className="container-editorial">
          <DevelopersGrid
            developers={developers as any[]}
            lang={lang}
            labels={{
              allFilter: d.allFilter,
              viriatoFilter: d.viriatoFilter,
              noDevelopers: d.noDevelopers,
              viriatoLabel: dict.developments.detail.viriatoClient,
              developmentsCount_one: d.developmentsCount_one,
              developmentsCount_other: d.developmentsCount_other,
            }}
          />
        </div>
      </section>
    </>
  )
}
