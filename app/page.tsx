import Link from 'next/link'

import {
  ArrowRight,
  BookOpen,
  Calendar,
  MessageCircle,
  Quote,
  ShieldCheck,
  Brain,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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
      next: { revalidate: 3600 },
    })

    if (!response.ok) return null

    return await response.json()
  } catch {
    return null
  }
}

async function getRecentQuestions(
  limit: number = 3
): Promise<Question[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/questions?page=1&limit=${limit}`,
      {
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) return []

    const data = await response.json()

    return data.questions || []
  } catch {
    return []
  }
}

async function getRecentDoctrines(
  limit: number = 3
): Promise<Doctrine[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/doctrines?page=1&limit=${limit}`,
      {
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) return []

    const data = await response.json()

    return data.doctrines || []
  } catch {
    return []
  }
}

const features = [
  {
    icon: MessageCircle,
    title: 'Perguntas & Respostas',
    description:
      'Respostas bíblicas para dúvidas teológicas e práticas cristãs.',
    href: '/perguntas',
  },

  {
    icon: BookOpen,
    title: 'Doutrinas',
    description:
      'Ensino sistemático das principais doutrinas da fé cristã.',
    href: '/doutrinas',
  },

  {
    icon: Calendar,
    title: 'Frases Diárias',
    description:
      'Reflexões e versículos comentados para sua caminhada diária.',
    href: '/frases-diarias',
  },
]

