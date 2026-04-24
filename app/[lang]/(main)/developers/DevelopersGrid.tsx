'use client'

import { useState } from 'react'
import DeveloperCard from '@/components/DeveloperCard'

interface Developer {
  _id: string
  name: string
  slug: { current: string }
  headquartersCity?: string | null
  shortDescription?: string | null
  isViriatoClient?: boolean
  developmentCount?: number
}

interface DevelopersGridProps {
  developers: Developer[]
  lang: string
  labels: {
    allFilter: string
    viriatoFilter: string
    noDevelopers: string
    viriatoLabel: string
    developmentsCount_one: string
    developmentsCount_other: string
  }
}

export default function DevelopersGrid({ developers, lang, labels }: DevelopersGridProps) {
  const [filter, setFilter] = useState<'all' | 'viriato'>('all')

  const filtered = filter === 'viriato'
    ? developers.filter(d => d.isViriatoClient)
    : developers

  const filterBtnStyle = (active: boolean) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
        letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: active ? 'var(--foreground)' : 'var(--muted)',
    borderBottom: active ? '1px solid var(--foreground)' : '1px solid transparent',
    padding: '2px 0',
  })

  function devCountLabel(count: number) {
    const tpl = count === 1 ? labels.developmentsCount_one : labels.developmentsCount_other
    return tpl.replace('{count}', String(count))
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
        <button style={filterBtnStyle(filter === 'all')} onClick={() => setFilter('all')}>
          {labels.allFilter}
        </button>
        <button style={filterBtnStyle(filter === 'viriato')} onClick={() => setFilter('viriato')}>
          {labels.viriatoFilter}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontSize: '15px', color: 'var(--muted)' }}>{labels.noDevelopers}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', background: 'var(--border)' }}>
          {filtered.map(dev => (
            <DeveloperCard
              key={dev._id}
              developer={dev}
              lang={lang}
              variant="default"
              viriatoLabel={labels.viriatoLabel}
              developmentsCountLabel={typeof dev.developmentCount === 'number' ? devCountLabel(dev.developmentCount) : undefined}
            />
          ))}
        </div>
      )}
    </>
  )
}
