import { getTasks } from '@/actions/tasks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckSquare } from 'lucide-react'
import TaskForm from '@/components/tasks/task-form'

export default async function TasksPage({ params }: { params: { projectId: string } }) {
  const tasks = await getTasks(params.projectId)

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const doingTasks = tasks.filter(t => t.status === 'doing')
  const doneTasks = tasks.filter(t => t.status === 'done')

  return (
    <div className="space-y-6">
      {/* Quick Add */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">빠른 추가</h3>
        <TaskForm projectId={params.projectId} />
      </Card>

      {/* Kanban Board */}
      <div>
        <h3 className="text-lg font-semibold mb-4">작업 현황</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {/* TODO Column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-gray-500"></div>
              <h4 className="font-semibold">대기 ({todoTasks.length})</h4>
            </div>
            <div className="space-y-2">
              {todoTasks.length === 0 ? (
                <Card className="p-6 text-center text-sm text-muted-foreground">
                  대기 중인 작업이 없습니다
                </Card>
              ) : (
                todoTasks.map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-semibold text-sm">{task.title}</h5>
                        <Badge variant="outline" className="text-xs">
                          {task.contract_type === 'contract' ? '계약' : '추가'}
                        </Badge>
                      </div>
                      {task.team && (
                        <p className="text-xs text-muted-foreground">{task.team}</p>
                      )}
                      {task.due_date && (
                        <p className="text-xs text-muted-foreground">
                          마감: {new Date(task.due_date).toLocaleDateString('ko-KR')}
                        </p>
                      )}
                      {task.spaces && task.spaces.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {task.spaces.join(', ')}
                        </p>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* DOING Column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <h4 className="font-semibold">진행중 ({doingTasks.length})</h4>
            </div>
            <div className="space-y-2">
              {doingTasks.length === 0 ? (
                <Card className="p-6 text-center text-sm text-muted-foreground">
                  진행 중인 작업이 없습니다
                </Card>
              ) : (
                doingTasks.map((task) => (
                  <Card key={task.id} className="p-4 border-l-4 border-l-blue-500">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-semibold text-sm">{task.title}</h5>
                        <Badge variant="outline" className="text-xs">
                          {task.contract_type === 'contract' ? '계약' : '추가'}
                        </Badge>
                      </div>
                      {task.team && (
                        <p className="text-xs text-muted-foreground">{task.team}</p>
                      )}
                      {task.due_date && (
                        <p className="text-xs text-muted-foreground">
                          마감: {new Date(task.due_date).toLocaleDateString('ko-KR')}
                        </p>
                      )}
                      {task.spaces && task.spaces.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {task.spaces.join(', ')}
                        </p>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* DONE Column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <h4 className="font-semibold">완료 ({doneTasks.length})</h4>
            </div>
            <div className="space-y-2">
              {doneTasks.length === 0 ? (
                <Card className="p-6 text-center text-sm text-muted-foreground">
                  완료된 작업이 없습니다
                </Card>
              ) : (
                doneTasks.map((task) => (
                  <Card key={task.id} className="p-4 opacity-75">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-semibold text-sm line-through">{task.title}</h5>
                        <Badge variant="outline" className="text-xs">
                          {task.contract_type === 'contract' ? '계약' : '추가'}
                        </Badge>
                      </div>
                      {task.team && (
                        <p className="text-xs text-muted-foreground">{task.team}</p>
                      )}
                    </div>
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
