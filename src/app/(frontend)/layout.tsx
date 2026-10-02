import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Noto_Serif } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSiteSettings } from '@/lib/payload'
import './globals.css'

const sans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

const serif = Noto_Serif({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-noto-serif',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: {
      default: `${settings.siteName} – ${settings.tagline ?? 'Tin tức'}`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.tagline ?? undefined,
    openGraph: { siteName: settings.siteName, locale: 'vi_VN', type: 'website' },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <Header />
        <main className="container-news py-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
