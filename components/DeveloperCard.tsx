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
      style={{ display: 'block', border: '1px solid var(--border)', padding: '24px', textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
        <div style={{ fontSize: '16px', fontWeight: 400, color: 'var(--foreground)', lineHeight: 1.3 }}>{developer.name}</div>
        {developer.isViriatoClient && (
          <span style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', border: '1px solid var(--border)', padding: '3px 8px', flexShrink: 0 }}>
            {viriatoLabel}
          </span>
        )}
      </div>
      {developer.headquartersCity && (
        <div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.04em', marginBottom: '12px' }}>
          {developer.headquartersCity}
        </div>
      )}
      {developer.shortDescription && (
        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 16px' }}>
          {developer.shortDescription}
        </p>
      )}
      {typeof developer.developmentCount === 'number' && (
        <div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.04em', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          {developmentsCountLabel ?? `${developer.developmentCount} development${developer.developmentCount !== 1 ? 's' : ''}`}
        </div>
      )}
    </Link>
  )
}
