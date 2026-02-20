'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/admin/data-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Author {
  id: string
  name: string
  slug: string
  description?: string
  bioUrl?: string
  _count?: {
    questions: number
    doctrines: number
    dailyVerses: number
  }
  createdAt: string
}

export default function AdminAuthorsPage() {
  const router = useRouter()
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  useEffect(() => {
    fetchAuthors()
  }, [page])

  async function fetchAuthors(search?: string) {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })

      const response = await fetch(`/api/authors?${params}`)
      const data = await response.json()
      setAuthors(data.authors || data) // Ajuste conforme sua API
      setPagination(data.pagination || { page: 1, limit: 10, total: data.length, pages: 1 })
    } catch (error) {
      console.error('Erro ao buscar autores:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(author: Author) {
    if (!confirm(`Tem certeza que deseja excluir o autor ${author.name}? Isso também excluirá todo o conteúdo associado.`)) return

    try {
      const response = await fetch(`/api/authors/${author.slug}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchAuthors()
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const columns = [
    {
      key: 'name',
      header: 'Autor',
      cell: (item: Author) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(item.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.slug}</p>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'stats',
      header: 'Conteúdo',
      cell: (item: Author) => (
        <div className="text-xs">
          <div>Perguntas: {item._count?.questions || 0}</div>
          <div>Doutrinas: {item._count?.doctrines || 0}</div>
          <div>Versículos: {item._count?.dailyVerses || 0}</div>
        </div>
      )
    },
    {
      key: 'bioUrl',
      header: 'Biografia',
      cell: (item: Author) => (
        item.bioUrl ? (
          <a 
            href={item.bioUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            Link externo
          </a>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      )
    },
    {
      key: 'createdAt',
      header: 'Cadastro',
      cell: (item: Author) => format(new Date(item.createdAt), 'dd/MM/yyyy', { locale: ptBR })
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Autores</h1>
          <p className="text-muted-foreground">
            Gerencie os autores que contribuem com conteúdo na plataforma
          </p>
        </div>
        <Button onClick={() => router.push('/admin/authors/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Autor
        </Button>
      </div>

      <DataTable
        data={authors}
        columns={columns}
        onEdit={(item) => router.push(`/admin/authors/${item.id}`)}
        onDelete={handleDelete}
        onView={(item) => router.push(`/autores/${item.slug}`)}
        onSearch={fetchAuthors}
        pagination={{
          ...pagination,
          onPageChange: setPage
        }}
        isLoading={loading}
      />
    </div>
  )
}