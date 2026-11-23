'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Header from './header'
import Footer from './footer'
import { Logo, LogoMark } from '@/components/brand/logo'

const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password']

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // O admin tem o seu próprio layout
  if (pathname.startsWith('/admin')) {
    return <>{children}</>
  }

  // Autenticação: painel de marca à esquerda, formulário à direita
  if (AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))) {
    return (
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <aside className="relative hidden overflow-hidden bg-lapis-deep text-white lg:flex lg:flex-col lg:justify-between lg:p-12 dark:bg-[#0b1128]">
          <Link href="/" className="relative z-10 w-fit">
            <Logo size="md" tone="inverse" />
          </Link>
          <LogoMark
            className="pointer-events-none absolute -right-24 top-1/2 h-[34rem] -translate-y-1/2 text-white opacity-[0.06]"
            lightColor="#ffffff"
          />
          <figure className="relative z-10 max-w-md">
            <blockquote className="scripture text-[1.9rem] leading-snug text-white">
              Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.
            </blockquote>
            <figcaption className="ref mt-4 text-lg text-[#D9B45A]">Salmos 119:105</figcaption>
          </figure>
        </aside>
        <main className="flex items-center justify-center px-5 py-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-8 inline-flex lg:hidden">
              <Logo size="sm" />
            </Link>
            {children}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  )
}
