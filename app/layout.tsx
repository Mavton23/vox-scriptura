import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/eb-garamond'
import '@fontsource-variable/eb-garamond/wght-italic.css'
import '@fontsource-variable/hanken-grotesk'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import { LayoutProvider } from '@/components/layout/layout-provider'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vox Scriptura | Voz da Escritura',
    template: '%s | Vox Scriptura',
  },
  description:
    'Aprenda e cresça na fé com perguntas e respostas, doutrinas e uma frase bíblica para cada dia, a partir de autores fiéis à sã doutrina.',
  applicationName: 'Vox Scriptura',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Vox Scriptura',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F8F6' },
    { media: '(prefers-color-scheme: dark)', color: '#0E1530' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--popover)',
                color: 'var(--popover-foreground)',
                border: '1px solid var(--border)',
                fontSize: '0.9rem',
              },
            }}
          />
          <LayoutProvider>{children}</LayoutProvider>
        </Providers>
      </body>
    </html>
  )
}
