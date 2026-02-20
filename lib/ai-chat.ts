import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { searchSimilarContent } from './embeddings'
import prisma from './prisma'

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo-preview',
  temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.MAX_TOKENS || '4000'),
})

const systemPrompt = PromptTemplate.fromTemplate(`
Você é um assistente teológico especializado chamado "vox-scriptura", baseado exclusivamente nos escritos de autores cristãos confiáveis como Mario Persona, John Nelson Darby, William Kelly, Chuck Smith e outros da sã doutrina.

CONTEXTO FORNECIDO:
{context}

DIRETRIZES:
1. Baseie suas respostas APENAS no contexto fornecido acima
2. Se o contexto não contiver informação suficiente para responder, diga honestamente que não encontrou essa informação nos escritos disponíveis
3. Sempre cite o autor e a fonte quando usar informações do contexto
4. Mantenha um tom pastoral, amoroso e doutrinariamente preciso
5. Use linguagem clara e acessível, mas sem comprometer a profundidade teológica
6. Quando apropriado, sugira versículos bíblicos relacionados
7. Evite especulações teológicas não fundamentadas no contexto

PERGUNTA DO USUÁRIO: {question}

INSTRUÇÃO: Responda à pergunta baseando-se ESTRITAMENTE no contexto fornecido. Se o contexto não for suficiente, explique isso ao usuário e sugira temas relacionados que você pode ajudar.
`)

export async function generateChatResponse(
  question: string,
  conversationId?: string,
  userId?: string
) {
  try {
    // Buscar contexto relevante via busca semântica
    const similarContent = await searchSimilarContent(question, 5)
    
    // Formatar contexto para o prompt
    const contextText = similarContent
      .map((item, index) => {
        let content = ''
        switch (item.contentType) {
          case 'question':
            content = `[FONTE ${index + 1}] Pergunta: ${item.title}\nResposta: ${item.content} (Autor: ${item.authorName})`
            break
          case 'doctrine':
            content = `[FONTE ${index + 1}] Doutrina: ${item.title}\nConteúdo: ${item.content} (Autor: ${item.authorName})`
            break
          case 'verse':
            content = `[FONTE ${index + 1}] Versículo: ${item.title}\n${item.content} (Autor: ${item.authorName})`
            break
        }
        return content
      })
      .join('\n\n')

    // Preparar fontes para salvar no histórico
    const sources = similarContent.map(item => ({
      id: item.contentId,
      type: item.contentType,
      title: item.title,
      author: item.authorName,
      similarity: item.similarity
    }))

    // Gerar resposta com LangChain
    const chain = RunnableSequence.from([
      systemPrompt,
      model,
      new StringOutputParser(),
    ])

    const response = await chain.invoke({
      context: contextText || 'Nenhum contexto específico encontrado para esta pergunta.',
      question: question,
    })

    // Salvar no histórico se tiver usuário logado
    if (userId) {
      await saveChatMessage(userId, conversationId, question, response, sources)
    }

    return {
      answer: response,
      sources: sources.filter(s => s.similarity > 0.7), // Só mostrar fontes com alta relevância
      conversationId
    }
  } catch (error) {
    console.error('Erro ao gerar resposta:', error)
    throw new Error('Não foi possível processar sua pergunta. Tente novamente.')
  }
}

async function saveChatMessage(
  userId: string,
  conversationId: string | undefined,
  question: string,
  answer: string,
  sources: any[]
) {
  try {
    // Se não tiver conversationId, criar nova conversa
    if (!conversationId) {
      const conversation = await prisma.chatConversation.create({
        data: {
          userId,
          title: question.slice(0, 50) + (question.length > 50 ? '...' : ''),
          messages: {
            create: [
              { role: 'user', content: question },
              { role: 'assistant', content: answer, sources }
            ]
          }
        }
      })
      return conversation.id
    } else {
      // Adicionar mensagem à conversa existente
      await prisma.chatMessage.createMany({
        data: [
          { conversationId, role: 'user', content: question },
          { conversationId, role: 'assistant', content: answer, sources }
        ]
      })
      return conversationId
    }
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error)
    return conversationId
  }
}

export async function getChatHistory(userId: string, conversationId: string) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        role: true,
        content: true,
        sources: true,
        createdAt: true
      }
    })

    return messages
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return []
  }
}

export async function getUserConversations(userId: string) {
  try {
    const conversations = await prisma.chatConversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return conversations
  } catch (error) {
    console.error('Erro ao buscar conversas:', error)
    return []
  }
}