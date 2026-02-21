import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/permissions'

// Buscar pergunta específica (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    console.error('Erro ao buscar pergunta:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pergunta' },
      { status: 500 }
    )
  }
}

// Atualizar pergunta (admin apenas)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar permissões de admin
    const authResult = await requireAdmin()
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { question, answer, context, tags } = body

    // Validar campos obrigatórios
    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Pergunta e resposta são obrigatórias' },
        { status: 400 }
      )
    }

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

    const updatedQuestion = await prisma.questionAnswer.update({
      where: { id },
      data: { 
        question, 
        answer, 
        context: context || null, 
        tags: tags || [] 
      },
      include: { author: true }
    })

    return NextResponse.json(updatedQuestion)
  } catch (error) {
    console.error('Erro ao atualizar pergunta:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pergunta' },
      { status: 500 }
    )
  }
}

// Remover pergunta (admin apenas)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar permissões de admin
    const authResult = await requireAdmin()
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      )
    }

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

    // Verificar se há dependências (favoritos)
    const favoritesCount = await prisma.questionFavorite.count({
      where: { questionId: id }
    })

    if (favoritesCount > 0) {
      // Opcional: Remover todos os favoritos antes de deletar a pergunta
      await prisma.questionFavorite.deleteMany({
        where: { questionId: id }
      })
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
}