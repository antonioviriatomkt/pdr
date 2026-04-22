import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates } from '@/lib/i18n/metadata'
import { JsonLd } from '@/components/JsonLd'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Methodology — How We Curate New Developments',
  description: 'Our editorial curation process for selecting new developments in Portugal. Why curation matters, selection criteria, and how developers can be considered.',
  alternates: getAlternates('/methodology'),
}

export default async function MethodologyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const m = dict.methodology

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: m.faq.map((item: { q: string; a: string }) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <JsonLd data={faqSchema} />
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {m.eyebrow}
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {m.heading}
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '560px', margin: 0 }}>
            {m.subheading}
          </p>
        </div>
      </section>

      <div className="container-editorial">
        <div style={{ maxWidth: '680px', padding: '56px 0' }}>

          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              {m.whyCurationHeading}
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              {m.whyCuration1}
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              {m.whyCuration2}
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              {m.whyCuration3}
            </p>
          </section>

          <hr style={{ margin: '0 0 56px' }} />

          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              {m.criteriaHeading}
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 24px' }}>
              {m.criteriaIntro}
            </p>

            {m.criteria.map((item: { title: string; body: string }, i: number) => (
              <div key={i} style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', paddingBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 400, margin: '0 0 12px' }}>{item.title}</h3>
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </section>

          <hr style={{ margin: '0 0 56px' }} />

          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              {m.limitsHeading}
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              {m.limitsIntro}
            </p>
            <ul style={{ margin: '0 0 16px', paddingLeft: '0', listStyle: 'none' }}>
              {m.limits.map((item: string, i: number) => (
                <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'start' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>—</span>
                  <span style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <hr style={{ margin: '0 0 56px' }} />

          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              {m.reviewHeading}
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              {m.review1}
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              {m.review2}
            </p>
          </section>

          <hr style={{ margin: '0 0 56px' }} />

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              {m.considerationHeading}
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              {m.consideration1}
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 24px' }}>
              {m.consideration2}
            </p>
            <Link
              href={`/${lang}/for-developers`}
              style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}
            >
              {m.forDevelopersLink}
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}
