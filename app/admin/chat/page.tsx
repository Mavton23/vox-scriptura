'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Bot, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react'

interface ChatStats {
  totalConversations: number
  totalMessages: number
  averageMessagesPerConversation: number
  feedbackStats: {
    positive: number
    negative: number
    average: number
  }
  popularTopics: Array<{
    topic: string
    count: number
  }>
  usageByDay: Array<{
    date: string
    count: number
  }>
}

interface AIConfig {
  model: string
  temperature: number
  maxTokens: number
  contextChunks: number
  enabled: boolean
  requireAuth: boolean
}

export default function AdminChatPage() {
  const [stats, setStats] = useState<ChatStats | null>(null)
  const [config, setConfig] = useState<AIConfig>({
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 4000,
    contextChunks: 5,
    enabled: true,
    requireAuth: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchStats()
    fetchConfig()
  }, [])

  async function fetchStats() {
    try {
      const response = await fetch('/api/admin/chat/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }

  async function fetchConfig() {
    try {
      const response = await fetch('/api/admin/chat/config')
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveConfig() {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/chat/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar')
      }

      setSuccess('Configurações salvas com sucesso!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleReindex() {
    if (!confirm('Isso vai recriar todos os embeddings para busca semântica. Deseja continuar?')) {
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/reindex', {
        method: 'POST'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao reindexar')
      }

      setSuccess('Reindexação iniciada com sucesso!')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Chat com IA</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações e monitore o uso do chat com IA
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stats">
            <BarChart3 className="mr-2 h-4 w-4" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <TrendingUp className="mr-2 h-4 w-4" />
            Monitoramento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          {/* Cards de Estatísticas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversas</CardTitle>
                <MessageSquare className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalConversations || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Total de conversas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
                <Bot className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Total de mensagens
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média</CardTitle>
                <Users className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.averageMessagesPerConversation.toFixed(1) || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Msgs por conversa
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feedback</CardTitle>
                <ThumbsUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.feedbackStats.average.toFixed(1) || 0}/5
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <ThumbsUp className="h-3 w-3 mr-1 text-green-500" />
                    {stats?.feedbackStats.positive || 0}
                  </span>
                  <span className="flex items-center">
                    <ThumbsDown className="h-3 w-3 mr-1 text-red-500" />
                    {stats?.feedbackStats.negative || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tópicos Populares */}
          <Card>
            <CardHeader>
              <CardTitle>Tópicos Mais Discutidos</CardTitle>
              <CardDescription>
                Assuntos mais frequentes nas conversas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.popularTopics.map((topic, index) => (
                  <div key={topic.topic} className="flex items-center gap-4">
                    <Badge variant="outline" className="w-16 justify-center">
                      #{index + 1}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{topic.topic}</span>
                        <span className="text-sm text-muted-foreground">
                          {topic.count} menções
                        </span>
                      </div>
                      <Progress value={topic.count} max={stats.popularTopics[0].count} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Modelo</CardTitle>
              <CardDescription>
                Ajuste os parâmetros do modelo de IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enabled">Chat Habilitado</Label>
                  <p className="text-xs text-muted-foreground">
                    Ativa ou desativa o chat com IA na plataforma
                  </p>
                </div>
                <Switch
                  id="enabled"
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireAuth">Exigir Autenticação</Label>
                  <p className="text-xs text-muted-foreground">
                    Usuários precisam estar logados para usar o chat
                  </p>
                </div>
                <Switch
                  id="requireAuth"
                  checked={config.requireAuth}
                  onCheckedChange={(checked) => setConfig({ ...config, requireAuth: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <select
                  id="model"
                  className="w-full p-2 border rounded-md"
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                >
                  <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperatura: {config.temperature}</Label>
                  <span className="text-xs text-muted-foreground">
                    {config.temperature < 0.3 ? 'Mais preciso' : config.temperature > 0.7 ? 'Mais criativo' : 'Balanceado'}
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[config.temperature]}
                  onValueChange={(value) => setConfig({ ...config, temperature: value[0] })}
                />
                <p className="text-xs text-muted-foreground">
                  Valores mais baixos: respostas mais precisas e focadas
                  Valores mais altos: respostas mais criativas e diversas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTokens">Máximo de Tokens: {config.maxTokens}</Label>
                <Slider
                  id="maxTokens"
                  min={1000}
                  max={8000}
                  step={500}
                  value={[config.maxTokens]}
                  onValueChange={(value) => setConfig({ ...config, maxTokens: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contextChunks">Chunks de Contexto: {config.contextChunks}</Label>
                <Slider
                  id="contextChunks"
                  min={1}
                  max={10}
                  step={1}
                  value={[config.contextChunks]}
                  onValueChange={(value) => setConfig({ ...config, contextChunks: value[0] })}
                />
                <p className="text-xs text-muted-foreground">
                  Número de documentos similares usados como contexto para responder
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Base de Conhecimento</CardTitle>
              <CardDescription>
                Gerencie os embeddings e a base de conhecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status dos Embeddings</p>
                  <p className="text-sm text-muted-foreground">
                    Última atualização: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline" className="text-green-500">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  OK
                </Badge>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleReindex}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Reindexar Base de Conhecimento
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveConfig} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uso em Tempo Real</CardTitle>
              <CardDescription>
                Monitoramento do uso do chat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-75 flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  Gráfico de uso em tempo real será exibido aqui
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Últimas Conversas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Conversa #{i}</p>
                        <p className="text-xs text-muted-foreground">
                          <Clock className="inline h-3 w-3 mr-1" />
                          Há {i} hora{i > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Badge variant="secondary">8 mensagens</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {i > 3 ? (
                          <ThumbsUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ThumbsDown className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Resposta sobre salvação</p>
                          <p className="text-xs text-muted-foreground">
                            Usuário anônimo
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{i}/5</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}