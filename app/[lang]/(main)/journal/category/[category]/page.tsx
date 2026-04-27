import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { getArticlesByCategory, getJournalCategory, getCategoriesWithArticles, HIDDEN_CATEGORIES } from '@/lib/queries'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'
import { JsonLd } from '@/components/JsonLd'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const categories = await getCategoriesWithArticles()
  return (categories as string[]).map((category) => ({ category }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; category: string }> }): Promise<Metadata> {
  const { category, lang } = await params
  if (HIDDEN_CATEGORIES.includes(category)) return {}
  const locale = hasLocale(lang) ? lang : 'en'
  const [dict, catDoc, articles] = await Promise.all([
    getDictionary(locale),
    getJournalCategory(category, locale),
    getArticlesByCategory(category, locale),
  ])
  const label = dict.journal.categories[category as keyof typeof dict.journal.categories]
  if (!label) return {}
  return {
    title: catDoc?.seoTitle || dict.seo.journal.categoryTitle.replace('{label}', label),
    description: catDoc?.seoDescription || dict.seo.journal.categoryDescription.replace('{label}', label.toLowerCase()),
    alternates: getAlternates(`/journal/category/${category}`, lang),
    openGraph: { type: 'website', ...getOgLocale(lang) },
    robots: (articles as any[]).length === 0 ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default async function JournalCategoryPage({ params }: { params: Promise<{ lang: string; category: string }> }) {
  const { lang, category } = await params
  if (!hasLocale(lang)) notFound()
  if (HIDDEN_CATEGORIES.includes(category)) notFound()

  const [articles, dict, catDoc] = await Promise.all([
    getArticlesByCategory(category, lang),
    getDictionary(lang),
    getJournalCategory(category, lang),
  ])

  const j = dict.journal
  const categories = j.categories
  const label = categories[category as keyof typeof categories]
  if (!label) notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.home, item: `${BASE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: j.heading, item: `${BASE_URL}/${lang}/journal` },
      { '@type': 'ListItem', position: 3, name: label, item: `${BASE_URL}/${lang}/journal/category/${category}` },
    ],
  }

  const itemListSchema = (articles as any[]).length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: label,
    itemListElement: (articles as any[]).map((a: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: a.title,
      url: `${BASE_URL}/${lang}/journal/${a.slug.current}`,
    })),
  } : null

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {itemListSchema && <JsonLd data={itemListSchema} />}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <Link href={`/${lang}/journal`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{j.heading}</Link>
            <span>›</span>
            <span>{label}</span>
          </nav>
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {j.eyebrow}
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 400, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            {label}
          </h1>
          {catDoc?.intro && (
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '680px', margin: '16px 0 0' }}>
              {catDoc.intro}
            </p>
          )}
        </div>
      </section>

      {/* Category nav */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '16px 0', background: 'var(--surface)' }}>
        <div className="container-editorial">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href={`/${lang}/journal`} style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'none' }}>
              {j.filterAll}
            </Link>
            {Object.entries(categories).filter(([value]) => !HIDDEN_CATEGORIES.includes(value)).map(([value, lbl]) => (
              <Link
                key={value}
                href={`/${lang}/journal/category/${value}`}
                style={{ fontSize: '12px', color: value === category ? 'var(--foreground)' : 'var(--muted)', textDecoration: 'none', borderBottom: value === category ? '1px solid var(--foreground)' : 'none', paddingBottom: '2px' }}
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
              <p style={{ fontSize: '16px', color: 'var(--muted)' }}>
                {j.noArticlesInCategory}
              </p>
              <Link href={`/${lang}/journal`} style={{ fontSize: '13px', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)', marginTop: '12px', display: 'inline-block' }}>
                {dict.common.allArticles}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px 40px' }}>
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