export default async function HomePage() {
  const [dailyVerse, recentQuestions, recentDoctrines] =
    await Promise.all([
      getDailyVerse(),
      getRecentQuestions(3),
      getRecentDoctrines(3),
    ])

  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-col">
        {/* HERO */}
        <section className="relative overflow-hidden border-b bg-linear-to-b from-primary/10 via-background to-background">
          <div className="absolute inset-0 bg-grid-white/[0.02]" />

          <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center md:px-8">
            <Badge
              variant="secondary"
              className="mb-6 rounded-full px-4 py-1 text-sm"
            >
              {/* <Sparkles className="mr-2 h-4 w-4" /> */}
              Voz da Escritura
            </Badge>

            <h1 className="max-w-5xl text-5xl font-bold tracking-tight md:text-7xl">
              Aprenda e Cresça na{' '}
              <span className="bg-linear-to-r from-primary to-hightlight bg-clip-text text-transparent">
                Sã Doutrina
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Uma plataforma dedicada ao ensino bíblico sólido,
              baseada em autores confiáveis e comprometida com a
              verdade das Escrituras.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/perguntas">
                  Explorar Perguntas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <Link href="/doutrinas">
                  Ver Doutrinas
                </Link>
              </Button>
            </div>

            {/* STATS */}
            <div className="mt-20 grid w-full max-w-5xl gap-6 md:grid-cols-3">
              <Card className="border-border/60 bg-background/70 backdrop-blur">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>

                  <div className="text-left">
                    <div className="text-3xl font-bold text-primary">
                      +100
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Perguntas Respondidas
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-background/70 backdrop-blur">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>

                  <div className="text-left">
                    <div className="text-3xl font-bold text-primary">
                      +50
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Estudos Doutrinários
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-background/70 backdrop-blur">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>

                  <div className="text-left">
                    <div className="text-3xl font-bold text-primary">
                      100%
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Conteúdo Verificado
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* DAILY VERSE */}
        {dailyVerse && (
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <div className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/10 via-background to-secondary/10 p-8 md:p-14">
                <Quote className="absolute right-6 top-6 h-28 w-28 text-primary/10" />

                <div className="relative z-10 max-w-4xl">
                  <Badge className="mb-5 rounded-full px-4 py-1">
                    Versículo do Dia
                  </Badge>

                  <h2 className="text-3xl font-bold text-primary md:text-4xl">
                    {dailyVerse.verse}
                  </h2>

                  <p className="mt-6 text-xl italic leading-relaxed text-muted-foreground">
                    "{dailyVerse.text}"
                  </p>

                  <Separator className="my-8" />

                  <p className="leading-relaxed text-muted-foreground">
                    {dailyVerse.explanation}
                  </p>

                  <p className="mt-6 font-medium text-primary">
                    — {dailyVerse.author.name}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FEATURES */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-14 text-center">
              <Badge variant="outline" className="mb-4">
                Recursos
              </Badge>

              <h2 className="text-4xl font-bold tracking-tight">
                Explore a Plataforma
              </h2>

              <p className="mt-4 text-lg text-muted-foreground">
                Ferramentas desenvolvidas para fortalecer sua vida espiritual.
              </p>
            </div>

            <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <Card
                    key={feature.title}
                    className="group flex h-full flex-col border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <CardHeader>
                      <div className="mb-4 w-fit rounded-2xl bg-primary/10 p-4 transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-8 w-8" />
                      </div>

                      <CardTitle>{feature.title}</CardTitle>

                      <CardDescription className="leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter className="mt-auto">
                      <Button
                        variant="ghost"
                        asChild
                        className="group/button px-0"
                      >
                        <Link href={feature.href}>
                          Explorar
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* RECENT CONTENT */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid gap-10 lg:grid-cols-2">
              {/* QUESTIONS */}
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">
                      Perguntas Recentes
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                      Respostas bíblicas para dúvidas frequentes.
                    </p>
                  </div>

                  <Button variant="ghost" asChild>
                    <Link href="/perguntas">
                      Ver todas
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="space-y-5">
                  {recentQuestions.length > 0 ? (
                    recentQuestions.map((q) => (
                      <Card
                        key={q.id}
                        className="transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                      >
                        <CardHeader>
                          <CardTitle className="text-xl leading-snug">
                            <Link
                              href={`/perguntas/${q.id}`}
                              className="transition-colors hover:text-primary"
                            >
                              {q.question}
                            </Link>
                          </CardTitle>
                        </CardHeader>

                        <CardContent>
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <p className="text-sm text-muted-foreground">
                              Por {q.author.name}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {q.tags?.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                >
                                  {tag}
                                </Badge>
                              ))}

                              {q.tags &&
                                q.tags.length > 2 && (
                                  <Badge variant="outline">
                                    +{q.tags.length - 2}
                                  </Badge>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                          Nenhuma pergunta encontrada.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* DOCTRINES */}
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">
                      Doutrinas Recentes
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                      Estudos teológicos aprofundados.
                    </p>
                  </div>

                  <Button variant="ghost" asChild>
                    <Link href="/doutrinas">
                      Ver todas
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="space-y-5">
                  {recentDoctrines.length > 0 ? (
                    recentDoctrines.map((d) => (
                      <Card
                        key={d.id}
                        className="transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                      >
                        <CardHeader>
                          <CardTitle className="text-xl leading-snug">
                            <Link
                              href={`/doutrinas/${d.slug}`}
                              className="transition-colors hover:text-primary"
                            >
                              {d.title}
                            </Link>
                          </CardTitle>

                          <CardDescription className="line-clamp-3 leading-relaxed">
                            {d.summary}
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <p className="text-sm text-muted-foreground">
                              Por {d.author.name}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {d.tags?.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                >
                                  {tag}
                                </Badge>
                              ))}

                              {d.tags &&
                                d.tags.length > 2 && (
                                  <Badge variant="outline">
                                    +{d.tags.length - 2}
                                  </Badge>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                          Nenhuma doutrina encontrada.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="overflow-hidden rounded-3xl border bg-hightlight p-12 text-center text-primary-foreground md:p-16">
              <div className="mx-auto max-w-3xl">
                <Badge
                  variant="secondary"
                  className="mb-6 text-secondary-foreground"
                >
                  Comece Hoje
                </Badge>

                <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                  Aprofunde Seus Estudos Bíblicos
                </h2>

                <p className="mt-6 text-lg leading-relaxed opacity-90">
                  Explore perguntas, doutrinas e conteúdos desenvolvidos para
                  fortalecer sua caminhada cristã.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                  >
                    <Link href="/doutrinas">
                      Começar Agora
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-transparent text-white hover:bg-white hover:text-primary"
                    asChild
                  >
                    <Link href="/perguntas">
                      Explorar Perguntas
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}