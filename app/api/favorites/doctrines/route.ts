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
      prisma.doctrineFavorite.findMany({
        where: { userId: user.id },
        include: {
          doctrine: {
            include: {
              author: { select: { name: true, slug: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.doctrineFavorite.count({
        where: { userId: user.id }
      })
    ])

    return NextResponse.json({
      favorites: favorites.map(f => f.doctrine),
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

    const { doctrineId } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const existing = await prisma.doctrineFavorite.findUnique({
      where: {
        userId_doctrineId: {
          userId: user.id,
          doctrineId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Doutrina já está nos favoritos' },
        { status: 400 }
      )
    }

    const favorite = await prisma.doctrineFavorite.create({
      data: {
        userId: user.id,
        doctrineId
      },
      include: {
        doctrine: {
          include: {
            author: { select: { name: true, slug: true } }
          }
        }
      }
    })

    return NextResponse.json(favorite.doctrine, { status: 201 })
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
    const doctrineId = searchParams.get('doctrineId')

    if (!doctrineId) {
      return NextResponse.json(
        { error: 'ID da doutrina é obrigatório' },
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

    await prisma.doctrineFavorite.delete({
      where: {
        userId_doctrineId: {
          userId: user.id,
          doctrineId
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