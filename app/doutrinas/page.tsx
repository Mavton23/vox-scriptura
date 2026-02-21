'use client'

import { useState, useEffect } from 'react'
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
import { Search, User, Tag, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface Doctrine {
  id: string
  title: string
  slug: string
  summary: string
  author: {
    name: string
    slug: string
  }
  tags: string[]
  createdAt: string
}

export default function DoutrinasPage() {
  const [doctrines, setDoctrines] = useState<Doctrine[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [selectedAuthor, setSelectedAuthor] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [availableAuthors, setAvailableAuthors] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetchDoctrines()
    fetchFilters()
  }, [currentPage, selectedTag, selectedAuthor])

  async function fetchDoctrines() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(selectedTag !== 'all' && { tag: selectedTag }),
        ...(selectedAuthor !== 'all' && { authorId: selectedAuthor })
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

  async function fetchFilters() {
    try {
      const tagsResponse = await fetch('/api/tags?type=doctrines')
      const tagsData = await tagsResponse.json()
      setAvailableTags(tagsData.tags)

      const authorsResponse = await fetch('/api/authors')
      const authorsData = await authorsResponse.json()
      setAvailableAuthors(authorsData.authors)
    } catch (error) {
      console.error('Erro ao buscar filtros:', error)
    }
  }

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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar doutrinas..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
              <p className="text-muted-foreground">Nenhuma doutrina encontrada</p>
            </CardContent>
          </Card>
        ) : (
          doctrines.map((d) => (
            <Card key={d.id} className="transition-all hover:shadow-lg flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl line-clamp-2">
                  <Link href={`/doutrinas/${d.slug}`} className="hover:text-primary transition-colors">
                    {d.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {d.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="grow">
                <div className="flex flex-wrap gap-2">
                  {d.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {d.tags.length > 3 && (
                    <Badge variant="outline">+{d.tags.length - 3}</Badge>
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
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, pagination.pages) }).map((_, i) => {
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
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}