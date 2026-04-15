'use client'

import { useState } from 'react'

interface InquiryPanelProps {
  development: {
    name: string
    slug: { current: string }
    primaryCta?: string
    location?: { name: string }
    priceDisplay?: string
  }
}

const CTA_OPTIONS = [
  'Request Brochure',
  'Register Interest',
  'Download Investment Pack',
  'Schedule Consultation',
  'Speak with an Advisor',
]

export default function InquiryPanel({ development }: InquiryPanelProps) {
  const [activeCta, setActiveCta] = useState(development.primaryCta || 'Register Interest')
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: activeCta,
          development: development.name,
          location: development.location?.name,
        }),
      })
      if (res.ok) {
        setFormState('success')
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    fontFamily: 'sans-serif',
    border: '1px solid var(--border)',
    background: 'var(--background)',
    color: 'var(--foreground)',
    display: 'block',
    marginBottom: '12px',
  }

  return (
    <div style={{ border: '1px solid var(--border)', padding: '28px' }}>
      <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
        {development.name}
      </div>

      {development.priceDisplay && (
        <div style={{ fontSize: '20px', fontWeight: 400, marginBottom: '20px' }}>
          {development.priceDisplay}
        </div>
      )}

      {/* CTA selector */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>
          I would like to:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {CTA_OPTIONS.map(cta => (
            <button
              key={cta}
              onClick={() => setActiveCta(cta)}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                fontSize: '13px',
                fontFamily: 'sans-serif',
                background: activeCta === cta ? 'var(--foreground)' : 'transparent',
                color: activeCta === cta ? 'var(--background)' : 'var(--muted)',
                border: `1px solid ${activeCta === cta ? 'var(--foreground)' : 'var(--border)'}`,
                cursor: 'pointer',
              }}
            >
              {cta}
            </button>
          ))}
        </div>
      </div>

      {formState === 'success' ? (
        <div style={{ padding: '20px', background: 'var(--surface)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontFamily: 'sans-serif', color: 'var(--foreground)', margin: '0 0 8px' }}>
            Thank you for your enquiry.
          </p>
          <p style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: 0 }}>
            We will be in touch within one business day.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Full name"
            required
            value={formData.name}
            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
          />
          <input
            style={inputStyle}
            type="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
          />
          <input
            style={inputStyle}
            type="tel"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
          />
          <textarea
            style={{ ...inputStyle, height: '80px', resize: 'vertical' as const }}
            placeholder="Message (optional)"
            value={formData.message}
            onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
          />

          {formState === 'error' && (
            <p style={{ fontSize: '13px', fontFamily: 'sans-serif', color: '#B91C1C', margin: '0 0 12px' }}>
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={formState === 'submitting'}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--foreground)',
              color: 'var(--background)',
              fontSize: '13px',
              fontFamily: 'sans-serif',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: formState === 'submitting' ? 'not-allowed' : 'pointer',
              opacity: formState === 'submitting' ? 0.7 : 1,
            }}
          >
            {formState === 'submitting' ? 'Sending…' : activeCta}
          </button>

          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: '12px 0 0', textAlign: 'center', lineHeight: 1.5 }}>
            Your enquiry goes to Portugal Developments Review. We will connect you with the relevant team.
          </p>
        </form>
      )}
    </div>
  )
}
