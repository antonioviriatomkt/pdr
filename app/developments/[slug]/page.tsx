import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { demoDevelopments } from '@/lib/demo-data'
import DevelopmentCard from '@/components/DevelopmentCard'
import ArticleCard from '@/components/ArticleCard'
import InquiryPanel from './InquiryPanel'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const dev = demoDevelopments.find(d => d.slug.current === slug)
  if (!dev) return {}
  return {
    title: `${dev.name} — ${dev.location.name}`,
    description: dev.editorialThesis || `Discover ${dev.name}, a curated new development in ${dev.location.name}, Portugal.`,
  }
}

export async function generateStaticParams() {
  return demoDevelopments.map(d => ({ slug: d.slug.current }))
}

export default async function DevelopmentPage({ params }: PageProps) {
  const { slug } = await params
  const dev = demoDevelopments.find(d => d.slug.current === slug)
  if (!dev) notFound()

  const related = demoDevelopments.filter(d => d._id !== dev._id && d.location.slug.current === dev.location.slug.current).slice(0, 3)

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
            <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link href="/developments" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Developments</Link>
            <span>›</span>
            <Link href={`/locations/${dev.location.slug.current}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{dev.location.name}</Link>
            <span>›</span>
            <span style={{ color: 'var(--foreground)' }}>{dev.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ aspectRatio: '16/7', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {dev.name} — {dev.location.name}
          </span>
        </div>
      </section>

      {/* Main content */}
      <div className="container-editorial">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '60px', padding: '48px 0', alignItems: 'start' }}>
          {/* Left: Editorial content */}
          <div>
            {/* Status + type */}
            <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
              {dev.location.name} · {dev.status}{dev.type ? ` · ${dev.type}` : ''}
            </div>

            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {dev.name}
            </h1>

            {dev.priceDisplay && (
              <p style={{ fontSize: '18px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: '0 0 32px' }}>
                {dev.priceDisplay}
              </p>
            )}

            {/* Editorial thesis */}
            {dev.editorialThesis && (
              <div style={{ borderLeft: '2px solid var(--foreground)', paddingLeft: '24px', marginBottom: '40px' }}>
                <p style={{ fontSize: '18px', lineHeight: 1.6, margin: 0, color: 'var(--foreground)' }}>
                  {dev.editorialThesis}
                </p>
              </div>
            )}

            {/* Key facts */}
            {dev.keyFacts && dev.keyFacts.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 16px' }}>
                  Key Facts
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1px', border: '1px solid var(--border)', background: 'var(--border)' }}>
                  {dev.keyFacts.map((fact, i) => (
                    <div key={i} style={{ background: 'var(--background)', padding: '16px' }}>
                      <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                        {fact.label}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 400 }}>
                        {fact.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Typology */}
            {dev.typologyNote && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                  Availability
                </h2>
                <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                  {dev.typologyNote}
                </p>
              </div>
            )}

            {/* Developer */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginBottom: '40px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
                Developer
              </div>
              <div style={{ fontSize: '16px', fontWeight: 400 }}>
                {dev.developer.name}
              </div>
              {dev.developer.isViriatoClient && (
                <div style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', marginTop: '4px' }}>
                  Viriato client
                </div>
              )}
            </div>

            {/* Location context */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                Location Context
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 12px' }}>
                {`${dev.name} is located in ${dev.location.name}, one of Portugal's most sought-after addresses for new residential development.`}
              </p>
              <Link
                href={`/locations/${dev.location.slug.current}`}
                style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}
              >
                Explore {dev.location.name} →
              </Link>
            </div>

            {/* Lifestyle tags */}
            {dev.lifestyleTags && dev.lifestyleTags.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
                  Lifestyle
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {dev.lifestyleTags.map(tag => (
                    <span key={tag} style={{ fontSize: '12px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', border: '1px solid var(--border)', padding: '5px 12px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Inquiry panel */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <InquiryPanel development={dev} />
          </div>
        </div>
      </div>

      {/* Related developments */}
      {related.length > 0 && (
        <section style={{ borderTop: '1px solid var(--border)', padding: '48px 0' }}>
          <div className="container-editorial">
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 32px', letterSpacing: '-0.01em' }}>
              Other Developments in {dev.location.name}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
              {related.map(r => (
                <DevelopmentCard key={r._id} development={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
