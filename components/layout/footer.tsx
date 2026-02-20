import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50 w-full">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">Vox Scriptura</h3>
            <p className="text-sm text-muted-foreground">
              Voz da Escritura - Uma plataforma dedicada ao ensino da sã doutrina,
              baseada nos escritos de autores confiáveis e comprometidos com a verdade bíblica.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/perguntas" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Perguntas e Respostas
                </Link>
              </li>
              <li>
                <Link href="/doutrinas" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Ensino de Doutrina
                </Link>
              </li>
              <li>
                <Link href="/frases-diarias" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Frases Diárias
                </Link>
              </li>
              <li>
                <Link href="/autores" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Autores
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Redes Sociais</h3>
            <div className="flex space-x-4">
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors bg-background rounded-full p-2 hover:bg-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="h-4 w-4" />
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors bg-background rounded-full p-2 hover:bg-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="h-4 w-4" />
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors bg-background rounded-full p-2 hover:bg-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Newsletter ou contato direto */}
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">
                Receba atualizações por email
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Seu email" 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-3">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright com separador mais suave */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vox Scriptura. Todos os direitos reservados.
          </p>
          <p className="text-center text-xs text-muted-foreground/60 mt-2">
            Voz da Escritura - Crescendo na graça e no conhecimento
          </p>
        </div>
      </div>
    </footer>
  )
}