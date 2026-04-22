import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'
import { JsonLd } from '@/components/JsonLd'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(hasLocale(lang) ? lang : 'en')
  return {
    title: dict.seo.forDevelopers.title,
    description: dict.seo.forDevelopers.description,
    alternates: getAlternates('/for-developers', lang),
    openGraph: { type: 'website', ...getOgLocale(lang) },
  }
}

export default async function ForDevelopersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const fd = dict.forDevelopers

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: fd.faq.map((item: { q: string; a: string }) => ({
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
            {fd.eyebrow}
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {fd.heading}
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '560px', margin: 0 }}>
            {fd.subheading}
          </p>
        </div>
      </section>

      <div className="container-editorial">
        <div style={{ padding: '56px 0' }}>

          {/* What the platform is */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '56px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
                {fd.whatItIsHeading}
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
                {fd.whatItIs1}
              </p>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
                {fd.whatItIs2}
              </p>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
                {fd.whatItIs3}
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
                {fd.whatReceiveHeading}
              </h2>
              {fd.whatReceive.map((item: { title: string; body: string }, i: number) => (
                <div key={i} style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 400, margin: '0 0 8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <hr style={{ margin: '0 0 56px' }} />

          {/* Viriato clients */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '56px' }}>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                {fd.viriatoClientsEyebrow}
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
                {fd.viriatoClientsHeading}
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
                {fd.viriatoClients1}
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
                {fd.viriatoClients2}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                {fd.nonClientEyebrow}
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
                {fd.nonClientHeading}
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
                {fd.nonClient1}
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 24px' }}>
                {fd.nonClient2}
              </p>
              <Link
                href={`/${lang}/contact`}
                style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--background)', background: 'var(--foreground)', padding: '12px 24px', textDecoration: 'none', display: 'inline-block' }}
              >
                {fd.submitBtn}
              </Link>
            </div>
          </div>

          <hr style={{ margin: '0 0 56px' }} />

          {/* What we cannot promise */}
          <div style={{ maxWidth: '560px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              {fd.noPromisesHeading}
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              {fd.noPromises1}
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              {fd.noPromises2}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
