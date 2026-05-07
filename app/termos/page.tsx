import { Metadata } from 'next'
import {
  FileText,
  AlertCircle,
  Scale,
  Shield,
  UserCheck,
  BookOpen,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Termos de Uso | Vox Scriptura',
  description:
    'Leia os termos e condições de uso da plataforma Vox Scriptura - Voz da Escritura.',
}

const sections = [
  {
    id: 'aceitacao',
    icon: UserCheck,
    title: '1. Aceitação dos Termos',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Bem-vindo à{' '}
          <span className="font-semibold text-primary">
            Vox Scriptura
          </span>{' '}
          (“Voz da Escritura”). Estes Termos de Uso regem o acesso e uso da
          nossa plataforma, incluindo todos os conteúdos, funcionalidades e
          serviços oferecidos através do site.
        </p>

        <p className="text-muted-foreground leading-relaxed">
          Ao acessar ou utilizar qualquer parte da plataforma, você concorda em
          cumprir estes Termos de Uso. Caso não concorde integralmente com os
          termos apresentados, não utilize nossos serviços.
        </p>

        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-500" />

            <p className="text-sm leading-relaxed text-yellow-700 dark:text-yellow-300">
              Ao criar uma conta ou enviar conteúdo, você declara possuir
              capacidade legal para firmar este acordo e garante que todas as
              informações fornecidas são verdadeiras.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 'uso',
    icon: Shield,
    title: '2. Uso da Plataforma',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 font-semibold">2.1. Elegibilidade</h3>

          <p className="text-muted-foreground leading-relaxed">
            Você deve possuir pelo menos 13 anos para utilizar nossa plataforma.
            Usuários entre 13 e 18 anos devem utilizar o serviço sob supervisão
            ou autorização de seus responsáveis legais.
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 font-semibold">2.2. Conta de Usuário</h3>

          <p className="text-muted-foreground leading-relaxed">
            Algumas funcionalidades exigem autenticação. Você é responsável por:
          </p>

          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>• Manter suas credenciais seguras</li>
            <li>• Todas as atividades realizadas em sua conta</li>
            <li>• Informar acessos não autorizados imediatamente</li>
            <li>• Manter dados corretos e atualizados</li>
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 font-semibold">2.3. Conduta Proibida</h3>

          <p className="mb-3 text-muted-foreground leading-relaxed">
            Você concorda em não:
          </p>

          <ul className="space-y-2 text-muted-foreground">
            <li>• Utilizar a plataforma para fins ilegais</li>
            <li>• Violar propriedade intelectual</li>
            <li>• Enviar spam ou conteúdo malicioso</li>
            <li>• Interferir no funcionamento da plataforma</li>
            <li>• Coletar dados sem autorização</li>
            <li>• Disseminar conteúdos fraudulentos ou enganosos</li>
          </ul>
        </div>
      </div>
    ),
  },

  {
    id: 'conteudo',
    icon: BookOpen,
    title: '3. Conteúdo da Plataforma',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 font-semibold">3.1. Natureza do Conteúdo</h3>

          <p className="text-muted-foreground leading-relaxed">
            O conteúdo disponível na Vox Scriptura possui finalidade
            educacional, espiritual e teológica, visando promover crescimento
            bíblico e reflexão cristã.
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 font-semibold">3.2. Isenção Teológica</h3>

          <p className="text-muted-foreground leading-relaxed">
            Nosso conteúdo não substitui aconselhamento pastoral, discipulado ou
            autoridade da igreja local.
          </p>

          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>• Examine as Escrituras pessoalmente</li>
            <li>• Consulte líderes espirituais</li>
            <li>• Utilize o conteúdo como recurso complementar</li>
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 font-semibold">3.3. Atualizações</h3>

          <p className="text-muted-foreground leading-relaxed">
            Podemos corrigir, atualizar ou remover conteúdos a qualquer momento
            sem aviso prévio.
          </p>
        </div>
      </div>
    ),
  },

  {
    id: 'propriedade',
    icon: Scale,
    title: '4. Propriedade Intelectual',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 font-semibold">4.1. Direitos Autorais</h3>

          <p className="text-muted-foreground leading-relaxed">
            Todo conteúdo original da plataforma está protegido por direitos
            autorais e demais legislações aplicáveis.
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 font-semibold">4.2. Uso Permitido</h3>

          <ul className="space-y-2 text-muted-foreground">
            <li>• Compartilhar links da plataforma</li>
            <li>• Citar trechos com atribuição adequada</li>
            <li>• Uso pessoal ou em pequenos grupos</li>
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 font-semibold">4.3. Uso Proibido</h3>

          <ul className="space-y-2 text-muted-foreground">
            <li>• Republicar conteúdo integralmente</li>
            <li>• Comercializar materiais da plataforma</li>
            <li>• Criar obras derivadas sem autorização</li>
          </ul>
        </div>

        <div className="rounded-xl bg-primary/10 p-4">
          <p className="text-sm text-primary">
            <span className="font-semibold">
              Solicitações de uso:
            </span>{' '}
            contato@voxscriptura.com
          </p>
        </div>
      </div>
    ),
  },

  {
    id: 'responsabilidade',
    icon: AlertCircle,
    title: '5. Limitação de Responsabilidade',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 font-semibold">5.1. Isenção de Garantias</h3>

          <p className="text-muted-foreground leading-relaxed">
            A plataforma é fornecida “como está”, sem garantias implícitas ou
            explícitas de disponibilidade contínua.
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 font-semibold">5.2. Limitação de Danos</h3>

          <p className="text-muted-foreground leading-relaxed">
            Não nos responsabilizamos por danos indiretos decorrentes do uso da
            plataforma.
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 font-semibold">5.3. Links Externos</h3>

          <p className="text-muted-foreground leading-relaxed">
            Não controlamos conteúdos de terceiros acessados através de links
            externos.
          </p>
        </div>
      </div>
    ),
  },

  {
    id: 'modificacoes',
    icon: Shield,
    title: '6. Modificações dos Termos',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Reservamo-nos o direito de alterar estes Termos a qualquer momento.
          Alterações entram em vigor imediatamente após publicação.
        </p>

        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold">
              Notificação de mudanças:
            </span>{' '}
            alterações relevantes poderão ser comunicadas via email ou aviso na
            plataforma.
          </p>
        </div>
      </div>
    ),
  },
]

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-10 md:px-8 lg:px-12">
        {/* Header */}
        <section className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-2">
            <FileText className="h-4 w-4 text-primary" />

            <span className="text-sm font-medium text-primary">
              Documento Legal
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-6xl">
            Termos de Uso
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Ao utilizar a plataforma Vox Scriptura, você concorda com os termos,
            condições e políticas descritos abaixo.
          </p>

          <p className="mt-3 text-sm text-muted-foreground">
            Última atualização: 19 de Março de 2026
          </p>
        </section>

        {/* Navegação */}
        <section className="mb-10">
          <Card className="border-border/60 bg-muted/40 backdrop-blur">
            <CardContent className="flex flex-wrap items-center justify-center gap-3 py-5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-full bg-background px-4 py-2 text-sm font-medium text-primary transition hover:scale-[1.02] hover:bg-primary hover:text-primary-foreground"
                >
                  {section.title}
                </a>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Grid */}
        <section className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon

            return (
              <Card
                key={section.id}
                id={section.id}
                className="group flex h-full flex-col border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-2 transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>

                    <CardTitle className="text-lg leading-snug">
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

          {/* Rescisão */}
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>7. Rescisão</CardTitle>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="text-muted-foreground leading-relaxed">
                Podemos suspender ou encerrar contas em caso de violação destes
                Termos ou comportamento inadequado.
              </p>
            </CardContent>
          </Card>

          {/* Lei */}
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>8. Lei Aplicável</CardTitle>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="text-muted-foreground leading-relaxed">
                Estes Termos são regidos pelas leis da República de Moçambique.
              </p>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>9. Contato</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-3">
              <p className="text-muted-foreground">
                Para dúvidas ou suporte:
              </p>

              <div className="space-y-2">
                <p className="font-medium text-primary">
                  nordinomaviedeveloper@gmail.com
                </p>

                <p className="font-medium text-primary">
                  +258 87 569 4141
                </p>
              </div>

              <Separator />

              <p className="text-sm text-muted-foreground">
                Desenvolvido por Nordino Mavie Dev — 2026
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}