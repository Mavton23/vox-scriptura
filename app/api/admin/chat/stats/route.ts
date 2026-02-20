import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/auth/permissions'

export const GET = withAuth(
  async () => {
    try {
      // Estatísticas gerais
      const [
        totalConversations,
        totalMessages,
        feedbackStats,
        popularTopics
      ] = await Promise.all([
        // Total de conversas
        prisma.chatConversation.count(),
        
        // Total de mensagens
        prisma.chatMessage.count(),
        
        // Estatísticas de feedback
        prisma.chatFeedback.groupBy({
          by: ['rating'],
          _count: true
        }),
        
        // Tópicos populares (baseado em palavras-chave nas perguntas)
        prisma.chatMessage.findMany({
          where: { role: 'user' },
          select: { content: true },
          take: 100,
          orderBy: { createdAt: 'desc' }
        })
      ])

      // Calcular média de mensagens por conversa
      const averageMessagesPerConversation = totalConversations > 0 
        ? totalMessages / totalConversations 
        : 0

      // Processar feedback
      let positive = 0
      let negative = 0
      let totalRating = 0
      let ratingCount = 0

      feedbackStats.forEach(stat => {
        if (stat.rating >= 4) positive += stat._count
        if (stat.rating <= 2) negative += stat._count
        totalRating += stat.rating * stat._count
        ratingCount += stat._count
      })

      const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0

      // Processar tópicos populares (simplificado)
      const topicCounts: Record<string, number> = {}
      const commonWords = ['que', 'o', 'a', 'em', 'para', 'com', 'como', 'por', 'de', 'do', 'da', 'dos', 'das']

      popularTopics.forEach(msg => {
        const words = msg.content
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .split(/\W+/)
          .filter(word => word.length > 3 && !commonWords.includes(word))

        words.forEach(word => {
          topicCounts[word] = (topicCounts[word] || 0) + 1
        })
      })

      const topTopics = Object.entries(topicCounts)
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      return NextResponse.json({
        totalConversations,
        totalMessages,
        averageMessagesPerConversation,
        feedbackStats: {
          positive,
          negative,
          average: averageRating
        },
        popularTopics: topTopics,
        usageByDay: [] // Placeholder para dados de uso diário
      })
    } catch (error) {
      console.error('Erro ao buscar estatísticas do chat:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar estatísticas' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)