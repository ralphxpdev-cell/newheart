import { getDailyLogs } from '@/actions/logs'
import { getTasks } from '@/actions/tasks'
import { getTodos } from '@/actions/todos'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, CheckSquare, ListTodo, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function ProjectDashboard({ params }: { params: { projectId: string } }) {
  const [logs, tasks, todos] = await Promise.all([
    getDailyLogs(params.projectId),
    getTasks(params.projectId),
    getTodos(params.projectId),
  ])

  const recentLogs = logs.slice(0, 5)
  const followUpLogs = logs.filter(log => log.follow_up_needed)
  const tasksInProgress = tasks.filter(task => task.status === 'doing')
  const todosHighPriority = todos.filter(todo => todo.priority === 'high' && todo.status !== 'done')
  const todosToday = todos.filter(todo => {
    if (!todo.due_date) return false
    const today = new Date().toISOString().split('T')[0]
    return todo.due_date === today && todo.status !== 'done'
  })

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">현장일지</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground">
              총 {logs.length}건 작성됨
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">작업내용</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksInProgress.length}</div>
            <p className="text-xs text-muted-foreground">
              진행중 {tasksInProgress.length} / 총 {tasks.length}건
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">관리업무</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todosHighPriority.length}</div>
            <p className="text-xs text-muted-foreground">
              높은 우선순위 {todosHighPriority.length}건
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘 할 일</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todosToday.length}</div>
            <p className="text-xs text-muted-foreground">
              오늘 마감 {todosToday.length}건
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Logs */}
        <Card>
          <CardHeader>
            <CardTitle>최근 현장일지</CardTitle>
            <CardDescription>최근 5개의 현장일지</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">작성된 현장일지가 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <Link
                    key={log.id}
                    href={`/p/${params.projectId}/logs`}
                    className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{log.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.log_date).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <Badge variant={
                        log.work_status === 'normal' ? 'outline' :
                        log.work_status === 'delayed' ? 'secondary' : 'destructive'
                      }>
                        {log.work_status === 'normal' ? '정상' :
                         log.work_status === 'delayed' ? '지연' : '이슈'}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle>팔로우업 필요</CardTitle>
            <CardDescription>조치가 필요한 항목</CardDescription>
          </CardHeader>
          <CardContent>
            {followUpLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">팔로우업이 필요한 항목이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {followUpLogs.slice(0, 5).map((log) => (
                  <Link
                    key={log.id}
                    href={`/p/${params.projectId}/logs`}
                    className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{log.title}</p>
                        {log.follow_up_summary && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {log.follow_up_summary}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Todos */}
      {todosToday.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>오늘 마감되는 업무</CardTitle>
            <CardDescription>오늘까지 완료해야 할 항목</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todosToday.map((todo) => (
                <Link
                  key={todo.id}
                  href={`/p/${params.projectId}/todos`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      todo.priority === 'high' ? 'destructive' :
                      todo.priority === 'mid' ? 'secondary' : 'outline'
                    }>
                      {todo.priority === 'high' ? '높음' :
                       todo.priority === 'mid' ? '중간' : '낮음'}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{todo.title}</p>
                      {todo.assignee && (
                        <p className="text-xs text-muted-foreground">담당: {todo.assignee}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">{todo.category}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
