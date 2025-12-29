import { getTasks } from '@/actions/tasks'
import { getTodos } from '@/actions/todos'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

export default async function CalendarPage({ params }: { params: { projectId: string } }) {
  const [tasks, todos] = await Promise.all([
    getTasks(params.projectId),
    getTodos(params.projectId),
  ])

  // Filter items with due dates
  const tasksWithDates = tasks.filter(t => t.due_date).sort((a, b) =>
    new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
  )
  const todosWithDates = todos.filter(t => t.due_date).sort((a, b) =>
    new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
  )

  // Group by date
  const itemsByDate = new Map<string, { tasks: typeof tasks, todos: typeof todos }>()

  tasksWithDates.forEach(task => {
    const date = task.due_date!
    if (!itemsByDate.has(date)) {
      itemsByDate.set(date, { tasks: [], todos: [] })
    }
    itemsByDate.get(date)!.tasks.push(task)
  })

  todosWithDates.forEach(todo => {
    const date = todo.due_date!
    if (!itemsByDate.has(date)) {
      itemsByDate.set(date, { tasks: [], todos: [] })
    }
    itemsByDate.get(date)!.todos.push(todo)
  })

  const sortedDates = Array.from(itemsByDate.keys()).sort()
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">작업 캘린더</h2>
          <p className="text-sm text-muted-foreground mt-1">
            마감일 기준으로 정렬된 작업 및 업무
          </p>
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">예정된 작업이 없습니다.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const items = itemsByDate.get(date)!
            const isToday = date === today
            const isPast = date < today

            return (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className={`text-lg font-semibold ${isToday ? 'text-blue-500' : isPast ? 'text-muted-foreground' : ''}`}>
                    {new Date(date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </h3>
                  {isToday && <Badge>오늘</Badge>}
                  {isPast && !isToday && <Badge variant="outline">지난 날짜</Badge>}
                </div>

                <div className="space-y-3">
                  {/* Tasks */}
                  {items.tasks.map((task) => (
                    <Card key={task.id} className={`p-4 ${isPast && task.status !== 'done' ? 'border-red-500/50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">작업</Badge>
                            <h4 className="font-semibold text-sm">{task.title}</h4>
                            <Badge variant={
                              task.status === 'done' ? 'default' :
                              task.status === 'doing' ? 'secondary' : 'outline'
                            }>
                              {task.status === 'done' ? '완료' :
                               task.status === 'doing' ? '진행중' : '대기'}
                            </Badge>
                          </div>
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            {task.team && <span>{task.team}</span>}
                            {task.spaces && task.spaces.length > 0 && (
                              <span>{task.spaces.join(', ')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Todos */}
                  {items.todos.map((todo) => (
                    <Card key={todo.id} className={`p-4 ${isPast && todo.status !== 'done' ? 'border-red-500/50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">업무</Badge>
                            <h4 className="font-semibold text-sm">{todo.title}</h4>
                            <Badge variant={
                              todo.priority === 'high' ? 'destructive' :
                              todo.priority === 'mid' ? 'secondary' : 'outline'
                            }>
                              {todo.priority === 'high' ? '높음' :
                               todo.priority === 'mid' ? '중간' : '낮음'}
                            </Badge>
                            <Badge variant={
                              todo.status === 'done' ? 'default' :
                              todo.status === 'doing' ? 'secondary' : 'outline'
                            }>
                              {todo.status === 'done' ? '완료' :
                               todo.status === 'doing' ? '진행중' : '대기'}
                            </Badge>
                          </div>
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            {todo.assignee && <span>담당: {todo.assignee}</span>}
                            {todo.spaces && todo.spaces.length > 0 && (
                              <span>{todo.spaces.join(', ')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
