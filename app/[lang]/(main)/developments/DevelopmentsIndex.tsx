'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import DevelopmentCard from '@/components/DevelopmentCard'
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
}

const TYPES = ['Apartments', 'Villas', 'Townhouses', 'Penthouse', 'Mixed-use', 'Branded Residences']
const STATUSES = ['Off-plan', 'Under Construction', 'Completed', 'Selling Now']

export default function DevelopmentsIndex({ developments, locations, lang, dict, devCardUi }: Props) {
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sort, setSort] = useState('featured')

  const filtered = useMemo(() => {
    let list = [...developments]
    if (locationFilter) list = list.filter(d => d.location.slug.current === locationFilter)
    if (typeFilter) list = list.filter(d => d.type === typeFilter)
    if (statusFilter) list = list.filter(d => d.status === statusFilter)
    if (sort === 'featured') list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    if (sort === 'newest') list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    return list
  }, [locationFilter, typeFilter, statusFilter, sort])

  const hasFilters = locationFilter || typeFilter || statusFilter
  const f = dict.filters
  const r = dict.results

  const selectStyle = { fontSize: '13px', border: '1px solid var(--border)', padding: '8px 12px', background: 'var(--background)', color: 'var(--foreground)', cursor: 'pointer', appearance: 'none' as const, minWidth: '160px' }

  const clearAll = () => { setLocationFilter(''); setTypeFilter(''); setStatusFilter('') }

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
          <div className="filter-bar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="filter-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={selectStyle}>
              <option value="">{f.allLocations}</option>
              {locations.map(loc => <option key={loc._id} value={loc.slug.current}>{loc.name}</option>)}
            </select>
            <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={selectStyle}>
              <option value="">{f.allTypes}</option>
              {TYPES.map(t => <option key={t} value={t}>{(dict.typeLabels as Record<string, string>)[t] ?? t}</option>)}
            </select>
            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
              <option value="">{f.allStatus}</option>
              {STATUSES.map(s => <option key={s} value={s}>{(dict.statusLabels as Record<string, string>)[s] ?? s}</option>)}
            </select>
            {hasFilters && (
              <button onClick={clearAll} style={{ fontSize: '12px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                {f.clearFilters}
              </button>
            )}
            <Link
              href={`/${lang}/journal/off-plan-vs-ready-portugal-property`}
              style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
            >
              {f.offPlanGuide}
            </Link>
            <div className="filter-sort" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{f.sort}</span>
              {[{ value: 'featured', label: f.sortFeatured }, { value: 'newest', label: f.sortNewest }].map(s => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  style={{ fontSize: '12px', color: sort === s.value ? 'var(--foreground)' : 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: sort === s.value ? 'underline' : 'none', padding: '4px 0' }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 0' }}>
        <div className="container-editorial">
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {filtered.length === 1 ? r.count_one.replace('{count}', '1') : r.count_other.replace('{count}', String(filtered.length))}
              {hasFilters ? r.matchingFilters : ''}
            </span>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', color: 'var(--muted)' }}>{r.noResults}</p>
              <button onClick={clearAll} style={{ fontSize: '13px', color: 'var(--foreground)', background: 'none', border: '1px solid var(--border)', cursor: 'pointer', padding: '10px 20px', marginTop: '16px' }}>
                {r.clearFiltersBtn}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '48px 40px' }}>
              {filtered.map(dev => (
                <DevelopmentCard key={dev._id} development={dev} lang={lang} ui={devCardUi} />
              ))}
            </div>
          )}
        </div>
      </section>
      <style>{`
        @media (max-width: 768px) {
          .filter-bar { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
          .filter-select { width: 100% !important; min-width: unset !important; }
          .filter-sort { margin-left: 0 !important; justify-content: flex-start !important; }
        }
      `}</style>
    </>
  )
}
