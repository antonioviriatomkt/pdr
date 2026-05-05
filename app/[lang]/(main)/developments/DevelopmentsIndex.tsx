import Link from 'next/link'
import DevelopmentCard from '@/components/DevelopmentCard'
import Filters from './Filters'
import type { Dictionary } from '@/lib/i18n/types'

interface DevCardUi {
  priceOnRequest: string
  featured: string
  viewArrow: string
  statusLabels: Record<string, string>
  typeLabels: Record<string, string>
  priceLabels: Record<string, string>
  lifestyleTagLabels: Record<string, string>
}

interface Props {
  developments: any[]
  locations: { _id: string; name: string; slug: { current: string } }[]
  lang: string
  dict: Dictionary['developments']
  devCardUi: DevCardUi
  hasFilters: boolean
}

export default function DevelopmentsIndex({ developments, locations, lang, dict, devCardUi, hasFilters }: Props) {
  const r = dict.results

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '48px 0 40px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px' }}>
            {dict.eyebrow}
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 400, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            {dict.heading}
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', margin: 0, maxWidth: '520px', lineHeight: 1.6 }}>
            {dict.subheading}
          </p>
        </div>
      </section>

      <section style={{ borderBottom: '1px solid var(--border)', padding: '16px 0', background: 'var(--surface)', position: 'sticky', top: '64px', zIndex: 10 }}>
        <div className="container-editorial">
          <Filters locations={locations} lang={lang} dict={dict} />
        </div>
      </section>

      <section style={{ padding: '48px 0' }}>
        <div className="container-editorial">
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {developments.length === 1 ? r.count_one.replace('{count}', '1') : r.count_other.replace('{count}', String(developments.length))}
              {hasFilters ? r.matchingFilters : ''}
            </span>
          </div>
          {developments.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', color: 'var(--muted)' }}>{r.noResults}</p>
              <Link
                href={`/${lang}/developments`}
                style={{ display: 'inline-block', fontSize: '13px', color: 'var(--foreground)', textDecoration: 'none', border: '1px solid var(--border)', padding: '10px 20px', marginTop: '16px' }}
              >
                {r.clearFiltersBtn}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px 40px' }}>
              {developments.map(dev => (
                <DevelopmentCard key={dev._id} development={dev} lang={lang} ui={devCardUi} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
