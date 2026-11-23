import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { Logo } from '@/components/brand/logo'

const columns = [
  {
    title: 'Estudar',
    links: [
      { name: 'Perguntas e respostas', href: '/perguntas' },
      { name: 'Ensino de doutrina', href: '/doutrinas' },
      { name: 'Frases diárias', href: '/frases-diarias' },
      { name: 'Autores', href: '/autores' },
    ],
  },
  {
    title: 'Sobre',
    links: [
      { name: 'Quem somos', href: '/sobre' },
      { name: 'Contato', href: '/contato' },
      { name: 'Privacidade', href: '/privacidade' },
      { name: 'Termos de uso', href: '/termos' },
    ],
  },
]

const social = [
  { name: 'Facebook', href: 'https://facebook.com/profile.php?id=61565792531619', icon: FaFacebookF },
  { name: 'Instagram', href: 'https://www.instagram.com/nordinomaviedev/', icon: FaInstagram },
  { name: 'WhatsApp', href: 'https://wa.me/258875694141', icon: FaWhatsapp },
]

export default function Footer() {
  return (
    <footer className="mt-24 bg-lapis-deep text-[#C9D0E6] dark:bg-[#0b1128]">
      <div className="container py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm space-y-5">
            <Logo tone="inverse" />
            <p className="text-[0.95rem] leading-relaxed">
              Ensino bíblico a partir de autores fiéis à sã doutrina, para ler, guardar e partilhar.
            </p>
            <div className="flex gap-2">
              {social.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#D9B45A] hover:text-[#D9B45A]"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 font-serif text-lg text-white">{col.title}</h2>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[0.95rem] transition-colors hover:text-white">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-[#9AA3C0] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vox Scriptura. Todos os direitos reservados.</p>
          <p className="font-serif italic text-[#D9B45A]">
            Crescei na graça e no conhecimento. <span className="not-italic text-[#9AA3C0]">2 Pedro 3:18</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
