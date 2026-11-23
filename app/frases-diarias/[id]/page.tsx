import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FavoriteButton } from '@/components/common/favorite-button'
import { ArticleShell, NotFoundState } from '@/components/reading/article-shell'
import { ShareButton } from '@/components/reading/share-button'

const API_URL = process.env.NEXT_PUBLIC_APP_URL || ''

async function getVerse(id: string) {
  try {
  const res = await fetch(`${API_URL}/api/daily/${id}`, {
    cache: 'no-store'
  })
  if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching:', error)
    return null
  }
}

export default async function FraseDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const verse = await getVerse(id)

  if (!verse) {
    return <NotFoundState title="Frase não encontrada" href="/frases-diarias" action="Ver frases diárias" />
  }

  const date = verse.scheduledFor
    ? format(new Date(verse.scheduledFor), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : format(new Date(verse.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <ArticleShell
      back={{ href: '/frases-diarias', label: 'Frases diárias' }}
      kind={verse.verse}
      kindClassName="ref text-xl font-normal"
      title={<span className="scripture versal block">{verse.text}</span>}
      titleClassName="text-[1.9rem] leading-[1.35] md:text-[2.5rem] font-normal"
      author={verse.author}
      date={date}
      actions={
        <>
          <FavoriteButton type="verse" id={verse.id} variant="outline" size="icon" />
          <ShareButton title={verse.verse} text={`"${verse.text}" — ${verse.verse}`} />
        </>
      }
      tags={verse.tags}
      tagBase="/frases-diarias"
      related={
        verse.tags?.[0]
          ? [
              { href: `/perguntas?tag=${encodeURIComponent(verse.tags[0])}`, label: 'Perguntas relacionadas' },
              { href: `/doutrinas?tag=${encodeURIComponent(verse.tags[0])}`, label: 'Doutrinas relacionadas' },
            ]
          : undefined
      }
    >
      <h2 className="mb-4 font-sans text-sm font-medium text-muted-foreground">Meditação</h2>
      <div className="reading whitespace-pre-line">{verse.explanation}</div>
    </ArticleShell>
  )
}
