'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Mail, 
  MailOpen, 
  Archive, 
  Trash2,
  Loader2,
  Eye,
  CheckCircle
} from 'lucide-react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  reply?: string
  createdAt: string
  user?: {
    name: string
    email: string
  }
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [reply, setReply] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      toast.error('Erro ao carregar mensagens')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(messageId: string, status: string, replyText?: string) {
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageId, 
          status,
          reply: replyText 
        })
      })

      if (response.ok) {
        toast.success(`Mensagem ${status === 'replied' ? 'respondida' : 'atualizada'} com sucesso`)
        fetchMessages()
        setSelectedMessage(null)
        setReply('')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar mensagem')
    } finally {
      setIsReplying(false)
    }
  }

  async function deleteMessage(messageId: string) {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return

    try {
      const response = await fetch(`/api/contact?id=${messageId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Mensagem excluída')
        fetchMessages()
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao excluir mensagem')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pendente', className: 'bg-yellow-500' },
      read: { label: 'Lida', className: 'bg-blue-500' },
      replied: { label: 'Respondida', className: 'bg-green-500' },
      archived: { label: 'Arquivada', className: 'bg-gray-500' }
    }
    const config = statusConfig[status] || { label: status, className: 'bg-gray-500' }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Mensagens de Contato</h1>
        <p className="text-muted-foreground">
          Gerencie todas as mensagens enviadas pelos usuários
        </p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Nenhuma mensagem</h3>
              <p className="text-muted-foreground">
                Não há mensagens de contato no momento
              </p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{message.subject}</CardTitle>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>De: {message.name}</span>
                      <span>Email: {message.email}</span>
                      <span>Data: {new Date(message.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(message.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Mensagem:</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>

                {message.reply && (
                  <div className="mb-4 p-3 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2 text-primary">Resposta enviada:</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {message.reply}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedMessage(message)
                          setReply(message.reply || '')
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{selectedMessage?.subject}</DialogTitle>
                        <DialogDescription>
                          De: {selectedMessage?.name} ({selectedMessage?.email})
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Mensagem:</h4>
                          <p className="text-muted-foreground whitespace-pre-wrap">
                            {selectedMessage?.message}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Responder:</h4>
                          <Textarea
                            placeholder="Digite sua resposta aqui..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            rows={4}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => updateStatus(selectedMessage!.id, 'read')}
                            variant="outline"
                          >
                            Marcar como lida
                          </Button>
                          <Button
                            onClick={() => {
                              setIsReplying(true)
                              updateStatus(selectedMessage!.id, 'replied', reply)
                            }}
                            disabled={isReplying || !reply}
                          >
                            {isReplying ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Enviar Resposta
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus(message.id, 'read')}
                  >
                    <MailOpen className="h-4 w-4 mr-2" />
                    Marcar como lida
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus(message.id, 'archived')}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Arquivar
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMessage(message.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}