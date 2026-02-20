import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const [favorites, total] = await Promise.all([
      prisma.verseFavorite.findMany({
        where: { userId: user.id },
        include: {
          verse: {
            include: {
              author: { select: { name: true, slug: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.verseFavorite.count({
        where: { userId: user.id }
      })
    ])

    return NextResponse.json({
      favorites: favorites.map(f => f.verse),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar favoritos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { verseId } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const existing = await prisma.verseFavorite.findUnique({
      where: {
        userId_verseId: {
          userId: user.id,
          verseId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Versículo já está nos favoritos' },
        { status: 400 }
      )
    }

    const favorite = await prisma.verseFavorite.create({
      data: {
        userId: user.id,
        verseId
      },
      include: {
        verse: {
          include: {
            author: { select: { name: true, slug: true } }
          }
        }
      }
    })

    return NextResponse.json(favorite.verse, { status: 201 })
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar favorito' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const verseId = searchParams.get('verseId')

    if (!verseId) {
      return NextResponse.json(
        { error: 'ID do versículo é obrigatório' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    await prisma.verseFavorite.delete({
      where: {
        userId_verseId: {
          userId: user.id,
          verseId
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