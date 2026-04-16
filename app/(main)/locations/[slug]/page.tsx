import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DevelopmentCard from '@/components/DevelopmentCard'
import ArticleCard from '@/components/ArticleCard'
import { getLocationBySlug, getDevelopmentsByLocation, getArticlesByLocation, getAllLocations } from '@/lib/queries'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60
export const dynamicParams = true

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const loc = await getLocationBySlug(slug)
  if (!loc) return {}
  return {
    title: `New Developments in ${loc.name}, Portugal`,
    description: `Discover curated new residential developments in ${loc.name}. ${loc.intro?.slice(0, 120)}...`,
  }
}

export async function generateStaticParams() {
  const locations = await getAllLocations()
  return locations.map((l: any) => ({ slug: l.slug.current }))
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params
  const [loc, developments, articles] = await Promise.all([
    getLocationBySlug(slug),
    getDevelopmentsByLocation(slug),
    getArticlesByLocation(slug),
  ])
  if (!loc) notFound()

  const nearby = (loc.nearbyLocations ?? []).slice(0, 4)

  return (
    <>
      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', marginBottom: '24px', display: 'flex', gap: '8px' }}>
            <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <span style={{ color: 'var(--foreground)' }}>Locations</span>
            <span>›</span>
            <span style={{ color: 'var(--foreground)' }}>{loc.name}</span>
          </nav>

          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {loc.region}
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            New Developments in {loc.name}
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
            Curated Developments in {loc.name}
          </h2>
          {developments.length === 0 ? (
            <div style={{ padding: '48px 0', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '15px', color: 'var(--muted)', fontFamily: 'sans-serif' }}>
                No developments currently listed in {loc.name}. New projects are added as they pass our curation process.
              </p>
              <Link href="/developments" style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)', marginTop: '12px', display: 'inline-block' }}>
                View All Developments →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
              {developments.map(dev => (
                <DevelopmentCard key={dev._id} development={dev} />
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
              Journal — {loc.name}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
              {articles.map(a => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Secondary filter links */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-editorial">
          <h2 style={{ fontSize: '16px', fontWeight: 400, margin: '0 0 20px', fontFamily: 'sans-serif', letterSpacing: '0.02em', color: 'var(--muted)' }}>
            Filter Developments in {loc.name}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Apartments', 'Villas', 'Off-plan', 'Under Construction', 'Selling Now'].map(tag => (
              <Link
                key={tag}
                href={`/developments`}
                style={{ fontSize: '12px', fontFamily: 'sans-serif', border: '1px solid var(--border)', padding: '6px 14px', color: 'var(--muted)', textDecoration: 'none' }}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby locations */}
      <section style={{ padding: '48px 0' }}>
        <div className="container-editorial">
          <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 24px', letterSpacing: '-0.01em' }}>
            Other Locations
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', border: '1px solid var(--border)', background: 'var(--border)' }}>
            {nearby.map(l => (
              <Link key={l._id} href={`/locations/${l.slug.current}`} style={{ display: 'block', background: 'var(--background)', padding: '20px', textDecoration: 'none' }}>
                <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
                  {l.region}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 400 }}>{l.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
