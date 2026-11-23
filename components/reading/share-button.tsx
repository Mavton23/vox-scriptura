'use client'

import { Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'

export function ShareButton({ title, text }: { title: string; text?: string }) {
  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
        return
      }
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado')
    } catch {
      /* partilha cancelada pelo utilizador */
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={share} aria-label="Partilhar" title="Partilhar">
      <Share2 className="h-4 w-4" />
    </Button>
  )
}
