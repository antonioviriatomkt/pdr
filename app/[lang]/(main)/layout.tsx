import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getDictionary, hasLocale } from '@/lib/i18n'

export default async function MainLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  return (
    <>
      <Header lang={lang} nav={dict.nav} />
      <main>{children}</main>
      <Footer lang={lang} footer={dict.footer} />
    </>
  )
}
