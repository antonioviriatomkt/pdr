import type { Metadata } from 'next'
import '../globals.css'
import { getAlternates } from '@/lib/i18n/metadata'

export const metadata: Metadata = {
  title: {
    default: 'Portugal Developments Review by Viriato',
    template: '%s | Portugal Developments Review',
  },
  description: 'Curated new developments across Portugal. A premium editorial discovery platform for exceptional new residential projects in Lisbon, Porto, Cascais, the Algarve, and Comporta.',
  keywords: ['Portugal new developments', 'luxury property Portugal', 'Lisbon apartments', 'Algarve villas', 'Portugal real estate'],
  openGraph: {
    type: 'website',
    siteName: 'Portugal Developments Review by Viriato',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: getAlternates(''),
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }]
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  )
}
