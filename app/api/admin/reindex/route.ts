import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { reindexAllContent } from '@/lib/embeddings'

export async function POST() {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verificar se é admin (você pode buscar do banco)
    // Por simplicidade, vamos assumir que o middleware já protegeu

    await reindexAllContent()

    return NextResponse.json({
      message: 'Reindexação concluída com sucesso'
    })
  } catch (error) {
    console.error('Erro na reindexação:', error)
    return NextResponse.json(
      { error: 'Erro ao reindexar conteúdo' },
      { status: 500 }
    )
  }
}