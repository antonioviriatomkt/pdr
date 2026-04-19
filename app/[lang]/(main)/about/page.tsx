import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates } from '@/lib/i18n/metadata'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About — Portugal Developments Review by Viriato',
  description: 'About Portugal Developments Review — a curated editorial platform for discovering exceptional new developments across Portugal, by Viriato.',
  alternates: getAlternates('/about'),
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const a = dict.about

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {a.eyebrow}
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {a.heading}
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '560px', margin: 0 }}>
            {a.subheading}
          </p>
        </div>
      </section>

      <div className="container-editorial">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', padding: '56px 0', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              {a.platformHeading}
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              {a.platform1}
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              {a.platform2}
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              {a.platform3}
            </p>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '32px', paddingTop: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 400, margin: '0 0 16px' }}>
                {a.forBuyersHeading}
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 12px' }}>
                {a.forBuyers1}
              </p>
              <Link href={`/${lang}/contact`} style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}>
                {dict.common.contactUs}
              </Link>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              {a.viriatoHeading}
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              {a.viriato1}
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              {a.viriato2}
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              {a.viriato3}
            </p>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '32px', paddingTop: '32px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                {a.audiencesHeading}
              </div>
              {a.audiences.map((item: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>—</span>
                  <span style={{ fontSize: '15px', color: 'var(--muted)' }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '24px', paddingTop: '24px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                {a.locationsCoveredHeading}
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
