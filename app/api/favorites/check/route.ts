import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ isFavorite: false })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'question', 'doctrine', 'verse'
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Tipo e ID são obrigatórios' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ isFavorite: false })
    }

    let isFavorite = false

    switch (type) {
      case 'question':
        const questionFav = await prisma.questionFavorite.findUnique({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: id
            }
          }
        })
        isFavorite = !!questionFav
        break
      case 'doctrine':
        const doctrineFav = await prisma.doctrineFavorite.findUnique({
          where: {
            userId_doctrineId: {
              userId: user.id,
              doctrineId: id
            }
          }
        })
        isFavorite = !!doctrineFav
        break
      case 'verse':
        const verseFav = await prisma.verseFavorite.findUnique({
          where: {
            userId_verseId: {
              userId: user.id,
              verseId: id
            }
          }
        })
        isFavorite = !!verseFav
        break
    }

    return NextResponse.json({ isFavorite })
  } catch (error) {
    console.error('Erro ao verificar favorito:', error)
    return NextResponse.json({ isFavorite: false })
  }
}