import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth/permissions'

// Listar perguntas favoritas do usuário
export const GET = withAuth(
  async (req: Request, user) => {
    try {
      const { searchParams } = new URL(req.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const skip = (page - 1) * limit

      const [favorites, total] = await Promise.all([
        prisma.questionFavorite.findMany({
          where: { userId: user.id },
          include: {
            question: {
              include: {
                author: { select: { name: true, slug: true } }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.questionFavorite.count({
          where: { userId: user.id }
        })
      ])

      return NextResponse.json({
        favorites: favorites.map(f => f.question),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      })
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar favoritos' },
        { status: 500 }
      )
    }
  }
)

// Adicionar pergunta aos favoritos
export const POST = withAuth(
  async (req: Request, user) => {
    try {
      const { questionId } = await req.json()

      if (!questionId) {
        return NextResponse.json(
          { error: 'ID da pergunta é obrigatório' },
          { status: 400 }
        )
      }

      const existing = await prisma.questionFavorite.findUnique({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId
          }
        }
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Pergunta já está nos favoritos' },
          { status: 400 }
        )
      }

      const favorite = await prisma.questionFavorite.create({
        data: {
          userId: user.id,
          questionId
        },
        include: {
          question: {
            include: {
              author: { select: { name: true, slug: true } }
            }
          }
        }
      })

      return NextResponse.json(favorite.question, { status: 201 })
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error)
      return NextResponse.json(
        { error: 'Erro ao adicionar favorito' },
        { status: 500 }
      )
    }
  }
)

// Remover dos favoritos
export const DELETE = withAuth(
  async (req: Request, user) => {
    try {
      const { searchParams } = new URL(req.url)
      const questionId = searchParams.get('questionId')

      if (!questionId) {
        return NextResponse.json(
          { error: 'ID da pergunta é obrigatório' },
          { status: 400 }
        )
      }

      // Verificar se o favorito pertence ao usuário
      const favorite = await prisma.questionFavorite.findUnique({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId
          }
        }
      })

      if (!favorite) {
        return NextResponse.json(
          { error: 'Favorito não encontrado' },
          { status: 404 }
        )
      }

      await prisma.questionFavorite.delete({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId
          }
        }
      })

      return new NextResponse(null, { status: 204 })
    } catch (error) {
      console.error('Erro ao remover favorito:', error)
      return NextResponse.json(
        { error: 'Erro ao remover favorito' },
        { status: 500 }
      )
    }
  }
)