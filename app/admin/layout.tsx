import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/admin')
  }

  // Verificar se é admin (isso também é feito pelo middleware, mas vamos garantir)
  // Idealmente, você buscaria o usuário do banco para verificar a role

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}