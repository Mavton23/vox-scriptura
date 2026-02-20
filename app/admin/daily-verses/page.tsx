'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/admin/data-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DailyVerse {
  id: string
  verse: string
  text: string
  explanation: string
  author: {
    id: string
    name: string
    slug: string
  }
  tags: string[]
  scheduledFor?: string | null
  createdAt: string
}

interface PaginatedResponse {
  verses: DailyVerse[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function AdminDailyVersesPage() {
  const router = useRouter()
  const [verses, setVerses] = useState<DailyVerse[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchVerses()
  }, [page, activeTab])

  async function fetchVerses(search?: string) {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: 'list',
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(activeTab !== 'all' && { status: activeTab })
      })

      const response = await fetch(`/api/daily?${params}`)
      const data: PaginatedResponse = await response.json()
      setVerses(data.verses)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao buscar versículos:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(verse: DailyVerse) {
    if (!confirm(`Tem certeza que deseja excluir o versículo ${verse.verse}?`)) return

    try {
      const response = await fetch(`/api/daily/${verse.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchVerses()
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  const getStatusBadge = (verse: DailyVerse) => {
    if (!verse.scheduledFor) {
      return <Badge variant="outline">Data livre</Badge>
    }
    
    const scheduledDate = new Date(verse.scheduledFor)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (scheduledDate < today) {
      return <Badge variant="secondary">Passado</Badge>
    } else if (scheduledDate.getTime() === today.getTime()) {
      return <Badge className="bg-green-500 text-white">Hoje</Badge>
    } else {
      return <Badge variant="default">Agendado</Badge>
    }
  }

  const columns = [
    {
      key: 'verse',
      header: 'Versículo',
      cell: (item: DailyVerse) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{item.verse}</span>
            {getStatusBadge(item)}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{item.text}</p>
        </div>
      ),
      sortable: true
    },
    {
      key: 'author',
      header: 'Autor',
      cell: (item: DailyVerse) => (
        <span className="text-sm">{item.author.name}</span>
      )
    },
    {
      key: 'scheduledFor',
      header: 'Agendamento',
      cell: (item: DailyVerse) => (
        item.scheduledFor 
          ? format(new Date(item.scheduledFor), "dd/MM/yyyy", { locale: ptBR })
          : '—'
      )
    },
    {
      key: 'tags',
      header: 'Tags',
      cell: (item: DailyVerse) => (
        <div className="flex flex-wrap gap-1 max-w-50">
          {item.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 3}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Criado em',
      cell: (item: DailyVerse) => format(new Date(item.createdAt), 'dd/MM/yyyy', { locale: ptBR })
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Frases Diárias</h1>
          <p className="text-muted-foreground">
            Gerencie os versículos com explicações para meditação diária
          </p>
        </div>
        <Button onClick={() => router.push('/admin/daily-verses/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Frase
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pagination.total}</p>
            <p className="text-xs text-muted-foreground">versículos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {verses.filter(v => {
                if (!v.scheduledFor) return false
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return new Date(v.scheduledFor).getTime() === today.getTime()
              }).length}
            </p>
            <p className="text-xs text-muted-foreground">versículos agendados para hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Agendados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-500">
              {verses.filter(v => {
                if (!v.scheduledFor) return false
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return new Date(v.scheduledFor) > today
              }).length}
            </p>
            <p className="text-xs text-muted-foreground">versículos futuros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Livres</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-500">
              {verses.filter(v => !v.scheduledFor).length}
            </p>
            <p className="text-xs text-muted-foreground">sem data fixa</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para filtros rápidos */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="scheduled">Agendados</TabsTrigger>
          <TabsTrigger value="free">Data Livre</TabsTrigger>
          <TabsTrigger value="past">Passados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <DataTable
            data={verses}
            columns={columns}
            onEdit={(item) => router.push(`/admin/daily-verses/${item.id}`)}
            onDelete={handleDelete}
            onView={(item) => router.push(`/frases-diarias/${item.id}`)}
            onSearch={fetchVerses}
            pagination={{
              ...pagination,
              onPageChange: setPage
            }}
            isLoading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}