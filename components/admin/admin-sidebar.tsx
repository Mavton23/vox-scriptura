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
    <div
      className={cn(
        "bg-primary text-primary-foreground transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-primary-foreground/10">
        {!collapsed && (
          <span className="font-bold text-lg">Vox Scriptura</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                isActive 
                  ? "bg-primary-foreground/20 text-white" 
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-white",
                collapsed && "justify-center"
              )}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-primary-foreground/10 p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-primary-foreground hover:bg-primary-foreground/10",
            collapsed && "justify-center"
          )}
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </div>
  )
}