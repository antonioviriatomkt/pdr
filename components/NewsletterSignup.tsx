'use client'

import { useState } from 'react'
import type { Dictionary } from '@/lib/i18n/types'

interface NewsletterSignupProps {
  dict: Dictionary['newsletter']
}

export default function NewsletterSignup({ dict }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(data.error || dict.submitting)
      }
    } catch {
      setStatus('error')
      setErrorMessage(dict.submitting)
    }
  }

  if (status === 'success') {
    return (
      <div style={{ background: 'var(--surface)', padding: '20px 24px' }}>
        <p style={{ fontSize: '14px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
          {dict.successMessage}
        </p>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '12px' }}>
          <label
            htmlFor="newsletter-email"
            style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}
          >
            {dict.emailLabel}
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={dict.emailPlaceholder}
            required
            disabled={status === 'submitting'}
            autoComplete="email"
            style={{ width: '100%', padding: '11px 14px', fontSize: '14px', fontFamily: 'sans-serif', border: `1px solid ${focused ? 'var(--foreground)' : 'var(--border)'}`, background: 'var(--background)', color: 'var(--foreground)', borderRadius: '0', outline: 'none', boxSizing: 'border-box', opacity: status === 'submitting' ? 0.6 : 1 }}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{ width: '100%', background: 'var(--foreground)', color: 'var(--background)', padding: '13px 24px', fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: status === 'submitting' ? 'not-allowed' : 'pointer', opacity: status === 'submitting' ? 0.6 : 1 }}
        >
          {status === 'submitting' ? dict.submitting : dict.submitBtn}
        </button>
        {errorMessage && (
          <p style={{ fontSize: '13px', fontFamily: 'sans-serif', color: '#B91C1C', margin: '10px 0 0', lineHeight: 1.5 }}>
            {errorMessage}
          </p>
        )}
      </form>
      <p style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: '16px 0 0', lineHeight: 1.6, letterSpacing: '0.01em' }}>
        {dict.footnote}
      </p>
    </>
  )
}
