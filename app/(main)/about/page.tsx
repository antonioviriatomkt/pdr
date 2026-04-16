import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — Portugal Developments Review by Viriato',
  description: 'About Portugal Developments Review — a curated editorial platform for discovering exceptional new developments across Portugal, by Viriato.',
}

export default function AboutPage() {
  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            Platform
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            About
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '560px', margin: 0 }}>
            What Portugal Developments Review is — and what it is not.
          </p>
        </div>
      </section>

      <div className="container-editorial">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', padding: '56px 0', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              The Platform
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              Portugal Developments Review is an independent editorial platform for discovering exceptional new residential developments across Portugal. It is not a brokerage, a portal, or a listings service. It is a curated selection — backed by a methodology, maintained by an editorial team, and presented to a specific audience.
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              The platform exists because the growth of Portugal&apos;s new development market has outpaced reliable discovery. There is more product, more marketing, and more noise — but not necessarily more clarity. Portugal Developments Review is designed to provide that clarity.
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              Every development on this platform has been reviewed through our editorial process. The quantity of developments is deliberately limited. The aim is not comprehensive coverage — it is reliable signal.
            </p>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '32px', paddingTop: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 400, margin: '0 0 16px' }}>
                For Buyers
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 12px' }}>
                The platform is free to use. There are no registration walls, no data harvesting, and no sponsored rankings. Every enquiry submitted through the platform goes through our team first.
              </p>
              <Link href="/contact" style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}>
                Contact Us →
              </Link>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              Viriato
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              Portugal Developments Review is published by Viriato — a real estate advisory firm operating across Portugal&apos;s premium property market. Viriato works with developers, investors, and private buyers on the acquisition, structuring, and management of significant property assets.
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              The platform gives Viriato&apos;s developer clients a premium editorial channel alongside their existing advisory relationship. It also gives serious buyers access to a curated, trustworthy view of Portugal&apos;s new development market.
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              The editorial standards of the platform are maintained independently of the commercial relationships. Inclusion on Portugal Developments Review requires meeting the same criteria regardless of whether a developer is a Viriato client.
            </p>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '32px', paddingTop: '32px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                Our Audiences
              </div>
              {[
                'Portuguese HNWI',
                'International investors buying in Portugal',
                'Diaspora buyers',
                'Affluent second-home buyers',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>—</span>
                  <span style={{ fontSize: '15px', color: 'var(--muted)' }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '24px', paddingTop: '24px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                Locations Covered
              </div>
              {['Lisbon', 'Porto', 'Gaia', 'Cascais', 'Algarve', 'Comporta'].map((loc, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>—</span>
                  <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{loc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
