'use client'

import { useState } from 'react'
import type { Dictionary } from '@/lib/i18n/types'

interface InquiryPanelProps {
  development: {
    name: string
    slug: { current: string }
    primaryCta?: string
    location?: { name: string }
    priceDisplay?: string
  }
  dict: Dictionary['inquiry']
}

export default function InquiryPanel({ development, dict }: InquiryPanelProps) {
  const [activeCta, setActiveCta] = useState(dict.ctaOptions[1]) // "Register Interest" / "Registar Interesse"
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: activeCta, development: development.name, location: development.location?.name }),
      })
      setFormState(res.ok ? 'success' : 'error')
    } catch {
      setFormState('error')
    }
  }

  const inputStyle = { width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', display: 'block', marginBottom: '12px' }

  return (
    <div style={{ border: '1px solid var(--border)', padding: '28px' }}>
      <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
        {development.name}
      </div>
      {development.priceDisplay && (
        <div style={{ fontSize: '20px', fontWeight: 400, marginBottom: '20px' }}>{development.priceDisplay}</div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>
          {dict.iWouldLikeTo}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {dict.ctaOptions.map(cta => (
            <button
              key={cta}
              onClick={() => setActiveCta(cta)}
              style={{ textAlign: 'left', padding: '8px 12px', fontSize: '13px', background: activeCta === cta ? 'var(--foreground)' : 'transparent', color: activeCta === cta ? 'var(--background)' : 'var(--muted)', border: `1px solid ${activeCta === cta ? 'var(--foreground)' : 'var(--border)'}`, cursor: 'pointer' }}
            >
              {cta}
            </button>
          ))}
        </div>
      </div>

      {formState === 'success' ? (
        <div style={{ padding: '20px', background: 'var(--surface)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--foreground)', margin: '0 0 8px' }}>{dict.successHeading}</p>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>{dict.successBody}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input style={inputStyle} type="text" placeholder={dict.fullNamePlaceholder} required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
          <input style={inputStyle} type="email" placeholder={dict.emailPlaceholder} required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
          <input style={inputStyle} type="tel" placeholder={dict.phonePlaceholder} value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' as const }} placeholder={dict.messagePlaceholder} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} />
          {formState === 'error' && (
            <p style={{ fontSize: '13px', color: '#B91C1C', margin: '0 0 12px' }}>{dict.errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={formState === 'submitting'}
            style={{ width: '100%', padding: '14px', background: 'var(--foreground)', color: 'var(--background)', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', border: 'none', cursor: formState === 'submitting' ? 'not-allowed' : 'pointer', opacity: formState === 'submitting' ? 0.7 : 1 }}
          >
            {formState === 'submitting' ? '…' : activeCta}
          </button>
          <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '12px 0 0', textAlign: 'center', lineHeight: 1.5 }}>
            {dict.privacyNote}
          </p>
        </form>
      )}
    </div>
  )
}
