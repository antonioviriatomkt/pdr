import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllLocations } from '@/lib/queries'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'
import { JsonLd } from '@/components/JsonLd'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(hasLocale(lang) ? lang : 'en')
  return {
    title: dict.seo.locationsIndex.title,
    description: dict.seo.locationsIndex.description,
    alternates: getAlternates('/locations', lang),
    openGraph: { type: 'website', ...getOgLocale(lang) },
  }
}

export default async function LocationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [locations, dict] = await Promise.all([
    getAllLocations(lang),
    getDictionary(lang),
  ])

  const l = dict.locations

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.home, item: `${BASE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: dict.nav.locations, item: `${BASE_URL}/${lang}/locations` },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: l.indexHeading,
    itemListElement: (locations as any[]).map((loc: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: loc.name,
      url: `${BASE_URL}/${lang}/locations/${loc.slug.current}`,
    })),
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />
      <section style={{ borderBottom: '1px solid var(--border)', padding: '80px 0 72px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {l.indexEyebrow}
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            {l.indexHeading}
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '560px', margin: 0 }}>
            {l.indexSubheading}
          </p>
        </div>
      </section>

      <section style={{ padding: '64px 0' }}>
        <div className="container-editorial">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1px',
            border: '1px solid var(--border)',
            background: 'var(--border)',
          }}>
            {locations.map((loc: any) => (
              <Link
                key={loc._id}
                href={`/${lang}/locations/${loc.slug.current}`}
                style={{ display: 'block', background: 'var(--background)', padding: '28px 24px', textDecoration: 'none' }}
              >
                <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px' }}>
                  {loc.region}
                </p>
                <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
                  {loc.name}
                </h2>
                {loc.intro && (
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--muted)',
                    lineHeight: 1.6,
                    margin: '0 0 16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  } as React.CSSProperties}>
                    {loc.intro}
                  </p>
                )}
                <span style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', borderBottom: '1px solid var(--foreground)' }}>
                  {l.exploreArrow}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
