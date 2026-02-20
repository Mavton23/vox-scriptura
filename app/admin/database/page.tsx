'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Database, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function DatabasePage() {
  const [reindexing, setReindexing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleReindex = async () => {
    if (!confirm('Isso vai recriar todos os embeddings para busca semântica. Deseja continuar?')) {
      return
    }

    setReindexing(true)
    setProgress(0)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/admin/reindex', {
        method: 'POST'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao reindexar')
      }

      setStatus('success')
      setMessage('Reindexação concluída com sucesso!')
      setProgress(100)
    } catch (error: any) {
      setStatus('error')
      setMessage(error.message)
    } finally {
      setReindexing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Banco de Dados</h1>
        <p className="text-muted-foreground">
          Gerencie o banco de dados e embeddings da plataforma
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Banco</CardTitle>
            <CardDescription>
              Informações sobre o banco de dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">PostgreSQL</span>
              <span className="text-sm text-green-500 flex items-center">
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Conectado
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">pgvector</span>
              <span className="text-sm text-green-500 flex items-center">
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Instalado
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Embeddings</span>
              <span className="text-sm text-muted-foreground">
                OpenAI text-embedding-3-small
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Reindex Card */}
        <Card>
          <CardHeader>
            <CardTitle>Reindexar Embeddings</CardTitle>
            <CardDescription>
              Recrie os embeddings para busca semântica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'success' && (
              <Alert className="border-green-500 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {reindexing && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  Reindexando... Isso pode levar alguns minutos.
                </p>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Esta operação vai gerar novos embeddings para todo o conteúdo da plataforma,
              garantindo que a busca semântica e o chat com IA funcionem corretamente.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleReindex}
              disabled={reindexing}
              className="w-full"
            >
              {reindexing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reindexando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reindexar Agora
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Estatísticas */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Estatísticas do Banco</CardTitle>
            <CardDescription>
              Tamanho e contagem dos dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 border rounded-lg text-center">
                <Database className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <p className="text-2xl font-bold">XX</p>
                <p className="text-xs text-muted-foreground">Perguntas</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Database className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <p className="text-2xl font-bold">XX</p>
                <p className="text-xs text-muted-foreground">Doutrinas</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Database className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <p className="text-2xl font-bold">XX</p>
                <p className="text-xs text-muted-foreground">Versículos</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Database className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <p className="text-2xl font-bold">XX</p>
                <p className="text-xs text-muted-foreground">Embeddings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}