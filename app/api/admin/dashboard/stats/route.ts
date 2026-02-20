import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth/permissions'

export const GET = withAuth(
  async () => {
    try {
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
        // Contagens totais
        prisma.questionAnswer.count(),
        prisma.doctrine.count(),
        prisma.dailyVerse.count(),
        prisma.author.count(),
        prisma.user.count(),
        
        // Itens recentes
        prisma.questionAnswer.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { 
            author: { 
              select: { name: true } 
            } 
          }
        }),
        
        prisma.doctrine.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { 
            author: { 
              select: { name: true } 
            } 
          }
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
      console.error('Erro ao buscar estatísticas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar estatísticas' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)