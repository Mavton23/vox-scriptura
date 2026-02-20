'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface Author {
  id: string
  name: string
}

export default function QuestionFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const isNew = id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [authors, setAuthors] = useState<Author[]>([])
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    context: '',
    authorId: '',
    tags: ''
  })

  useEffect(() => {
    fetchAuthors()
    if (!isNew) {
      fetchQuestion()
    }
  }, [id])

  async function fetchAuthors() {
    try {
      const response = await fetch('/api/authors')
      const data = await response.json()

      if (data && Array.isArray(data.authors)) {
        setAuthors(data.authors)
      } else if (Array.isArray(data)) {
        setAuthors(data)
      } else {
        console.error('Formato de dados inesperado:', data)
        setAuthors([])
      }
    } catch (error) {
      console.error('Erro ao buscar autores:', error)
    }
  }

  async function fetchQuestion() {
    try {
      const response = await fetch(`/api/questions/${id}`)
      const data = await response.json()
      setFormData({
        question: data.question,
        answer: data.answer,
        context: data.context || '',
        authorId: data.authorId,
        tags: data.tags?.join(', ') || ''
      })
    } catch (error) {
      console.error('Erro ao buscar pergunta:', error)
      setError('Não foi possível carregar a pergunta')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const payload = {
        ...formData,
        tags: tagsArray
      }

      const response = await fetch(
        isNew ? '/api/questions' : `/api/questions/${id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar')
      }

      setSuccess('Pergunta salva com sucesso!')
      
      if (isNew) {
        router.push('/admin/questions')
      } else {
        setTimeout(() => setSuccess(''), 3000)
      }
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/admin/questions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {isNew ? 'Nova Pergunta' : 'Editar Pergunta'}
          </h1>
          <p className="text-muted-foreground">
            {isNew 
              ? 'Adicione uma nova pergunta e resposta à plataforma'
              : 'Edite os detalhes da pergunta'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Pergunta</CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="question">Pergunta *</Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Digite a pergunta..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Resposta *</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Digite a resposta..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Contexto (opcional)</Label>
              <Input
                id="context"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                placeholder="Ex: Baseado em João 3..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Select
                value={formData.authorId}
                onValueChange={(value) => setFormData({ ...formData, authorId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um autor" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Ex: salvação, graça, fé"
              />
              <p className="text-xs text-muted-foreground">
                Separe as tags por vírgula. Ex: salvação, graça, fé
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/questions')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}