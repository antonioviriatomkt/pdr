import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DevelopmentCard from '@/components/DevelopmentCard'
import ArticleCard from '@/components/ArticleCard'
import { getLocationBySlug, getDevelopmentsByLocation, getArticlesByLocation, getAllLocations, getLocationChildren } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'
import { JsonLd } from '@/components/JsonLd'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

export const revalidate = 60
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params
  const [loc, dict] = await Promise.all([
    getLocationBySlug(slug, hasLocale(lang) ? lang : 'en'),
    getDictionary(hasLocale(lang) ? lang : 'en'),
  ])
  if (!loc) return {}
  const title = dict.seo.locations.title.replace('{name}', loc.name)
  const description = `${dict.seo.locations.descriptionPrefix} ${loc.name}. ${loc.intro?.slice(0, 120) ?? ''}...`
  const ogImageSource = loc.seoImage ?? loc.heroImage
  const ogImage = ogImageSource
    ? urlFor(ogImageSource).width(1200).height(630).fit('crop').auto('format').url()
    : undefined
  return {
    title,
    description,
    alternates: getAlternates(`/locations/${slug}`, lang),
    robots: loc.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: 'website',
      ...getOgLocale(lang),
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: loc.name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

export async function generateStaticParams() {
  const locations = await getAllLocations()
  return locations.map((l: any) => ({ slug: l.slug.current }))
}

export default async function LocationPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()

  const [loc, developments, articles, children, dict] = await Promise.all([
    getLocationBySlug(slug, lang),
    getDevelopmentsByLocation(slug, lang),
    getArticlesByLocation(slug, lang),
    getLocationChildren(slug, lang),
    getDictionary(lang),
  ])
  if (!loc) notFound()

  const l = dict.locations
  const devCardUi = { priceOnRequest: dict.common.priceOnRequest, featured: dict.common.featured, viewArrow: dict.common.viewArrow, statusLabels: dict.developments.statusLabels, typeLabels: dict.developments.typeLabels, priceLabels: dict.developments.priceLabels, lifestyleTagLabels: dict.developments.lifestyleTagLabels }
  const categories = dict.journal.categories
  const nearby = (loc.nearbyLocations ?? []).slice(0, 4)

  const ogImageSource = loc.seoImage ?? loc.heroImage
  const ogImage = ogImageSource
    ? urlFor(ogImageSource).width(1200).height(630).fit('crop').auto('format').url()
    : undefined

  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: loc.name,
    description: loc.intro ?? undefined,
    url: `${BASE_URL}/${lang}/locations/${slug}`,
    ...(ogImage && { image: ogImage }),
    containedInPlace: { '@type': 'Country', name: 'Portugal' },
    ...(loc.latitude != null && loc.longitude != null && {
      geo: { '@type': 'GeoCoordinates', latitude: loc.latitude, longitude: loc.longitude },
    }),
  }

  const breadcrumbItems: { '@type': string; position: number; name: string; item: string }[] = [
    { '@type': 'ListItem', position: 1, name: dict.common.home, item: `${BASE_URL}/${lang}` },
    { '@type': 'ListItem', position: 2, name: l.breadcrumbLocations, item: `${BASE_URL}/${lang}/locations` },
  ]
  if (loc.parentLocation?.parentLocation) {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: loc.parentLocation.parentLocation.name, item: `${BASE_URL}/${lang}/locations/${loc.parentLocation.parentLocation.slug.current}` })
    breadcrumbItems.push({ '@type': 'ListItem', position: 4, name: loc.parentLocation.name, item: `${BASE_URL}/${lang}/locations/${loc.parentLocation.slug.current}` })
    breadcrumbItems.push({ '@type': 'ListItem', position: 5, name: loc.name, item: `${BASE_URL}/${lang}/locations/${slug}` })
  } else if (loc.parentLocation) {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: loc.parentLocation.name, item: `${BASE_URL}/${lang}/locations/${loc.parentLocation.slug.current}` })
    breadcrumbItems.push({ '@type': 'ListItem', position: 4, name: loc.name, item: `${BASE_URL}/${lang}/locations/${slug}` })
  } else {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: loc.name, item: `${BASE_URL}/${lang}/locations/${slug}` })
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  const itemListSchema = developments.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${l.developmentsHeading} — ${loc.name}`,
    url: `${BASE_URL}/${lang}/locations/${slug}`,
    itemListElement: (developments as any[]).map((dev, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: dev.name,
      url: `${BASE_URL}/${lang}/developments/${dev.slug.current}`,
    })),
  } : null

  return (
    <>
      <JsonLd data={placeSchema} />
      <JsonLd data={breadcrumbSchema} />
      {itemListSchema && <JsonLd data={itemListSchema} />}
      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link href={`/${lang}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{dict.common.home}</Link>
            <span>›</span>
            <Link href={`/${lang}/locations`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{l.breadcrumbLocations}</Link>
            {loc.parentLocation?.parentLocation && (
              <>
                <span>›</span>
                <Link href={`/${lang}/locations/${loc.parentLocation.parentLocation.slug.current}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{loc.parentLocation.parentLocation.name}</Link>
              </>
            )}
            {loc.parentLocation && (
              <>
                <span>›</span>
                <Link href={`/${lang}/locations/${loc.parentLocation.slug.current}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{loc.parentLocation.name}</Link>
              </>
            )}
            <span>›</span>
            <span style={{ color: 'var(--foreground)' }}>{loc.name}</span>
          </nav>

          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {loc.region}
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            {l.headingPrefix} {loc.name}
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '600px', margin: 0 }}>
            {loc.intro}
          </p>
          {loc.parentLocation && (
            <div style={{ marginTop: '24px' }}>
              <Link href={`/${lang}/locations/${loc.parentLocation.slug.current}`} style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                {l.backTo.replace('{name}', loc.parentLocation.name)}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Neighbourhoods — only for macro locations with children */}
      {loc.locationType === 'macro' && children.length > 0 && (
        <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0' }}>
          <div className="container-editorial">
            <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 32px', letterSpacing: '-0.01em' }}>
              {l.neighbourhoodsHeading} — {loc.name}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', border: '1px solid var(--border)', background: 'var(--border)' }}>
              {children.map((child: any) => (
                <Link key={child._id} href={`/${lang}/locations/${child.slug.current}`} style={{ display: 'block', background: 'var(--background)', padding: '20px', textDecoration: 'none' }}>
                  <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
                    {child.locationType === 'sub-region' ? child.locationType : loc.name}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 400, marginBottom: '8px' }}>{child.name}</div>
                  {child.intro && (
                    <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                      {child.intro.slice(0, 80)}…
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Developments in this location */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-editorial">
          <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 32px', letterSpacing: '-0.01em' }}>
            {l.developmentsHeading} — {loc.name}
          </h2>
          {developments.length === 0 ? (
            <div style={{ padding: '48px 0', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '15px', color: 'var(--muted)' }}>
                {l.noDevelopments}
              </p>
              <Link href={`/${lang}/developments`} style={{ fontSize: '13px', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)', marginTop: '12px', display: 'inline-block' }}>
                {dict.common.allDevelopments}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
              {developments.map((dev: any) => (
                <DevelopmentCard key={dev._id} development={dev} lang={lang} ui={devCardUi} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Journal articles for this location */}
      {articles.length > 0 && (
        <section style={{ padding: '56px 0', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div className="container-editorial">
            <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 32px', letterSpacing: '-0.01em' }}>
              {l.journalHeading} — {loc.name}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
              {articles.map((a: any) => (
                <div key={a._id}>
                  {a.isComparison && (
                    <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px' }}>
                      {l.comparisonLabel} —
                    </p>
                  )}
                  <ArticleCard article={a} lang={lang} categories={categories} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nearby locations */}
      {nearby.length > 0 && (
        <section style={{ padding: '48px 0' }}>
          <div className="container-editorial">
            <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 24px', letterSpacing: '-0.01em' }}>
              {l.nearbyHeading}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', border: '1px solid var(--border)', background: 'var(--border)' }}>
              {nearby.map((n: any) => (
                <Link key={n._id} href={`/${lang}/locations/${n.slug.current}`} style={{ display: 'block', background: 'var(--background)', padding: '20px', textDecoration: 'none' }}>
                  <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
                    {n.region}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 400 }}>{n.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
