'use client'

import { useState } from 'react'
import type { Dictionary } from '@/lib/i18n/types'

interface ContactFormProps {
  dict: Dictionary['contactForm']
}

export default function ContactForm({ dict }: ContactFormProps) {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: dict.enquiryTypes[6] ?? 'General Question',
    development: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setFormState(res.ok ? 'success' : 'error')
    } catch {
      setFormState('error')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    fontSize: '14px',
        border: '1px solid var(--border)',
    background: 'var(--background)',
    color: 'var(--foreground)',
    display: 'block',
    marginBottom: '14px',
  }

  const labelStyle = {
    fontSize: '11px',
        letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--muted)',
    display: 'block',
    marginBottom: '6px',
  }

  if (formState === 'success') {
    return (
      <div style={{ padding: '48px', background: 'var(--surface)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 12px' }}>{dict.successHeading}</h2>
        <p style={{ fontSize: '15px', color: 'var(--muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
          {dict.successBody}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>{dict.fullName}</label>
        <input
          style={inputStyle}
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
          placeholder={dict.fullNamePlaceholder}
        />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>{dict.email}</label>
        <input
          style={inputStyle}
          type="email"
          required
          value={formData.email}
          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
          placeholder={dict.emailPlaceholder}
        />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>{dict.phone}</label>
        <input
          style={inputStyle}
          type="tel"
          value={formData.phone}
          onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
          placeholder={dict.phonePlaceholder}
        />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>{dict.enquiryType}</label>
        <select
          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
          required
          value={formData.enquiryType}
          onChange={e => setFormData(p => ({ ...p, enquiryType: e.target.value }))}
        >
          {dict.enquiryTypes.map((t: string) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>{dict.development}</label>
        <input
          style={inputStyle}
          type="text"
          value={formData.development}
          onChange={e => setFormData(p => ({ ...p, development: e.target.value }))}
          placeholder={dict.developmentPlaceholder}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>{dict.message}</label>
        <textarea
          style={{ ...inputStyle, height: '120px', resize: 'vertical' }}
          required
          value={formData.message}
          onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
          placeholder={dict.messagePlaceholder}
        />
      </div>

      {formState === 'error' && (
        <p style={{ fontSize: '14px', color: '#B91C1C', margin: '0 0 16px' }}>
          {dict.errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === 'submitting'}
        style={{
          width: '100%',
          padding: '16px',
          background: 'var(--foreground)',
          color: 'var(--background)',
          fontSize: '13px',
                    letterSpacing: '0.08em',
          textTransform: 'uppercase',
          border: 'none',
          cursor: formState === 'submitting' ? 'not-allowed' : 'pointer',
          opacity: formState === 'submitting' ? 0.6 : 1,
        }}
      >
        {formState === 'submitting' ? dict.submitting : dict.submit}
      </button>

      <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '12px 0 0', lineHeight: 1.5 }}>
        {dict.privacyNote}
      </p>
    </form>
  )
}
