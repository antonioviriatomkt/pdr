import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getLatestArticles, getDevelopmentsByLocation } from '@/lib/queries'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates } from '@/lib/i18n/metadata'
import DevelopmentCard from '@/components/DevelopmentCard'

export const revalidate = 60
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params
  const article = await getArticleBySlug(slug, hasLocale(lang) ? lang : 'en')
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt || `${article.title} — Portugal Developments Review Journal`,
    alternates: getAlternates(`/journal/article/${slug}`),
  }
}

function formatDate(date: string, lang: string) {
  return new Date(date).toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function ArticlePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()

  const [article, dict] = await Promise.all([
    getArticleBySlug(slug, lang),
    getDictionary(lang),
  ])
  if (!article) notFound()

  const j = dict.journal
  const categories = j.categories
  const devCardUi = { priceOnRequest: dict.common.priceOnRequest, featured: dict.common.featured, viewArrow: dict.common.viewArrow }

  const label = categories[article.category as keyof typeof categories] ?? article.category

  const [linkedDevs, allArticles] = await Promise.all([
    article.linkedLocation
      ? getDevelopmentsByLocation(article.linkedLocation.slug.current, lang)
      : Promise.resolve([]),
    getLatestArticles(20, lang),
  ])

  const relatedArticles = (allArticles as any[])
    .filter((a: any) => a._id !== article._id && a.category === article.category)
    .slice(0, 3)

  const linkedDevsSlice = (linkedDevs as any[]).slice(0, 2)

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <Link href={`/${lang}/journal`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{j.heading}</Link>
            <span>›</span>
            <Link href={`/${lang}/journal/category/${article.category}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{label}</Link>
          </nav>

          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 12px' }}>
            {label}
            {article.linkedLocation && ` · ${article.linkedLocation.name}`}
          </p>

          <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2, maxWidth: '720px' }}>
            {article.title}
          </h1>

          <p style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)' }}>
            {formatDate(article.publishedAt, lang)}
          </p>
        </div>
      </section>

      {/* Hero image */}
      {article.heroImage ? (
        <div style={{ aspectRatio: '16/7', background: 'var(--surface)', maxHeight: '420px', overflow: 'hidden' }}>
          {/* Image rendered via next/image if available */}
        </div>
      ) : (
        <div style={{ aspectRatio: '16/7', background: 'var(--surface)', maxHeight: '420px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {label}
          </span>
        </div>
      )}

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

            {article.body && (
              <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--foreground)' }}>
                {/* Portable Text rendering would go here */}
              </div>
            )}

            {article.linkedLocation && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '32px' }}>
                <p style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: '0 0 8px' }}>
                  {j.article.relatedLocation}
                </p>
                <Link
                  href={`/${lang}/locations/${article.linkedLocation.slug.current}`}
                  style={{ fontSize: '16px', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}
                >
                  {dict.locations.headingPrefix} {article.linkedLocation.name} {dict.locations.exploreArrow}
                </Link>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside>
            {linkedDevsSlice.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  {j.article.relatedDevelopments}
                </div>
                {linkedDevsSlice.map((dev: any) => (
                  <DevelopmentCard key={dev._id} development={dev} lang={lang} ui={devCardUi} variant="compact" />
                ))}
              </div>
            )}

            {relatedArticles.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  {label}
                </div>
                {relatedArticles.map((a: any) => (
                  <Link key={a._id} href={`/${lang}/journal/article/${a.slug.current}`} style={{ display: 'block', textDecoration: 'none', borderTop: '1px solid var(--border)', paddingTop: '12px', paddingBottom: '12px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--foreground)', margin: '0 0 4px', lineHeight: 1.4 }}>{a.title}</p>
                    <p style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: 0 }}>{formatDate(a.publishedAt, lang)}</p>
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
