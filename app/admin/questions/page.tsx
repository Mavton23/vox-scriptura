'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/admin/data-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'

interface Question {
  id: string
  question: string
  answer: string
  context?: string
  author: {
    name: string
  }
  tags: string[]
  createdAt: string
}

export default function AdminQuestionsPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  useEffect(() => {
    fetchQuestions()
  }, [page])

  async function fetchQuestions(search?: string) {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })

      const response = await fetch(`/api/questions?${params}`)
      const data = await response.json()
      setQuestions(data.questions)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(question: Question) {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return

    try {
      const response = await fetch(`/api/questions/${question.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchQuestions()
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  const columns = [
    {
      key: 'question',
      header: 'Pergunta',
      cell: (item: Question) => (
        <div>
          <p className="font-medium line-clamp-1">{item.question}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{item.answer}</p>
        </div>
      ),
      sortable: true
    },
    {
      key: 'author',
      header: 'Autor',
      cell: (item: Question) => item.author.name
    },
    {
      key: 'tags',
      header: 'Tags',
      cell: (item: Question) => (
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
      cell: (item: Question) => format(new Date(item.createdAt), 'dd/MM/yyyy', { locale: ptBR })
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Perguntas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as perguntas e respostas da plataforma
          </p>
        </div>
        <Button onClick={() => router.push('/admin/questions/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Pergunta
        </Button>
      </div>

      <DataTable
        data={questions}
        columns={columns}
        onEdit={(item) => router.push(`/admin/questions/${item.id}`)}
        onDelete={handleDelete}
        onView={(item) => router.push(`/perguntas/${item.id}`)}
        onSearch={fetchQuestions}
        pagination={{
          ...pagination,
          onPageChange: setPage
        }}
        isLoading={loading}
      />
    </div>
  )
}