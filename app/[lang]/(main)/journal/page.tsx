import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { getLatestArticles, getPillarArticles } from '@/lib/queries'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(hasLocale(lang) ? lang : 'en')
  return {
    title: dict.seo.journal.title,
    description: dict.seo.journal.description,
    alternates: getAlternates('/journal', lang),
    openGraph: { type: 'website', ...getOgLocale(lang) },
  }
}

export default async function JournalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [articles, pillarArticles, dict] = await Promise.all([
    getLatestArticles(24, lang),
    getPillarArticles(lang),
    getDictionary(lang),
  ])

  const j = dict.journal
  const categories = j.categories

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {j.eyebrow}
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {j.heading}
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', maxWidth: '480px', lineHeight: 1.6, margin: 0 }}>
            {j.subheading}
          </p>
        </div>
      </section>

      {/* Pillar guides */}
      {pillarArticles.length > 0 && (
        <section style={{ borderBottom: '1px solid var(--border)', padding: '48px 0' }}>
          <div className="container-editorial">
            <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 24px' }}>
              {j.guidesHeading}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '48px 40px' }}>
              {pillarArticles.slice(0, 3).map((article: any) => (
                <ArticleCard key={article._id} article={article} lang={lang} categories={categories} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category nav */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '16px 0', background: 'var(--surface)' }}>
        <div className="container-editorial">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href={`/${lang}/journal`} style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)', paddingBottom: '2px' }}>
              {j.filterAll}
            </Link>
            {Object.entries(categories).map(([value, label]) => (
              <Link
                key={value}
                href={`/${lang}/journal/category/${value}`}
                style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', textDecoration: 'none' }}
              >
                {label as string}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section style={{ padding: '56px 0' }}>
        <div className="container-editorial">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '48px 40px' }}>
            {articles.map((article: any) => (
              <ArticleCard key={article._id} article={article} lang={lang} categories={categories} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
