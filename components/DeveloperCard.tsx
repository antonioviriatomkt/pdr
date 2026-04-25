import Link from 'next/link'

interface DeveloperCardProps {
  developer: {
    _id: string
    name: string
    slug: { current: string }
    headquartersCity?: string | null
    shortDescription?: string | null
    isViriatoClient?: boolean
    developmentCount?: number
  }
  lang: string
  variant?: 'default' | 'compact'
  viriatoLabel?: string
  developmentsCountLabel?: string
}

export default function DeveloperCard({
  developer,
  lang,
  variant = 'default',
  viriatoLabel = 'Viriato client',
  developmentsCountLabel,
}: DeveloperCardProps) {
  const href = `/${lang}/developers/${developer.slug.current}`

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '24px', padding: '14px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'inherit' }}
      >
        <div>
          <span style={{ fontSize: '15px', fontWeight: 400, color: 'var(--foreground)' }}>{developer.name}</span>
          {developer.headquartersCity && (
            <span style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '12px' }}>{developer.headquartersCity}</span>
          )}
        </div>
        {developer.isViriatoClient && (
          <span style={{ fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', flexShrink: 0 }}>
            {viriatoLabel}
          </span>
        )}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      style={{ display: 'block', borderBottom: '1px solid var(--border)', padding: '24px 0', textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '24px', marginBottom: developer.shortDescription ? '8px' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '18px', fontWeight: 400, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>{developer.name}</span>
          {developer.isViriatoClient && (
            <span style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              {viriatoLabel}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '32px', flexShrink: 0 }}>
          {developer.headquartersCity && (
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{developer.headquartersCity}</span>
          )}
          {developmentsCountLabel && (
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: 'sans-serif', letterSpacing: '0.04em' }}>{developmentsCountLabel}</span>
          )}
        </div>
      </div>
      {developer.shortDescription && (
        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)', margin: 0, maxWidth: '600px' }}>
          {developer.shortDescription}
        </p>
      )}
    </Link>
  )
}
