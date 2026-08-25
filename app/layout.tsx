import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SentiSolar | Instant AI Solar Roof Analysis',
  description: 'Get an instant, custom solar report for your roof powered by Senti AI and Google Solar mapping. Calculate your exact solar potential and battery needs in seconds.',
  keywords: ['solar', 'solar potential', 'roof analysis', 'AI solar', 'solar estimator', 'home battery', 'SentiSolar'],
  openGraph: {
    title: 'SentiSolar | Instant AI Solar Roof Analysis',
    description: 'Get an instant, custom solar report for your roof powered by AI.',
    url: 'https://sentisolar.com',
    siteName: 'SentiSolar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SentiSolar | Instant AI Solar Roof Analysis',
    description: 'Calculate your exact solar potential and battery needs in seconds.',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8faf9',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-paper">
      <body>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body>
    </html>
  )
}
