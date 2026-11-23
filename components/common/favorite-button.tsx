'use client'

import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  type: 'question' | 'doctrine' | 'verse'
  id: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showText?: boolean
  className?: string
}

export function FavoriteButton({ 
  type, 
  id, 
  variant = 'outline',
  size = 'default',
  showText = false,
  className 
}: FavoriteButtonProps) {
  const { isFavorite, loading, toggleFavorite } = useFavorites({ type, id })

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleFavorite}
      disabled={loading}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
      title={isFavorite ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
      className={cn(isFavorite && 'text-gold-ink hover:text-gold-ink', className)}
    >
      <Bookmark 
        className={cn(
          "h-4 w-4",
          isFavorite && "fill-current"
        )} 
      />
      {showText && (isFavorite ? 'Guardado' : 'Guardar')}
    </Button>
  )
}