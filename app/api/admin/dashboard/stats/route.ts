import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/permissions'

export async function GET(req: NextRequest) {
  try {
    // Verificar permissões de admin
    const authResult = await requireAdmin()
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const [
      totalQuestions,
      totalDoctrines,
      totalVerses,
      totalAuthors,
      totalUsers,
      recentQuestions,
      recentDoctrines,
      recentUsers
    ] = await Promise.all([
      prisma.questionAnswer.count(),
      prisma.doctrine.count(),
      prisma.dailyVerse.count(),
      prisma.author.count(),
      prisma.user.count(),

      prisma.questionAnswer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } }
      }),

      prisma.doctrine.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } }
      }),

      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      })
    ])

    return NextResponse.json({
      counts: {
        questions: totalQuestions,
        doctrines: totalDoctrines,
        verses: totalVerses,
        authors: totalAuthors,
        users: totalUsers
      },
      recent: {
        questions: recentQuestions,
        doctrines: recentDoctrines,
        users: recentUsers
      }
    })
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}