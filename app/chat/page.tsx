'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  Plus, 
  History,
  Trash2,
  Edit2,
  Check,
  X,
  BookOpen,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{
    id: string
    type: string
    title: string
    author: string
    similarity: number
  }>
  createdAt: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  updatedAt: string
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/chat')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchConversations()
    }
  }, [session])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function fetchConversations() {
    try {
      const response = await fetch('/api/chat')
      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.error('Erro ao buscar conversas:', error)
    }
  }

  async function fetchConversation(id: string) {
    try {
      const response = await fetch(`/api/chat/${id}`)
      const data = await response.json()
      setCurrentConversation(data)
      setMessages(data.messages)
    } catch (error) {
      console.error('Erro ao buscar conversa:', error)
    }
  }

  async function handleSendMessage() {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // Adicionar mensagem do usuário à UI imediatamente
    const tempUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          conversationId: currentConversation?.id
        })
      })

      const data = await response.json()

      // Adicionar resposta da IA
      const assistantMessage: Message = {
        id: Date.now().toString() + '-ai',
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, assistantMessage])

      // Atualizar lista de conversas se for nova
      if (!currentConversation && data.conversationId) {
        await fetchConversations()
        await fetchConversation(data.conversationId)
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleNewChat() {
    setCurrentConversation(null)
    setMessages([])
    setInput('')
    inputRef.current?.focus()
  }

  async function handleDeleteConversation(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta conversa?')) return

    try {
      const response = await fetch(`/api/chat?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== id))
        if (currentConversation?.id === id) {
          handleNewChat()
        }
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error)
    }
  }

  async function handleUpdateTitle(id: string) {
    if (!newTitle.trim()) return

    try {
      const response = await fetch(`/api/chat/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      })

      if (response.ok) {
        setConversations(prev =>
          prev.map(c => c.id === id ? { ...c, title: newTitle } : c)
        )
        if (currentConversation?.id === id) {
          setCurrentConversation(prev => prev ? { ...prev, title: newTitle } : null)
        }
        setEditingTitle(null)
        setNewTitle('')
      }
    } catch (error) {
      console.error('Erro ao atualizar título:', error)
    }
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'question':
        return <MessageSquare className="h-3 w-3" />
      case 'doctrine':
        return <BookOpen className="h-3 w-3" />
      default:
        return null
    }
  }

  if (status === 'loading') {
    return (
      <div className="container py-12 flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r bg-muted/10 overflow-hidden`}>
        <div className="p-4 h-full flex flex-col">
          <Button onClick={handleNewChat} className="w-full mb-4">
            <Plus className="mr-2 h-4 w-4" />
            Nova Conversa
          </Button>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group relative rounded-lg transition-colors ${
                    currentConversation?.id === conv.id
                      ? 'bg-primary/10'
                      : 'hover:bg-muted'
                  }`}
                >
                  {editingTitle === conv.id ? (
                    <div className="p-3 flex items-center gap-2">
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleUpdateTitle(conv.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingTitle(null)
                          setNewTitle('')
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="p-3 cursor-pointer"
                      onClick={() => fetchConversation(conv.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {conv.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(conv.updatedAt), "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingTitle(conv.id)
                              setNewTitle(conv.title)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteConversation(conv.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <History className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">
              {currentConversation?.title || 'Nova Conversa'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Chat com IA baseada nos escritos dos autores
            </p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                <h3 className="text-lg font-semibold mb-2">
                  Como posso ajudar?
                </h3>
                <p className="text-muted-foreground">
                  Faça perguntas sobre doutrina, teologia, interpretação bíblica,
                  ou qualquer tema relacionado à fé cristã.
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`flex-1 max-w-2xl ${
                      msg.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="prose prose-sm max-w-none">
                          {msg.role === 'assistant' ? (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          ) : (
                            <p>{msg.content}</p>
                          )}
                        </div>

                        {/* Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">
                              Fontes utilizadas:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {msg.sources.map((source, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {getSourceIcon(source.type)}
                                  <span className="ml-1">
                                    {source.title} - {source.author}
                                  </span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(msg.createdAt), "HH:mm")}
                    </p>
                  </div>

                  {msg.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Card>
                  <CardContent className="p-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </CardContent>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Digite sua pergunta sobre doutrina, teologia ou interpretação bíblica..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={loading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || loading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}