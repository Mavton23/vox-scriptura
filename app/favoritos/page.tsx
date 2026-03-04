'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Heart, MessageCircle, BookOpen, Calendar, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface FavoriteItem {
  id: string
  title?: string
  question?: string
  verse?: string
  text?: string
  summary?: string
  slug?: string
  author: {
    name: string
    slug: string
  }
  tags: string[]
  createdAt: string
}

interface PaginatedResponse {
  favorites: FavoriteItem[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function FavoritosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('questions')
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/favoritos')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchFavorites()
    }
  }, [session, activeTab, currentPage])

  async function fetchFavorites() {
    setLoading(true)
    try {
      const response = await fetch(`/api/favorites/${activeTab}?page=${currentPage}&limit=10`)
      const data: PaginatedResponse = await response.json()
      setFavorites(data.favorites)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(id: string) {
    try {
      const response = await fetch(`/api/favorites/${activeTab}?${activeTab.slice(0, -1)}Id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remover da lista local
        setFavorites(prev => prev.filter(f => f.id !== id))
        // Atualizar paginação
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1,
          pages: Math.ceil((prev.total - 1) / prev.limit)
        }))
      }
    } catch (error) {
      console.error('Erro ao remover favorito:', error)
    }
  }

  const getItemUrl = (item: FavoriteItem) => {
    switch (activeTab) {
      case 'questions':
        return `/perguntas/${item.id}`
      case 'doctrines':
        return `/doutrinas/${item.slug}`
      case 'verses':
        return `/frases-diarias/${item.id}`
      default:
        return '#'
    }
  }

  const getItemTitle = (item: FavoriteItem) => {
    switch (activeTab) {
      case 'questions':
        return item.question
      case 'doctrines':
        return item.title
      case 'verses':
        return item.verse
      default:
        return ''
    }
  }

  const getItemDescription = (item: FavoriteItem) => {
    switch (activeTab) {
      case 'questions':
        return item.question
      case 'doctrines':
        return item.summary
      case 'verses':
        return item.text
      default:
        return ''
    }
  }

  const getIcon = () => {
    switch (activeTab) {
      case 'questions':
        return <MessageCircle className="h-5 w-5 text-secondary" />
      case 'doctrines':
        return <BookOpen className="h-5 w-5 text-secondary" />
      case 'verses':
        return <Calendar className="h-5 w-5 text-secondary" />
    }
  }

  if (status === 'loading') {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center h-64">
          <Skeleton className="h-8 w-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-8 w-8 text-secondary fill-current" />
          <h1 className="text-4xl font-bold text-primary">Meus Favoritos</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Gerencie todo o conteúdo que você salvou para estudar depois
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Perguntas
          </TabsTrigger>
          <TabsTrigger value="doctrines" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Doutrinas
          </TabsTrigger>
          <TabsTrigger value="verses" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Versículos
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-32" />
                </CardFooter>
              </Card>
            ))
          ) : favorites.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum favorito ainda</h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não salvou nenhum {activeTab === 'questions' ? 'pergunta' : activeTab === 'doctrines' ? 'doutrina' : 'versículo'} nos favoritos
                </p>
                <Button asChild>
                  <Link href={`/${activeTab}`}>
                    Explorar {activeTab === 'questions' ? 'Perguntas' : activeTab === 'doctrines' ? 'Doutrinas' : 'Frases Diárias'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {favorites.map((item) => (
                  <Card key={item.id} className="relative group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getIcon()}
                          <div>
                            <CardTitle className="text-xl">
                              <Link href={getItemUrl(item)} className="hover:text-primary transition-colors">
                                {getItemTitle(item)}
                              </Link>
                            </CardTitle>
                            <CardDescription className="mt-2">
                              {getItemDescription(item)}
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemove(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Link 
                        href={`/autores/${item.author.slug}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        Por {item.author.name}
                      </Link>
                      <div className="flex flex-wrap gap-2">
                        {item.tags?.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <Pagination className="mt-8">
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
                        className={currentPage === pagination.pages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}