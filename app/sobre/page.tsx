import { Metadata } from 'next'
import Link from 'next/link'

import {
  Award,
  BookOpen,
  Bot,
  Calendar,
  Code,
  Globe,
  Heart,
  Mail,
  MessageCircle,
  Shield,
  Target,
  Users,
  ArrowRight
} from 'lucide-react'

import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Sobre Nós | Vox Scriptura',
  description:
    'Conheça a história, missão e valores da Vox Scriptura.',
}

const principles = [
  {
    icon: Target,
    title: 'Nossa Missão',
    description:
      'Proclamar a verdade das Escrituras através de conteúdo teológico sólido, acessível e fiel à sã doutrina.',
  },

  {
    icon: Globe,
    title: 'Nossa Visão',
    description:
      'Ser referência em ensino bíblico e teológico no mundo lusófono.',
  },

  {
    icon: Heart,
    title: 'Nossos Valores',
    description:
      'Fidelidade bíblica, excelência teológica, integridade doutrinária e serviço à igreja.',
  },
]

const features = [
  {
    icon: MessageCircle,
    title: 'Perguntas & Respostas',
    description:
      'Respostas bíblicas para dúvidas teológicas e práticas cristãs.',
  },

  {
    icon: BookOpen,
    title: 'Doutrinas',
    description:
      'Ensino sistemático das principais doutrinas da fé cristã.',
  },

  {
    icon: Calendar,
    title: 'Frases Diárias',
    description:
      'Reflexões e versículos para edificação espiritual diária.',
  },

  {
    icon: Bot,
    title: 'Chat com IA',
    description:
      'Assistente virtual treinado em nosso acervo teológico.',
  },

  {
    icon: Heart,
    title: 'Favoritos',
    description:
      'Salve conteúdos importantes para estudar futuramente.',
  },

  {
    icon: Shield,
    title: 'Conteúdo Verificado',
    description:
      'Material revisado e alinhado à sã doutrina cristã.',
  },
]

