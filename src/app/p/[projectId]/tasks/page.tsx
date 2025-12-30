import { getTasks } from '@/actions/tasks'
import { getTaskPhotos } from '@/actions/task-photos'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckSquare, Circle, Clock, CheckCircle2, Users, Calendar, MapPin, PlusCircle, Layers } from 'lucide-react'
import TaskForm from '@/components/tasks/task-form'
import TaskPhotoGallery from '@/components/tasks/task-photo-gallery'

export default async function TasksPage({ params }: { params: { projectId: string } }) {
  const tasks = await getTasks(params.projectId)

  // Fetch photos for each task
  const tasksWithPhotos = await Promise.all(
    tasks.map(async (task) => {
      const photosResult = await getTaskPhotos(task.id)
      return { ...task, photos: photosResult.data || [] }
    })
  )

  const todoTasks = tasksWithPhotos.filter(t => t.status === 'todo')
  const doingTasks = tasksWithPhotos.filter(t => t.status === 'doing')
  const doneTasks = tasksWithPhotos.filter(t => t.status === 'done')

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">작업 관리</h2>
        <p className="text-muted-foreground mt-2">프로젝트 작업을 단계별로 추적하고 관리하세요</p>
      </div>

      {/* Quick Add Section */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-violet-50 to-purple-100">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-violet-500/20 rounded-xl">
              <PlusCircle className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold">새 작업 추가</h3>
          </div>
          <TaskForm projectId={params.projectId} />
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">작업 현황</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* TODO Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-md border-none">
              <div className="p-2 bg-slate-500/20 rounded-lg">
                <Circle className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg">대기</h4>
                <p className="text-sm text-muted-foreground">{todoTasks.length}개 작업</p>
              </div>
            </div>

            <div className="space-y-3">
              {todoTasks.length === 0 ? (
                <Card className="border-none shadow-sm bg-muted/30">
                  <CardContent className="p-8 text-center">
                    <Circle className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">대기 중인 작업이 없습니다</p>
                  </CardContent>
                </Card>
              ) : (
                todoTasks.map((task) => (
                  <Card key={task.id} className="border-none shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-sm leading-tight flex-1">{task.title}</h5>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {task.contract_type === 'contract' ? '계약' : '추가'}
                          </Badge>
                        </div>

                        {task.team && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>{task.team}</span>
                          </div>
                        )}

                        {task.due_date && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>마감: {new Date(task.due_date).toLocaleDateString('ko-KR')}</span>
                          </div>
                        )}

                        {task.spaces && task.spaces.length > 0 && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="flex flex-wrap gap-1">
                              {task.spaces.map((space, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {space}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <TaskPhotoGallery
                        projectId={params.projectId}
                        taskId={task.id}
                        photos={task.photos}
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* DOING Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border-none">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg">진행중</h4>
                <p className="text-sm text-muted-foreground">{doingTasks.length}개 작업</p>
              </div>
            </div>

            <div className="space-y-3">
              {doingTasks.length === 0 ? (
                <Card className="border-none shadow-sm bg-muted/30">
                  <CardContent className="p-8 text-center">
                    <Clock className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">진행 중인 작업이 없습니다</p>
                  </CardContent>
                </Card>
              ) : (
                doingTasks.map((task) => (
                  <Card key={task.id} className="border-none shadow-md hover:shadow-lg transition-all hover:scale-[1.02] border-l-4 border-l-blue-500">
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-sm leading-tight flex-1">{task.title}</h5>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {task.contract_type === 'contract' ? '계약' : '추가'}
                          </Badge>
                        </div>

                        {task.team && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>{task.team}</span>
                          </div>
                        )}

                        {task.due_date && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>마감: {new Date(task.due_date).toLocaleDateString('ko-KR')}</span>
                          </div>
                        )}

                        {task.spaces && task.spaces.length > 0 && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="flex flex-wrap gap-1">
                              {task.spaces.map((space, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {space}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <TaskPhotoGallery
                        projectId={params.projectId}
                        taskId={task.id}
                        photos={task.photos}
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* DONE Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-md border-none">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg">완료</h4>
                <p className="text-sm text-muted-foreground">{doneTasks.length}개 작업</p>
              </div>
            </div>

            <div className="space-y-3">
              {doneTasks.length === 0 ? (
                <Card className="border-none shadow-sm bg-muted/30">
                  <CardContent className="p-8 text-center">
                    <CheckCircle2 className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">완료된 작업이 없습니다</p>
                  </CardContent>
                </Card>
              ) : (
                doneTasks.map((task) => (
                  <Card key={task.id} className="border-none shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-muted/30">
                    <CardContent className="p-5">
                      <div className="space-y-3 opacity-80">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-sm leading-tight flex-1 line-through decoration-2">
                            {task.title}
                          </h5>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {task.contract_type === 'contract' ? '계약' : '추가'}
                          </Badge>
                        </div>

                        {task.team && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>{task.team}</span>
                          </div>
                        )}
                      </div>

                      <TaskPhotoGallery
                        projectId={params.projectId}
                        taskId={task.id}
                        photos={task.photos}
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
