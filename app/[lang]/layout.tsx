import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import '../globals.css'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'
import { JsonLd } from '@/components/JsonLd'
import { RouteFade } from '@/components/RouteFade'

const dmSans = localFont({
  src: [
    { path: '../fonts/DMSans-VariableFont_opsz,wght.ttf', style: 'normal' },
    { path: '../fonts/DMSans-Italic-VariableFont_opsz,wght.ttf', style: 'italic' },
  ],
  variable: '--font-sans',
  display: 'swap',
})

const georgiaPro = localFont({
  src: [
    { path: '../fonts/GeorgiaPro-Light.ttf', weight: '300', style: 'normal' },
    { path: '../fonts/GeorgiaPro-LightItalic.ttf', weight: '300', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
})

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
    <html lang={lang === 'pt' ? 'pt-PT' : lang} className={`${dmSans.variable} ${georgiaPro.variable}`}>
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WNHTSFX8');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WNHTSFX8"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <RouteFade>{children}</RouteFade>
      </body>
    </html>
  )
}
