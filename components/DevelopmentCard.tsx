import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'

interface DevCardUi {
  priceOnRequest: string
  featured: string
  viewArrow: string
  statusLabels: Record<string, string>
  typeLabels: Record<string, string>
  priceLabels: Record<string, string>
  lifestyleTagLabels: Record<string, string>
}

interface DevelopmentCardProps {
  development: {
    name: string
    slug: { current: string }
    status: string
    type?: string
    priceDisplay?: string
    isFeatured?: boolean
    lifestyleTags?: string[]
    editorialThesis?: string
    primaryCta?: string
    location?: { name: string; slug: { current: string } }
    developer?: { name: string }
    heroImage?: unknown
  }
  variant?: 'default' | 'compact'
  lang: string
  ui: DevCardUi
}

export default function DevelopmentCard({ development, variant = 'default', lang, ui }: DevelopmentCardProps) {
  const href = `/${lang}/developments/${development.slug.current}`
  const status = ui.statusLabels[development.status] ?? development.status
  const type = development.type ? (ui.typeLabels[development.type] ?? development.type) : undefined
  const price = development.priceDisplay
    ? (ui.priceLabels[development.priceDisplay] ?? development.priceDisplay)
    : ui.priceOnRequest

  if (variant === 'compact') {
    return (
      <Link href={href} style={{ display: 'block', textDecoration: 'none' }}>
        <article style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                {development.location?.name} · {status}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 400, margin: 0 }}>{development.name}</h3>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--muted)' }}>{price}</div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={href} style={{ display: 'block', textDecoration: 'none' }}>
      <article>
        <div style={{ aspectRatio: '4/3', background: 'var(--surface)', marginBottom: '16px', overflow: 'hidden', position: 'relative' }}>
          {development.isFeatured && (
            <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--foreground)', color: 'var(--background)', fontSize: '10px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px', zIndex: 1 }}>
              {ui.featured}
            </div>
          )}
          {development.heroImage ? (
            <Image
              src={urlFor(development.heroImage).width(600).height(450).auto('format').url()}
              alt={development.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '12px', fontFamily: 'sans-serif', letterSpacing: '0.04em' }}>
              {development.location?.name}
            </div>
          )}
        </div>

        <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
          {development.location?.name} · {status}
          {type && ` · ${type}`}
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 8px 0', lineHeight: 1.2 }}>
          {development.name}
        </h3>

        {development.editorialThesis && (
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {development.editorialThesis}
          </p>
        )}

        <div style={{ borderTop: '1px solid var(--border)', marginTop: '14px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--muted)' }}>
            {price}
          </span>
          <span style={{ fontSize: '12px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', borderBottom: '1px solid var(--foreground)' }}>
            {ui.viewArrow}
          </span>
        </div>

        {development.lifestyleTags && development.lifestyleTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
            {development.lifestyleTags.slice(0, 3).map(tag => (
              <span key={tag} style={{ fontSize: '10px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', border: '1px solid var(--border)', padding: '3px 8px' }}>
                {ui.lifestyleTagLabels[tag] ?? tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  )
}
