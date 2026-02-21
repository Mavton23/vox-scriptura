import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/permissions'

// Listar perguntas favoritas do usuário
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireAuth()
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const user = authResult.user
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [favorites, total] = await Promise.all([
      prisma.questionFavorite.findMany({
        where: { userId: user?.id },
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
        where: { userId: user?.id }
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

// Adicionar pergunta aos favoritos
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireAuth()
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const user = authResult.user
    const { questionId } = await request.json()

    if (!questionId) {
      return NextResponse.json(
        { error: 'ID da pergunta é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a pergunta existe
    const question = await prisma.questionAnswer.findUnique({
      where: { id: questionId }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }

    const existing = await prisma.questionFavorite.findUnique({
      where: {
        userId_questionId: {
          userId: user?.id as any,
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
        userId: user?.id as any,
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

// Remover dos favoritos
export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireAuth()
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const user = authResult.user
    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('questionId')

    if (!questionId) {
      return NextResponse.json(
        { error: 'ID da pergunta é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a pergunta existe
    const question = await prisma.questionAnswer.findUnique({
      where: { id: questionId }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o favorito pertence ao usuário
    const favorite = await prisma.questionFavorite.findUnique({
      where: {
        userId_questionId: {
          userId: user?.id as any,
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
          userId: user?.id as any,
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