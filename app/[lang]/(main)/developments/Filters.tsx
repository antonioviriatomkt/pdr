'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { Dictionary } from '@/lib/i18n/types'

interface Props {
  locations: { _id: string; name: string; slug: { current: string } }[]
  lang: string
  dict: Dictionary['developments']
}

const TYPES = ['Apartments', 'Villas', 'Townhouses', 'Penthouse', 'Mixed-use', 'Branded Residences']
const STATUSES = ['Off-plan', 'Under Construction', 'Completed', 'Selling Now']

export default function Filters({ locations, lang, dict }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const locationFilter = searchParams.get('location') ?? ''
  const typeFilter = searchParams.get('type') ?? ''
  const statusFilter = searchParams.get('status') ?? ''
  const sort = searchParams.get('sort') ?? 'featured'
  const hasFilters = !!(locationFilter || typeFilter || statusFilter)

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('location')
    params.delete('type')
    params.delete('status')
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const f = dict.filters
  const selectStyle = { fontSize: '13px', border: '1px solid var(--border)', padding: '8px 12px', background: 'var(--background)', color: 'var(--foreground)', cursor: 'pointer', appearance: 'none' as const, minWidth: '160px' }

  return (
    <div className="filter-bar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <select className="filter-select" value={locationFilter} onChange={e => setParam('location', e.target.value)} style={selectStyle}>
        <option value="">{f.allLocations}</option>
        {locations.map(loc => <option key={loc._id} value={loc.slug.current}>{loc.name}</option>)}
      </select>
      <select className="filter-select" value={typeFilter} onChange={e => setParam('type', e.target.value)} style={selectStyle}>
        <option value="">{f.allTypes}</option>
        {TYPES.map(t => <option key={t} value={t}>{(dict.typeLabels as Record<string, string>)[t] ?? t}</option>)}
      </select>
      <select className="filter-select" value={statusFilter} onChange={e => setParam('status', e.target.value)} style={selectStyle}>
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
            onClick={() => setParam('sort', s.value === 'featured' ? '' : s.value)}
            style={{ fontSize: '12px', color: sort === s.value ? 'var(--foreground)' : 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: sort === s.value ? 'underline' : 'none', padding: '4px 0' }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
