import { FavoriteButton } from '@/components/common/favorite-button'
import { ArticleShell, NotFoundState } from '@/components/reading/article-shell'
import { ShareButton } from '@/components/reading/share-button'
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

export default async function PerguntaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const question = await getQuestion(id)

  if (!question) {
    return <NotFoundState title="Pergunta não encontrada" href="/perguntas" action="Ver todas as perguntas" />
  }

  return (
    <ArticleShell
      back={{ href: '/perguntas', label: 'Perguntas e respostas' }}
      kind="Pergunta"
      title={question.question}
      titleClassName="text-[1.9rem] md:text-[2.4rem]"
      lead={question.context}
      author={question.author}
      date={formatDate(question.createdAt)}
      actions={
        <>
          <FavoriteButton type="question" id={question.id} variant="outline" size="icon" />
          <ShareButton title={question.question} />
        </>
      }
      tags={question.tags}
      tagBase="/perguntas"
      related={[
        ...(question.tags?.[0]
          ? [{ href: `/doutrinas?tag=${encodeURIComponent(question.tags[0])}`, label: 'Doutrinas sobre o tema' }]
          : []),
        { href: `/autores/${question.author.slug}`, label: `Mais de ${question.author.name}` },
      ]}
    >
      <h2 className="mb-4 font-sans text-sm font-medium text-muted-foreground">Resposta</h2>
      <div className="reading whitespace-pre-line">{question.answer}</div>
    </ArticleShell>
  )
}
