import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth/permissions'

// Buscar autor por slug (público)
export async function GET(
  _req: Request,
  { params }: { params: Promise <{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const author = await prisma.author.findUnique({
      where: { slug },
      include: {
        questions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            question: true,
            tags: true,
            createdAt: true
          }
        },
        doctrines: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            slug: true,
            summary: true,
            tags: true,
            createdAt: true
          }
        },
        dailyVerses: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            verse: true,
            text: true,
            tags: true,
            createdAt: true
          }
        }
      }
    })

    if (!author) {
      return NextResponse.json(
        { error: 'Autor não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(author)
  } catch (error) {
    console.error('Erro ao buscar autor:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar autor' },
      { status: 500 }
    )
  }
}

// Atualizar autor (admin apenas)
export const PUT = withAuth(
  async (req: Request, user) => {
    try {
      const url = new URL(req.url)
      const slug = url.pathname.split('/').pop()

      if (!slug) {
        return NextResponse.json(
          { error: 'Slug não fornecido' },
          { status: 400 }
        )
      }

      const body = await req.json()
      const { name, description, bioUrl } = body

      // Verificar se autor existe
      const existing = await prisma.author.findUnique({
        where: { slug }
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Autor não encontrado' },
          { status: 404 }
        )
      }

      const author = await prisma.author.update({
        where: { slug },
        data: { name, description, bioUrl }
      })

      return NextResponse.json(author)
    } catch (error) {
      console.error('Erro ao atualizar autor:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar autor' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)

// Remover autor (admin apenas)
export const DELETE = withAuth(
  async (req: Request, user) => {
    try {
      const url = new URL(req.url)
      const slug = url.pathname.split('/').pop()

      if (!slug) {
        return NextResponse.json(
          { error: 'Slug não fornecido' },
          { status: 400 }
        )
      }

      // Verificar se autor existe
      const existing = await prisma.author.findUnique({
        where: { slug },
        include: {
          questions: { select: { id: true } },
          doctrines: { select: { id: true } },
          dailyVerses: { select: { id: true } }
        }
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Autor não encontrado' },
          { status: 404 }
        )
      }

      // Verificar se há conteúdo associado
      const totalContent = 
        existing.questions.length + 
        existing.doctrines.length + 
        existing.dailyVerses.length

      if (totalContent > 0) {
        return NextResponse.json(
          { error: 'Não é possível excluir autor com conteúdo associado. Remova ou reassocie o conteúdo primeiro.' },
          { status: 400 }
        )
      }

      await prisma.author.delete({
        where: { slug }
      })

      return new NextResponse(null, { status: 204 })
    } catch (error) {
      console.error('Erro ao remover autor:', error)
      return NextResponse.json(
        { error: 'Erro ao remover autor' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)