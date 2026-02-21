'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, BookOpen, MessageCircle, Calendar, ExternalLink, Users } from 'lucide-react'
import Link from 'next/link'

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

export default function AutoresPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('todos')

  useEffect(() => {
    fetchAuthors()
  }, [])

  async function fetchAuthors() {
    try {
      const response = await fetch('/api/authors')
      const data = await response.json()
      setAuthors(data.authors)
    } catch (error) {
      console.error('Erro ao buscar autores:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

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

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar autor por nome ou biografia..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Authors Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Tabs defaultValue="todos" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="mais-ativos">Mais Ativos</TabsTrigger>
            <TabsTrigger value="recentes">Recentes</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAuthors.map((author) => (
                <Card key={author.id} className="transition-all hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src={author.image} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {getInitials(author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{author.name}</CardTitle>
                      <CardDescription>
                        {author._count && (
                          <span className="text-xs">
                            {author._count.questions + author._count.doctrines + author._count.dailyVerses} contribuições
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {author.description || 'Biografia não disponível'}
                    </p>
                    
                    {/* Stats */}
                    {author._count && (
                      <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageCircle className="h-3 w-3" />
                          <span>{author._count.questions}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          <span>{author._count.doctrines}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{author._count.dailyVerses}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
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
          </TabsContent>

          <TabsContent value="mais-ativos">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAuthors
                .sort((a, b) => {
                  const countA = (a._count?.questions || 0) + (a._count?.doctrines || 0) + (a._count?.dailyVerses || 0)
                  const countB = (b._count?.questions || 0) + (b._count?.doctrines || 0) + (b._count?.dailyVerses || 0)
                  return countB - countA
                })
                .map((author) => (
                  // Mesmo card do TabsContent "todos"
                  <Card key={author.id} className="transition-all hover:shadow-lg">
                    {/* ... mesmo conteúdo do card acima ... */}
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="recentes">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAuthors
                .sort((a, b) => (a.id > b.id ? -1 : 1))
                .map((author) => (
                  // Mesmo card do TabsContent "todos"
                  <Card key={author.id} className="transition-all hover:shadow-lg">
                    {/* ... mesmo conteúdo do card acima ... */}
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {!loading && filteredAuthors.length === 0 && (
        <Card className="col-span-full">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum autor encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}