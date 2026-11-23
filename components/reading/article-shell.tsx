import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Ornament } from '@/components/brand/logo'
import { cn } from '@/lib/utils'

type Author = { name: string; slug: string }

export function ArticleShell({
  back,
  kind,
  kindClassName,
  title,
  titleClassName,
  lead,
  author,
  date,
  actions,
  children,
  tags,
  tagBase,
  related,
}: {
  back: { href: string; label: string }
  kind: string
  kindClassName?: string
  title: React.ReactNode
  titleClassName?: string
  lead?: React.ReactNode
  author?: Author
  date?: string
  actions?: React.ReactNode
  children: React.ReactNode
  tags?: string[]
  tagBase?: string
  related?: { href: string; label: string }[]
}) {
  return (
    <article className="container max-w-3xl py-10 md:py-14">
      <Link
        href={back.href}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {back.label}
      </Link>

      <header className="mt-10">
        <p className={cn('text-sm font-medium text-gold-ink', kindClassName)}>{kind}</p>
        <h1 className={cn('mt-3 text-[2.2rem] leading-[1.15] md:text-[2.9rem]', titleClassName)}>{title}</h1>
        {lead && <div className="mt-5 text-lg leading-relaxed text-muted-foreground">{lead}</div>}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y py-4">
          <p className="text-sm text-muted-foreground">
            {author && (
              <>
                Por{' '}
                <Link href={`/autores/${author.slug}`} className="font-medium text-foreground hover:text-primary">
                  {author.name}
                </Link>
              </>
            )}
            {author && date && <span className="mx-2 text-border">|</span>}
            {date && <time>{date}</time>}
          </p>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </header>

      <div className="mt-10">{children}</div>

      {(tags?.length || related?.length) && (
        <footer className="mt-16 space-y-8">
          <Ornament />
          {tags && tags.length > 0 && (
            <div>
              <h2 className="font-sans text-sm font-medium text-muted-foreground">Temas</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li key={tag}>
                    {tagBase ? (
                      <Link
                        href={`${tagBase}?tag=${encodeURIComponent(tag)}`}
                        className="inline-block rounded-full border px-3 py-1 text-sm transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {tag}
                      </Link>
                    ) : (
                      <span className="inline-block rounded-full border px-3 py-1 text-sm">{tag}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {related && related.length > 0 && (
            <div className="rounded-xl bg-secondary p-6">
              <h2 className="text-xl text-secondary-foreground">Continue a estudar</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {related.map((r) => (
                  <Button key={r.href} variant="outline" asChild className="bg-card">
                    <Link href={r.href}>{r.label}</Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </footer>
      )}
    </article>
  )
}

export function NotFoundState({
  title,
  description,
  href,
  action,
}: {
  title: string
  description?: string
  href: string
  action: string
}) {
  return (
    <div className="container flex max-w-lg flex-col items-center py-24 text-center">
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">
        {description ?? 'O endereço pode ter mudado ou o conteúdo foi removido.'}
      </p>
      <Button asChild className="mt-8">
        <Link href={href}>{action}</Link>
      </Button>
    </div>
  )
}
