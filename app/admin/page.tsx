import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { 
  MessageCircle, 
  BookOpen, 
  Calendar, 
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

async function getStats() {
  const [
    totalQuestions,
    totalDoctrines,
    totalVerses,
    totalAuthors,
    totalUsers,
    recentQuestions,
    recentDoctrines
  ] = await Promise.all([
    prisma.questionAnswer.count(),
    prisma.doctrine.count(),
    prisma.dailyVerse.count(),
    prisma.author.count(),
    prisma.user.count(),
    prisma.questionAnswer.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } }
    }),
    prisma.doctrine.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } }
    })
  ])

  return {
    totalQuestions,
    totalDoctrines,
    totalVerses,
    totalAuthors,
    totalUsers,
    recentQuestions,
    recentDoctrines
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do conteúdo da plataforma
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perguntas</CardTitle>
            <MessageCircle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              Total de perguntas e respostas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doutrinas</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDoctrines}</div>
            <p className="text-xs text-muted-foreground">
              Total de ensinos doutrinários
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frases Diárias</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVerses}</div>
            <p className="text-xs text-muted-foreground">
              Total de versículos comentados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autores</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAuthors}</div>
            <p className="text-xs text-muted-foreground">
              Autores cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuários registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Recentes</CardTitle>
            <CardDescription>
              Últimas perguntas adicionadas à plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentQuestions.map((q) => (
                <div key={q.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium line-clamp-1">
                      {q.question}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Por {q.author.name}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Doctrines */}
        <Card>
          <CardHeader>
            <CardTitle>Doutrinas Recentes</CardTitle>
            <CardDescription>
              Últimas doutrinas adicionadas à plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentDoctrines.map((d) => (
                <div key={d.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium line-clamp-1">
                      {d.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Por {d.author.name}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Atalhos para tarefas comuns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <a
              href="/admin/questions/new"
              className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <MessageCircle className="h-8 w-8 text-secondary" />
              <span className="text-sm font-medium">Nova Pergunta</span>
            </a>
            <a
              href="/admin/doctrines/new"
              className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <BookOpen className="h-8 w-8 text-secondary" />
              <span className="text-sm font-medium">Nova Doutrina</span>
            </a>
            <a
              href="/admin/daily-verses/new"
              className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Calendar className="h-8 w-8 text-secondary" />
              <span className="text-sm font-medium">Nova Frase</span>
            </a>
            <a
              href="/admin/authors/new"
              className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Users className="h-8 w-8 text-secondary" />
              <span className="text-sm font-medium">Novo Autor</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}