import { useSession } from 'next-auth/react'

export function useAdmin() {
  const { data: session, status } = useSession()
  
  return {
    isAdmin: session?.user?.role === 'admin',
    isLoading: status === 'loading',
    session
  }
}