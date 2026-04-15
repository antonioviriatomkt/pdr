import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { demoArticles, categoryLabels } from '@/lib/demo-data'

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const label = categoryLabels[category]
  if (!label) return {}
  return {
    title: `${label} — Journal`,
    description: `Editorial articles about ${label.toLowerCase()} covering new developments across Portugal.`,
  }
}

export async function generateStaticParams() {
  return Object.keys(categoryLabels).map(c => ({ category: c }))
}

export default async function JournalCategoryPage({ params }: PageProps) {
  const { category } = await params
  const label = categoryLabels[category]
  if (!label) notFound()

  const articles = demoArticles.filter(a => a.category === category)

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <Link href="/journal" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Journal</Link>
            <span>›</span>
            <span>{label}</span>
          </nav>
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            Category
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
            <Link href="/journal" style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', textDecoration: 'none' }}>
              All
            </Link>
            {Object.entries(categoryLabels).map(([value, lbl]) => (
              <Link
                key={value}
                href={`/journal/category/${value}`}
                style={{ fontSize: '12px', fontFamily: 'sans-serif', color: value === category ? 'var(--foreground)' : 'var(--muted)', textDecoration: 'none', borderBottom: value === category ? '1px solid var(--foreground)' : 'none', paddingBottom: '2px' }}
              >
                {lbl}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 0' }}>
        <div className="container-editorial">
          {articles.length === 0 ? (
            <div style={{ padding: '48px 0' }}>
              <p style={{ fontSize: '16px', color: 'var(--muted)', fontFamily: 'sans-serif' }}>
                No articles in this category yet.
              </p>
              <Link href="/journal" style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)', marginTop: '12px', display: 'inline-block' }}>
                Browse All Articles →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '48px 40px' }}>
              {articles.map(article => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
