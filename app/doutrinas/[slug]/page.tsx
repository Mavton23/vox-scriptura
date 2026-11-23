import ReactMarkdown from 'react-markdown'
import { FavoriteButton } from '@/components/common/favorite-button'
import { ArticleShell, NotFoundState } from '@/components/reading/article-shell'
import { ShareButton } from '@/components/reading/share-button'
import { formatDate } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_APP_URL || ''

async function getDoctrine(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/doctrines/${slug}`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching:', error)
    return null
  }
}

export default async function DoctrineDetalhePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doctrine = await getDoctrine(slug)

  if (!doctrine) {
    return <NotFoundState title="Doutrina não encontrada" href="/doutrinas" action="Ver todas as doutrinas" />
  }

  return (
    <ArticleShell
      back={{ href: '/doutrinas', label: 'Doutrinas' }}
      kind="Ensino de doutrina"
      title={doctrine.title}
      lead={doctrine.summary}
      author={doctrine.author}
      date={formatDate(doctrine.createdAt)}
      actions={
        <>
          <FavoriteButton type="doctrine" id={doctrine.id} variant="outline" size="icon" />
          <ShareButton title={doctrine.title} text={doctrine.summary ?? undefined} />
        </>
      }
      tags={doctrine.tags}
      tagBase="/doutrinas"
      related={[
        ...(doctrine.tags?.[0]
          ? [{ href: `/perguntas?tag=${encodeURIComponent(doctrine.tags[0])}`, label: 'Perguntas sobre o tema' }]
          : []),
        { href: `/autores/${doctrine.author.slug}`, label: `Mais de ${doctrine.author.name}` },
      ]}
    >
      <div className="reading">
        <ReactMarkdown>{doctrine.content}</ReactMarkdown>
      </div>
    </ArticleShell>
  )
}
