import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth/permissions'

// Buscar versículos (público)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'today' ou 'list'
    const authorId = searchParams.get('authorId')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Se for para buscar o versículo do dia
    if (type === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Tenta encontrar um versículo agendado para hoje
      let verse = await prisma.dailyVerse.findFirst({
        where: { scheduledFor: today },
        include: { 
          author: { 
            select: { 
              id: true,
              name: true, 
              slug: true 
            } 
          } 
        }
      })

      // Se não houver agendado, pega um aleatório
      if (!verse) {
        const count = await prisma.dailyVerse.count()
        const skip = Math.floor(Math.random() * count)
        
        verse = await prisma.dailyVerse.findFirst({
          skip,
          include: { 
            author: { 
              select: { 
                id: true,
                name: true, 
                slug: true 
              } 
            } 
          }
        })
      }

      return NextResponse.json(verse)
    }

    // Lista paginada de versículos
    const where: any = {
      ...(authorId && { authorId }),
      ...(tag && { tags: { has: tag } }),
      ...(search && {
        OR: [
          { verse: { contains: search, mode: 'insensitive' } },
          { text: { contains: search, mode: 'insensitive' } },
          { explanation: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const [verses, total] = await Promise.all([
      prisma.dailyVerse.findMany({
        where,
        include: { 
          author: { 
            select: { 
              id: true,
              name: true, 
              slug: true 
            } 
          } 
        },
        orderBy: { scheduledFor: 'desc' },
        skip,
        take: limit
      }),
      prisma.dailyVerse.count({ where })
    ])

    return NextResponse.json({
      verses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    console.error('Erro ao buscar versículos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar versículos' },
      { status: 500 }
    )
  }
}

// Criar versículo (admin apenas)
export const POST = withAuth(
  async (req: Request) => {
    try {
      const body = await req.json()
      const { verse, text, explanation, authorId, tags, scheduledFor } = body

      if (!verse || !text || !explanation || !authorId) {
        return NextResponse.json(
          { error: 'Versículo, texto, explicação e autor são obrigatórios' },
          { status: 400 }
        )
      }

      // Verificar se autor existe
      const author = await prisma.author.findUnique({
        where: { id: authorId }
      })

      if (!author) {
        return NextResponse.json(
          { error: 'Autor não encontrado' },
          { status: 400 }
        )
      }

      // Se tiver data agendada, verificar se já existe para esta data
      if (scheduledFor) {
        const date = new Date(scheduledFor)
        date.setHours(0, 0, 0, 0)

        const existing = await prisma.dailyVerse.findFirst({
          where: { scheduledFor: date }
        })

        if (existing) {
          return NextResponse.json(
            { error: 'Já existe um versículo agendado para esta data' },
            { status: 400 }
          )
        }
      }

      const dailyVerse = await prisma.dailyVerse.create({
        data: {
          verse,
          text,
          explanation,
          authorId,
          tags: tags || [],
          scheduledFor: scheduledFor ? new Date(scheduledFor) : null
        },
        include: { author: true }
      })

      return NextResponse.json(dailyVerse, { status: 201 })
    } catch (error) {
      console.error('Erro ao criar versículo:', error)
      return NextResponse.json(
        { error: 'Erro ao criar versículo' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)