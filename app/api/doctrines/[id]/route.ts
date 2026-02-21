import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/permissions'

// Buscar doutrina por ID ou slug (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Tenta buscar por ID primeiro
    let doctrine = await prisma.doctrine.findUnique({
      where: { id },
      include: { author: true }
    })

    // Se não encontrar por ID, tenta por slug
    if (!doctrine) {
      doctrine = await prisma.doctrine.findUnique({
        where: { slug: id },
        include: { author: true }
      })
    }

    if (!doctrine) {
      return NextResponse.json(
        { error: 'Doutrina não encontrada' },
        { status: 404 }
      )
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
    const { title, slug, summary, content, authorId, tags } = body

    // Verificar se doutrina existe (tenta por ID ou slug)
    let existing = await prisma.doctrine.findUnique({
      where: { id }
    })

    // Se não encontrar por ID, tenta por slug
    if (!existing) {
      existing = await prisma.doctrine.findUnique({
        where: { slug: id }
      })
    }

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
      where: { id: existing.id }, // Usa o ID real do registro
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
}

// Remover doutrina (admin apenas)
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

    // Verificar se doutrina existe (tenta por ID ou slug)
    let existing = await prisma.doctrine.findUnique({
      where: { id }
    })

    if (!existing) {
      existing = await prisma.doctrine.findUnique({
        where: { slug: id }
      })
    }

    if (!existing) {
      return NextResponse.json(
        { error: 'Doutrina não encontrada' },
        { status: 404 }
      )
    }

    await prisma.doctrine.delete({
      where: { id: existing.id } // Usa o ID real do registro
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao remover doutrina:', error)
    return NextResponse.json(
      { error: 'Erro ao remover doutrina' },
      { status: 500 }
    )
  }
}