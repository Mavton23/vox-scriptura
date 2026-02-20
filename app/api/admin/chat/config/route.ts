import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/permissions'
import fs from 'fs/promises'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'config', 'chat.json')

// Configuração padrão
const defaultConfig = {
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  maxTokens: 4000,
  contextChunks: 5,
  enabled: true,
  requireAuth: false
}

// Garantir que o diretório de config existe
async function ensureConfigDir() {
  try {
    await fs.mkdir(path.join(process.cwd(), 'config'), { recursive: true })
  } catch (error) {
    // Diretório já existe
  }
}

// Ler configuração
async function readConfig() {
  try {
    await ensureConfigDir()
    const data = await fs.readFile(CONFIG_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // Arquivo não existe, retornar configuração padrão
    return defaultConfig
  }
}

// Salvar configuração
async function saveConfig(config: any) {
  await ensureConfigDir()
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))
}

// GET /api/admin/chat/config - Buscar configurações (admin)
export const GET = withAuth(
  async () => {
    try {
      const config = await readConfig()
      return NextResponse.json(config)
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar configurações' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)

// PUT /api/admin/chat/config - Atualizar configurações (admin)
export const PUT = withAuth(
  async (req: Request) => {
    try {
      const newConfig = await req.json()
      
      // Validar configurações
      if (newConfig.temperature < 0 || newConfig.temperature > 1) {
        return NextResponse.json(
          { error: 'Temperatura deve estar entre 0 e 1' },
          { status: 400 }
        )
      }

      if (newConfig.maxTokens < 1000 || newConfig.maxTokens > 8000) {
        return NextResponse.json(
          { error: 'Máximo de tokens deve estar entre 1000 e 8000' },
          { status: 400 }
        )
      }

      if (newConfig.contextChunks < 1 || newConfig.contextChunks > 10) {
        return NextResponse.json(
          { error: 'Chunks de contexto devem estar entre 1 e 10' },
          { status: 400 }
        )
      }

      await saveConfig(newConfig)
      return NextResponse.json(newConfig)
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar configurações' },
        { status: 500 }
      )
    }
  },
  { requireAdmin: true }
)