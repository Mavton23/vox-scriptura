'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from '@/components/brand/logo'
import { UserMenu } from '../common/user-menu'
import { ThemeToggle } from '../ui/theme-toggle'
import { SearchDialog } from './search-dialog'

export const navigation = [
  { name: 'Perguntas', full: 'Perguntas e respostas', href: '/perguntas' },
  { name: 'Doutrinas', full: 'Ensino de doutrina', href: '/doutrinas' },
  { name: 'Frases diárias', full: 'Frases diárias', href: '/frases-diarias' },
  { name: 'Autores', full: 'Autores', href: '/autores' },
]

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/')
}

export default function Header() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Atalho "/" ou Ctrl/⌘+K para abrir a busca
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b transition-[background-color,border-color] duration-200',
          isScrolled
            ? 'border-border bg-background/90 backdrop-blur-md'
            : 'border-transparent bg-background'
        )}
      >
        <div className="container flex h-16 items-center gap-6">
          <Link href="/" aria-label="Vox Scriptura, página inicial" className="shrink-0">
            <Logo size="md" className="hidden sm:inline-flex" />
            <Logo size="sm" className="sm:hidden" />
          </Link>

          <nav aria-label="Principal" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative rounded-md px-3 py-2 text-[0.94rem] font-medium transition-colors',
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    'after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[2px] after:rounded-full after:bg-gold after:transition-opacity',
                    active ? 'after:opacity-100' : 'after:opacity-0'
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-9 w-56 items-center gap-2 rounded-md border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground lg:flex"
            >
              <Search className="h-4 w-4" />
              <span>Buscar na Escritura…</span>
              <kbd className="ml-auto rounded border bg-muted px-1.5 font-sans text-[0.7rem] text-muted-foreground">/</kbd>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="lg:hidden"
              aria-label="Buscar"
            >
              <Search className="h-[1.1rem] w-[1.1rem]" />
            </Button>

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <UserMenu />

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Abrir menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full gap-0 p-0 sm:max-w-sm"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <div className="flex h-16 items-center border-b px-5">
                  <Logo size="sm" />
                </div>
                <nav aria-label="Principal" className="flex-1 overflow-y-auto px-3 py-4">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center rounded-md px-3 py-3 font-serif text-xl',
                      pathname === '/' ? 'bg-secondary text-secondary-foreground' : 'text-foreground'
                    )}
                  >
                    Início
                  </Link>
                  {navigation.map((item) => {
                    const active = isActive(pathname, item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-center rounded-md px-3 py-3 font-serif text-xl transition-colors',
                          active ? 'bg-secondary text-secondary-foreground' : 'text-foreground hover:bg-muted'
                        )}
                      >
                        {item.full}
                      </Link>
                    )
                  })}
                </nav>
                <div className="flex items-center justify-between border-t px-5 py-4">
                  <span className="text-sm text-muted-foreground">Tema</span>
                  <ThemeToggle />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
