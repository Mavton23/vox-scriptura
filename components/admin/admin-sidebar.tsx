'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MessageCircle, 
  BookOpen, 
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bot,
  Database
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { LogoMark } from '@/components/brand/logo'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Perguntas', href: '/admin/questions', icon: MessageCircle },
  { name: 'Doutrinas', href: '/admin/doctrines', icon: BookOpen },
  { name: 'Frases Diárias', href: '/admin/daily-verses', icon: Calendar },
  { name: 'Autores', href: '/admin/authors', icon: Users },
  { name: 'Usuários', href: '/admin/users', icon: Users },
  { name: 'Chat IA', href: '/admin/chat', icon: Bot },
  { name: 'Banco de Dados', href: '/admin/database', icon: Database },
  { name: 'Configurações', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-300',
        collapsed ? 'w-[4.5rem]' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between gap-2 border-b border-sidebar-border px-4">
        <Link href="/admin" className="flex min-w-0 items-center gap-2.5" aria-label="Painel Vox Scriptura">
          <LogoMark className="h-7 shrink-0 text-white" lightColor="#D9B45A" />
          {!collapsed && (
            <span className="flex flex-col leading-none">
              <span className="font-serif text-lg text-white">Vox Scriptura</span>
              <span className="mt-0.5 text-[0.7rem] text-sidebar-foreground/60">Painel</span>
            </span>
          )}
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground/70 hover:bg-white/10 hover:text-white"
            onClick={() => setCollapsed(true)}
            aria-label="Recolher menu"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="mx-auto mt-3 text-sidebar-foreground/70 hover:bg-white/10 hover:text-white"
          onClick={() => setCollapsed(false)}
          aria-label="Expandir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/admin' ? pathname === '/admin' : pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-white before:absolute before:inset-y-2 before:-left-3 before:w-[3px] before:rounded-r before:bg-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-white/5 hover:text-white',
                collapsed && 'justify-center px-0'
              )}
            >
              <Icon className="h-[1.1rem] w-[1.1rem] shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-sidebar-foreground/70 hover:bg-white/5 hover:text-white',
            collapsed && 'justify-center'
          )}
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-[1.1rem] w-[1.1rem]" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </aside>
  )
}
