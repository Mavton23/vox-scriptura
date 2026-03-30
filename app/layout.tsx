import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import { LayoutProvider } from '@/components/layout/layout-provider'

// Configurar Fonts
const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fontSerif = Merriweather({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vox Scriptura | Voz da Escritura',
  description: 'Aprenda e cresça na fé com ensinamentos de autores confiáveis da sã doutrina',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
        fontSerif.variable
      )}>
        <Providers>
          <Toaster position="top-right" />
          <LayoutProvider>
            {children}
          </LayoutProvider>
        </Providers>
      </body>
    </html>
  )
}