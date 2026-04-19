import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { getArticlesByCategory } from '@/lib/queries'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates } from '@/lib/i18n/metadata'

export const revalidate = 60
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ lang: string; category: string }> }): Promise<Metadata> {
  const { category, lang } = await params
  const dict = await getDictionary(hasLocale(lang) ? lang : 'en')
  const label = dict.journal.categories[category as keyof typeof dict.journal.categories]
  if (!label) return {}
  return {
    title: `${label} — Journal`,
    description: `Editorial articles about ${label.toLowerCase()} covering new developments across Portugal.`,
    alternates: getAlternates(`/journal/category/${category}`),
  }
}

export default async function JournalCategoryPage({ params }: { params: Promise<{ lang: string; category: string }> }) {
  const { lang, category } = await params
  if (!hasLocale(lang)) notFound()

  const [articles, dict] = await Promise.all([
    getArticlesByCategory(category, lang),
    getDictionary(lang),
  ])

  const j = dict.journal
  const categories = j.categories
  const label = categories[category as keyof typeof categories]
  if (!label) notFound()

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <Link href={`/${lang}/journal`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{j.heading}</Link>
            <span>›</span>
            <span>{label}</span>
          </nav>
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {j.eyebrow}
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 400, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            {label}
          </h1>
        </div>
      </section>

      {/* Category nav */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '16px 0', background: 'var(--surface)' }}>
        <div className="container-editorial">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href={`/${lang}/journal`} style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', textDecoration: 'none' }}>
              {j.filterAll}
            </Link>
            {Object.entries(categories).map(([value, lbl]) => (
              <Link
                key={value}
                href={`/${lang}/journal/category/${value}`}
                style={{ fontSize: '12px', fontFamily: 'sans-serif', color: value === category ? 'var(--foreground)' : 'var(--muted)', textDecoration: 'none', borderBottom: value === category ? '1px solid var(--foreground)' : 'none', paddingBottom: '2px' }}
              >
                {lbl as string}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 0' }}>
        <div className="container-editorial">
          {(articles as any[]).length === 0 ? (
            <div style={{ padding: '48px 0' }}>
              <p style={{ fontSize: '16px', color: 'var(--muted)', fontFamily: 'sans-serif' }}>
                No articles in this category yet.
              </p>
              <Link href={`/${lang}/journal`} style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)', marginTop: '12px', display: 'inline-block' }}>
                {dict.common.allArticles}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '48px 40px' }}>
              {(articles as any[]).map((article: any) => (
                <ArticleCard key={article._id} article={article} lang={lang} categories={categories} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
