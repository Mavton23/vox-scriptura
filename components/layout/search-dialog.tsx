'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, MessageCircle, BookOpen, Calendar, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchResults {
  questions?: Array<{
    id: string
    question: string
    author: { name: string }
    tags: string[]
  }>
  doctrines?: Array<{
    id: string
    title: string
    slug: string
    summary: string
    author: { name: string }
    tags: string[]
  }>
  verses?: Array<{
    id: string
    verse: string
    text: string
    author: { name: string }
    tags: string[]
  }>
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>({})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch()
    } else {
      setResults({})
    }
  }, [debouncedQuery])

  async function performSearch() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: debouncedQuery,
        type: activeTab === 'all' ? 'all' : activeTab
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Erro na busca:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setQuery('')
    setResults({})
    onOpenChange(false)
  }

  const totalResults = 
    (results.questions?.length || 0) + 
    (results.doctrines?.length || 0) + 
    (results.verses?.length || 0)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-175 max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Busca Global
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar perguntas, doutrinas, versículos..."
            className="pl-10 pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && query && totalResults === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum resultado encontrado para "{query}"</p>
          </div>
        )}

        {!loading && query && totalResults > 0 && (
          <>
            <div className="text-sm text-muted-foreground mb-2">
              {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="questions" disabled={!results.questions?.length}>
                  Perguntas ({results.questions?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="doctrines" disabled={!results.doctrines?.length}>
                  Doutrinas ({results.doctrines?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="daily" disabled={!results.verses?.length}>
                  Versículos ({results.verses?.length || 0})
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 overflow-y-auto max-h-100 pr-2">
                <TabsContent value="all" className="space-y-6">
                  {results.questions && results.questions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Perguntas e Respostas
                      </h3>
                      <div className="space-y-3">
                        {results.questions.slice(0, 3).map((item) => (
                          <SearchResultItem
                            key={item.id}
                            href={`/perguntas/${item.id}`}
                            title={item.question}
                            subtitle={`Por ${item.author.name}`}
                            tags={item.tags}
                            icon={<MessageCircle className="h-4 w-4 text-secondary" />}
                            onClick={handleClose}
                          />
                        ))}
                        {results.questions.length > 3 && (
                          <Link
                            href={`/perguntas?q=${query}`}
                            className="text-sm text-primary hover:underline block text-center"
                            onClick={handleClose}
                          >
                            Ver todas as {results.questions.length} perguntas
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {results.doctrines && results.doctrines.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Doutrinas
                      </h3>
                      <div className="space-y-3">
                        {results.doctrines.slice(0, 3).map((item) => (
                          <SearchResultItem
                            key={item.id}
                            href={`/doutrinas/${item.slug}`}
                            title={item.title}
                            subtitle={item.summary}
                            tags={item.tags}
                            icon={<BookOpen className="h-4 w-4 text-secondary" />}
                            onClick={handleClose}
                          />
                        ))}
                        {results.doctrines.length > 3 && (
                          <Link
                            href={`/doutrinas?q=${query}`}
                            className="text-sm text-primary hover:underline block text-center"
                            onClick={handleClose}
                          >
                            Ver todas as {results.doctrines.length} doutrinas
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {results.verses && results.verses.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Frases Diárias
                      </h3>
                      <div className="space-y-3">
                        {results.verses.slice(0, 3).map((item) => (
                          <SearchResultItem
                            key={item.id}
                            href={`/frases-diarias/${item.id}`}
                            title={item.verse}
                            subtitle={item.text}
                            tags={item.tags}
                            icon={<Calendar className="h-4 w-4 text-secondary" />}
                            onClick={handleClose}
                          />
                        ))}
                        {results.verses.length > 3 && (
                          <Link
                            href={`/frases-diarias?q=${query}`}
                            className="text-sm text-primary hover:underline block text-center"
                            onClick={handleClose}
                          >
                            Ver todos os {results.verses.length} versículos
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="questions" className="space-y-3">
                  {results.questions?.map((item) => (
                    <SearchResultItem
                      key={item.id}
                      href={`/perguntas/${item.id}`}
                      title={item.question}
                      subtitle={`Por ${item.author.name}`}
                      tags={item.tags}
                      icon={<MessageCircle className="h-4 w-4 text-secondary" />}
                      onClick={handleClose}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="doctrines" className="space-y-3">
                  {results.doctrines?.map((item) => (
                    <SearchResultItem
                      key={item.id}
                      href={`/doutrinas/${item.slug}`}
                      title={item.title}
                      subtitle={item.summary}
                      tags={item.tags}
                      icon={<BookOpen className="h-4 w-4 text-secondary" />}
                      onClick={handleClose}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="daily" className="space-y-3">
                  {results.verses?.map((item) => (
                    <SearchResultItem
                      key={item.id}
                      href={`/frases-diarias/${item.id}`}
                      title={item.verse}
                      subtitle={item.text}
                      tags={item.tags}
                      icon={<Calendar className="h-4 w-4 text-secondary" />}
                      onClick={handleClose}
                    />
                  ))}
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface SearchResultItemProps {
  href: string
  title: string
  subtitle: string
  tags: string[]
  icon: React.ReactNode
  onClick: () => void
}

function SearchResultItem({ href, title, subtitle, tags, icon, onClick }: SearchResultItemProps) {
  return (
    <Link href={href} onClick={onClick}>
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border">
        <div className="mt-1">{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{subtitle}</p>
          {tags && tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}