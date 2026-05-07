import { Metadata } from 'next'

import {
  Shield,
  Lock,
  Database,
  Cookie,
  UserCheck,
  Mail,
  Eye,
  Sparkles,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Vox Scriptura',
  description:
    'Política de privacidade e proteção de dados da Vox Scriptura.',
}

const sections = [
  {
    id: 'coleta',
    icon: Database,
    title: '1. Coleta de Informações',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed text-muted-foreground">
          Coletamos apenas as informações necessárias para fornecer uma
          experiência segura, personalizada e funcional dentro da plataforma.
        </p>

        <ul className="space-y-2 text-muted-foreground">
          <li>• Nome e endereço de email</li>
          <li>• Preferências de conteúdo</li>
          <li>• Histórico de favoritos e interações</li>
          <li>• Dados básicos de navegação e autenticação</li>
        </ul>
      </div>
    ),
  },

  {
    id: 'uso',
    icon: Eye,
    title: '2. Uso das Informações',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed text-muted-foreground">
          Utilizamos seus dados exclusivamente para melhorar sua experiência na
          plataforma e oferecer funcionalidades relevantes.
        </p>

        <ul className="space-y-2 text-muted-foreground">
          <li>• Personalizar conteúdos e recomendações</li>
          <li>• Gerenciar autenticação e favoritos</li>
          <li>• Enviar notificações importantes</li>
          <li>• Melhorar desempenho e segurança</li>
        </ul>
      </div>
    ),
  },

  {
    id: 'seguranca',
    icon: Lock,
    title: '3. Proteção de Dados',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed text-muted-foreground">
          Aplicamos medidas técnicas e organizacionais para proteger seus dados
          contra acessos não autorizados, alterações indevidas ou perda de
          informações.
        </p>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm leading-relaxed text-primary">
            Utilizamos boas práticas modernas de autenticação, criptografia e
            proteção de infraestrutura.
          </p>
        </div>
      </div>
    ),
  },

  {
    id: 'compartilhamento',
    icon: Shield,
    title: '4. Compartilhamento de Dados',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed text-muted-foreground">
          Não comercializamos nem compartilhamos seus dados pessoais para fins
          de marketing de terceiros.
        </p>

        <p className="leading-relaxed text-muted-foreground">
          Informações poderão ser compartilhadas apenas quando exigidas por lei
          ou necessárias para cumprimento de obrigações legais.
        </p>
      </div>
    ),
  },

  {
    id: 'direitos',
    icon: UserCheck,
    title: '5. Seus Direitos',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed text-muted-foreground">
          Você possui controle sobre seus dados pessoais e pode solicitar ações
          relacionadas às suas informações armazenadas.
        </p>

        <ul className="space-y-2 text-muted-foreground">
          <li>• Acessar seus dados pessoais</li>
          <li>• Corrigir informações incorretas</li>
          <li>• Solicitar exclusão de dados</li>
          <li>• Revogar permissões previamente concedidas</li>
        </ul>
      </div>
    ),
  },

  {
    id: 'cookies',
    icon: Cookie,
    title: '6. Cookies',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed text-muted-foreground">
          Utilizamos cookies para melhorar desempenho, lembrar preferências e
          otimizar sua experiência de navegação.
        </p>

        <p className="leading-relaxed text-muted-foreground">
          Você pode desativar cookies nas configurações do navegador, embora
          algumas funcionalidades possam ser afetadas.
        </p>
      </div>
    ),
  },

  {
    id: 'contato',
    icon: Mail,
    title: '7. Contato',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed text-muted-foreground">
          Para dúvidas relacionadas à privacidade ou proteção de dados, entre em
          contato conosco:
        </p>

        <div className="rounded-xl bg-muted p-4">
          <p className="font-medium text-primary">
            privacidade@voxscriptura.com
          </p>
        </div>
      </div>
    ),
  },
]

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-10 md:px-8 lg:px-12">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/10 via-background to-secondary/10 px-6 py-20 md:px-12">
          <div className="absolute inset-0 bg-grid-white/[0.02]" />

          <div className="relative mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 rounded-full px-4 py-1"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Proteção & Transparência
            </Badge>

            <h1 className="text-5xl font-bold tracking-tight text-primary md:text-7xl">
              Política de Privacidade
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Saiba como coletamos, utilizamos e protegemos suas informações
              dentro da plataforma Vox Scriptura.
            </p>

            <p className="mt-6 text-sm text-muted-foreground">
              Última atualização:{' '}
              {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rounded-2xl border bg-muted/40 p-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold">
                Seu Dados São Tratados com Responsabilidade
              </h2>

              <p className="mt-4 leading-relaxed text-muted-foreground">
                Nosso compromisso é manter transparência, segurança e respeito à
                privacidade de todos os usuários da plataforma.
              </p>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="pb-20">
          <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon

              return (
                <Card
                  key={section.id}
                  id={section.id}
                  className="group flex h-full flex-col border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardHeader>
                    <div className="mb-4 flex items-center gap-4">
                      <div className="rounded-2xl bg-primary/10 p-3 transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>

                      <CardTitle className="leading-snug">
                        {section.title}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    {section.content}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* FOOTER */}
        <section className="pb-10">
          <div className="overflow-hidden rounded-3xl border bg-linear-to-r from-primary/10 via-background to-hightlight p-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              Transparência e Segurança
            </h2>

            <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-muted-foreground">
              A Vox Scriptura está comprometida em proteger suas informações e
              garantir uma experiência segura, ética e confiável.
            </p>

            <Separator className="mx-auto my-8 max-w-md" />

            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Vox Scriptura — Todos os direitos
              reservados.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}