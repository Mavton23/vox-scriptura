import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, BookOpen, MessageCircle, Calendar, ExternalLink, Quote } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

async function getAuthor(slug: string) {
  const res = await fetch(`http://localhost:3000/api/authors/${slug}`, {
    cache: 'no-store'
  })
  if (!res.ok) return null
  return res.json()
}

export default async function AutorDetalhePage({ params }: { params: Promise <{ slug: string }> }) {
  
   const { slug } = await params; 
   const author = await getAuthor(slug)

  if (!author) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Autor não encontrado</h1>
        <Button asChild>
          <Link href="/autores">Voltar para autores</Link>
        </Button>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="container py-12 max-w-5xl">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/autores">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para autores
        </Link>
      </Button>

      {/* Author Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={author.image} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                {getInitials(author.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-3xl text-primary mb-2">{author.name}</CardTitle>
              <CardDescription className="text-base">
                {author.description || 'Biografia não disponível'}
              </CardDescription>
              {author.bioUrl && (
                <Button variant="link" className="px-0 mt-2" asChild>
                  <a href={author.bioUrl} target="_blank" rel="noopener noreferrer">
                    Saiba mais
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perguntas</CardTitle>
            <MessageCircle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{author.questions?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doutrinas</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{author.doctrines?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frases Diárias</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{author.dailyVerses?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="questions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="questions">Perguntas e Respostas</TabsTrigger>
          <TabsTrigger value="doctrines">Doutrinas</TabsTrigger>
          <TabsTrigger value="verses">Frases Diárias</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          {author.questions?.length > 0 ? (
            author.questions.map((q: any) => (
              <Card key={q.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href={`/perguntas/${q.id}`} className="hover:text-primary transition-colors">
                      {q.question}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(q.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{q.answer}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    {q.tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma pergunta encontrada para este autor
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="doctrines" className="space-y-4">
          {author.doctrines?.length > 0 ? (
            author.doctrines.map((d: any) => (
              <Card key={d.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href={`/doutrinas/${d.slug}`} className="hover:text-primary transition-colors">
                      {d.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(d.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{d.summary || d.content.substring(0, 150)}...</p>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    {d.tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma doutrina encontrada para este autor
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="verses" className="space-y-4">
          {author.dailyVerses?.length > 0 ? (
            author.dailyVerses.map((v: any) => (
              <Card key={v.id}>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{v.verse}</CardTitle>
                  <CardDescription>
                    {format(new Date(v.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="italic text-muted-foreground mb-2">"{v.text}"</p>
                  <p className="text-sm text-muted-foreground">{v.explanation}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    {v.tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma frase diária encontrada para este autor
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}