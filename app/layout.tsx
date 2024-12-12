import './globals.css'
import { TemaSaglayici } from "@/components/tema-saglayici"
import { Baslik } from "@/components/baslik"
import { AltBilgi } from "@/components/alt-bilgi"
import { Metadata } from 'next'
import { GlitchEfekti } from "@/components/glitch-efekti"
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Sanal Kıyafet - AI Destekli Sanal Kıyafet Deneme Uygulaması',
  description: 'Kendi fotoğrafında veya örnek modellerde kıyafetleri dene. AI destekli sanal kıyafet deneme uygulaması.',
  keywords: 'sanal kıyafet, AI, yapay zeka, giyim, moda, online alışveriş',
  authors: [{ name: 'Teşkilatsız' }],
  openGraph: {
    title: 'Sanal Kıyafet - AI Destekli Sanal Kıyafet Deneme Uygulaması',
    description: 'Kendi fotoğrafında veya örnek modellerde kıyafetleri dene.',
    url: 'https://sanal-kiyafet.vercel.app',
    siteName: 'Sanal Kıyafet',
    images: [
      {
        url: 'https://sanal-kiyafet.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="font-sans">
        <TemaSaglayici attribute="class" defaultTheme="system" enableSystem>
          <GlitchEfekti />
          <div className="flex flex-col min-h-screen">
            <Baslik />
            <main className="flex-grow">
              {children}
            </main>
            <AltBilgi />
          </div>
        </TemaSaglayici>
      </body>
    </html>
  )
}

