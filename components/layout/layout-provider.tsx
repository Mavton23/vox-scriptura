'use client'

import { usePathname } from 'next/navigation'
import Header from './header'
import Footer from './footer'

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Rotas que não devem ter header e footer
  const noLayoutRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/admin'
  ]

  // Verificar se a rota atual é uma rota de admin ou auth
  const isAdminRoute = pathname.startsWith('/admin')
  const isAuthRoute = noLayoutRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Se for rota admin, não renderizar header/footer (o admin tem seu próprio layout)
  if (isAdminRoute) {
    return <>{children}</>
  }

  // Se for rota de autenticação, renderizar apenas o conteúdo (com fundo clean)
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
          {children}
        </div>
      </div>
    )
  }

  // Rotas normais: renderizar com header e footer
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}