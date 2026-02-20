import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { withAuth } from '@/lib/auth/permissions'

// Listar autores (público)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const skip = (page - 1) * limit

    const where = search ? {
      OR: [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: search, mode: Prisma.QueryMode.insensitive } }
      ]
    } : {}

    const [authors, total] = await Promise.all([
      prisma.author.findMany({
        where,
        include: {
          _count: {
            select: {
              questions: true,
              doctrines: true,
              dailyVerses: true
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.author.count({ where })
    ])

    return NextResponse.json({
      authors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar autores:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar autores' },
      { status: 500 }
    )
  }
}

// Criar autor (admin apenas)
export const POST = withAuth(
  async (req: Request) => {
    try {
      const body = await req.json()
      const { name, slug, description, bioUrl } = body

      if (!name || !slug) {
        return NextResponse.json(
          { error: 'Nome e slug são obrigatórios' },
          { status: 400 }
        )
      }

      // Verificar se slug já existe
      const existing = await prisma.author.findUnique({
        where: { slug }
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Este slug já está em uso' },
          { status: 400 }
        )
      }

      const author = await prisma.author.create({
        data: { name, slug, description, bioUrl }
      })

      return NextResponse.json(author, { status: 201 })
    } catch (error) {
      console.error('Erro ao criar autor:', error)
      return NextResponse.json(
        { error: 'Erro ao criar autor' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)