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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Author {
  id: string
  name: string
}

export default function DailyVerseFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const isNew = id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [authors, setAuthors] = useState<Author[]>([])
  const [date, setDate] = useState<Date>()
  
  const [formData, setFormData] = useState({
    verse: '',
    text: '',
    explanation: '',
    authorId: '',
    tags: ''
  })

  useEffect(() => {
    fetchAuthors()
    if (!isNew) {
      fetchVerse()
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

  async function fetchVerse() {
    try {
      const response = await fetch(`/api/daily/${id}`)
      const data = await response.json()
      setFormData({
        verse: data.verse,
        text: data.text,
        explanation: data.explanation,
        authorId: data.authorId,
        tags: data.tags?.join(', ') || ''
      })
      if (data.scheduledFor) {
        setDate(new Date(data.scheduledFor))
      }
    } catch (error) {
      console.error('Erro ao buscar versículo:', error)
      setError('Não foi possível carregar o versículo')
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
        tags: tagsArray,
        scheduledFor: date ? date.toISOString() : null
      }

      const response = await fetch(
        isNew ? '/api/daily' : `/api/daily/${id}`,
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

      setSuccess('Versículo salvo com sucesso!')
      
      if (isNew) {
        setTimeout(() => router.push('/admin/daily-verses'), 1500)
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
          <Link href="/admin/daily-verses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {isNew ? 'Nova Frase Diária' : 'Editar Frase Diária'}
          </h1>
          <p className="text-muted-foreground">
            {isNew 
              ? 'Adicione um novo versículo com explicação'
              : 'Edite os detalhes do versículo'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Versículo</CardTitle>
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
              <Label htmlFor="verse">Versículo (referência) *</Label>
              <Input
                id="verse"
                value={formData.verse}
                onChange={(e) => setFormData({ ...formData, verse: e.target.value })}
                placeholder="Ex: João 3:16"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Texto do Versículo *</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Digite o texto do versículo..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="explanation">Explicação/Meditação *</Label>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Digite a explicação ou meditação sobre o versículo..."
                rows={5}
                required
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
              <Label>Agendamento (opcional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Se não selecionar uma data, o versículo será exibido aleatoriamente.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Ex: amor, graça, salvação"
              />
              <p className="text-xs text-muted-foreground">
                Separe as tags por vírgula. Ex: amor, graça, salvação
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/daily-verses')}
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