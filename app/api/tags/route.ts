import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/tags?type=questions|doctrines|daily - Listar todas as tags únicas por tipo
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'

    let tags: string[] = []

    if (type === 'all' || type === 'questions') {
      const questions = await prisma.questionAnswer.findMany({
        select: { tags: true }
      })
      tags = [...tags, ...questions.flatMap(q => q.tags)]
    }

    if (type === 'all' || type === 'doctrines') {
      const doctrines = await prisma.doctrine.findMany({
        select: { tags: true }
      })
      tags = [...tags, ...doctrines.flatMap(d => d.tags)]
    }

    if (type === 'all' || type === 'daily') {
      const verses = await prisma.dailyVerse.findMany({
        select: { tags: true }
      })
      tags = [...tags, ...verses.flatMap(v => v.tags)]
    }

    // Remove duplicatas e ordena
    const uniqueTags = [...new Set(tags)].sort()

    return NextResponse.json({ tags: uniqueTags })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar tags' },
      { status: 500 }
    )
  }
}