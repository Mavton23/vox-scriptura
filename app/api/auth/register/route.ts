import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Criar usuário admin (usar apenas para setup)
export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário admin
    const user = await prisma.user.create({
      data: {
        email,
        name: name || 'Admin',
        password: hashedPassword,
        role: 'admin' // Forçar role admin
      }
    })

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: { email: user.email, name: user.name }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}