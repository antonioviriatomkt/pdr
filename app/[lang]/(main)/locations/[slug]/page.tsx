import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DevelopmentCard from '@/components/DevelopmentCard'
import ArticleCard from '@/components/ArticleCard'
import { getLocationBySlug, getDevelopmentsByLocation, getArticlesByLocation, getAllLocations } from '@/lib/queries'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates } from '@/lib/i18n/metadata'

export const revalidate = 60
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params
  const loc = await getLocationBySlug(slug, hasLocale(lang) ? lang : 'en')
  if (!loc) return {}
  return {
    title: `New Developments in ${loc.name}, Portugal`,
    description: `Discover curated new residential developments in ${loc.name}. ${loc.intro?.slice(0, 120)}...`,
    alternates: getAlternates(`/locations/${slug}`),
  }
}

export async function generateStaticParams() {
  const locations = await getAllLocations()
  return locations.map((l: any) => ({ slug: l.slug.current }))
}

export default async function LocationPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()

  const [loc, developments, articles, dict] = await Promise.all([
    getLocationBySlug(slug, lang),
    getDevelopmentsByLocation(slug, lang),
    getArticlesByLocation(slug, lang),
    getDictionary(lang),
  ])
  if (!loc) notFound()

  const l = dict.locations
  const devCardUi = { priceOnRequest: dict.common.priceOnRequest, featured: dict.common.featured, viewArrow: dict.common.viewArrow }
  const categories = dict.journal.categories
  const nearby = (loc.nearbyLocations ?? []).slice(0, 4)

  return (
    <>
      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', marginBottom: '24px', display: 'flex', gap: '8px' }}>
            <Link href={`/${lang}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{dict.common.home}</Link>
            <span>›</span>
            <span style={{ color: 'var(--foreground)' }}>{l.breadcrumbLocations}</span>
            <span>›</span>
            <span style={{ color: 'var(--foreground)' }}>{loc.name}</span>
          </nav>

          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {loc.region}
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            {l.headingPrefix} {loc.name}
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '600px', margin: 0 }}>
            {loc.intro}
          </p>
        </div>
      </section>

      {/* Developments in this location */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-editorial">
          <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 32px', letterSpacing: '-0.01em' }}>
            {l.developmentsHeading} — {loc.name}
          </h2>
          {developments.length === 0 ? (
            <div style={{ padding: '48px 0', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '15px', color: 'var(--muted)', fontFamily: 'sans-serif' }}>
                {l.noDevelopments}
              </p>
              <Link href={`/${lang}/developments`} style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)', marginTop: '12px', display: 'inline-block' }}>
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
                <ArticleCard key={a._id} article={a} lang={lang} categories={categories} />
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
                  <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
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
