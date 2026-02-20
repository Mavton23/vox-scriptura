'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/admin/data-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'

interface Doctrine {
  id: string
  title: string
  slug: string
  summary: string
  author: {
    name: string
  }
  tags: string[]
  createdAt: string
}

export default function AdminDoctrinesPage() {
  const router = useRouter()
  const [doctrines, setDoctrines] = useState<Doctrine[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  useEffect(() => {
    fetchDoctrines()
  }, [page])

  async function fetchDoctrines(search?: string) {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })

      const response = await fetch(`/api/doctrines?${params}`)
      const data = await response.json()
      setDoctrines(data.doctrines)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao buscar doutrinas:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(doctrine: Doctrine) {
    if (!confirm('Tem certeza que deseja excluir esta doutrina?')) return

    try {
      const response = await fetch(`/api/doctrines/${doctrine.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchDoctrines()
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Título',
      cell: (item: Doctrine) => (
        <div>
          <p className="font-medium line-clamp-1">{item.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{item.summary}</p>
        </div>
      ),
      sortable: true
    },
    {
      key: 'author',
      header: 'Autor',
      cell: (item: Doctrine) => item.author.name
    },
    {
      key: 'tags',
      header: 'Tags',
      cell: (item: Doctrine) => (
        <div className="flex gap-1">
          {item.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Data',
      cell: (item: Doctrine) => format(new Date(item.createdAt), 'dd/MM/yyyy', { locale: ptBR })
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Doutrinas</h1>
          <p className="text-muted-foreground">
            Gerencie todos os ensinos doutrinários da plataforma
          </p>
        </div>
        <Button onClick={() => router.push('/admin/doctrines/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Doutrina
        </Button>
      </div>

      <DataTable
        data={doctrines}
        columns={columns}
        onEdit={(item) => router.push(`/admin/doctrines/${item.id}`)}
        onDelete={handleDelete}
        onView={(item) => router.push(`/doutrinas/${item.slug}`)}
        onSearch={fetchDoctrines}
        pagination={{
          ...pagination,
          onPageChange: setPage
        }}
        isLoading={loading}
      />
    </div>
  )
}