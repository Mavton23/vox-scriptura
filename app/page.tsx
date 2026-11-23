import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowUpRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/common/favorite-button'
import { Ornament } from '@/components/brand/logo'

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

const paths = [
  {
    title: 'Perguntas e respostas',
    description: 'Dúvidas reais sobre a fé e a vida cristã, respondidas a partir da Escritura.',
    href: '/perguntas',
    action: 'Ver perguntas',
  },
  {
    title: 'Ensino de doutrina',
    description: 'Estudos sobre as verdades centrais da fé, para ler com calma e voltar a eles.',
    href: '/doutrinas',
    action: 'Ver doutrinas',
  },
  {
    title: 'Frases diárias',
    description: 'Um versículo por dia, com uma meditação curta para levar consigo.',
    href: '/frases-diarias',
    action: 'Ver frases',
  },
]

const FALLBACK_VERSE = {
  verse: 'Salmos 119:105',
  text: 'Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.',
}

function SectionHeading({ title, href, action }: { title: string; href: string; action: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b pb-4">
      <h2 className="text-[1.9rem] leading-tight">{title}</h2>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
      >
        {action}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

export default async function HomePage() {
  const [dailyVerse, recentQuestions, recentDoctrines] = await Promise.all([
    getDailyVerse(),
    getRecentQuestions(4),
    getRecentDoctrines(3),
  ])

  const verse = dailyVerse ?? FALLBACK_VERSE
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })

  return (
    <div className="flex flex-col">
      {/* HERO — a frase do dia é a porta de entrada */}
      <section className="border-b">
        <div className="container relative grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <div className="max-w-3xl">
            <p className="mb-8 text-sm text-muted-foreground first-letter:uppercase">{today}</p>

            <blockquote className="scripture versal text-[1.85rem] leading-[1.35] text-foreground sm:text-[2.35rem] md:text-[2.7rem]">
              {verse.text}
            </blockquote>

            <p className="mt-6 text-lg">
              <span className="ref text-xl">{verse.verse}</span>
              {dailyVerse && (
                <span className="text-muted-foreground"> — comentado por{' '}
                  <Link href={`/autores/${dailyVerse.author.slug}`} className="text-foreground hover:text-primary">
                    {dailyVerse.author.name}
                  </Link>
                </span>
              )}
            </p>

            {dailyVerse && (
              <>
                <p className="mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground line-clamp-3">
                  {dailyVerse.explanation}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button size="lg" asChild>
                    <Link href={`/frases-diarias/${dailyVerse.id}`}>Ler a meditação</Link>
                  </Button>
                  <FavoriteButton type="verse" id={dailyVerse.id} variant="outline" size="lg" showText />
                </div>
              </>
            )}
          </div>

          <aside className="self-end border-t pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h1 className="text-[1.6rem] leading-snug">
              Aprenda e cresça na sã doutrina.
            </h1>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              Ensino bíblico a partir de autores fiéis à Escritura, organizado para estudar no seu ritmo.
            </p>
            <ul className="mt-6 space-y-1">
              {paths.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="group -mx-2 flex items-center justify-between rounded-md px-2 py-2 text-[0.95rem] font-medium hover:bg-secondary"
                  >
                    {p.title}
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* CAMINHOS DE ESTUDO */}
      <section className="container py-20">
        <div className="grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x">
          {paths.map((p) => (
            <Link key={p.href} href={p.href} className="group md:px-8 md:first:pl-0 md:last:pr-0">
              <h2 className="text-2xl transition-colors group-hover:text-primary">{p.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{p.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                {p.action}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="container">
        <Ornament />
      </div>

      {/* CONTEÚDO RECENTE */}
      <section className="container grid gap-16 py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <SectionHeading title="Perguntas recentes" href="/perguntas" action="Todas as perguntas" />
          {recentQuestions.length > 0 ? (
            <ol className="divide-y">
              {recentQuestions.map((q) => (
                <li key={q.id}>
                  <Link href={`/perguntas/${q.id}`} className="group block py-5">
                    <p className="font-serif text-[1.3rem] leading-snug transition-colors group-hover:text-primary">
                      {q.question}
                    </p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{q.author.name}</span>
                      {q.tags?.slice(0, 2).map((t) => (
                        <span key={t} className="text-gold-ink">#{t}</span>
                      ))}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="py-10 text-muted-foreground">
              Ainda não há perguntas publicadas.{' '}
              <Link href="/contato" className="text-primary underline underline-offset-4">Envie a sua</Link>.
            </p>
          )}
        </div>

        <div>
          <SectionHeading title="Doutrinas" href="/doutrinas" action="Todos os estudos" />
          {recentDoctrines.length > 0 ? (
            <ul className="space-y-4">
              {recentDoctrines.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/doutrinas/${d.slug}`}
                    className="group block rounded-lg border bg-card p-5 transition-colors hover:border-primary/40"
                  >
                    <h3 className="text-xl leading-snug transition-colors group-hover:text-primary">{d.title}</h3>
                    {d.summary && (
                      <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                        {d.summary}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-muted-foreground">{d.author.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-10 text-muted-foreground">Os primeiros estudos estão a ser preparados.</p>
          )}
        </div>
      </section>

      {/* CONVITE */}
      <section className="container">
        <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-secondary px-6 py-10 sm:px-10 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-[1.75rem] leading-tight text-secondary-foreground">
              Guarde o que tocar o seu coração.
            </h2>
            <p className="mt-2 text-muted-foreground">
              Com uma conta gratuita, você marca perguntas, doutrinas e frases como favoritas e volta a elas quando quiser.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Button size="lg" asChild>
              <Link href="/auth/register">Criar conta</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/auth/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
