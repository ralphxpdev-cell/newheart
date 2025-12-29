import { getProjects } from '@/actions/projects'
import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogOut, Plus, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import CreateProjectDialog from '@/components/projects/create-project-dialog'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">프로젝트</h1>
            <p className="text-muted-foreground mt-1">관리 중인 현장 프로젝트</p>
          </div>
          <div className="flex gap-2">
            <CreateProjectDialog />
            <form action={signOut}>
              <Button variant="outline" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">프로젝트가 없습니다</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  새 프로젝트를 생성하여 시작하세요.
                </p>
              </div>
              <CreateProjectDialog />
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/p/${project.id}`}>
                <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <Badge variant={
                        project.status === 'active' ? 'default' :
                        project.status === 'planned' ? 'secondary' :
                        project.status === 'paused' ? 'outline' : 'secondary'
                      }>
                        {project.status === 'active' ? '진행중' :
                         project.status === 'planned' ? '계획' :
                         project.status === 'paused' ? '중단' : '완료'}
                      </Badge>
                    </div>
                    <CardDescription>
                      생성일: {new Date(project.created_at).toLocaleDateString('ko-KR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      프로젝트 대시보드로 이동하려면 클릭하세요
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
