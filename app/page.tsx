import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookOpen, MessageCircle, Calendar, ArrowRight, Quote } from 'lucide-react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_APP_URL || ''

interface DailyVerse {
  id: string
  verse: string
  text: string
  explanation: string
  author: {
    id: string
    name: string
    slug: string
  }
  tags: string[]
}

interface Question {
  id: string
  question: string
  author: {
    name: string
    slug: string
  }
  tags: string[]
  createdAt: string
}

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

async function getDailyVerse(): Promise<DailyVerse | null> {
  try {
    const response = await fetch(`${API_URL}/api/daily?type=today`, {
      next: { revalidate: 3600 }
    })
    
    if (!response.ok) {
      console.error('Erro ao buscar versículo do dia:', response.status)
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar versículo do dia:', error)
    return null
  }
}

async function getRecentQuestions(limit: number = 3): Promise<Question[]> {
  try {
    const response = await fetch(`${API_URL}/api/questions?page=1&limit=${limit}`, {
      next: { revalidate: 300 }
    })
    
    if (!response.ok) {
      console.error('Erro ao buscar perguntas recentes:', response.status)
      return []
    }
    
    const data = await response.json()
    return data.questions || []
  } catch (error) {
    console.error('Erro ao buscar perguntas recentes:', error)
    return []
  }
}

async function getRecentDoctrines(limit: number = 3): Promise<Doctrine[]> {
  try {
    const response = await fetch(`${API_URL}/api/doctrines?page=1&limit=${limit}`, {
      next: { revalidate: 300 }
    })
    
    if (!response.ok) {
      console.error('Erro ao buscar doutrinas recentes:', response.status)
      return []
    }
    
    const data = await response.json()
    return data.doctrines || []
  } catch (error) {
    console.error('Erro ao buscar doutrinas recentes:', error)
    return []
  }
}

export default async function HomePage() {

  const [dailyVerse, recentQuestions, recentDoctrines] = await Promise.all([
    getDailyVerse(),
    getRecentQuestions(3),
    getRecentDoctrines(3)
  ])

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative w-full bg-linear-to-b from-primary/5 to-background pt-16 pb-24">
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Voz da Escritura
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
              Aprenda e Cresça na
              <span className="text-foreground block">Sã Doutrina</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Uma plataforma dedicada ao ensino bíblico baseado nos escritos de autores confiáveis,
              comprometidos com a verdade das Escrituras.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/perguntas">
                  Explorar Perguntas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/doutrinas">
                  Ver Doutrinas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Verse */}
      {dailyVerse && (
        <section className="container">
          <div className="relative overflow-hidden rounded-2xl bg-primary/5 p-8 md:p-12">
            <Quote className="absolute right-4 top-4 h-24 w-24 text-primary/10" />
            <div className="relative z-10">
              <Badge className="mb-4">Versículo do Dia</Badge>
              <h2 className="text-2xl font-bold text-primary md:text-3xl">{dailyVerse.verse}</h2>
              <p className="mt-4 text-lg text-muted-foreground italic">"{dailyVerse.text}"</p>
              <Separator className="my-6" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">{dailyVerse.explanation}</span>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                — {dailyVerse.author.name}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="container">
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="relative overflow-hidden transition-all hover:shadow-lg">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-secondary" />
              <CardTitle className="mt-4">Perguntas e Respostas</CardTitle>
              <CardDescription>
                Respostas bíblicas para suas dúvidas, baseadas nos escritos de autores confiáveis
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" asChild className="group">
                <Link href="/perguntas">
                  Ver perguntas
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative overflow-hidden transition-all hover:shadow-lg">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-secondary" />
              <CardTitle className="mt-4">Ensino de Doutrina</CardTitle>
              <CardDescription>
                Estudos profundos sobre as principais doutrinas da fé cristã
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" asChild className="group">
                <Link href="/doutrinas">
                  Ver doutrinas
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative overflow-hidden transition-all hover:shadow-lg">
            <CardHeader>
              <Calendar className="h-12 w-12 text-secondary" />
              <CardTitle className="mt-4">Frases Diárias</CardTitle>
              <CardDescription>
                Versículos com explicações práticas para sua meditação diária
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" asChild className="group">
                <Link href="/frases-diarias">
                  Ver frases
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Recent Content */}
      <section className="container">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Recent Questions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Perguntas Recentes</h2>
              <Button variant="ghost" asChild>
                <Link href="/perguntas">
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recentQuestions.length > 0 ? (
                recentQuestions.map((q) => (
                  <Card key={q.id} className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        <Link href={`/perguntas/${q.id}`} className="hover:text-primary transition-colors">
                          {q.question}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Por {q.author.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {q.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                          {q.tags && q.tags.length > 2 && (
                            <Badge variant="outline">+{q.tags.length - 2}</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhuma pergunta encontrada
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Recent Doctrines */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Doutrinas Recentes</h2>
              <Button variant="ghost" asChild>
                <Link href="/doutrinas">
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recentDoctrines.length > 0 ? (
                recentDoctrines.map((d) => (
                  <Card key={d.id} className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        <Link href={`/doutrinas/${d.slug}`} className="hover:text-primary transition-colors">
                          {d.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{d.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Por {d.author.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {d.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                          {d.tags && d.tags.length > 2 && (
                            <Badge variant="outline">+{d.tags.length - 2}</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhuma doutrina encontrada
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <div className="rounded-2xl bg-primary p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold">Pronto para aprofundar seus estudos?</h2>
          <p className="mt-4 text-lg opacity-90">
            Explore nossa biblioteca de perguntas, doutrinas e versículos comentados
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link href="/doutrinas">
              Começar Agora
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}