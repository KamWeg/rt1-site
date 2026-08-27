import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Archivo_Narrow } from 'next/font/google'
import { site } from '@/lib/content'
import './globals.css'

/** The brand voice. One weight — the serif is never bolded. */
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-instrument-serif',
})

/** The interface. Three weights, all of them narrow. */
const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-archivo-narrow',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'TV remote app',
    'Wi-Fi remote control',
    'Samsung Tizen remote',
    'LG webOS remote',
    'private remote app',
    'no account TV remote',
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: '#ECEAE5',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${archivoNarrow.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-dark focus:px-4 focus:py-3 focus:text-on-dark micro-l"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
