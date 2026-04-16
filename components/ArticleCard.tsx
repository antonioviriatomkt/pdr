import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'
import { categoryLabels } from '@/lib/demo-data'

interface ArticleCardProps {
  article: {
    title: string
    slug: { current: string }
    category: string
    excerpt?: string
    publishedAt: string
    heroImage?: unknown
    linkedLocation?: { name: string; slug: { current: string } }
  }
  variant?: 'default' | 'compact'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const href = `/journal/article/${article.slug.current}`
  const label = categoryLabels[article.category] || article.category

  if (variant === 'compact') {
    return (
      <Link href={href} style={{ display: 'block', textDecoration: 'none' }}>
        <article style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', paddingBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
            {label} · {formatDate(article.publishedAt)}
          </div>
          <h4 style={{ fontSize: '16px', fontWeight: 400, margin: 0, lineHeight: 1.3 }}>{article.title}</h4>
        </article>
      </Link>
    )
  }

  return (
    <Link href={href} style={{ display: 'block', textDecoration: 'none' }}>
      <article>
        <div style={{ aspectRatio: '16/10', background: 'var(--surface)', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
          {article.heroImage ? (
            <Image
              src={urlFor(article.heroImage).width(600).height(375).auto('format').url()}
              alt={article.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'sans-serif', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {label}
              </span>
            </div>
          )}
        </div>

        <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
          {label}
          {article.linkedLocation && ` · ${article.linkedLocation.name}`}
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 400, margin: '0 0 10px 0', lineHeight: 1.3 }}>
          {article.title}
        </h3>

        {article.excerpt && (
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {article.excerpt}
          </p>
        )}

        <span style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)' }}>
          {formatDate(article.publishedAt)}
        </span>
      </article>
    </Link>
  )
}
