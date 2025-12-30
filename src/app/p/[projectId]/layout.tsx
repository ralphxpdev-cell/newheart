import { getProject } from '@/actions/projects'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowLeft, LayoutDashboard, FileText, CheckSquare, ListTodo, Calendar, TrendingUp, Users, Clock } from 'lucide-react'

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { projectId: string }
}) {
  const project = await getProject(params.projectId)

  if (!project) {
    notFound()
  }

  const navItems = [
    { href: `/p/${params.projectId}`, label: '대시보드', icon: LayoutDashboard },
    { href: `/p/${params.projectId}/workers`, label: '인력관리', icon: Users },
    { href: `/p/${params.projectId}/attendance`, label: '출퇴근', icon: Clock },
    { href: `/p/${params.projectId}/logs`, label: '현장일지', icon: FileText },
    { href: `/p/${params.projectId}/tasks`, label: '작업내용', icon: CheckSquare },
    { href: `/p/${params.projectId}/todos`, label: '관리업무', icon: ListTodo },
    { href: `/p/${params.projectId}/calendar`, label: '캘린더', icon: Calendar },
    { href: `/p/${params.projectId}/progress`, label: '진행률', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    project.status === 'active' ? 'default' :
                    project.status === 'planned' ? 'secondary' :
                    project.status === 'paused' ? 'outline' : 'secondary'
                  }
                  className="text-xs"
                >
                  {project.status === 'active' ? '진행중' :
                   project.status === 'planned' ? '계획' :
                   project.status === 'paused' ? '중단' : '완료'}
                </Badge>
                {project.client && (
                  <span className="text-sm text-muted-foreground">• {project.client}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Card className="border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <nav className="flex gap-1 p-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="whitespace-nowrap h-10 px-4 hover:bg-primary/10 transition-colors"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </Card>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  )
}
