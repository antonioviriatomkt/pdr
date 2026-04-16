import type { Metadata } from 'next'
import './globals.css'

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
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
