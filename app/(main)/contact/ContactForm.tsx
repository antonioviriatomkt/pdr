'use client'

import { useState } from 'react'

const ENQUIRY_TYPES = [
  'Register Interest in a Development',
  'Request Brochure',
  'Download Investment Pack',
  'Schedule Consultation',
  'Speak with an Advisor',
  'Developer Enquiry',
  'General Question',
]

export default function ContactForm() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'General Question',
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
    padding: '11px 14px',
    fontSize: '14px',
    fontFamily: 'sans-serif',
    border: '1px solid var(--border)',
    background: 'var(--background)',
    color: 'var(--foreground)',
    display: 'block',
    marginBottom: '14px',
  }

  const labelStyle = {
    fontSize: '11px',
    fontFamily: 'sans-serif',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--muted)',
    display: 'block',
    marginBottom: '6px',
  }

  if (formState === 'success') {
    return (
      <div style={{ padding: '48px', background: 'var(--surface)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 12px' }}>Thank you.</h2>
        <p style={{ fontSize: '15px', color: 'var(--muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
          We have received your enquiry and will respond within one business day.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Full Name *</label>
        <input
          style={inputStyle}
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
          placeholder="Your full name"
        />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Email Address *</label>
        <input
          style={inputStyle}
          type="email"
          required
          value={formData.email}
          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
          placeholder="your@email.com"
        />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Phone</label>
        <input
          style={inputStyle}
          type="tel"
          value={formData.phone}
          onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
          placeholder="+351 or international"
        />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Enquiry Type *</label>
        <select
          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
          required
          value={formData.enquiryType}
          onChange={e => setFormData(p => ({ ...p, enquiryType: e.target.value }))}
        >
          {ENQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Development (if applicable)</label>
        <input
          style={inputStyle}
          type="text"
          value={formData.development}
          onChange={e => setFormData(p => ({ ...p, development: e.target.value }))}
          placeholder="Name of the development you are interested in"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Message *</label>
        <textarea
          style={{ ...inputStyle, height: '120px', resize: 'vertical' }}
          required
          value={formData.message}
          onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
          placeholder="Tell us what you are looking for..."
        />
      </div>

      {formState === 'error' && (
        <p style={{ fontSize: '14px', fontFamily: 'sans-serif', color: '#B91C1C', margin: '0 0 16px' }}>
          Something went wrong. Please try again or contact us directly.
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
          fontFamily: 'sans-serif',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          border: 'none',
          cursor: formState === 'submitting' ? 'not-allowed' : 'pointer',
          opacity: formState === 'submitting' ? 0.6 : 1,
        }}
      >
        {formState === 'submitting' ? 'Sending…' : 'Send Enquiry'}
      </button>

      <p style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: '12px 0 0', lineHeight: 1.5 }}>
        We do not pass your details to third parties without your prior consent. You will receive a response from our team within one business day.
      </p>
    </form>
  )
}
