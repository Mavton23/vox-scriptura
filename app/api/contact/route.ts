import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { headers } from 'next/headers'
import { requireAdmin } from '@/lib/auth/permissions'

// Schema de validação
const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  subject: z.string().min(3, 'Assunto deve ter pelo menos 3 caracteres').max(200),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(5000)
})

// GET - Listar mensagens (apenas para admin)
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin (você precisará implementar a lógica de autenticação)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || undefined
    const skip = (page - 1) * limit

    const where = status ? { status } : {}

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.contactMessage.count({ where })
    ])

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Enviar nova mensagem
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados
    const validation = contactSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validation.data

    // Obter IP e User Agent
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    // Verificar se o usuário está logado (opcional)
    // Você pode adicionar lógica de sessão aqui

    // Verificar limite de mensagens por IP (anti-spam)
    const recentMessages = await prisma.contactMessage.count({
      where: {
        ipAddress: ipAddress,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
        }
      }
    })

    if (recentMessages >= 5) {
      return NextResponse.json(
        { error: 'Limite de mensagens excedido. Tente novamente amanhã.' },
        { status: 429 }
      )
    }

    // Salvar mensagem no banco
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        ipAddress,
        userAgent,
        status: 'pending'
      }
    })

    // Aqui você pode adicionar integração com email
    // Enviar notificação por email para o admin
    await sendEmailNotification(contactMessage)

    // Enviar confirmação automática para o usuário
    await sendAutoReply(contactMessage)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensagem enviada com sucesso! Responderemos em breve.' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao processar sua mensagem. Tente novamente.' },
      { status: 500 }
    )
  }
}

// Funções auxiliares (você precisará implementar o envio de email)
async function sendEmailNotification(message: any) {
  // Implementar envio de email para o admin
  // Pode usar nodemailer, resend, ou outro serviço
  console.log('Notificação para admin:', message)
}

async function sendAutoReply(message: any) {
  // Implementar envio de resposta automática para o usuário
  console.log('Auto-resposta para:', message.email)
}

// PUT - Atualizar status da mensagem (admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, status, reply } = body

    if (!messageId) {
      return NextResponse.json(
        { error: 'ID da mensagem é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar permissão de admin aqui

    const updatedMessage = await prisma.contactMessage.update({
      where: { id: messageId },
      data: {
        status,
        reply: reply || undefined,
        repliedAt: status === 'replied' ? new Date() : undefined
      }
    })

    return NextResponse.json({
      success: true,
      message: updatedMessage
    })
  } catch (error) {
    console.error('Erro ao atualizar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar mensagem' },
      { status: 500 }
    )
  }
}

// DELETE - Remover mensagem (admin)
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
        
    if (authResult.error) {
        return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
        )
    }

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('id')

    if (!messageId) {
      return NextResponse.json(
        { error: 'ID da mensagem é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar permissão de admin aqui

    await prisma.contactMessage.delete({
      where: { id: messageId }
    })

    return NextResponse.json({
      success: true,
      message: 'Mensagem removida com sucesso'
    })
  } catch (error) {
    console.error('Erro ao remover mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao remover mensagem' },
      { status: 500 }
    )
  }
}