const stats = [
  {
    icon: BookOpen,
    value: '+100',
    label: 'Perguntas Respondidas',
  },

  {
    icon: Users,
    value: '+10',
    label: 'Autores Confiáveis',
  },

  {
    icon: Award,
    value: '100%',
    label: 'Conteúdo Verificado',
  },
]

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-10 md:px-8 lg:px-12">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/10 via-background to-secondary/10 px-6 py-20 md:px-12">
          <div className="absolute inset-0 bg-grid-white/[0.02]" />

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 backdrop-blur">
              <span className="text-sm font-medium text-primary">
                Vox Scriptura
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-primary md:text-7xl">
              Voz da Escritura
            </h1>

            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Uma plataforma cristã dedicada ao ensino da sã doutrina,
              construída para unir profundidade teológica, fidelidade bíblica e
              tecnologia moderna.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/perguntas">
                  Explorar Conteúdo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <Link href="/contato">Entrar em Contato</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* PRINCÍPIOS */}
        <section className="py-20">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold tracking-tight">
              Fundamentos da Plataforma
            </h2>

            <p className="mt-4 text-lg text-muted-foreground">
              Os princípios que orientam nossa missão.
            </p>
          </div>

          <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon

              return (
                <Card
                  key={item.title}
                  className="group flex h-full flex-col border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardHeader className="items-center text-center">
                    <div className="mb-4 rounded-2xl bg-primary/10 p-4 transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-8 w-8" />
                    </div>

                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p className="text-center leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* HISTÓRIA */}
        <section className="py-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <BookOpen className="h-4 w-4 text-primary" />

                <span className="text-sm font-medium text-primary">
                  Nossa História
                </span>
              </div>

              <h2 className="mb-6 text-4xl font-bold tracking-tight">
                Tecnologia a Serviço da Verdade Bíblica
              </h2>

              <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                <p>
                  A{' '}
                  <span className="font-semibold text-primary">
                    Vox Scriptura
                  </span>{' '}
                  nasceu em 2026 com o propósito de tornar o ensino teológico
                  sólido mais acessível através da tecnologia.
                </p>

                <p>
                  Inspirados pelo princípio reformado{' '}
                  <span className="font-semibold text-foreground">
                    “Sola Scriptura”
                  </span>
                  , acreditamos que as Escrituras são a autoridade suprema para
                  fé e prática cristã.
                </p>

                <p>
                  Nosso objetivo é fornecer uma plataforma moderna onde cristãos
                  possam estudar doutrina, responder dúvidas e crescer no
                  conhecimento de Cristo.
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((stat) => {
                const Icon = stat.icon

                return (
                  <Card
                    key={stat.label}
                    className="overflow-hidden border-border/60"
                  >
                    <CardContent className="flex items-center gap-5 p-6">
                      <div className="rounded-2xl bg-primary/10 p-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>

                      <div>
                        <div className="text-3xl font-bold text-primary">
                          {stat.value}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* RECURSOS */}
        <section className="py-20">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold tracking-tight">
              O Que Oferecemos
            </h2>

            <p className="mt-4 text-lg text-muted-foreground">
              Ferramentas desenvolvidas para fortalecer sua caminhada cristã.
            </p>
          </div>

          <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <Card
                  key={feature.title}
                  className="group flex h-full flex-col border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-4 rounded-xl bg-primary/10 p-3 w-fit transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>

                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p className="leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* DESENVOLVEDOR */}
        <section className="py-10">
          <Card className="overflow-hidden border-border/60">
            <div className="grid lg:grid-cols-5">
              {/* LEFT */}
              <div className="relative flex items-center justify-center bg-linear-to-br from-primary/15 to-secondary/15 p-10 lg:col-span-2">
                <div className="text-center">
                  <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-primary/20">
                    <Code className="h-14 w-14 text-primary" />
                  </div>

                  <h3 className="text-3xl font-bold">Nordino Mavie</h3>

                  <p className="mt-2 text-muted-foreground">
                    Desenvolvedor Full Stack
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="p-8 lg:col-span-3 lg:p-10">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl">
                    Sobre o Desenvolvedor
                  </CardTitle>

                  <CardDescription className="text-base">
                    Construindo tecnologia com propósito.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 px-0">
                  <p className="leading-relaxed text-muted-foreground">
                    Nordino Mavie é desenvolvedor full stack apaixonado por
                    tecnologia, ensino e soluções digitais voltadas ao impacto
                    espiritual e educacional.
                  </p>

                  <p className="leading-relaxed text-muted-foreground">
                    A Vox Scriptura foi criada como uma iniciativa para ajudar
                    cristãos a aprofundarem seu conhecimento bíblico através de
                    uma experiência moderna, acessível e centrada nas Escrituras.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" asChild>
                      <Link
                        href="https://github.com/nordinomavie"
                        target="_blank"
                      >
                        <FaGithub className="mr-2 h-4 w-4" />
                        GitHub
                      </Link>
                    </Button>

                    <Button variant="outline" asChild>
                      <Link
                        href="https://linkedin.com/in/nordinomavie"
                        target="_blank"
                      >
                        <FaLinkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </Link>
                    </Button>

                    <Button asChild>
                      <Link href="mailto:nordino@voxscriptura.com">
                        <Mail className="mr-2 h-4 w-4" />
                        Contato
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="overflow-hidden rounded-3xl border bg-linear-to-r from-primary/10 via-background to-secondary/10 px-6 py-16 text-center md:px-12">
            <h2 className="text-4xl font-bold tracking-tight text-primary">
              Faça Parte Desta Missão
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Cresça no conhecimento da Palavra de Deus através de conteúdo
              bíblico sólido, acessível e cuidadosamente desenvolvido.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/perguntas">
                  Explorar Conteúdo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <Link href="/contato">Entrar em Contato</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}