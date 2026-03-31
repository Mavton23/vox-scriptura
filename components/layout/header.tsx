'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { UserMenu } from '../common/user-menu'
import { ThemeToggle } from '../ui/theme-toggle'
import { 
  Menu, 
  Home, 
  MessageCircle, 
  BookOpen, 
  Calendar,
  Search,
  Users,
  X
} from 'lucide-react'
import { SearchDialog } from './search-dialog'
import { VisuallyHidden } from 'radix-ui'

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Perguntas e Respostas', href: '/perguntas', icon: MessageCircle },
  { name: 'Ensino de Doutrina', href: '/doutrinas', icon: BookOpen },
  { name: 'Frases Diárias', href: '/frases-diarias', icon: Calendar },
  { name: 'Autores', href: '/autores', icon: Users },
]

export default function Header() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Detectar scroll para efeito visual
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm" 
          : "bg-background/80 backdrop-blur-sm border-b"
      )}>
        <div className="container flex h-16 items-center justify-between px-3 sm:px-4">
          {/* Logo - Ajustada para mobile */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-hightlight truncate">
              Vox Scriptura
            </span>
            <span className="hidden xs:inline-block text-[8px] sm:text-xs bg-secondary text-secondary-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
              Voz da Escritura
            </span>
          </Link>

          {/* Desktop Navigation - Escondido em mobile */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          pathname === item.href && "bg-accent text-muted-foreground"
                        )}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Section - Ajustado para mobile */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
            {/* Search Button - Desktop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="hidden lg:inline-flex h-9 w-9"
              title="Buscar"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* User Menu */}
            <UserMenu />

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-80 p-0"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <SheetTitle className='sr-only'>
                  Menu de Navegação
                </SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Header do Menu Mobile */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <span className="text-lg font-bold text-primary">Menu</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Navegação Mobile */}
                  <nav className="flex-1 overflow-y-auto py-2">
                    {navigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-base transition-colors hover:bg-accent/50",
                            pathname === item.href 
                              ? "text-primary bg-accent/10 border-l-4 border-primary" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Ações Mobile */}
                  <div className="border-t p-4 space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2 h-11"
                      onClick={() => {
                        setSearchOpen(true)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <Search className="h-4 w-4" />
                      Buscar
                    </Button>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tema</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Search Button - Fora do Sheet para acesso rápido */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="lg:hidden h-9 w-9"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}