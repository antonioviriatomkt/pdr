import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--background)', marginTop: '80px' }}>
      {/* Brand statement row */}
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
            Curated new developments across Portugal.
          </p>
        </div>
      </div>
      <div className="container-editorial" style={{ padding: '48px 2rem 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Developments */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
              Developments
            </div>
            {[
              { href: '/developments', label: 'All Developments' },
              { href: '/locations/lisbon', label: 'Lisbon' },
              { href: '/locations/porto', label: 'Porto' },
              { href: '/locations/cascais', label: 'Cascais' },
              { href: '/locations/algarve', label: 'Algarve' },
              { href: '/locations/comporta', label: 'Comporta' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Journal */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
              Journal
            </div>
            {[
              { href: '/journal', label: 'All Articles' },
              { href: '/journal/category/area-guides', label: 'Area Guides' },
              { href: '/journal/category/investment', label: 'Investment' },
              { href: '/journal/category/architecture', label: 'Architecture' },
              { href: '/journal/category/branded-residences', label: 'Branded Residences' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Platform */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
              Platform
            </div>
            {[
              { href: '/methodology', label: 'Methodology' },
              { href: '/about', label: 'About' },
              { href: '/for-developers', label: 'For Developers' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'sans-serif' }}>
            © {year} Portugal Developments Review by Viriato. All rights reserved.
          </p>
          <p style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'sans-serif' }}>
            A curated platform for new developments across Portugal.
          </p>
        </div>
      </div>
    </footer>
  )
}
