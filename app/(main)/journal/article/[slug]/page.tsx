import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { demoArticles, demoDevelopments, categoryLabels } from '@/lib/demo-data'
import DevelopmentCard from '@/components/DevelopmentCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = demoArticles.find(a => a.slug.current === slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt || `${article.title} — Portugal Developments Review Journal`,
  }
}

export async function generateStaticParams() {
  return demoArticles.map(a => ({ slug: a.slug.current }))
}

// Demo article body content
const demoBodyContent: Record<string, string[]> = {
  default: [
    'Portugal has quietly become one of Europe\'s most compelling destinations for both lifestyle and investment buyers. The country\'s combination of Atlantic climate, architectural heritage, and relative affordability compared to Western European peers has driven sustained international demand over the past decade.',
    'What distinguishes the current moment is the quality of product coming to market. A new generation of developers — often working with internationally recognised architects — is producing residences that can credibly compete with the finest addresses in Lisbon, Madrid, or Milan.',
    'The developments that appear on this platform represent a fraction of the total market activity. Our selection process deliberately excludes projects that fail to meet our criteria on any of the key dimensions: architectural coherence, developer credibility, location fundamentals, and specification integrity.',
    'For buyers navigating this market, the challenge is not a shortage of product — it is the difficulty of identifying which projects represent genuine quality and which are riding the wave of demand without the substance to sustain long-term value.',
    'Portugal Developments Review exists to address that challenge. Our editorial process is the filter between the noise of the market and the signal of genuine opportunity.',
  ],
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = demoArticles.find(a => a.slug.current === slug)
  if (!article) notFound()

  const label = categoryLabels[article.category] || article.category
  const linkedDevs = article.linkedLocation
    ? demoDevelopments.filter(d => d.location.slug.current === article.linkedLocation!.slug.current).slice(0, 2)
    : []
  const relatedArticles = demoArticles.filter(a => a._id !== article._id && a.category === article.category).slice(0, 3)
  const bodyParagraphs = demoBodyContent.default

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <Link href="/journal" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Journal</Link>
            <span>›</span>
            <Link href={`/journal/category/${article.category}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{label}</Link>
          </nav>

          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 12px' }}>
            {label}
            {article.linkedLocation && ` · ${article.linkedLocation.name}`}
          </p>

          <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2, maxWidth: '720px' }}>
            {article.title}
          </h1>

          <p style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)' }}>
            {formatDate(article.publishedAt)}
          </p>
        </div>
      </section>

      {/* Hero image placeholder */}
      <div style={{ aspectRatio: '16/7', background: 'var(--surface)', maxHeight: '420px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>

      {/* Article body */}
      <div className="container-editorial">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '60px', padding: '48px 0' }}>
          {/* Body */}
          <article>
            {article.excerpt && (
              <p style={{ fontSize: '20px', lineHeight: 1.6, color: 'var(--foreground)', margin: '0 0 32px', fontStyle: 'italic' }}>
                {article.excerpt}
              </p>
            )}

            <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--foreground)' }}>
              {bodyParagraphs.map((para, i) => (
                <p key={i} style={{ margin: '0 0 24px' }}>{para}</p>
              ))}
            </div>

            {article.linkedLocation && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '32px' }}>
                <p style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: '0 0 8px' }}>
                  Related Location
                </p>
                <Link
                  href={`/locations/${article.linkedLocation.slug.current}`}
                  style={{ fontSize: '16px', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}
                >
                  New Developments in {article.linkedLocation.name} →
                </Link>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside>
            {linkedDevs.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  Related Developments
                </div>
                {linkedDevs.map(dev => (
                  <DevelopmentCard key={dev._id} development={dev} variant="compact" />
                ))}
              </div>
            )}

            {relatedArticles.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  More in {label}
                </div>
                {relatedArticles.map(a => (
                  <Link key={a._id} href={`/journal/article/${a.slug.current}`} style={{ display: 'block', textDecoration: 'none', borderTop: '1px solid var(--border)', paddingTop: '12px', paddingBottom: '12px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--foreground)', margin: '0 0 4px', lineHeight: 1.4 }}>{a.title}</p>
                    <p style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: 0 }}>{formatDate(a.publishedAt)}</p>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
