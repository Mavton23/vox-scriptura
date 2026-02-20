import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Share2, Bookmark } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { FavoriteButton } from '@/components/common/favorite-button'

async function getDoctrine(slug: string) {
  const res = await fetch(`http://localhost:3000/api/doctrines/${slug}`, {
    cache: 'no-store'
  })
  if (!res.ok) return null
  return res.json()
}

export default async function DoctrineDetalhePage({ params }: { params: Promise <{ slug: string }> }) {
  
  const { slug } = await params;
  const doctrine = await getDoctrine(slug)

  if (!doctrine) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Doutrina não encontrada</h1>
        <Button asChild>
          <Link href="/doutrinas">Voltar para doutrinas</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-4xl">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/doutrinas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para doutrinas
        </Link>
      </Button>

      {/* Main content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-3xl text-primary">{doctrine.title}</CardTitle>
              {doctrine.summary && (
                <CardDescription className="text-base">{doctrine.summary}</CardDescription>
              )}
            </div>
            <div className="flex gap-2">
              <FavoriteButton 
                type='doctrine'
                id={doctrine.id}
                variant='outline'
                size='icon'
              />
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>
              {doctrine.content}
            </ReactMarkdown>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-primary">Autor:</span>{' '}
              <Link 
                href={`/autores/${doctrine.author.slug}`}
                className="hover:text-primary transition-colors"
              >
                {doctrine.author.name}
              </Link>
            </div>
            <div>
              <span className="font-semibold text-primary">Publicado em:</span>{' '}
              {formatDate(doctrine.createdAt)}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-3">Tags relacionadas:</h3>
            <div className="flex flex-wrap gap-2">
              {doctrine.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}