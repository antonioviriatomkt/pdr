import Link from 'next/link'
import type { Dictionary } from '@/lib/i18n/types'

interface FooterProps {
  lang: string
  footer: Dictionary['footer']
}

export default function Footer({ lang, footer }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--background)', marginTop: '80px' }}>
      <div className="container-editorial">
        <div style={{ padding: '40px 0 36px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--foreground)' }}>
              Portugal Developments Review
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'sans-serif', letterSpacing: '0.04em' }}>
              by Viriato
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: 'sans-serif', margin: 0 }}>
            {footer.tagline}
          </p>
        </div>
      </div>

      <div className="container-editorial" style={{ padding: '48px 2rem 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Developments */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
              {footer.sections.developments}
            </div>
            {[
              { href: `/${lang}/developments`, label: footer.links.allDevelopments },
              { href: `/${lang}/locations/lisbon`, label: 'Lisbon' },
              { href: `/${lang}/locations/porto`, label: 'Porto' },
              { href: `/${lang}/locations/cascais`, label: 'Cascais' },
              { href: `/${lang}/locations/algarve`, label: 'Algarve' },
              { href: `/${lang}/locations/comporta`, label: 'Comporta' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Journal */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
              {footer.sections.journal}
            </div>
            {[
              { href: `/${lang}/journal`, label: footer.links.allArticles },
              { href: `/${lang}/journal/category/area-guides`, label: footer.links.areaGuides },
              { href: `/${lang}/journal/category/investment`, label: footer.links.investment },
              { href: `/${lang}/journal/category/architecture`, label: footer.links.architecture },
              { href: `/${lang}/journal/category/branded-residences`, label: footer.links.brandedResidences },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Lifestyle */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
              {footer.sections.lifestyle}
            </div>
            {[
              { href: `/${lang}/lifestyle/golf`, label: footer.links.lifestyleGolf },
              { href: `/${lang}/lifestyle/beachfront`, label: footer.links.lifestyleBeachfront },
              { href: `/${lang}/lifestyle/investment-grade`, label: footer.links.lifestyleInvestmentGrade },
              { href: `/${lang}/lifestyle/city-centre`, label: footer.links.lifestyleCityCentre },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Platform */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
              {footer.sections.platform}
            </div>
            {[
              { href: `/${lang}/developers`, label: footer.links.developers },
              { href: `/${lang}/methodology`, label: footer.links.methodology },
              { href: `/${lang}/about`, label: footer.links.about },
              { href: `/${lang}/for-developers`, label: footer.links.forDevelopers },
              { href: `/${lang}/contact`, label: footer.links.contact },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'sans-serif' }}>
            {footer.copyright.replace('{year}', String(year))}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'sans-serif' }}>
            {footer.platformTagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
