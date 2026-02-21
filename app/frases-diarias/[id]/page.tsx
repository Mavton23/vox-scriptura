import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, User, Tag, Heart, Share2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FavoriteButton } from '@/components/common/favorite-button'

async function getVerse(id: string) {
  try {
    // Em produção, use URL relativa ou variável de ambiente
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}` 
      : process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : ''

    // Para APIs internas do Next.js, use URL relativa
    const res = await fetch(`${baseUrl}/api/daily/${id}`, {
      cache: 'no-store',
      // Importante para server components
      next: { revalidate: 0 }
    })
    
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching verse:', error)
    return null
  }
}

export default async function FraseDetalhePage({ params }: { params: Promise <{ id: string }> }) {
  
    const { id } = await params;
    const verse = await getVerse(id)

  if (!verse) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Versículo não encontrado</h1>
        <Button asChild>
          <Link href="/frases-diarias">Voltar para frases diárias</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-4xl">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/frases-diarias">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para frases diárias
        </Link>
      </Button>

      {/* Main content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Calendar className="inline h-3 w-3 mr-1" />
                {verse.scheduledFor 
                  ? format(new Date(verse.scheduledFor), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  : 'Data livre'}
              </Badge>
              <CardTitle className="text-4xl text-primary mb-4">{verse.verse}</CardTitle>
              <CardDescription className="text-xl italic text-muted-foreground">
                "{verse.text}"
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <FavoriteButton 
                type='verse'
                id={verse.id}
                variant="outline" 
                size="icon"
              />
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Explanation */}
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Meditação</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">{verse.explanation}</p>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <Link 
                href={`/autores/${verse.author.slug}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {verse.author.name}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                {format(new Date(verse.createdAt), "dd/MM/yyyy")}
              </span>
            </div>
          </div>

          {/* Tags */}
          {verse.tags && verse.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags relacionadas:
              </h3>
              <div className="flex flex-wrap gap-2">
                {verse.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related content */}
          <div className="bg-primary/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Aprofunde seu estudo</h3>
            <p className="text-muted-foreground mb-4">
              Este versículo se conecta com outros ensinamentos importantes:
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <Link href={`/perguntas?tag=${verse.tags[0] || ''}`}>
                  Ver perguntas relacionadas
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/doutrinas?tag=${verse.tags[0] || ''}`}>
                  Ver doutrinas relacionadas
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}