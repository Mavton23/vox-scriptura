'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, Search, User, Tag, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
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
import { FavoriteButton } from '@/components/common/favorite-button'

interface DailyVerse {
  id: string
  verse: string
  text: string
  explanation: string
  author: {
    name: string
    slug: string
  }
  tags: string[]
  scheduledFor?: string
  createdAt: string
}

export default function FrasesDiariasPage() {
  const [verses, setVerses] = useState<DailyVerse[]>([])
  const [todayVerse, setTodayVerse] = useState<DailyVerse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [selectedAuthor, setSelectedAuthor] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [availableAuthors, setAvailableAuthors] = useState<{ id: string; name: string }[]>([])
  const [likedVerses, setLikedVerses] = useState<string[]>([])

  useEffect(() => {
    fetchTodayVerse()
    fetchVerses()
    fetchFilters()
  }, [currentPage, selectedTag, selectedAuthor])

  async function fetchTodayVerse() {
    try {
      const response = await fetch('/api/daily?type=today')
      const data = await response.json()
      setTodayVerse(data)
    } catch (error) {
      console.error('Erro ao buscar versículo do dia:', error)
    }
  }

  async function fetchVerses() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: 'list',
        page: currentPage.toString(),
        limit: '12',
        ...(selectedTag !== 'all' && { tag: selectedTag }),
        ...(selectedAuthor !== 'all' && { authorId: selectedAuthor })
      })

      const response = await fetch(`/api/daily?${params}`)
      const data = await response.json()
      setVerses(data.verses)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Erro ao buscar versículos:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchFilters() {
    try {
      const tagsResponse = await fetch('/api/tags?type=daily')
      const tagsData = await tagsResponse.json()
      setAvailableTags(tagsData.tags)

      const authorsResponse = await fetch('/api/authors')
      const authorsData = await authorsResponse.json()
      setAvailableAuthors(authorsData)
    } catch (error) {
      console.error('Erro ao buscar filtros:', error)
    }
  }

  const toggleLike = (id: string) => {
    setLikedVerses(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    )
  }

  const handleShare = (verse: DailyVerse) => {
    if (navigator.share) {
      navigator.share({
        title: verse.verse,
        text: `${verse.text} - ${verse.explanation}`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-8 w-8 text-secondary" />
          <h1 className="text-4xl font-bold text-primary">Frases Diárias</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Versículos com explicações práticas para sua meditação diária
        </p>
      </div>

      {/* Versículo do Dia */}
      {todayVerse && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Versículo do Dia</h2>
          <Card className="relative overflow-hidden bg-linear-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full -ml-8 -mb-8" />
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="mb-2">Destaque de Hoje</Badge>
                <div className="flex gap-2">
                  <FavoriteButton 
                    type='verse'
                    id={todayVerse.id}
                    variant="ghost" 
                    size="icon"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleShare(todayVerse)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-3xl text-primary">{todayVerse.verse}</CardTitle>
              <CardDescription className="text-lg italic">
                "{todayVerse.text}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{todayVerse.explanation}</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Link 
                href={`/autores/${todayVerse.author.slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <User className="inline h-3 w-3 mr-1" />
                {todayVerse.author.name}
              </Link>
              <div className="flex gap-2">
                {todayVerse.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        </section>
      )}

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar versículos por referência, texto ou explicação..."
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

      {/* Verses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-32" />
              </CardFooter>
            </Card>
          ))
        ) : verses.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhum versículo encontrado</p>
            </CardContent>
          </Card>
        ) : (
          verses.map((verse) => (
            <Card key={verse.id} className="transition-all hover:shadow-lg flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">
                    {verse.scheduledFor ? format(new Date(verse.scheduledFor), "dd 'de' MMMM", { locale: ptBR }) : 'Data livre'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleLike(verse.id)}
                  >
                    <Heart className={`h-4 w-4 ${likedVerses.includes(verse.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
                <CardTitle className="text-xl text-primary">{verse.verse}</CardTitle>
                <CardDescription className="line-clamp-2 italic">
                  "{verse.text}"
                </CardDescription>
              </CardHeader>
              <CardContent className="grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {verse.explanation}
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex-col items-start gap-3">
                <div className="flex items-center justify-between w-full">
                  <Link 
                    href={`/autores/${verse.author.slug}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <User className="inline h-3 w-3 mr-1" />
                    {verse.author.name}
                  </Link>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/frases-diarias/${verse.id}`}>
                      Meditar
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {verse.tags.slice(0, 2).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="text-xs cursor-pointer"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {verse.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">+{verse.tags.length - 2}</Badge>
                  )}
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
        </div>
      )}
    </div>
  )
}