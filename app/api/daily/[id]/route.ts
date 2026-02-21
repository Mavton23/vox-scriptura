import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/permissions'

// Buscar versículo por ID (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const updatedVerse = await prisma.dailyVerse.update({
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

    return NextResponse.json(updatedVerse)
  } catch (error) {
    console.error('Erro ao atualizar versículo:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar versículo' },
      { status: 500 }
    )
  }
}

// Remover versículo (admin apenas)
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
}