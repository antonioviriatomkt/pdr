'use client'

import { useState, useMemo } from 'react'
import DevelopmentCard from '@/components/DevelopmentCard'

const TYPES = ['Apartments', 'Villas', 'Townhouses', 'Penthouse', 'Mixed-use', 'Branded Residences']
const STATUSES = ['Off-plan', 'Under Construction', 'Completed', 'Selling Now']
const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
]

interface Props {
  developments: any[]
  locations: { _id: string; name: string; slug: { current: string } }[]
}

export default function DevelopmentsIndex({ developments, locations }: Props) {
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

  const selectStyle = {
    fontSize: '13px',
    fontFamily: 'sans-serif',
    border: '1px solid var(--border)',
    padding: '8px 12px',
    background: 'var(--background)',
    color: 'var(--foreground)',
    cursor: 'pointer',
    appearance: 'none' as const,
    minWidth: '160px',
  }

  return (
    <>
      {/* Header */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '48px 0 40px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px' }}>
            Curated Selection
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 400, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            New Developments in Portugal
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', margin: 0, maxWidth: '520px', lineHeight: 1.6 }}>
            Every project on this platform has been assessed through our editorial selection process. Quantity is not the aim.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '16px 0', background: 'var(--surface)', position: 'sticky', top: '64px', zIndex: 10 }}>
        <div className="container-editorial">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={selectStyle}>
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc._id} value={loc.slug.current}>{loc.name}</option>
              ))}
            </select>

            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={selectStyle}>
              <option value="">All Types</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {hasFilters && (
              <button
                onClick={() => { setLocationFilter(''); setTypeFilter(''); setStatusFilter('') }}
                style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear filters
              </button>
            )}

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)' }}>Sort:</span>
              {SORTS.map(s => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  style={{
                    fontSize: '12px',
                    fontFamily: 'sans-serif',
                    color: sort === s.value ? 'var(--foreground)' : 'var(--muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: sort === s.value ? 'underline' : 'none',
                    padding: '4px 0',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section style={{ padding: '48px 0' }}>
        <div className="container-editorial">
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--muted)' }}>
              {filtered.length} development{filtered.length !== 1 ? 's' : ''}
              {hasFilters ? ' matching your filters' : ''}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', color: 'var(--muted)', fontFamily: 'sans-serif' }}>
                No developments match your current filters.
              </p>
              <button
                onClick={() => { setLocationFilter(''); setTypeFilter(''); setStatusFilter('') }}
                style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--foreground)', background: 'none', border: '1px solid var(--border)', cursor: 'pointer', padding: '10px 20px', marginTop: '16px' }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '48px 40px' }}>
              {filtered.map(dev => (
                <DevelopmentCard key={dev._id} development={dev} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
