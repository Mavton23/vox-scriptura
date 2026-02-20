'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UserMenu } from '../common/user-menu'
import { 
  Menu, 
  Home, 
  MessageCircle, 
  BookOpen, 
  Calendar,
  Search,
  Users,
  Heart,
  Bot
} from 'lucide-react'
import { SearchDialog } from './search-dialog'

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Perguntas e Respostas', href: '/perguntas', icon: MessageCircle },
  { name: 'Ensino de Doutrina', href: '/doutrinas', icon: BookOpen },
  { name: 'Frases Diárias', href: '/frases-diarias', icon: Calendar },
  { name: 'Autores', href: '/autores', icon: Users },
  { name: 'Favoritos', href: '/favoritos', icon: Heart },
  { name: 'Chat com IA', href: '/chat', icon: Bot },
]

export default function Header() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 ml-2">
            <span className="text-xl font-bold text-primary sm:text-2xl">Vox Scriptura</span>
            <span className="hidden xs:inline-block text-[10px] sm:text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full whitespace-nowrap">
              Voz da Escritura
            </span>
          </Link>

        {/* Desktop Navigation */}
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
                                pathname === item.href && "bg-accent/10 text-accent"
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

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/favoritos">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/chat">
              <Bot className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            className="hidden lg:inline-flex"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Menu do usuário */}
          <UserMenu />

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-100">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 text-lg font-semibold transition-colors hover:text-primary",
                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
                <Button variant="outline" className="mt-4" onClick={() => setSearchOpen(true)}>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="lg:hidden"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}