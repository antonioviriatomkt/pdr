import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(hasLocale(lang) ? lang : 'en')
  return {
    title: dict.seo.terms.title,
    description: dict.seo.terms.description,
    alternates: getAlternates('/terms', lang),
    openGraph: { type: 'website', ...getOgLocale(lang) },
  }
}

const sections = [
  {
    heading: '1. About PDR',
    content: (
      <>
        <p>Portugal Developments Review is a curated platform for discovering selected new developments in Portugal through editorial selection, location context, and premium presentation.</p>
        <p>Unless expressly stated otherwise, PDR is not the seller, promoter, broker, estate agent, or contracting party for the developments featured on the website. PDR does not itself sell units, conclude reservations, or enter into property contracts on behalf of users.</p>
      </>
    ),
  },
  {
    heading: '2. Website purpose',
    content: (
      <>
        <p>The website is intended to:</p>
        {[
          'Present curated information about selected developments',
          'Provide location and editorial context',
          'Help users discover projects aligned with their interests',
          'Allow users to request information, brochures, consultations, or introductions',
          'Support communication between interested users and relevant developers or representatives',
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
    heading: '3. Eligibility and use',
    content: (
      <>
        <p>You may use the website only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        {[
          'Use the website in any way that violates applicable law or regulation',
          'Submit false, misleading, or fraudulent information',
          'Interfere with the security, operation, or performance of the website',
          'Attempt to gain unauthorised access to systems, accounts, or data',
          'Copy, scrape, harvest, republish, or systematically extract content or data from the website without our prior written permission',
          'Use the website to send spam, unsolicited communications, or abusive content',
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
    heading: '4. Nature of content',
    content: (
      <>
        <p>The website contains editorial, informational, and promotional content relating to property developments and related topics. Content may include descriptions, images, visuals, location information, indicative pricing language, specifications, amenities, timelines, and availability details.</p>
        <p>While we aim to present information carefully and in good faith, project information may be supplied in whole or in part by developers, promoters, sales teams, or other third parties. Such information may change without notice.</p>
      </>
    ),
  },
  {
    heading: '5. No guarantee and no advice',
    content: (
      <>
        <p>Content on the website is provided for general informational purposes only. It is not legal, financial, tax, investment, planning, engineering, or technical advice.</p>
        <p>Inclusion of a development on PDR does not constitute certification, due diligence, legal verification, construction verification, or a guarantee of quality, investment performance, availability, or suitability.</p>
        <p>You should independently verify any project details, legal documentation, commercial terms, reservation conditions, availability, timelines, and pricing before making any decision or entering into any transaction.</p>
      </>
    ),
  },
  {
    heading: '6. Editorial curation',
    content: (
      <>
        <p>PDR applies its own editorial and curation standards when deciding whether and how to feature developments. Inclusion, exclusion, ordering, prominence, or removal of a project is at PDR's discretion.</p>
        <p>We may update, revise, suspend, or remove listings, pages, editorial content, or methodology references at any time.</p>
      </>
    ),
  },
  {
    heading: '7. Inquiries and introductions',
    content: (
      <>
        <p>If you submit a request through the website, including a brochure request, consultation request, or registration of interest, PDR may receive and review the inquiry before forwarding it to the relevant developer, promoter, sales team, or authorised representative.</p>
        <p>Submitting an inquiry through the website does not create a brokerage relationship, fiduciary relationship, advisory relationship, client relationship, or contractual obligation unless expressly agreed in writing.</p>
        <p>PDR does not guarantee that any inquiry will result in a response, offer, reservation, transaction, or other outcome.</p>
      </>
    ),
  },
  {
    heading: '8. Availability, pricing, and development details',
    content: (
      <>
        <p>Any references to pricing, unit mix, completion status, incentives, specifications, amenities, delivery timing, or other development details are subject to change, withdrawal, correction, or update without notice.</p>
        <p>Listings may contain approximate, preliminary, or promotional information. Users should confirm all material details directly with the relevant developer or representative.</p>
      </>
    ),
  },
  {
    heading: '9. Intellectual property',
    content: (
      <>
        <p>Unless otherwise stated, the website and its contents, including text, editorial content, branding, logos, design, layout, selection, databases, graphics, and original visuals, are owned by or licensed to PDR and are protected by applicable intellectual property laws.</p>
        <p>You may view the website for personal, non-commercial use only. You may not reproduce, distribute, modify, create derivative works from, publicly display, republish, or exploit any part of the website without prior written permission, except as allowed by law.</p>
      </>
    ),
  },
  {
    heading: '10. Third-party content and links',
    content: (
      <>
        <p>The website may contain third-party materials, embedded content, or links to third-party websites. PDR is not responsible for the accuracy, availability, security, or content of third-party websites or services.</p>
        <p>A link to a third-party website does not imply endorsement, approval, or control by PDR.</p>
      </>
    ),
  },
  {
    heading: '11. Disclaimer of warranties',
    content: (
      <>
        <p>To the maximum extent permitted by law, the website and its content are provided on an "as is" and "as available" basis. We do not guarantee that the website will be uninterrupted, error-free, secure, or free from inaccuracies or omissions.</p>
        <p>We disclaim, to the maximum extent permitted by law, all warranties, representations, and conditions not expressly stated in these Terms.</p>
      </>
    ),
  },
  {
    heading: '12. Limitation of liability',
    content: (
      <>
        <p>To the maximum extent permitted by law, PDR shall not be liable for any direct, indirect, incidental, consequential, special, punitive, or economic loss arising out of or in connection with:</p>
        {[
          'Your use of or inability to use the website',
          'Reliance on project information, editorial content, or third-party information',
          'Errors, omissions, or changes in listings, pricing, specifications, or availability',
          'Dealings, communications, or transactions between you and a developer, promoter, sales team, or other third party',
          'Any interruption, delay, virus, or technical issue affecting the website',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'start' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', flexShrink: 0 }}>—</span>
            <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{item}</p>
          </div>
        ))}
        <p style={{ marginTop: '16px' }}>Nothing in these Terms excludes liability that cannot lawfully be excluded.</p>
      </>
    ),
  },
  {
    heading: '13. Indemnity',
    content: (
      <p>You agree to indemnify and hold harmless PDR, its affiliates, directors, employees, contractors, and representatives from claims, losses, liabilities, damages, and costs arising out of your breach of these Terms or misuse of the website, to the extent permitted by law.</p>
    ),
  },
  {
    heading: '14. Changes to the website or Terms',
    content: (
      <p>We may change the website, suspend access, modify content, or update these Terms at any time. The updated Terms will be posted on this page with a revised "Last updated" date.</p>
    ),
  },
  {
    heading: '15. Governing law',
    content: (
      <>
        <p>These Terms are governed by the laws of Portugal, without prejudice to any mandatory consumer protections that may apply under relevant law.</p>
        <p>Any dispute arising in connection with these Terms or the website shall be subject to the jurisdiction of the competent courts of Portugal, unless applicable law requires otherwise.</p>
      </>
    ),
  },
  {
    heading: '16. Contact',
    content: (
      <>
        <p>For questions relating to these Terms, please contact:</p>
        <p>[Legal Entity Name]<br />[Registered Address]<br />[General Contact Email]</p>
      </>
    ),
  },
]

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
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
            Terms of Use
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, fontFamily: 'sans-serif', letterSpacing: '0.02em' }}>
            Last updated: [Date]
          </p>
        </div>
      </section>

      <div className="container-editorial">
        <div style={{ maxWidth: '720px', padding: '56px 0 80px' }}>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 48px' }}>
            These Terms of Use ("Terms") govern your access to and use of the Portugal Developments Review by Viriato website ("PDR", "we", "us", or "our"). By accessing or using the website, you agree to these Terms. If you do not agree, you should not use the website.
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
