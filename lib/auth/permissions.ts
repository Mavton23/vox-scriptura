import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'

export type UserRole = 'user' | 'admin' | 'superadmin'

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role: UserRole
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    return user as SessionUser | null
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    return {
      error: 'Não autorizado. Faça login para continuar.',
      status: 401,
      user: null
    }
  }

  return { user, error: null, status: 200 }
}

export async function requireAdmin() {
  const result = await requireAuth()
  
  if (result.error) {
    return result
  }

  if (result.user?.role !== 'admin' && result.user?.role !== 'superadmin') {
    return {
      error: 'Acesso negado. Permissões de administrador necessárias.',
      status: 403,
      user: null
    }
  }

  return { user: result.user, error: null, status: 200 }
}

export async function requireSuperAdmin() {
  const result = await requireAuth()
  
  if (result.error) {
    return result
  }

  if (result.user?.role !== 'superadmin') {
    return {
      error: 'Acesso negado. Permissões de super administrador necessárias.',
      status: 403,
      user: null
    }
  }

  return { user: result.user, error: null, status: 200 }
}

export function checkResourceOwnership(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId
}

export async function requireResourceOwner(resourceUserId: string) {
  const result = await requireAuth()
  
  if (result.error) {
    return result
  }

  if (!checkResourceOwnership(result.user!.id, resourceUserId) && result.user?.role !== 'admin') {
    return {
      error: 'Acesso negado. Você não tem permissão para modificar este recurso.',
      status: 403,
      user: null
    }
  }

  return { user: result.user, error: null, status: 200 }
}

// Função de middleware para uso em APIs
export function withAuth(
  handler: (req: NextRequest, user: SessionUser) => Promise<Response>,
  options: {
    requireAdmin?: boolean
    requireSuperAdmin?: boolean
    checkOwnership?: (user: SessionUser, req: NextRequest) => boolean | Promise<boolean>
  } = {}
) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      const authResult = await requireAuth()

      if (authResult.error) {
        return NextResponse.json(
          { error: authResult.error },
          { status: authResult.status }
        )
      }

      const user = authResult.user!

      if (
        options.requireAdmin &&
        user.role !== 'admin' &&
        user.role !== 'superadmin'
      ) {
        return NextResponse.json(
          { error: 'Acesso negado. Permissões de administrador necessárias.' },
          { status: 403 }
        )
      }

      if (
        options.requireSuperAdmin &&
        user.role !== 'superadmin'
      ) {
        return NextResponse.json(
          { error: 'Acesso negado. Permissões de super administrador necessárias.' },
          { status: 403 }
        )
      }

      if (options.checkOwnership) {
        const hasOwnership = await options.checkOwnership(user, req)
        if (!hasOwnership && user.role !== 'admin') {
          return NextResponse.json(
            { error: 'Acesso negado. Você não tem permissão para modificar este recurso.' },
            { status: 403 }
          )
        }
      }

      return handler(req, user)
    } catch (error) {
      console.error('Erro no middleware de autenticação:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }
}

// Função para verificar permissões em componentes React
export function usePermissions(userRole?: UserRole) {
  return {
    isAdmin: userRole === 'admin' || userRole === 'superadmin',
    isSuperAdmin: userRole === 'superadmin',
    can: (permission: string) => {
      // Aqui você pode implementar um sistema de permissões mais granular
      const permissions: Record<UserRole, string[]> = {
        user: ['read:content', 'create:favorites'],
        admin: ['read:content', 'create:favorites', 'create:content', 'edit:content', 'delete:content', 'manage:users'],
        superadmin: ['read:content', 'create:favorites', 'create:content', 'edit:content', 'delete:content', 'manage:users', 'manage:admins', 'system:configure']
      }
      return permissions[userRole || 'user']?.includes(permission) || false
    }
  }
}