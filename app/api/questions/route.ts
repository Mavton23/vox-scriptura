import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/permissions'

// GET /api/questions - Público, não requer autenticação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const authorId = searchParams.get('authorId')
    const tag = searchParams.get('tag')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = {
      ...(authorId && { authorId }),
      ...(tag && { tags: { has: tag } })
    }

    const [questions, total] = await Promise.all([
      prisma.questionAnswer.findMany({
        where,
        include: { author: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.questionAnswer.count({ where })
    ])

    return NextResponse.json({
      questions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar perguntas' },
      { status: 500 }
    )
  }
}

// Apenas admin pode criar
export async function POST(request: NextRequest) {
  try {
    // Verificar permissões de admin
    const authResult = await requireAdmin()
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const { question, answer, context, authorId, tags } = body

    if (!question || !answer || !authorId) {
      return NextResponse.json(
        { error: 'Pergunta, resposta e autor são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o autor existe
    const author = await prisma.author.findUnique({
      where: { id: authorId }
    })

    if (!author) {
      return NextResponse.json(
        { error: 'Autor não encontrado' },
        { status: 400 }
      )
    }

    const qa = await prisma.questionAnswer.create({
      data: { 
        question, 
        answer, 
        context, 
        authorId, 
        tags: tags || [] 
      },
      include: { author: true }
    })

    return NextResponse.json(qa, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar pergunta:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pergunta' },
      { status: 500 }
    )
  }
}