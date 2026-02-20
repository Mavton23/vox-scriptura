import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { role } = await request.json()

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Papel inválido' },
        { status: 400 }
      )
    }

    // Impedir que o admin remova o próprio papel de admin
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (user?.email === session.user.email && role !== 'admin') {
      return NextResponse.json(
        { error: 'Você não pode remover seu próprio papel de admin' },
        { status: 400 }
      )
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Impedir que o admin se exclua
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (user?.email === session.user.email) {
      return NextResponse.json(
        { error: 'Você não pode excluir sua própria conta' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: params.id }
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