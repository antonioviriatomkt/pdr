'use client'

import { useState } from 'react'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    try {
      const res = await fetch('/api/coming-soon-signup', {
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      {/* Top rule */}
      <div style={{ height: '3px', background: 'var(--foreground)' }} />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>

          {/* Eyebrow */}
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 28px' }}>
            Portugal · New Developments
          </p>

          {/* Site name */}
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--foreground)', margin: '0 0 8px' }}>
            Portugal Developments Review
          </h1>
          <p style={{ fontSize: '14px', letterSpacing: '0.04em', color: 'var(--muted)', margin: '0 0 32px' }}>
            by Viriato
          </p>

          {/* Divider */}
          <div style={{ width: '40px', height: '1px', background: 'var(--border)', margin: '0 0 32px' }} />

          {/* Coming soon headline */}
          <h2 style={{ fontSize: 'clamp(13px, 2vw, 15px)', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--foreground)', margin: '0 0 20px' }}>
            Coming Soon
          </h2>

          {/* Description */}
          <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.75, margin: '0 0 48px', maxWidth: '460px' }}>
            An independent editorial platform curating exceptional new residential developments across Portugal — Lisbon, Porto, Cascais, the Algarve, and Comporta.
          </p>

          {/* Email form */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 20px' }}>
              Get an alert when the website is live
            </p>

            {status === 'success' ? (
              <div style={{ padding: '20px 24px', background: 'var(--surface)', borderLeft: '2px solid var(--foreground)' }}>
                <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
                  You&apos;re on the list. We&apos;ll notify you the moment we launch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', gap: '0' }}>
                  <input
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
                      flex: 1,
                      padding: '13px 16px',
                      fontSize: '14px',
                                            border: `1px solid ${focused ? 'var(--foreground)' : 'var(--border)'}`,
                      borderRight: 'none',
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      outline: 'none',
                      opacity: status === 'submitting' ? 0.6 : 1,
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    style={{
                      padding: '13px 24px',
                      fontSize: '11px',
                                            letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: 'var(--foreground)',
                      color: 'var(--background)',
                      border: '1px solid var(--foreground)',
                      cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                      opacity: status === 'submitting' ? 0.6 : 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {status === 'submitting' ? 'Sending…' : 'Notify me'}
                  </button>
                </div>
                {errorMessage && (
                  <p style={{ fontSize: '13px', color: '#B91C1C', margin: '10px 0 0', lineHeight: 1.5 }}>
                    {errorMessage}
                  </p>
                )}
              </form>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.06em', color: 'var(--muted)', margin: 0 }}>
          © {new Date().getFullYear()} Portugal Developments Review by Viriato
        </p>
      </footer>
    </div>
  )
}
