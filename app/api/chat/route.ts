import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { generateChatResponse } from '@/lib/ai-chat'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth/permissions'

// Enviar mensagem para a IA
export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    const { question, conversationId } = await request.json()

    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta é obrigatória' },
        { status: 400 }
      )
    }

    // Verificar rate limiting (opcional - implementar com Redis em produção)
    // ...

    // Buscar usuário se estiver logado
    let userId = null
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
      userId as any
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

// Listar conversas do usuário
export const GET = withAuth(
  async (req: Request, user) => {
    try {
      const conversations = await prisma.chatConversation.findMany({
        where: { userId: user.id },
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
)

// Deletar conversa
export const DELETE = withAuth(
  async (req: Request, user) => {
    try {
      const { searchParams } = new URL(req.url)
      const conversationId = searchParams.get('id')

      if (!conversationId) {
        return NextResponse.json(
          { error: 'ID da conversa é obrigatório' },
          { status: 400 }
        )
      }

      // Verificar se a conversa pertence ao usuário
      const conversation = await prisma.chatConversation.findFirst({
        where: {
          id: conversationId,
          userId: user.id
        }
      })

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversa não encontrada' },
          { status: 404 }
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
)