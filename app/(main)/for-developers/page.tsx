import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'For Developers — Portugal Developments Review',
  description: 'Information for developers considering Portugal Developments Review. Learn how editorial placement works and how Viriato clients benefit from the platform.',
}

export default function ForDevelopersPage() {
  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            Developers
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            For Developers
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '560px', margin: 0 }}>
            This is a premium buyer-facing environment — not a listings portal. If your project meets our curation criteria, we would like to discuss it.
          </p>
        </div>
      </section>

      <div className="container-editorial">
        <div style={{ padding: '56px 0' }}>

          {/* What the platform is */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '56px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
                What this platform is
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
                Portugal Developments Review is not a traditional property portal. It is a curated editorial platform — selective by design, with a focused audience of serious buyers.
              </p>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
                The platform does not compete with your existing marketing. It occupies a specific layer: premium discovery, editorial framing, and qualified lead capture — aimed at buyers who are actively considering the Portuguese market and who are not served by mass-market portals.
              </p>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
                Our primary audiences are Portuguese HNWI, international investors, diaspora buyers, and affluent second-home seekers. These are buyers for whom curation signals credibility.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
                What developers receive
              </h2>
              {[
                {
                  title: 'Editorial presentation',
                  body: 'Each development receives a dedicated editorial page — not a raw listing. Your project is framed through an editorial thesis: what makes it distinct, why it matters, and why it belongs on a curated platform.',
                },
                {
                  title: 'Internal linking and visibility',
                  body: 'Your development is linked from the relevant location pages, journal articles, and featured sections across the site. This creates multiple discovery paths for buyers researching specific areas.',
                },
                {
                  title: 'Qualified lead flow',
                  body: 'Enquiries from buyers who have read an editorial presentation are different from portal enquiries. They have context, intent, and a level of engagement that reflects the nature of the platform.',
                },
                {
                  title: 'SEO presence',
                  body: 'Each development page is structured for search discovery — with clean semantic HTML, dynamic metadata, and connection to indexed location and journal content. Your project benefits from the platform\'s growing organic presence.',
                },
              ].map((item, i) => (
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
                Viriato Clients
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
                Inclusion as part of your service
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
                Developers who work with Viriato receive editorial assessment and platform placement as part of their existing service relationship. This is not automatic — the same editorial standards apply — but the review process is initiated as part of the engagement.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
                If you are already a Viriato client and your project has not yet been considered for the platform, contact your Viriato representative.
              </p>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                Non-Client Developers
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
                Submission and consideration
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
                If you are not a current Viriato client, you may submit your project for consideration. There is no fee for the initial editorial assessment. We will review the project against our criteria and respond with our assessment.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 24px' }}>
                If the project meets our threshold and is accepted, we will discuss the terms of inclusion. We do not guarantee leads, and we do not promise outcomes beyond the editorial presentation itself.
              </p>
              <Link
                href="/contact"
                style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--background)', background: 'var(--foreground)', padding: '12px 24px', textDecoration: 'none', display: 'inline-block' }}
              >
                Submit Your Project
              </Link>
            </div>
          </div>

          <hr style={{ margin: '0 0 56px' }} />

          {/* What we cannot promise */}
          <div style={{ maxWidth: '560px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              What we do not promise
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              We do not guarantee lead volumes, enquiry rates, or sales outcomes. The platform&apos;s value lies in its editorial credibility — which depends on its independence and restraint. We will not compromise our curation standards to accommodate commercial pressure.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              We also reserve the right to remove a development from the platform if material information comes to light that changes our assessment, or if the project&apos;s conduct becomes inconsistent with the standards we represent.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
