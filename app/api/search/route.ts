import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/search?q=termo&type=questions|doctrines|all
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query) {
      return NextResponse.json(
        { error: 'Termo de busca é obrigatório' },
        { status: 400 }
      )
    }

    const results: any = {}

    // Busca em Perguntas e Respostas
    if (type === 'all' || type === 'questions') {
      const questions = await prisma.questionAnswer.findMany({
        where: {
          OR: [
            { question: { contains: query, mode: 'insensitive' } },
            { answer: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: { author: { select: { name: true, slug: true } } },
        take: limit
      })
      results.questions = questions
    }

    // Busca em Doutrinas
    if (type === 'all' || type === 'doctrines') {
      const doctrines = await prisma.doctrine.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: { author: { select: { name: true, slug: true } } },
        take: limit
      })
      results.doctrines = doctrines
    }

    // Busca em Versículos Diários
    if (type === 'all' || type === 'daily') {
      const verses = await prisma.dailyVerse.findMany({
        where: {
          OR: [
            { verse: { contains: query, mode: 'insensitive' } },
            { text: { contains: query, mode: 'insensitive' } },
            { explanation: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: { author: { select: { name: true, slug: true } } },
        take: limit
      })
      results.verses = verses
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao realizar busca' },
      { status: 500 }
    )
  }
}