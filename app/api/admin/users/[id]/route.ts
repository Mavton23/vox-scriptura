import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/permissions'

export async function PATCH(
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

    // Aguardar os params (Next.js 15+)
    const { id } = await params

    const { role } = await request.json()

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Papel inválido' },
        { status: 400 }
      )
    }

    // Buscar o usuário a ser atualizado
    const userToUpdate = await prisma.user.findUnique({
      where: { id }
    })

    if (!userToUpdate) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Impedir que o admin remova o próprio papel de admin
    if (userToUpdate.email === authResult.user?.email && role !== 'admin') {
      return NextResponse.json(
        { error: 'Você não pode remover seu próprio papel de admin' },
        { status: 400 }
      )
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    )
  }
}

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

    // Aguardar os params (Next.js 15+)
    const { id } = await params

    // Buscar o usuário a ser excluído
    const userToDelete = await prisma.user.findUnique({
      where: { id }
    })

    if (!userToDelete) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Impedir que o admin se exclua
    if (userToDelete.email === authResult.user?.email) {
      return NextResponse.json(
        { error: 'Você não pode excluir sua própria conta' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao excluir usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir usuário' },
      { status: 500 }
    )
  }
}