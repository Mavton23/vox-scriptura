import { cn } from '@/lib/utils'

/**
 * Símbolo Vox Scriptura: um livro aberto em forma de "V" (de Vox)
 * do qual sobe a luz — "Lâmpada para os meus pés é a tua palavra" (Sl 119:105).
 * Cores herdam dos tokens: páginas = currentColor, luz = var(--gold).
 */
export function LogoMark({
  className,
  pageColor = 'currentColor',
  lightColor = 'var(--gold)',
  title,
}: {
  className?: string
  pageColor?: string
  lightColor?: string
  title?: string
}) {
  return (
    <svg
      viewBox="0 10 64 52"
      className={cn('h-8 w-auto', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      {/* O corte entre as folhas é uma máscara: funciona sobre qualquer fundo. */}
      <mask id="vx-leaf-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
        <rect width="64" height="64" fill="#fff" />
        <path
          d="M32 51.2 L8.6 23.5 M32 51.2 L55.4 23.5"
          stroke="#000"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </mask>
      <path
        fill={pageColor}
        mask="url(#vx-leaf-cut)"
        d="M32 58 L3 25.5 Q6.5 20.5 12 19.5 L32 44 Z M32 58 L61 25.5 Q57.5 20.5 52 19.5 L32 44 Z"
      />
      <path
        d="M32 35 L32 17 M26.28 35.19 L20.56 26.39 M37.72 35.19 L43.44 26.39"
        stroke={lightColor}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Logo({
  className,
  showTagline = true,
  size = 'md',
  tone = 'default',
}: {
  className?: string
  showTagline?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** "inverse" para fundos escuros de marca (lápis profundo) */
  tone?: 'default' | 'inverse'
}) {
  const inverse = tone === 'inverse'
  const sizes = {
    sm: { mark: 'h-6', word: 'text-lg', tag: 'text-[0.7rem]' },
    md: { mark: 'h-8', word: 'text-[1.4rem]', tag: 'text-[0.78rem]' },
    lg: { mark: 'h-12', word: 'text-3xl', tag: 'text-sm' },
  }[size]

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark
        className={cn(sizes.mark, inverse ? 'text-white' : 'text-lapis')}
        lightColor={inverse ? '#D9B45A' : 'var(--gold)'}
      />
      <span className="flex flex-col leading-none">
        <span className={cn('font-serif font-medium tracking-[0.004em]', inverse ? 'text-white' : 'text-foreground', sizes.word)}>
          Vox Scriptura
        </span>
        {showTagline && (
          <span className={cn('mt-0.5 font-serif italic tracking-[0.01em]', inverse ? 'text-[#D9B45A]' : 'text-gold-ink', sizes.tag)}>
            Voz da Escritura
          </span>
        )}
      </span>
    </span>
  )
}

/** Fio dourado com o ponto de luz ao centro — separador de seções. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 text-gold', className)} aria-hidden>
      <span className="h-px flex-1 bg-current opacity-40" />
      <svg viewBox="0 0 24 12" className="h-3 w-6">
        <path
          d="M12 11 L12 1 M7.5 11 L5 5 M16.5 11 L19 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="h-px flex-1 bg-current opacity-40" />
    </div>
  )
}
