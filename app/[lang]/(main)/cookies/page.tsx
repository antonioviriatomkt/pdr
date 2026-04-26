import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(hasLocale(lang) ? lang : 'en')
  return {
    title: dict.seo.cookies.title,
    description: dict.seo.cookies.description,
    alternates: getAlternates('/cookies', lang),
    openGraph: { type: 'website', ...getOgLocale(lang) },
  }
}

const cookieCategories = [
  {
    title: 'Strictly necessary cookies',
    body: 'These cookies are required for the website to function properly. They may be used for core operations such as page navigation, security, network management, load balancing, or remembering cookie preferences.',
  },
  {
    title: 'Analytics cookies',
    body: 'These cookies help us understand how visitors use the website, such as which pages are visited, how users navigate the site, and where improvements may be needed.',
  },
  {
    title: 'Preference cookies',
    body: 'These cookies remember choices you make, such as language or other interface preferences.',
  },
  {
    title: 'Marketing or third-party cookies',
    body: 'These cookies may be used by advertising, social media, video, map, CRM, or other third-party services to measure engagement, personalise content, or track activity across services, where such tools are enabled.',
  },
]

const thirdPartyExamples = [
  'Analytics providers',
  'Video or map providers',
  'Embedded content providers',
  'CRM, contact, chat, or form tools',
  'Advertising or remarketing platforms',
]

export default async function CookiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px', fontFamily: 'sans-serif' }}>
            Legal
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Cookie Notice
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, fontFamily: 'sans-serif', letterSpacing: '0.02em' }}>
            Last updated: [Date]
          </p>
        </div>
      </section>

      <div className="container-editorial">
        <div style={{ maxWidth: '720px', padding: '56px 0 80px' }}>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 48px' }}>
            This Cookie Notice explains how Portugal Developments Review by Viriato ("PDR", "we", "us", or "our") uses cookies and similar technologies on our website.
          </p>

          {/* Section 1 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              1. What cookies are
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              Cookies are small text files placed on your device when you visit a website. They help websites function, remember preferences, understand how visitors use the site, and support embedded services or marketing tools.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 40px' }} />

          {/* Section 2 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              2. How we use cookies
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              We may use cookies and similar technologies to:
            </p>
            {[
              'Enable essential website functions',
              'Maintain security and manage consent choices',
              'Understand website traffic and performance',
              'Improve user experience and site functionality',
              'Support embedded content or third-party features',
              'Measure the effectiveness of communications or campaigns, where used',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'start' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', flexShrink: 0 }}>—</span>
                <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 40px' }} />

          {/* Section 3 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              3. Categories of cookies we may use
            </h2>
            {cookieCategories.map((cat, i) => (
              <div key={i} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: i < cookieCategories.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <p style={{ fontSize: '15px', color: 'var(--foreground)', margin: '0 0 8px', lineHeight: 1.5 }}>{cat.title}</p>
                <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.8 }}>{cat.body}</p>
              </div>
            ))}
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 40px' }} />

          {/* Section 4 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              4. Legal basis
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              We use strictly necessary cookies where needed for the functioning and security of the website. We use non-essential cookies, including analytics, preference, and marketing cookies, only where you have given consent, in accordance with applicable law.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 40px' }} />

          {/* Section 5 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              5. Managing your preferences
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 14px' }}>
              When you first visit the website, you may be presented with a cookie banner or preference centre that allows you to accept, reject, or manage non-essential cookies.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              You can also manage cookies through your browser settings. Please note that disabling strictly necessary cookies may affect website functionality.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 40px' }} />

          {/* Section 6 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              6. Third-party services
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              Depending on the tools used on the website, some cookies may be set by third-party services such as:
            </p>
            {thirdPartyExamples.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'start' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', flexShrink: 0 }}>—</span>
                <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '16px 0 0' }}>
              If third-party services are used, their own privacy or cookie policies may also apply.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 40px' }} />

          {/* Section 7 */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              7. Changes to this Cookie Notice
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              We may update this Cookie Notice from time to time to reflect changes in the technologies we use or in legal requirements. The updated version will be posted on this page with a revised "Last updated" date.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 40px' }} />

          {/* Section 8 */}
          <section style={{ marginBottom: '0' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              8. Contact
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 14px' }}>
              If you have questions about our use of cookies or similar technologies, please contact:
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 24px' }}>
              [Legal Entity Name]<br />[Registered Address]<br />[Privacy Email]
            </p>
            <Link
              href={`/${lang}/privacy-policy`}
              style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)', fontFamily: 'sans-serif' }}
            >
              Read our Privacy Policy →
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}
