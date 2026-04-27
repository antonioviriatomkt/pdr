import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'

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
  lang: string
  categories: Record<string, string>
}

function formatDate(date: string, lang: string) {
  const locale = lang === 'pt' ? 'pt-PT' : 'en-GB'
  return new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ArticleCard({ article, variant = 'default', lang, categories }: ArticleCardProps) {
  const href = `/${lang}/journal/${article.slug.current}`
  const label = categories[article.category] || article.category

  if (variant === 'compact') {
    return (
      <Link href={href} style={{ display: 'block', textDecoration: 'none' }}>
        <article style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', paddingBottom: '16px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
            {label} · {formatDate(article.publishedAt, lang)}
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
              src={urlFor(article.heroImage).width(800).height(500).auto('format').url()}
              alt={article.title}
              fill
              quality={85}
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {label}
              </span>
            </div>
          )}
        </div>

        <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
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

        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
          {formatDate(article.publishedAt, lang)}
        </span>
      </article>
    </Link>
  )
}
