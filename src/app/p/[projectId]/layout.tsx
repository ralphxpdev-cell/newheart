import { getProject } from '@/actions/projects'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, LayoutDashboard, FileText, CheckSquare, ListTodo, Calendar, TrendingUp } from 'lucide-react'

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
    { href: `/p/${params.projectId}/logs`, label: '현장일지', icon: FileText },
    { href: `/p/${params.projectId}/tasks`, label: '작업내용', icon: CheckSquare },
    { href: `/p/${params.projectId}/todos`, label: '관리업무', icon: ListTodo },
    { href: `/p/${params.projectId}/calendar`, label: '캘린더', icon: Calendar },
    { href: `/p/${params.projectId}/progress`, label: '진행률', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-sm text-muted-foreground">
                {project.status === 'active' ? '진행중' :
                 project.status === 'planned' ? '계획' :
                 project.status === 'paused' ? '중단' : '완료'}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex gap-2 overflow-x-auto pb-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="whitespace-nowrap">
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  )
}
