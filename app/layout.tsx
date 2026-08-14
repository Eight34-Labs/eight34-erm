import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s — Eight34 ERM',
    default: 'Eight34 ERM',
  },
  description: 'Eight34 Labs internal Revenue & Sales Management platform.',
  robots: 'noindex, nofollow',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
