import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getChatHistory } from '@/lib/ai-chat'
import prisma from '@/lib/prisma'

// Buscar histórico de uma conversa
export async function GET(
  request: Request,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    // Verificar se a conversa pertence ao usuário
    const conversation = await prisma.chatConversation.findFirst({
      where: {
        id,
        userId: user?.id
      }
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    const messages = await getChatHistory(user!.id, id)

    return NextResponse.json({
      id: conversation.id,
      title: conversation.title,
      messages
    })
  } catch (error) {
    console.error('Erro ao buscar conversa:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar conversa' },
      { status: 500 }
    )
  }
}

// Atualizar título da conversa
export async function PATCH(
  request: Request,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession()
    const { title } = await request.json()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    // Verificar se a conversa pertence ao usuário
    const conversation = await prisma.chatConversation.findFirst({
      where: {
        id,
        userId: user?.id
      }
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    const updated = await prisma.chatConversation.update({
      where: { id },
      data: { title }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar conversa:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar conversa' },
      { status: 500 }
    )
  }
}