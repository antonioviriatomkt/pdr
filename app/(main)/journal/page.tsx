import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { demoArticles, categoryLabels } from '@/lib/demo-data'

export const metadata: Metadata = {
  title: 'Journal — Insights on New Developments in Portugal',
  description: 'Editorial insights on new developments, area guides, investment explainers, architecture, and branded residences across Portugal.',
}

const CATEGORIES = Object.entries(categoryLabels)

export default function JournalPage() {
  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            Insights
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Journal
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', maxWidth: '480px', lineHeight: 1.6, margin: 0 }}>
            Editorial analysis, area guides, investment explainers, and architecture reviews — all connecting back into the developments and locations on this platform.
          </p>
        </div>
      </section>

      {/* Category nav */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '16px 0', background: 'var(--surface)' }}>
        <div className="container-editorial">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/journal" style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)', paddingBottom: '2px' }}>
              All
            </Link>
            {CATEGORIES.map(([value, label]) => (
              <Link
                key={value}
                href={`/journal/category/${value}`}
                style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', textDecoration: 'none' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section style={{ padding: '56px 0' }}>
        <div className="container-editorial">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '48px 40px' }}>
            {demoArticles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
