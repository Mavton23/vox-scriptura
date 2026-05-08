'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    // Limpar erro do campo ao digitar
    if (errors[id as keyof FormData]) {
      setErrors(prev => ({ ...prev, [id]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}
    
    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!formData.subject.trim() || formData.subject.length < 3) {
      newErrors.subject = 'Assunto deve ter pelo menos 3 caracteres'
    }
    
    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Mensagem enviada com sucesso!')
        // Limpar formulário
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        toast.error(data.error || 'Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro de conexão. Tente novamente mais tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nome <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">
          Assunto <span className="text-red-500">*</span>
        </Label>
        <Input
          id="subject"
          placeholder="Dúvida, sugestão, parceria..."
          value={formData.subject}
          onChange={handleChange}
          disabled={isLoading}
          className={errors.subject ? 'border-red-500' : ''}
        />
        {errors.subject && (
          <p className="text-sm text-red-500">{errors.subject}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Mensagem <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Escreva sua mensagem aqui..."
          rows={6}
          value={formData.message}
          onChange={handleChange}
          disabled={isLoading}
          className={errors.message ? 'border-red-500' : ''}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Enviar Mensagem
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Ao enviar esta mensagem, você concorda com nossa{' '}
        <a href="/privacidade" className="text-primary hover:underline">
          Política de Privacidade
        </a>
      </p>
    </form>
  )
}