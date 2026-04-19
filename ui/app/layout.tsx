import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SYNOVA SUPREME AUTOPILOT MODE',
  description: 'Advanced AI-powered autonomous production build engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        {children}
      </body>
    </html>
  )
}
