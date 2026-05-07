import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, MapPin, Clock } from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contato | Vox Scriptura',
  description: 'Entre em contato conosco para dúvidas, sugestões ou parcerias.',
}

export default function ContatoPage() {
  return (
    <div className="container py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Entre em Contato</h1>
        <p className="text-md text-muted-foreground max-w-2xl mx-auto">
          Tem dúvidas, sugestões ou quer contribuir conosco? Adoraríamos ouvir você!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Informações de contato */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
              <CardDescription>
                Fale conosco através dos canais abaixo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:contato@voxscriptura.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    contato@voxscriptura.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Horário de Resposta</p>
                  <p className="text-sm text-muted-foreground">
                    Segunda a Sexta, 9h às 18h<br />
                    Respondemos em até 48h
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Localização</p>
                  <p className="text-sm text-muted-foreground">
                    Online - Servindo a igreja em todo o mundo lusófono
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulário de contato */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Envie uma Mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo que entraremos em contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}