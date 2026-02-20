'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function AuthorFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const isNew = id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    bioUrl: ''
  })

  useEffect(() => {
    if (!isNew) {
      fetchAuthor()
    }
  }, [id])

  // Gerar slug automaticamente a partir do nome
  useEffect(() => {
    if (formData.name && isNew) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.name, isNew])

  async function fetchAuthor() {
    try {
      const response = await fetch(`/api/authors/${id}`)
      const data = await response.json()
      setFormData({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        bioUrl: data.bioUrl || ''
      })
    } catch (error) {
      console.error('Erro ao buscar autor:', error)
      setError('Não foi possível carregar o autor')
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
      const response = await fetch(
        isNew ? '/api/authors' : `/api/authors/${formData.slug}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar')
      }

      setSuccess('Autor salvo com sucesso!')
      
      if (isNew) {
        setTimeout(() => router.push('/admin/authors'), 1500)
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
          <Link href="/admin/authors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {isNew ? 'Novo Autor' : 'Editar Autor'}
          </h1>
          <p className="text-muted-foreground">
            {isNew 
              ? 'Adicione um novo autor à plataforma'
              : 'Edite os dados do autor'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Autor</CardTitle>
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
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digite o nome do autor..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-amigavel-do-autor"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL amigável para o autor. Use apenas letras, números e hífens.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Biografia / Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Digite uma breve biografia ou descrição do autor..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bioUrl">URL da Biografia (opcional)</Label>
              <div className="flex gap-2">
                <Input
                  id="bioUrl"
                  value={formData.bioUrl}
                  onChange={(e) => setFormData({ ...formData, bioUrl: e.target.value })}
                  placeholder="https://..."
                  type="url"
                />
                {formData.bioUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={formData.bioUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Link para uma biografia completa ou página sobre o autor
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/authors')}
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