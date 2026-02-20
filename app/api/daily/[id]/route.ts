import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth/permissions'

// Buscar versículo por ID (público)
export async function GET(
  request: Request,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const { id } = await params;

    const verse = await prisma.dailyVerse.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!verse) {
      return NextResponse.json(
        { error: 'Versículo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(verse)
  } catch (error) {
    console.error('Erro ao buscar versículo:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar versículo' },
      { status: 500 }
    )
  }
}

// Atualizar versículo (admin apenas)
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
      const { verse, text, explanation, authorId, tags, scheduledFor } = body

      // Verificar se versículo existe
      const existing = await prisma.dailyVerse.findUnique({
        where: { id }
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Versículo não encontrado' },
          { status: 404 }
        )
      }

      // Se data foi alterada, verificar se já existe para nova data
      if (scheduledFor) {
        const newDate = new Date(scheduledFor)
        newDate.setHours(0, 0, 0, 0)

        const oldDate = existing.scheduledFor 
          ? new Date(existing.scheduledFor) 
          : null

        // Se a data mudou
        if (!oldDate || newDate.getTime() !== oldDate.getTime()) {
          const dateExists = await prisma.dailyVerse.findFirst({
            where: { 
              scheduledFor: newDate,
              NOT: { id }
            }
          })

          if (dateExists) {
            return NextResponse.json(
              { error: 'Já existe um versículo agendado para esta data' },
              { status: 400 }
            )
          }
        }
      }

      const verse_ = await prisma.dailyVerse.update({
        where: { id },
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

      return NextResponse.json(verse_)
    } catch (error) {
      console.error('Erro ao atualizar versículo:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar versículo' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)

// DELETE /api/daily/[id] - Remover versículo (admin apenas)
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

      const existing = await prisma.dailyVerse.findUnique({
        where: { id }
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Versículo não encontrado' },
          { status: 404 }
        )
      }

      await prisma.dailyVerse.delete({
        where: { id }
      })

      return new NextResponse(null, { status: 204 })
    } catch (error) {
      console.error('Erro ao remover versículo:', error)
      return NextResponse.json(
        { error: 'Erro ao remover versículo' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)