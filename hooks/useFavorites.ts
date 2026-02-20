import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

interface UseFavoritesProps {
  type: 'question' | 'doctrine' | 'verse'
  id: string
}

export function useFavorites({ type, id }: UseFavoritesProps) {
  const { data: session, status } = useSession()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      checkFavorite()
    }
  }, [session, id])

  async function checkFavorite() {
    try {
      const response = await fetch(`/api/favorites/check?type=${type}&id=${id}`)
      const data = await response.json()
      setIsFavorite(data.isFavorite)
    } catch (error) {
      console.error('Erro ao verificar favorito:', error)
    }
  }

  async function toggleFavorite() {
    if (!session?.user) {
      toast.error('Você precisa estar logado para favoritar conteúdo');
      return
    }

    setLoading(true)
    try {
      if (isFavorite) {
        // Remover dos favoritos
        const response = await fetch(`/api/favorites/${type}s?${type}Id=${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setIsFavorite(false)
          toast.success('Removido dos favoritos')
        }
      } else {
        // Adicionar aos favoritos
        const response = await fetch(`/api/favorites/${type}s`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [`${type}Id`]: id })
        })

        if (response.ok) {
          setIsFavorite(true)
          toast.success('Adicionado aos favoritos')
        }
      }
    } catch (error) {
      console.error('Erro ao toggle favorito:', error)
      toast.error('Não foi possível completar a operação')
    } finally {
      setLoading(false)
    }
  }

  return {
    isFavorite,
    loading,
    toggleFavorite,
    isAuthenticated: !!session?.user
  }
}