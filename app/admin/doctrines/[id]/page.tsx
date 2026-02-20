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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2, Eye } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

interface Author {
  id: string
  name: string
}

export default function DoctrineFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const isNew = id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [authors, setAuthors] = useState<Author[]>([])
  const [previewMode, setPreviewMode] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    authorId: '',
    tags: ''
  })

  useEffect(() => {
    fetchAuthors()
    if (!isNew) {
      fetchDoctrine()
    }
  }, [id])

  // Gerar slug automaticamente a partir do título
  useEffect(() => {
    if (formData.title && isNew) {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, isNew])

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

  async function fetchDoctrine() {
    try {
      const response = await fetch(`/api/doctrines/${id}`)
      const data = await response.json()
      setFormData({
        title: data.title,
        slug: data.slug,
        summary: data.summary || '',
        content: data.content,
        authorId: data.authorId,
        tags: data.tags?.join(', ') || ''
      })
    } catch (error) {
      console.error('Erro ao buscar doutrina:', error)
      setError('Não foi possível carregar a doutrina')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
        isNew ? '/api/doctrines' : `/api/doctrines/${id}`,
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

      setSuccess('Doutrina salva com sucesso!')
      
      if (isNew) {
        setTimeout(() => router.push('/admin/doctrines'), 1500)
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/admin/doctrines">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {isNew ? 'Nova Doutrina' : 'Editar Doutrina'}
          </h1>
          <p className="text-muted-foreground">
            {isNew 
              ? 'Adicione um novo ensino doutrinário à plataforma'
              : 'Edite os detalhes da doutrina'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Informações da Doutrina</CardTitle>
                <CardDescription>
                  Preencha todos os campos obrigatórios
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {previewMode ? 'Editar' : 'Visualizar'}
              </Button>
            </div>
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

            {previewMode ? (
              <div className="prose prose-lg max-w-none p-6 border rounded-lg">
                <h1 className="text-3xl font-bold text-primary">{formData.title || 'Título da Doutrina'}</h1>
                {formData.summary && (
                  <p className="text-muted-foreground italic">{formData.summary}</p>
                )}
                <hr className="my-4" />
                <ReactMarkdown>{formData.content || '*Conteúdo não disponível*'}</ReactMarkdown>
              </div>
            ) : (
              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                  <TabsTrigger value="content">Conteúdo</TabsTrigger>
                  <TabsTrigger value="metadata">Metadados</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Digite o título da doutrina..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL) *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="url-amigavel-da-doutrina"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      URL amigável para a doutrina. Use apenas letras, números e hífens.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Resumo</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Breve resumo da doutrina (aparece nas listagens)..."
                      rows={3}
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
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo * (Markdown)</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Digite o conteúdo da doutrina em formato Markdown..."
                      rows={15}
                      required
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Você pode usar Markdown para formatar o texto: **negrito**, *itálico*, # títulos, etc.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Ex: salvação, graça, expiação"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separe as tags por vírgula. Ex: salvação, graça, expiação
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/doctrines')}
            >
              Cancelar
            </Button>
            {!previewMode && (
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
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}