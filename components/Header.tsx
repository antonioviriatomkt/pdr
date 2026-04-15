'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
      <div className="container-editorial">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div>
              <span style={{ fontSize: '13px', fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--foreground)' }}>
                Portugal Developments Review
              </span>
              <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '6px', fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif', letterSpacing: '0.04em' }}>
                by Viriato
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
            {[
              { href: '/developments', label: 'Developments' },
              { href: '/locations/lisbon', label: 'Locations' },
              { href: '/journal', label: 'Journal' },
              { href: '/methodology', label: 'Methodology' },
              { href: '/about', label: 'About' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: '13px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
                  color: 'var(--muted)',
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              style={{
                fontSize: '12px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--background)',
                background: 'var(--foreground)',
                padding: '8px 16px',
                textDecoration: 'none',
              }}
            >
              Enquire
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none' }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            <span style={{ display: 'block', width: '20px', height: '1px', background: 'var(--foreground)', marginBottom: '5px' }} />
            <span style={{ display: 'block', width: '20px', height: '1px', background: 'var(--foreground)', marginBottom: '5px' }} />
            <span style={{ display: 'block', width: '20px', height: '1px', background: 'var(--foreground)' }} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--background)', padding: '16px 0' }}>
          <div className="container-editorial">
            {[
              { href: '/developments', label: 'Developments' },
              { href: '/locations/lisbon', label: 'Locations' },
              { href: '/journal', label: 'Journal' },
              { href: '/methodology', label: 'Methodology' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Enquire' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 0',
                  fontSize: '14px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
                  color: 'var(--foreground)',
                  borderBottom: '1px solid var(--border)',
                  textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  )
}
