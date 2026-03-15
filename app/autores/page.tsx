'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Search, BookOpen, MessageCircle, Calendar, ExternalLink, Users, Filter, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import debounce from 'lodash/debounce'

interface Author {
  id: string
  name: string
  slug: string
  description?: string
  bioUrl?: string
  image?: string
  _count?: {
    questions: number
    doctrines: number
    dailyVerses: number
  }
}

interface PaginatedResponse {
  authors: Author[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Auxiliar para destacar o termo buscado no texto
function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <span>{text}</span>
  }
  
  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

export default function AutoresPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedTab, setSelectedTab] = useState(searchParams.get('tab') || 'todos')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 1 })

  // Atualizar a URL com os filtros atuais
  const updateUrlParams = useCallback((params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'todos') {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    
    router.push(`/autores?${newParams.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      updateUrlParams({ search: term, page: '1' })
    }, 500),
    [updateUrlParams]
  )

  // Efeito para carregar dados quando os parâmetros da URL mudam
  useEffect(() => {
    fetchAuthors()
  }, [searchParams])

  // Sincronizar estado com parâmetros da URL
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
    setSelectedTab(searchParams.get('tab') || 'todos')
    setCurrentPage(parseInt(searchParams.get('page') || '1'))
  }, [searchParams])

  async function fetchAuthors() {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', currentPage.toString())
      params.set('limit', '9')
      
      if (!searchTerm) params.delete('search')

      const response = await fetch(`/api/authors?${params}`)
      const data: PaginatedResponse = await response.json()
      setAuthors(data.authors)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao buscar autores:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateUrlParams({ search: searchTerm, page: '1' })
  }

  function handleClearSearch() {
    setSearchTerm('')
    updateUrlParams({ search: '', page: '1' })
  }

  function handleTabChange(value: string) {
    setSelectedTab(value)
    updateUrlParams({ tab: value, page: '1' })
  }

  function handlePageChange(page: number) {
    setCurrentPage(page)
    updateUrlParams({ page: page.toString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClearFilters() {
    setSearchTerm('')
    setSelectedTab('todos')
    setCurrentPage(1)
    router.push('/autores')
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getTotalContributions = (author: Author) => {
    return (author._count?.questions || 0) + 
           (author._count?.doctrines || 0) + 
           (author._count?.dailyVerses || 0)
  }

  // Ordenar autores baseado na tab selecionada
  const getSortedAuthors = (authorsToSort: Author[]) => {
    switch (selectedTab) {
      case 'mais-ativos':
        return [...authorsToSort].sort((a, b) => getTotalContributions(b) - getTotalContributions(a))
      case 'recentes':
        return [...authorsToSort].sort((a, b) => (a.id > b.id ? -1 : 1))
      default:
        return authorsToSort
    }
  }

  const sortedAuthors = getSortedAuthors(authors)

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-8 w-8 text-secondary" />
          <h1 className="text-4xl font-bold text-primary">Autores</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Conheça os autores confiáveis que contribuem com ensinamentos baseados na sã doutrina
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar autor por nome ou biografia..."
              className="pl-10 pr-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                debouncedSearch(e.target.value)
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit">Buscar</Button>
        </form>

        {/* Active filters indicator */}
        {(searchTerm || selectedTab !== 'todos') && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Filtros ativos: {searchTerm ? 'busca' : ''} {selectedTab !== 'todos' ? 'ordenação' : ''}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
            >
              Limpar filtros
            </Button>
          </div>
        )}

        {/* Result info */}
        {!loading && authors.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Mostrando {authors.length} de {pagination.total} autores
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        )}
      </div>

      {/* Authors Grid with Tabs */}
      <Tabs defaultValue="todos" value={selectedTab} onValueChange={handleTabChange}>
        <TabsList className="mb-8">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="mais-ativos">Mais Ativos</TabsTrigger>
          <TabsTrigger value="recentes">Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-0">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                    <div className="flex gap-4 mt-4">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : sortedAuthors.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Nenhum autor encontrado</p>
                {(searchTerm || selectedTab !== 'todos') && (
                  <Button variant="outline" onClick={handleClearFilters}>
                    Limpar filtros e ver todos os autores
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedAuthors.map((author) => (
                <Card key={author.id} className="transition-all hover:shadow-lg flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src={author.image} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {getInitials(author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl truncate">
                        {searchTerm ? (
                          <HighlightText text={author.name} highlight={searchTerm} />
                        ) : (
                          author.name
                        )}
                      </CardTitle>
                      <CardDescription>
                        {author._count && (
                          <span className="text-xs">
                            {getTotalContributions(author)} contribuições
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {searchTerm && author.description ? (
                        <HighlightText text={author.description} highlight={searchTerm} />
                      ) : (
                        author.description || 'Biografia não disponível'
                      )}
                    </p>
                    
                    {/* Stats */}
                    {author._count && (
                      <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Perguntas">
                          <MessageCircle className="h-3 w-3" />
                          <span>{author._count.questions}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Doutrinas">
                          <BookOpen className="h-3 w-3" />
                          <span>{author._count.doctrines}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Frases Diárias">
                          <Calendar className="h-3 w-3" />
                          <span>{author._count.dailyVerses}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1" asChild>
                      <Link href={`/autores/${author.slug}`}>
                        Ver Perfil
                      </Link>
                    </Button>
                    {author.bioUrl && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={author.bioUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

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
                    if (currentPage > 1) handlePageChange(currentPage - 1)
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let page = i + 1
                if (pagination.pages > 5) {
                  if (currentPage <= 3) {
                    page = i + 1
                  } else if (currentPage >= pagination.pages - 2) {
                    page = pagination.pages - 4 + i
                  } else {
                    page = currentPage - 2 + i
                  }
                }
                
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(page)
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {pagination.pages > 5 && currentPage < pagination.pages - 2 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(pagination.pages)
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
                    if (currentPage < pagination.pages) handlePageChange(currentPage + 1)
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