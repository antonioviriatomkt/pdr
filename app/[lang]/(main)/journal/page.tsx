import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { getLatestArticles, countArticles, getPillarArticles, getArticlesByCategory, HIDDEN_CATEGORIES } from '@/lib/queries'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'
import { JsonLd } from '@/components/JsonLd'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')
const PAGE_SIZE = 12

export const revalidate = 60

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ page?: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const sp = await searchParams
  const dict = await getDictionary(hasLocale(lang) ? lang : 'en')
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)

  const alternates = getAlternates('/journal', lang)
  if (page > 1) {
    alternates.canonical = `${BASE_URL}/${lang}/journal?page=${page}`
  }

  return {
    title: page > 1 ? `${dict.seo.journal.title} — Page ${page}` : dict.seo.journal.title,
    description: dict.seo.journal.description,
    alternates,
    openGraph: { type: 'website', ...getOgLocale(lang) },
  }
}

export default async function JournalPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const [articles, total, pillarArticles, marketIntelligenceArticles, dict] = await Promise.all([
    getLatestArticles(PAGE_SIZE, lang, offset),
    countArticles(),
    page === 1 ? getPillarArticles(lang) : Promise.resolve([]),
    page === 1 ? getArticlesByCategory('market-intelligence', lang) : Promise.resolve([]),
    getDictionary(lang),
  ])

  const totalPages = Math.ceil((total as number) / PAGE_SIZE)

  const j = dict.journal
  const categories = j.categories

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.home, item: `${BASE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: j.heading, item: `${BASE_URL}/${lang}/journal` },
    ],
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: j.heading,
    description: j.subheading,
    url: `${BASE_URL}/${lang}/journal`,
    inLanguage: lang === 'pt' ? 'pt-PT' : 'en',
    publisher: {
      '@type': 'Organization',
      name: 'Portugal Developments Review by Viriato',
      url: BASE_URL,
    },
  }

  const prevUrl = page > 1 ? (page === 2 ? `/${lang}/journal` : `/${lang}/journal?page=${page - 1}`) : null
  const nextUrl = page < totalPages ? `/${lang}/journal?page=${page + 1}` : null

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={blogSchema} />
      {prevUrl && <link rel="prev" href={`${BASE_URL}${prevUrl}`} />}
      {nextUrl && <link rel="next" href={`${BASE_URL}${nextUrl}`} />}

      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
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

      {/* Pillar guides — first page only */}
      {page === 1 && (pillarArticles as any[]).length > 0 && (
        <section style={{ borderBottom: '1px solid var(--border)', padding: '48px 0' }}>
          <div className="container-editorial">
            <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 24px' }}>
              {j.guidesHeading}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px 40px' }}>
              {(pillarArticles as any[]).slice(0, 3).map((article: any) => (
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
            <Link href={`/${lang}/journal`} style={{ fontSize: '12px', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)', paddingBottom: '2px' }}>
              {j.filterAll}
            </Link>
            {Object.entries(categories).filter(([value]) => !HIDDEN_CATEGORIES.includes(value)).map(([value, label]) => (
              <Link
                key={value}
                href={`/${lang}/journal/category/${value}`}
                style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'none' }}
              >
                {label as string}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Market Intelligence compact list — first page only */}
      {page === 1 && (marketIntelligenceArticles as any[]).length > 0 && (
        <section style={{ borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
          <div className="container-editorial">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 4px' }}>
                {j.marketIntelligenceHeading}
              </p>
              <Link href={`/${lang}/journal/category/market-intelligence`} style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                {dict.common.viewAll}
              </Link>
            </div>
            {(marketIntelligenceArticles as any[]).slice(0, 2).map((article: any) => (
              <Link key={article._id} href={`/${lang}/journal/${article.slug.current}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', paddingBottom: '16px' }}>
                  <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 6px' }}>
                    {new Date(article.publishedAt).toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p style={{ fontSize: '17px', fontWeight: 400, margin: 0, lineHeight: 1.35, color: 'var(--foreground)' }}>
                    {article.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Articles grid */}
      <section style={{ padding: '56px 0' }}>
        <div className="container-editorial">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px 40px' }}>
            {(articles as any[]).map((article: any) => (
              <ArticleCard key={article._id} article={article} lang={lang} categories={categories} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
              <div>
                {prevUrl ? (
                  <Link href={prevUrl} style={{ fontSize: '13px', color: 'var(--foreground)', textDecoration: 'none', border: '1px solid var(--border)', padding: '10px 20px' }}>
                    ← Previous
                  </Link>
                ) : <span />}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Page {page} of {totalPages}
              </span>
              <div>
                {nextUrl ? (
                  <Link href={nextUrl} style={{ fontSize: '13px', color: 'var(--foreground)', textDecoration: 'none', border: '1px solid var(--border)', padding: '10px 20px' }}>
                    Next →
                  </Link>
                ) : <span />}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
