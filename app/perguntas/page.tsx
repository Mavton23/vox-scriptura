'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Filter, User, Tag } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  question: string
  answer: string
  context?: string
  author: {
    name: string
    slug: string
  }
  tags: string[]
  createdAt: string
}

interface PaginatedResponse {
  questions: Question[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function PerguntasPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [selectedAuthor, setSelectedAuthor] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [availableAuthors, setAvailableAuthors] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetchQuestions()
    fetchFilters()
  }, [currentPage, selectedTag, selectedAuthor])

  async function fetchQuestions() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(selectedTag !== 'all' && { tag: selectedTag }),
        ...(selectedAuthor !== 'all' && { authorId: selectedAuthor })
      })

      const response = await fetch(`/api/questions?${params}`)
      const data: PaginatedResponse = await response.json()
      setQuestions(data.questions)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchFilters() {
    try {
      // Buscar tags
      const tagsResponse = await fetch('/api/tags?type=questions')
      const tagsData = await tagsResponse.json()
      setAvailableTags(tagsData.tags)

      // Buscar autores
      const authorsResponse = await fetch('/api/authors')
      const authorsData = await authorsResponse.json()

      // Mapear apenas id e name dos autores
      setAvailableAuthors(
        authorsData.authors.map((author: any) => ({
          id: author.id,
          name: author.name
        }))
      )

    } catch (error) {
      console.error('Erro ao buscar filtros:', error)
    }
  }

  async function handleSearch(e: React.SubmitEvent) {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Implementar busca
      console.log('Buscar:', searchTerm)
    }
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Perguntas e Respostas</h1>
        <p className="text-lg text-muted-foreground">
          Encontre respostas bíblicas para suas dúvidas, baseadas nos escritos de autores confiáveis
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar perguntas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>

        <div className="flex flex-wrap gap-4">
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-50">
              <Tag className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as tags</SelectItem>
              {availableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
            <SelectTrigger className="w-50">
              <User className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por autor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os autores</SelectItem>
              {availableAuthors.map((author) => (
                <SelectItem key={author.id} value={author.id}>{author.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-32" />
              </CardFooter>
            </Card>
          ))
        ) : questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhuma pergunta encontrada</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((q) => (
            <Card key={q.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  <Link href={`/perguntas/${q.id}`} className="hover:text-primary transition-colors">
                    {q.question}
                  </Link>
                </CardTitle>
                {q.context && (
                  <CardDescription>{q.context}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{q.answer}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-4">
                  <Link 
                    href={`/autores/${q.author.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Por {q.author.name}
                  </Link>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex gap-2">
                    {q.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/perguntas/${q.id}`}>
                    Ler resposta
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: pagination.pages }).slice(0, 5).map((_, i) => {
                const page = i + 1
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(page)
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {pagination.pages > 5 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(pagination.pages)
                      }}
                    >
                      {pagination.pages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < pagination.pages) setCurrentPage(currentPage + 1)
                  }}
                  className={currentPage === pagination.pages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}