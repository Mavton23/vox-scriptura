import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/permissions'

type RouteParams = {
  params: Promise<{ slug: string }>
}

/**
 * Buscar doutrina por ID ou slug (público)
 */
export async function GET(
  _req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params

    const doctrine = await prisma.doctrine.findFirst({
      where: {
        OR: [{ id: slug }, { slug }]
      },
      include: { author: true }
    })

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

/**
 * Atualizar doutrina (admin)
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params

    const authResult = await requireAdmin()
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const { title, slug: newSlug, summary, content, authorId, tags } = body

    // Buscar por ID ou slug
    let existing = await prisma.doctrine.findUnique({
      where: { id: slug }
    })

    if (!existing) {
      existing = await prisma.doctrine.findUnique({
        where: { slug }
      })
    }

    if (!existing) {
      return NextResponse.json(
        { error: 'Doutrina não encontrada' },
        { status: 404 }
      )
    }

    // Validar novo slug
    if (newSlug && newSlug !== existing.slug) {
      const slugExists = await prisma.doctrine.findUnique({
        where: { slug: newSlug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Este slug já está em uso' },
          { status: 400 }
        )
      }
    }

    const doctrine = await prisma.doctrine.update({
      where: { id: existing.id },
      data: {
        title,
        slug: newSlug,
        summary,
        content,
        authorId,
        tags: tags ?? []
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

/**
 * Remover doutrina (admin)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params

    const authResult = await requireAdmin()
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    let existing = await prisma.doctrine.findUnique({
      where: { id: slug }
    })

    if (!existing) {
      existing = await prisma.doctrine.findUnique({
        where: { slug }
      })
    }

    if (!existing) {
      return NextResponse.json(
        { error: 'Doutrina não encontrada' },
        { status: 404 }
      )
    }

    await prisma.doctrine.delete({
      where: { id: existing.id }
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