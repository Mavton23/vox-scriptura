import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth/permissions'

// Buscar doutrina por ID (público)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doctrine = await prisma.doctrine.findUnique({
      where: { id: params.id },
      include: { author: true }
    })

    if (!doctrine) {
      // Tentar buscar por slug
      const bySlug = await prisma.doctrine.findUnique({
        where: { slug: params.id },
        include: { author: true }
      })

      if (!bySlug) {
        return NextResponse.json(
          { error: 'Doutrina não encontrada' },
          { status: 404 }
        )
      }

      return NextResponse.json(bySlug)
    }

    return NextResponse.json(doctrine)
  } catch (error) {
    console.error('Erro ao buscar doutrina:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar doutrina' },
      { status: 500 }
    )
  }
}

// Atualizar doutrina (admin apenas)
export const PUT = withAuth(
  async (req: Request, user) => {
    try {
      const url = new URL(req.url)
      const id = url.pathname.split('/').pop()

      if (!id) {
        return NextResponse.json(
          { error: 'ID não fornecido' },
          { status: 400 }
        )
      }

      const body = await req.json()
      const { title, slug, summary, content, authorId, tags } = body

      // Verificar se doutrina existe
      const existing = await prisma.doctrine.findUnique({
        where: { id }
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Doutrina não encontrada' },
          { status: 404 }
        )
      }

      // Se slug foi alterado, verificar se novo slug já existe
      if (slug && slug !== existing.slug) {
        const slugExists = await prisma.doctrine.findUnique({
          where: { slug }
        })

        if (slugExists) {
          return NextResponse.json(
            { error: 'Este slug já está em uso' },
            { status: 400 }
          )
        }
      }

      const doctrine = await prisma.doctrine.update({
        where: { id },
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

      return NextResponse.json(doctrine)
    } catch (error) {
      console.error('Erro ao atualizar doutrina:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar doutrina' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)

// Remover doutrina (admin apenas)
export const DELETE = withAuth(
  async (req: Request, user) => {
    try {
        const url = new URL(req.url)
        const id = url.pathname.split('/').pop()

        if (!id) {
        return NextResponse.json(
          { error: 'ID não fornecido' },
          { status: 400 }
        )
      }

        const existing = await prisma.doctrine.findUnique({
            where: { id }
        })

      if (!existing) {
        return NextResponse.json(
          { error: 'Doutrina não encontrada' },
          { status: 404 }
        )
      }

      await prisma.doctrine.delete({
        where: { id }
      })

      return new NextResponse(null, { status: 204 })
    } catch (error) {
      console.error('Erro ao remover doutrina:', error)
      return NextResponse.json(
        { error: 'Erro ao remover doutrina' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)