'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Aqui você implementaria a lógica real de recuperação de senha
      // Por enquanto, apenas simulamos sucesso
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch (error) {
      setError('Erro ao enviar email de recuperação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md py-12">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/login">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para login
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">
            Recuperar Senha
          </CardTitle>
          <CardDescription>
            Digite seu email para receber instruções de recuperação
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Email enviado! Verifique sua caixa de entrada para instruções de recuperação de senha.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar instruções'
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Voltar para login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}