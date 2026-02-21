import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { generateChatResponse } from '@/lib/ai-chat'
import prisma from '@/lib/prisma'
import { requireAuth, requireResourceOwner } from '@/lib/auth/permissions'

// Enviar mensagem para a IA (pode ser anônimo ou autenticado)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    const { question, conversationId } = await request.json()

    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta é obrigatória' },
        { status: 400 }
      )
    }

    // Buscar usuário se estiver autenticado
    let userId: any
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      userId = user?.id
    }

    // Gerar resposta
    const response = await generateChatResponse(
      question,
      conversationId,
      userId
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error('Erro no chat:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}

// Listar conversas do usuário (requer autenticação)
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

    const conversations = await prisma.chatConversation.findMany({
      where: { userId: user?.id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Erro ao buscar conversas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar conversas' },
      { status: 500 }
    )
  }
}

// Deletar conversa (requer ser dono do recurso)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('id')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'ID da conversa é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar a conversa para verificar o dono
    const conversation = await prisma.chatConversation.findUnique({
      where: { id: conversationId },
      select: { userId: true }
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o usuário é dono do recurso (ou admin)
    const ownershipResult = await requireResourceOwner(conversation.userId)
    
    if (ownershipResult.error) {
      return NextResponse.json(
        { error: ownershipResult.error },
        { status: ownershipResult.status }
      )
    }

    await prisma.chatConversation.delete({
      where: { id: conversationId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao deletar conversa:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar conversa' },
      { status: 500 }
    )
  }
}