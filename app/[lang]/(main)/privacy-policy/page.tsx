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
    title: dict.seo.privacyPolicy.title,
    description: dict.seo.privacyPolicy.description,
    alternates: getAlternates('/privacy-policy', lang),
    openGraph: { type: 'website', ...getOgLocale(lang) },
  }
}

const sections = [
  {
    heading: '1. Who we are',
    content: (
      <>
        <p>Controller: [Legal Entity Name]</p>
        <p>Trading name: Portugal Developments Review by Viriato</p>
        <p>Registered address: [Registered Address]</p>
        <p>Email: [Privacy Email]</p>
        <p>General contact: [General Contact Email]</p>
        <p>If you have questions about this Privacy Policy or how we use your personal data, please contact us using the details above.</p>
      </>
    ),
  },
  {
    heading: '2. What we do',
    content: (
      <p>PDR is a curated platform for discovering selected new developments in Portugal. We present editorially selected project information, location context, and related content. When you submit an inquiry through the website, PDR may receive your request first and, where relevant, pass it to the developer, promoter, sales team, or authorised representative connected to the development you asked about.</p>
    ),
  },
  {
    heading: '3. Personal data we collect',
    content: (
      <>
        <p>Depending on how you use the website, we may collect the following categories of personal data.</p>
        <p style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', margin: '20px 0 10px', fontFamily: 'sans-serif' }}>Information you provide directly</p>
        {[
          'Full name',
          'Email address',
          'Phone number',
          'Preferred location or development',
          'Budget range or purchase preferences',
          'Inquiry details, comments, or message content',
          'Appointment or consultation preferences',
          'Marketing preferences',
          'Any other information you choose to provide in forms or communications',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'start' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', flexShrink: 0 }}>—</span>
            <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{item}</p>
          </div>
        ))}
        <p style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', margin: '20px 0 10px', fontFamily: 'sans-serif' }}>Information collected automatically</p>
        {[
          'IP address',
          'Browser type and version',
          'Device information',
          'Website usage data, including pages viewed, referring pages, and approximate session activity',
          'Cookie and consent preferences',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'start' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', flexShrink: 0 }}>—</span>
            <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{item}</p>
          </div>
        ))}
        <p style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', margin: '20px 0 10px', fontFamily: 'sans-serif' }}>Information from third parties</p>
        {[
          'Information provided by developers, partners, or service providers where needed to respond to your inquiry',
          'Analytics or performance data from website tools, where enabled',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'start' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', flexShrink: 0 }}>—</span>
            <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{item}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    heading: '4. How we use your personal data',
    content: (
      <>
        <p>We may use your personal data to:</p>
        {[
          'Respond to your inquiries',
          'Send brochures, investment packs, project materials, or requested information',
          'Arrange calls, consultations, or follow-up contact',
          'Route your inquiry to the relevant developer, promoter, or representative for the development you selected',
          'Manage and improve our website, content, and user experience',
          'Maintain records of inquiries and communications',
          'Send newsletters or marketing communications where you have opted in or where otherwise permitted by law',
          'Detect misuse, maintain security, and protect our rights',
          'Comply with legal, regulatory, accounting, and compliance obligations',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'start' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', flexShrink: 0 }}>—</span>
            <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{item}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    heading: '5. Legal bases for processing',
    content: (
      <>
        <p>We process personal data on one or more of the following legal bases, depending on the context:</p>
        {[
          { title: 'Consent', body: 'When you subscribe to marketing communications, accept non-essential cookies, or otherwise give us explicit permission.' },
          { title: 'Pre-contractual steps', body: 'When you ask us to take steps at your request before a possible transaction or introduction, such as sending project information or connecting you with a relevant developer.' },
          { title: 'Legitimate interests', body: 'When we process data to operate, secure, improve, and administer the platform, manage inquiries, understand demand, and maintain the quality and integrity of our services.' },
          { title: 'Legal obligation', body: 'When we must retain or disclose information to comply with applicable law.' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'start' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', flexShrink: 0 }}>—</span>
            <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}><span style={{ color: 'var(--foreground)' }}>{item.title}.</span> {item.body}</p>
          </div>
        ))}
        <p style={{ marginTop: '16px' }}>Where we rely on consent, you may withdraw it at any time. Withdrawal does not affect processing already carried out before withdrawal.</p>
      </>
    ),
  },
  {
    heading: '6. Who we share your personal data with',
    content: (
      <>
        <p>We may share your personal data with:</p>
        {[
          'Members of our internal team who need access to manage the website or your inquiry',
          'Developers, promoters, sales teams, or authorised representatives related to the development or project you asked about',
          'Website hosting providers, analytics providers, CRM tools, email service providers, form processing tools, and other technical service providers acting on our behalf',
          'Professional advisers, including legal, compliance, or accounting advisers, where necessary',
          'Courts, regulators, public authorities, or law enforcement bodies where disclosure is required by law or needed to protect our rights',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'start' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', flexShrink: 0 }}>—</span>
            <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{item}</p>
          </div>
        ))}
        <p style={{ marginTop: '16px' }}>We do not sell your personal data.</p>
      </>
    ),
  },
  {
    heading: '7. International transfers',
    content: (
      <p>Some of our service providers may process data outside the European Economic Area. Where that happens, we will take steps to ensure that an appropriate level of protection is applied, including reliance on adequacy decisions, standard contractual clauses, or other lawful safeguards where required.</p>
    ),
  },
  {
    heading: '8. How long we keep your data',
    content: (
      <>
        <p>We keep personal data only for as long as necessary for the purposes described in this Privacy Policy, including to manage inquiries, provide requested information, maintain appropriate business records, resolve disputes, enforce agreements, and comply with legal obligations.</p>
        <p>Retention periods may vary depending on the type of data and the purpose of processing. For example:</p>
        {[
          'Inquiry data may be retained for the period reasonably necessary to manage the inquiry and any related follow-up',
          'Marketing data may be kept until you unsubscribe or object, subject to any legally required retention',
          'Technical and analytics data may be retained for shorter operational periods, depending on the tool used',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'start' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', flexShrink: 0 }}>—</span>
            <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{item}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    heading: '9. Your rights',
    content: (
      <>
        <p>Subject to applicable law, you may have the right to:</p>
        {[
          'Request access to your personal data',
          'Request correction of inaccurate or incomplete data',
          'Request erasure of your personal data',
          'Request restriction of processing',
          'Object to processing based on legitimate interests',
          'Request portability of data you provided to us, where applicable',
          'Withdraw consent at any time where processing is based on consent',
          'Lodge a complaint with the relevant supervisory authority',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'start' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', flexShrink: 0 }}>—</span>
            <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{item}</p>
          </div>
        ))}
        <p style={{ marginTop: '16px' }}>In Portugal, the supervisory authority is the Comissão Nacional de Proteção de Dados (CNPD). To exercise your rights, please contact us at [Privacy Email]. We may need to verify your identity before responding.</p>
      </>
    ),
  },
  {
    heading: '10. Cookies and similar technologies',
    content: (
      <p>We use cookies and similar technologies to operate the website and, where you consent, to understand website usage, improve performance, and support embedded or third-party features. Please see our <Link href="../cookies" style={{ color: 'var(--foreground)', borderBottom: '1px solid var(--foreground)', textDecoration: 'none' }}>Cookie Notice</Link> for more information about the categories of cookies we use, the legal basis for their use, and how you can manage your preferences.</p>
    ),
  },
  {
    heading: '11. Security',
    content: (
      <p>We use reasonable technical and organisational measures designed to protect personal data against unauthorised access, loss, misuse, alteration, or disclosure. However, no method of transmission over the internet or method of storage is completely secure.</p>
    ),
  },
  {
    heading: '12. Third-party websites',
    content: (
      <p>Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review their privacy notices before providing personal data.</p>
    ),
  },
  {
    heading: '13. Changes to this Privacy Policy',
    content: (
      <p>We may update this Privacy Policy from time to time to reflect changes to our services, data practices, or legal requirements. The updated version will be posted on this page with a revised "Last updated" date.</p>
    ),
  },
  {
    heading: '14. Contact us',
    content: (
      <>
        <p>For privacy-related questions or requests, please contact:</p>
        <p>[Legal Entity Name]<br />[Registered Address]<br />[Privacy Email]<br />[General Contact Email]</p>
      </>
    ),
  },
]

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, fontFamily: 'sans-serif', letterSpacing: '0.02em' }}>
            Last updated: [Date]
          </p>
        </div>
      </section>

      <div className="container-editorial">
        <div style={{ maxWidth: '720px', padding: '56px 0 80px' }}>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 48px' }}>
            Portugal Developments Review by Viriato ("PDR", "we", "us", or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, share, and protect your personal data when you visit our website, browse our content, request a brochure, register your interest in a development, request a consultation, download an investment pack, subscribe to updates, or otherwise contact us.
          </p>

          {sections.map((section, i) => (
            <div key={i}>
              {i > 0 && <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 40px' }} />}
              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
                  {section.heading}
                </h2>
                <div style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)' }}>
                  {section.content}
                </div>
              </section>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
