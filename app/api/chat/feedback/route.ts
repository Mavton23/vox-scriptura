import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { messageId, rating, comment } = await request.json()

    if (!messageId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    const feedback = await prisma.chatFeedback.upsert({
      where: {
        messageId_userId: {
          messageId,
          userId: user!.id
        }
      },
      update: { rating, comment },
      create: {
        messageId,
        userId: user!.id,
        rating,
        comment
      }
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Erro ao salvar feedback:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar feedback' },
      { status: 500 }
    )
  }
}