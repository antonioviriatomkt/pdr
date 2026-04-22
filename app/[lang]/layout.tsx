import type { Metadata } from 'next'
import '../globals.css'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'
import { JsonLd } from '@/components/JsonLd'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = (await params) as { lang: string }
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: 'Portugal Developments Review by Viriato',
      template: '%s | Portugal Developments Review',
    },
    description: 'Curated new developments across Portugal. A premium editorial discovery platform for exceptional new residential projects in Lisbon, Porto, Cascais, the Algarve, and Comporta.',
    keywords: ['Portugal new developments', 'luxury property Portugal', 'Lisbon apartments', 'Algarve villas', 'Portugal real estate'],
    openGraph: {
      type: 'website',
      siteName: 'Portugal Developments Review by Viriato',
      ...getOgLocale(lang),
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: getAlternates('', lang),
  }
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }]
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Portugal Developments Review by Viriato',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'An independent editorial platform curating exceptional new residential developments across Portugal.',
    sameAs: [`${BASE_URL}/en/about`],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Portugal Developments Review',
    url: BASE_URL,
    description: 'Curated new developments across Portugal. A premium editorial discovery platform for exceptional new residential projects in Lisbon, Porto, Cascais, the Algarve, and Comporta.',
    inLanguage: ['en', 'pt'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/en/developments`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang={lang === 'pt' ? 'pt-PT' : lang}>
      <body>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        {children}
      </body>
    </html>
  )
}
