import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/lib/i18n'
import ContactForm from './ContactForm'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(hasLocale(lang) ? lang : 'en')
  return {
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
    alternates: getAlternates('/contact', lang),
    openGraph: { type: 'website', ...getOgLocale(lang) },
  }
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const c = dict.contact

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {c.eyebrow}
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {c.heading}
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '480px', margin: 0 }}>
            {c.subheading}
          </p>
        </div>
      </section>

      <div className="container-editorial">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', padding: '56px 0', alignItems: 'start' }}>
          <div>
            <ContactForm dict={dict.contactForm} />
          </div>

          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '80px' }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
                {c.whatHappensNext}
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--muted)' }}>
                {c.whatHappensNextBody}
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
                {c.responseTime}
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--muted)' }}>
                {c.responseTimeBody}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                {c.otherWays}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 2 }}>
                <div>Email: contact@pdr.pt</div>
                <div>
                  <a href={`/${lang}/for-developers`} style={{ color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                    {c.forDevelopersLink}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
