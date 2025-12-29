import { getDailyLogs } from '@/actions/logs'
import { getTasks } from '@/actions/tasks'
import { getTodos } from '@/actions/todos'
import { getTodayAttendanceStats } from '@/actions/attendance'
import { getWorkers } from '@/actions/workers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, CheckSquare, ListTodo, AlertCircle, Users, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export default async function ProjectDashboard({ params }: { params: { projectId: string } }) {
  const [logs, tasks, todos, attendanceResult, workersResult] = await Promise.all([
    getDailyLogs(params.projectId),
    getTasks(params.projectId),
    getTodos(params.projectId),
    getTodayAttendanceStats(params.projectId),
    getWorkers(),
  ])

  const attendance = attendanceResult.data
  const workers = workersResult.data || []
  const activeWorkers = workers.filter(w => w.status === 'active')

  const recentLogs = logs.slice(0, 5)
  const followUpLogs = logs.filter(log => log.follow_up_needed)
  const tasksInProgress = tasks.filter(task => task.status === 'doing')
  const tasksDone = tasks.filter(task => task.status === 'done')
  const todosHighPriority = todos.filter(todo => todo.priority === 'high' && todo.status !== 'done')
  const todosToday = todos.filter(todo => {
    if (!todo.due_date) return false
    const today = new Date().toISOString().split('T')[0]
    return todo.due_date === today && todo.status !== 'done'
  })

  const today = format(new Date(), 'M월 d일 (E)', { locale: ko })

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <div>
        <h2 className="text-3xl font-bold">대시보드</h2>
        <p className="text-muted-foreground mt-1">{today}</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘 출근</CardTitle>
            <Clock className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{attendance?.present || 0}명</div>
            <p className="text-xs text-muted-foreground mt-1">
              전체 {activeWorkers.length}명 중 {attendance?.present || 0}명 출근
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행중 작업</CardTitle>
            <CheckSquare className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{tasksInProgress.length}건</div>
            <p className="text-xs text-muted-foreground mt-1">
              완료 {tasksDone.length}건 / 총 {tasks.length}건
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">긴급 업무</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{todosHighPriority.length}건</div>
            <p className="text-xs text-muted-foreground mt-1">
              높은 우선순위 업무
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘 마감</CardTitle>
            <ListTodo className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">{todosToday.length}건</div>
            <p className="text-xs text-muted-foreground mt-1">
              오늘까지 완료 필요
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Attendance */}
      {attendance && attendance.workers && attendance.workers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>오늘 출근 현황</CardTitle>
                <CardDescription>출근 {attendance.present}명 · 근무시간 {attendance.totalHours?.toFixed(1) || 0}h</CardDescription>
              </div>
              <Link href={`/p/${params.projectId}/attendance`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  전체보기
                </Badge>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {attendance.workers.slice(0, 8).map((worker: any) => (
                <div key={worker.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{worker.worker?.name}</p>
                    <p className="text-xs text-muted-foreground">{worker.worker?.role}</p>
                  </div>
                  <Badge variant={worker.status === 'present' ? 'default' : 'secondary'} className="text-xs">
                    {worker.work_hours ? `${worker.work_hours}h` : '출근'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Urgent Items */}
      {(followUpLogs.length > 0 || todosToday.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Follow-ups */}
          {followUpLogs.length > 0 && (
            <Card className="border-orange-500/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-orange-500">팔로우업 필요</CardTitle>
                </div>
                <CardDescription>조치가 필요한 현장일지</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {followUpLogs.slice(0, 3).map((log) => (
                    <Link
                      key={log.id}
                      href={`/p/${params.projectId}/logs`}
                      className="block p-3 rounded-lg border border-orange-500/30 hover:bg-orange-500/5 transition-colors"
                    >
                      <p className="font-medium text-sm">{log.title}</p>
                      {log.follow_up_summary && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {log.follow_up_summary}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(log.log_date).toLocaleDateString('ko-KR')}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Today's Todos */}
          {todosToday.length > 0 && (
            <Card className="border-purple-500/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-purple-500">오늘 마감 업무</CardTitle>
                </div>
                <CardDescription>오늘까지 완료해야 할 항목</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {todosToday.slice(0, 3).map((todo) => (
                    <Link
                      key={todo.id}
                      href={`/p/${params.projectId}/todos`}
                      className="flex items-center justify-between p-3 rounded-lg border border-purple-500/30 hover:bg-purple-500/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          todo.priority === 'high' ? 'destructive' :
                          todo.priority === 'mid' ? 'secondary' : 'outline'
                        } className="text-xs">
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
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>최근 현장일지</CardTitle>
                <CardDescription>최근 작성된 일지</CardDescription>
              </div>
              <Link href={`/p/${params.projectId}/logs`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  전체보기
                </Badge>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">작성된 현장일지가 없습니다.</p>
            ) : (
              <div className="space-y-2">
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
                      } className="text-xs">
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

        {/* Tasks in Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>진행중 작업</CardTitle>
                <CardDescription>현재 진행중인 작업</CardDescription>
              </div>
              <Link href={`/p/${params.projectId}/tasks`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  전체보기
                </Badge>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {tasksInProgress.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">진행중인 작업이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {tasksInProgress.slice(0, 5).map((task) => (
                  <Link
                    key={task.id}
                    href={`/p/${params.projectId}/tasks`}
                    className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        {task.team && (
                          <p className="text-xs text-muted-foreground mt-1">{task.team}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {task.contract_type === 'contract' ? '계약' : '추가'}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
