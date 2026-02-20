'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  _count?: {
    favoriteQuestions: number
    favoriteDoctrines: number
    favoriteVerses: number
    chatConversations: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  useEffect(() => {
    fetchUsers()
  }, [page])

  async function fetchUsers(search?: string) {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(user: User) {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    if (!confirm(`Tem certeza que deseja alterar o papel deste usuário para ${newRole}?`)) return

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Erro ao alterar papel:', error)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Nome',
      cell: (item: User) => (
        <div>
          <p className="font-medium">{item.name || '—'}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Papel',
      cell: (item: User) => (
        <Badge variant={item.role === 'admin' ? 'default' : 'secondary'}>
          {item.role === 'admin' ? 'Administrador' : 'Usuário'}
        </Badge>
      )
    },
    {
      key: 'stats',
      header: 'Atividade',
      cell: (item: User) => (
        <div className="text-xs">
          <div>Favoritos: {(item._count?.favoriteQuestions || 0) + (item._count?.favoriteDoctrines || 0) + (item._count?.favoriteVerses || 0)}</div>
          <div>Conversas: {item._count?.chatConversations || 0}</div>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Membro desde',
      cell: (item: User) => format(new Date(item.createdAt), 'dd/MM/yyyy', { locale: ptBR })
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários da plataforma
        </p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        onEdit={handleRoleChange}
        onSearch={fetchUsers}
        pagination={{
          ...pagination,
          onPageChange: setPage
        }}
        isLoading={loading}
      />
    </div>
  )
}