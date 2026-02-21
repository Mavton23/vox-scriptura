'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Mail, Lock, User, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { FaGithub, FaChrome } from 'react-icons/fa'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const validatePassword = () => {
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres'
    }
    if (password !== confirmPassword) {
      return 'As senhas não conferem'
    }
    return null
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    
    const passwordError = validatePassword()
    if (passwordError) {
      setErrorMessage(passwordError)
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta')
      }

      setSuccessMessage('Conta criada com sucesso! Redirecionando...')

      // Fazer login automático após registro
      setTimeout(async () => {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
          callbackUrl: '/'
        })

        if (result?.error) {
          router.push('/login?registered=true')
        } else {
          router.push('/chat')
        }
      }, 1500)

    } catch (error: any) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    setLoading(true)
    signIn(provider, { callbackUrl: '/chat' })
  }

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Criar Conta
          </CardTitle>
          <CardDescription>
            Registre-se para acessar todos os recursos da plataforma
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Success Message */}
          {successMessage && (
            <Alert variant="default" className="border-green-500 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* OAuth Buttons */}
          {/* <div className="grid gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
            >
              <FaChrome className="mr-2 h-4 w-4" />
              Continuar com Google
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignIn('github')}
              disabled={loading}
            >
              <FaGithub className="mr-2 h-4 w-4" />
              Continuar com GitHub
            </Button>
          </div> */}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              {/* <Separator className="w-full" /> */}
            </div>
            {/* <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou registre-se com email
              </span>
            </div> */}
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Mínimo de 6 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Registrar'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Já tem uma conta?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Ao se registrar, você concorda com nossos{' '}
            <Link href="/termos" className="text-primary hover:underline">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}