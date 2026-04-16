'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
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
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ background: 'var(--surface)', padding: '20px 24px' }}>
        <p style={{ fontSize: '14px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
          You are on the shortlist. The next edition will reach you directly.
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
            style={{
              fontSize: '11px',
              fontFamily: 'sans-serif',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="your@email.com"
            required
            disabled={status === 'submitting'}
            autoComplete="email"
            style={{
              width: '100%',
              padding: '11px 14px',
              fontSize: '14px',
              fontFamily: 'sans-serif',
              border: `1px solid ${focused ? 'var(--foreground)' : 'var(--border)'}`,
              background: 'var(--background)',
              color: 'var(--foreground)',
              borderRadius: '0',
              outline: 'none',
              boxSizing: 'border-box',
              opacity: status === 'submitting' ? 0.6 : 1,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            width: '100%',
            background: 'var(--foreground)',
            color: 'var(--background)',
            padding: '13px 24px',
            fontSize: '13px',
            fontFamily: 'sans-serif',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            border: 'none',
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            opacity: status === 'submitting' ? 0.6 : 1,
          }}
        >
          {status === 'submitting' ? 'Sending…' : 'Receive the Shortlist'}
        </button>

        {errorMessage && (
          <p
            style={{
              fontSize: '13px',
              fontFamily: 'sans-serif',
              color: '#B91C1C',
              margin: '10px 0 0',
              lineHeight: 1.5,
            }}
          >
            {errorMessage}
          </p>
        )}
      </form>

      <p
        style={{
          fontSize: '13px',
          fontFamily: 'sans-serif',
          color: 'var(--muted)',
          margin: '16px 0 0',
          lineHeight: 1.6,
          letterSpacing: '0.01em',
        }}
      >
        One edition per month. Curated selections, early release alerts, and selected brochures.
      </p>
    </>
  )
}
