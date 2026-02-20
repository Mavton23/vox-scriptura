import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth/permissions'

// GET /api/doctrines - Listar doutrinas (público)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const authorId = searchParams.get('authorId')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {
      ...(authorId && { authorId }),
      ...(tag && { tags: { has: tag } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const [doctrines, total] = await Promise.all([
      prisma.doctrine.findMany({
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.doctrine.count({ where })
    ])

    return NextResponse.json({
      doctrines,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    console.error('Erro ao buscar doutrinas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar doutrinas' },
      { status: 500 }
    )
  }
}

// Criar doutrina (admin apenas)
export const POST = withAuth(
  async (req: Request) => {
    try {
      const body = await req.json()
      const { title, slug, summary, content, authorId, tags } = body

      if (!title || !slug || !content || !authorId) {
        return NextResponse.json(
          { error: 'Título, slug, conteúdo e autor são obrigatórios' },
          { status: 400 }
        )
      }

      // Verificar se slug já existe
      const existing = await prisma.doctrine.findUnique({
        where: { slug }
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Este slug já está em uso' },
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

      const doctrine = await prisma.doctrine.create({
        data: { 
          title, 
          slug, 
          summary, 
          content, 
          authorId, 
          tags: tags || [] 
        },
        include: { author: true }
      })

      return NextResponse.json(doctrine, { status: 201 })
    } catch (error) {
      console.error('Erro ao criar doutrina:', error)
      return NextResponse.json(
        { error: 'Erro ao criar doutrina' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)