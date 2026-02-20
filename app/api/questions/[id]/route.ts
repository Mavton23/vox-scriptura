import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth/permissions'

// Buscar pergunta específica
export async function GET(
  _req: Request,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const { id } = await params;
    const question = await prisma.questionAnswer.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(question)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar pergunta' },
      { status: 500 }
    )
  }
}

// Atualizar pergunta
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
      const { question, answer, context, tags } = body

      // Verificar se a pergunta existe
      const existing = await prisma.questionAnswer.findUnique({
        where: { id }
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Pergunta não encontrada' },
          { status: 404 }
        )
      }

      const qa = await prisma.questionAnswer.update({
        where: { id },
        data: { question, answer, context, tags }
      })

      return NextResponse.json(qa)
    } catch (error) {
      console.error('Erro ao atualizar pergunta:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar pergunta' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)

// Remover pergunta
export const DELETE = withAuth(
  async (req: Request, user) => {
    try {
      const url = new URL(req.url)
      const id = url.pathname.split('/').pop()

      const existing = await prisma.questionAnswer.findUnique({
        where: { id }
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Pergunta não encontrada' },
          { status: 404 }
        )
      }

      await prisma.questionAnswer.delete({
        where: { id }
      })

      return new NextResponse(null, { status: 204 })
    } catch (error) {
      console.error('Erro ao deletar pergunta:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar pergunta' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)