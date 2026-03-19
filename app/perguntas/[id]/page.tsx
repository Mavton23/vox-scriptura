import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { FavoriteButton } from '@/components/common/favorite-button'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_APP_URL || ''

async function getQuestion(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/questions/${id}`, {
      cache: 'no-store'
    })

    if (!res.ok) return null
      return res.json()
  } catch (error) {
    console.error('Error fetching:', error)
    return null
  }
}

export default async function PerguntaDetalhePage({ params }: { params: Promise <{ id: string }> }) {

  const { id } = await params;
  const question = await getQuestion(id)

  if (!question) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Pergunta não encontrada</h1>
        <Button asChild>
          <Link href="/perguntas">Voltar para perguntas</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-4xl">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/perguntas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para perguntas
        </Link>
      </Button>

      {/* Main content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-3xl text-primary">{question.question}</CardTitle>
              {question.context && (
                <CardDescription className="text-base">{question.context}</CardDescription>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <FavoriteButton 
                id={question.id}
                type='question'
                variant='outline'
                size='icon'
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Answer */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-primary mb-4">Resposta</h2>
            <div className="whitespace-pre-wrap text-muted-foreground">
              {question.answer}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-primary">Autor:</span>{' '}
              <Link 
                href={`/autores/${question.author.slug}`}
                className="hover:text-primary transition-colors"
              >
                {question.author.name}
              </Link>
            </div>
            <div>
              <span className="font-semibold text-primary">Publicado em:</span>{' '}
              {formatDate(question.createdAt)}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-3">Tags relacionadas:</h3>
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Related content suggestion */}
          <div className="bg-primary/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Aprofunde seus estudos</h3>
            <p className="text-muted-foreground mb-4">
              Este tema está relacionado com outras doutrinas importantes. Explore mais:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" asChild>
                <Link href={`/doutrinas?tag=${question.tags[0]}`}>
                  Ver doutrinas relacionadas
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/autores/${question.author.slug}`}>
                  Mais do autor
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}