'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { Dictionary } from '@/lib/i18n/types'

interface HeaderProps {
  lang: string
  nav: Dictionary['nav']
}

export default function Header({ lang, nav }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const otherLang = lang === 'en' ? 'pt' : 'en'
  const otherLangPath = pathname.replace(`/${lang}`, `/${otherLang}`)

  const navLinks = [
    { href: `/${lang}/developments`, label: nav.developments },
    { href: `/${lang}/locations`, label: nav.locations },
    { href: `/${lang}/developers`, label: nav.developers },
    { href: `/${lang}/journal`, label: nav.journal },
    { href: `/${lang}/methodology`, label: nav.methodology },
    { href: `/${lang}/about`, label: nav.about },
  ]

  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
      <div className="container-editorial">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href={`/${lang}`} style={{ textDecoration: 'none' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--foreground)' }}>
                Portugal Developments Review
              </span>
              <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '6px', letterSpacing: '0.04em' }}>
                by Viriato
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ fontSize: '13px', color: 'var(--muted)', letterSpacing: '0.02em', textDecoration: 'none' }}
              >
                {label}
              </Link>
            ))}
            <Link
              href={`/${lang}/contact`}
              style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--background)', background: 'var(--foreground)', padding: '8px 16px', textDecoration: 'none' }}
            >
              {nav.enquire}
            </Link>

            {/* Language switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--foreground)', fontWeight: 500 }}>
                {lang.toUpperCase()}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--border)', userSelect: 'none' }}>·</span>
              <Link
                href={otherLangPath}
                style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}
              >
                {otherLang.toUpperCase()}
              </Link>
            </div>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none' }}
            className="mobile-toggle"
            aria-label={nav.toggleMenu}
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
            {[...navLinks, { href: `/${lang}/contact`, label: nav.enquire }].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '12px 0', fontSize: '14px', color: 'var(--foreground)', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}
              >
                {label}
              </Link>
            ))}
            {/* Mobile language switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px' }}>
              <span style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--foreground)', fontWeight: 500 }}>
                {lang.toUpperCase()}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--border)', userSelect: 'none' }}>·</span>
              <Link
                href={otherLangPath}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}
              >
                {otherLang.toUpperCase()}
              </Link>
            </div>
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
