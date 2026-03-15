'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { Search, User, Tag, BookOpen, Filter, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import debounce from 'lodash/debounce'

interface Doctrine {
  id: string
  title: string
  slug: string
  summary: string
  author: {
    id: string
    name: string
    slug: string
  }
  tags: string[]
  createdAt: string
}

interface PaginatedResponse {
  doctrines: Doctrine[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Destacar o termo buscado no texto
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

export default function DoutrinasPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [doctrines, setDoctrines] = useState<Doctrine[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || 'all')
  const [selectedAuthor, setSelectedAuthor] = useState(searchParams.get('authorId') || 'all')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [availableAuthors, setAvailableAuthors] = useState<{ id: string; name: string }[]>([])

  // Atualizar a URL com os filtros atuais
  const updateUrlParams = useCallback((params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    
    router.push(`/doutrinas?${newParams.toString()}`, { scroll: false })
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
    fetchDoctrines()
  }, [searchParams])

  // Efeito para carregar filtros iniciais
  useEffect(() => {
    fetchFilters()
  }, [])

  // Sincronizar estado com parâmetros da URL
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
    setSelectedTag(searchParams.get('tag') || 'all')
    setSelectedAuthor(searchParams.get('authorId') || 'all')
    setCurrentPage(parseInt(searchParams.get('page') || '1'))
  }, [searchParams])

  async function fetchDoctrines() {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', currentPage.toString())
      params.set('limit', '10')
      
      // Remover 'all' dos parâmetros
      if (selectedTag === 'all') params.delete('tag')
      if (selectedAuthor === 'all') params.delete('authorId')
      if (!searchTerm) params.delete('search')

      const response = await fetch(`/api/doctrines?${params}`)
      const data: PaginatedResponse = await response.json()
      setDoctrines(data.doctrines)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao buscar doutrinas:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchFilters() {
    try {
      // Buscar tags específicas para doutrinas
      const tagsResponse = await fetch('/api/tags?type=doctrines')
      const tagsData = await tagsResponse.json()
      setAvailableTags(tagsData.tags || [])

      // Buscar autores
      const authorsResponse = await fetch('/api/authors')
      const authorsData = await authorsResponse.json()
      setAvailableAuthors(
        authorsData.authors?.map((author: any) => ({
          id: author.id,
          name: author.name
        })) || []
      )
    } catch (error) {
      console.error('Erro ao buscar filtros:', error)
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

  function handleTagChange(value: string) {
    setSelectedTag(value)
    updateUrlParams({ tag: value, page: '1' })
  }

  function handleAuthorChange(value: string) {
    setSelectedAuthor(value)
    updateUrlParams({ authorId: value, page: '1' })
  }

  function handlePageChange(page: number) {
    setCurrentPage(page)
    updateUrlParams({ page: page.toString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClearFilters() {
    setSearchTerm('')
    setSelectedTag('all')
    setSelectedAuthor('all')
    setCurrentPage(1)
    router.push('/doutrinas')
  }

  // Contar filtros ativos
  const activeFiltersCount = [
    searchTerm && 'busca',
    selectedTag !== 'all' && 'tag',
    selectedAuthor !== 'all' && 'autor'
  ].filter(Boolean).length

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-8 w-8 text-secondary" />
          <h1 className="text-4xl font-bold text-primary">Ensino de Doutrina</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Estudos profundos sobre as principais doutrinas da fé cristã, baseados em autores confiáveis
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar doutrinas por título ou conteúdo..."
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

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Filtros ativos: {activeFiltersCount}
            </span>
          </div>

          <Select value={selectedTag} onValueChange={handleTagChange}>
            <SelectTrigger className="w-45">
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

          <Select value={selectedAuthor} onValueChange={handleAuthorChange}>
            <SelectTrigger className="w-45">
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

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
            >
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Result info */}
        {!loading && doctrines.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Mostrando {doctrines.length} de {pagination.total} doutrinas
            {searchTerm && ` para "${searchTerm}"`}
            {selectedTag !== 'all' && ` na tag "${selectedTag}"`}
            {selectedAuthor !== 'all' && ` do autor selecionado`}
          </p>
        )}
      </div>

      {/* Doctrines Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
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
        ) : doctrines.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhuma doutrina encontrada</p>
              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Limpar filtros e ver todas as doutrinas
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          doctrines.map((d) => (
            <Card key={d.id} className="transition-all hover:shadow-lg flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl line-clamp-2">
                  <Link href={`/doutrinas/${d.slug}`} className="hover:text-primary transition-colors">
                    {searchTerm ? (
                      <HighlightText text={d.title} highlight={searchTerm} />
                    ) : (
                      d.title
                    )}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {searchTerm ? (
                    <HighlightText text={d.summary} highlight={searchTerm} />
                  ) : (
                    d.summary
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grow">
                <div className="flex flex-wrap gap-2">
                  {d.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant={selectedTag === tag ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleTagChange(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {d.tags.length > 3 && (
                    <Badge variant="outline" className="cursor-default">
                      +{d.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex items-center justify-between w-full">
                  <Link 
                    href={`/autores/${d.author.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Por {d.author.name}
                  </Link>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/doutrinas/${d.slug}`}>
                      Ler mais
                    </Link>
                  </Button>
                </div>
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