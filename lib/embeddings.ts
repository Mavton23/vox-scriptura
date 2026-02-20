import { OpenAIEmbeddings } from '@langchain/openai'
import prisma from './prisma'

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
  maxConcurrency: 5,
  maxRetries: 3,
})

interface ContentToEmbed {
  id: string
  type: 'question' | 'doctrine' | 'verse'
  title?: string
  content: string
  authorId?: string
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const embedding = await embeddings.embedQuery(text)
    return embedding
  } catch (error) {
    console.error('Erro ao gerar embedding:', error)
    throw error
  }
}

export async function storeEmbedding(content: ContentToEmbed) {
  try {
    // Preparar texto para embedding
    let textToEmbed = ''
    
    switch (content.type) {
      case 'question':
        textToEmbed = `Pergunta: ${content.title}\nResposta: ${content.content}`
        break
      case 'doctrine':
        textToEmbed = `Título: ${content.title}\nConteúdo: ${content.content}`
        break
      case 'verse':
        textToEmbed = `Versículo: ${content.title}\nTexto: ${content.content}`
        break
    }

    // Gerar embedding
    const embedding = await generateEmbedding(textToEmbed)

    // Armazenar no banco
    // Nota: A sintaxe exata para vetores pode variar com o driver PostgreSQL
    await prisma.$executeRaw`
      INSERT INTO "ContentEmbedding" ("id", "contentId", "contentType", "title", "content", "embedding", "authorId", "createdAt", "updatedAt")
      VALUES (${crypto.randomUUID()}, ${content.id}, ${content.type}, ${content.title}, ${textToEmbed}, ${embedding}::vector, ${content.authorId}, NOW(), NOW())
    `

    return true
  } catch (error) {
    console.error('Erro ao armazenar embedding:', error)
    return false
  }
}

export async function searchSimilarContent(query: string, limit: number = 5): Promise<any[]> {
  try {
    // Gerar embedding da consulta
    const queryEmbedding = await generateEmbedding(query)

    // Buscar conteúdos similares usando similaridade de cosseno
    const results = await prisma.$queryRaw`
      SELECT 
        ce."contentId",
        ce."contentType",
        ce.title,
        ce.content,
        a.name as "authorName",
        a.slug as "authorSlug",
        1 - (ce.embedding <=> ${queryEmbedding}::vector) as similarity
      FROM "ContentEmbedding" ce
      LEFT JOIN "Author" a ON ce."authorId" = a.id
      WHERE ce.embedding IS NOT NULL
      ORDER BY ce.embedding <=> ${queryEmbedding}::vector
      LIMIT ${limit}
    `

    return results as any
  } catch (error) {
    console.error('Erro na busca semântica:', error)
    return []
  }
}

// Função para reindexar todo o conteúdo (útil após seed ou atualizações)
export async function reindexAllContent() {
  console.log('Iniciando reindexação de conteúdo...')

  // Buscar todas as perguntas
  const questions = await prisma.questionAnswer.findMany({
    include: { author: true }
  })
  
  for (const q of questions) {
    await storeEmbedding({
      id: q.id,
      type: 'question',
      title: q.question,
      content: q.answer,
      authorId: q.authorId
    })
  }

  // Buscar todas as doutrinas
  const doctrines = await prisma.doctrine.findMany({
    include: { author: true }
  })
  
  for (const d of doctrines) {
    await storeEmbedding({
      id: d.id,
      type: 'doctrine',
      title: d.title,
      content: d.content,
      authorId: d.authorId
    })
  }

  // Buscar todos os versículos
  const verses = await prisma.dailyVerse.findMany({
    include: { author: true }
  })
  
  for (const v of verses) {
    await storeEmbedding({
      id: v.id,
      type: 'verse',
      title: v.verse,
      content: `${v.text}\n\nExplicação: ${v.explanation}`,
      authorId: v.authorId
    })
  }

  console.log('Reindexação concluída!')
}