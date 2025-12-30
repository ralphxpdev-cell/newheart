import { getDailyLogs } from '@/actions/logs'
import { getTasks } from '@/actions/tasks'
import { getTodos } from '@/actions/todos'
import { getTodayAttendanceStats } from '@/actions/attendance'
import { getWorkers } from '@/actions/workers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, CheckSquare, ListTodo, AlertCircle, Users, Clock, TrendingUp, ArrowUpRight } from 'lucide-react'
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
  const tasksTodo = tasks.filter(task => task.status === 'todo')
  const tasksDone = tasks.filter(task => task.status === 'done')
  const todosHighPriority = todos.filter(todo => todo.priority === 'high' && todo.status !== 'done')
  const todosToday = todos.filter(todo => {
    if (!todo.due_date) return false
    const today = new Date().toISOString().split('T')[0]
    return todo.due_date === today && todo.status !== 'done'
  })

  const today = format(new Date(), 'yyyy년 M월 d일 (E)', { locale: ko })

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">대시보드</h1>
          <p className="text-muted-foreground mt-2">{today}</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">오늘 출근</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-4xl font-bold text-blue-900 dark:text-blue-100">{attendance?.present || 0}</h3>
                  <span className="text-sm text-blue-600 dark:text-blue-400">명</span>
                </div>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-2">
                  전체 {activeWorkers.length}명 중
                </p>
              </div>
              <div className="p-4 bg-blue-500/20 rounded-2xl">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">진행중 작업</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-4xl font-bold text-green-900 dark:text-green-100">{tasksInProgress.length}</h3>
                  <span className="text-sm text-green-600 dark:text-green-400">건</span>
                </div>
                <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-2">
                  완료 {tasksDone.length} / 총 {tasks.length}건
                </p>
              </div>
              <div className="p-4 bg-green-500/20 rounded-2xl">
                <CheckSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">긴급 업무</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-4xl font-bold text-orange-900 dark:text-orange-100">{todosHighPriority.length}</h3>
                  <span className="text-sm text-orange-600 dark:text-orange-400">건</span>
                </div>
                <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-2">
                  높은 우선순위
                </p>
              </div>
              <div className="p-4 bg-orange-500/20 rounded-2xl">
                <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">오늘 마감</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-4xl font-bold text-purple-900 dark:text-purple-100">{todosToday.length}</h3>
                  <span className="text-sm text-purple-600 dark:text-purple-400">건</span>
                </div>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-2">
                  오늘까지 완료 필요
                </p>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-2xl">
                <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Attendance */}
      {attendance && attendance.workers && attendance.workers.length > 0 && (
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">오늘 출근 현황</CardTitle>
                <CardDescription className="mt-1">출근 {attendance.present}명 · 근무시간 {attendance.totalHours?.toFixed(1) || 0}시간</CardDescription>
              </div>
              <Link href={`/p/${params.projectId}/attendance`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent transition-colors px-4 py-2">
                  전체보기 <ArrowUpRight className="ml-1 h-3 w-3" />
                </Badge>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {attendance.workers.slice(0, 8).map((worker: any) => (
                <div key={worker.id} className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{worker.worker?.name}</p>
                    <p className="text-xs text-muted-foreground">{worker.worker?.role}</p>
                  </div>
                  <Badge variant={worker.status === 'present' ? 'default' : 'secondary'} className="text-xs font-medium">
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
        <div className="grid gap-6 md:grid-cols-2">
          {/* Follow-ups */}
          {followUpLogs.length > 0 && (
            <Card className="border-orange-200 dark:border-orange-800 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-orange-600 dark:text-orange-400">팔로우업 필요</CardTitle>
                    <CardDescription>조치가 필요한 현장일지</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {followUpLogs.slice(0, 3).map((log) => (
                    <Link
                      key={log.id}
                      href={`/p/${params.projectId}/logs`}
                      className="block p-4 rounded-xl border border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-sm transition-all"
                    >
                      <p className="font-semibold text-sm">{log.title}</p>
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
            <Card className="border-purple-200 dark:border-purple-800 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-purple-600 dark:text-purple-400">오늘 마감 업무</CardTitle>
                    <CardDescription>오늘까지 완료해야 할 항목</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todosToday.slice(0, 3).map((todo) => (
                    <Link
                      key={todo.id}
                      href={`/p/${params.projectId}/todos`}
                      className="flex items-center gap-3 p-4 rounded-xl border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-sm transition-all"
                    >
                      <Badge variant={
                        todo.priority === 'high' ? 'destructive' :
                        todo.priority === 'mid' ? 'secondary' : 'outline'
                      } className="text-xs shrink-0">
                        {todo.priority === 'high' ? '높음' :
                         todo.priority === 'mid' ? '중간' : '낮음'}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{todo.title}</p>
                        {todo.assignee && (
                          <p className="text-xs text-muted-foreground">담당: {todo.assignee}</p>
                        )}
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
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Logs */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">최근 현장일지</CardTitle>
                <CardDescription className="mt-1">최근 작성된 일지</CardDescription>
              </div>
              <Link href={`/p/${params.projectId}/logs`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent transition-colors px-4 py-2">
                  전체보기 <ArrowUpRight className="ml-1 h-3 w-3" />
                </Badge>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">작성된 현장일지가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <Link
                    key={log.id}
                    href={`/p/${params.projectId}/logs`}
                    className="block p-4 rounded-xl border hover:border-primary/50 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{log.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.log_date).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <Badge variant={
                        log.work_status === 'normal' ? 'outline' :
                        log.work_status === 'delayed' ? 'secondary' : 'destructive'
                      } className="text-xs shrink-0">
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
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">진행중 작업</CardTitle>
                <CardDescription className="mt-1">현재 진행중인 작업</CardDescription>
              </div>
              <Link href={`/p/${params.projectId}/tasks`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent transition-colors px-4 py-2">
                  전체보기 <ArrowUpRight className="ml-1 h-3 w-3" />
                </Badge>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {tasksInProgress.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">진행중인 작업이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasksInProgress.slice(0, 5).map((task) => (
                  <Link
                    key={task.id}
                    href={`/p/${params.projectId}/tasks`}
                    className="block p-4 rounded-xl border hover:border-primary/50 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{task.title}</p>
                        {task.team && (
                          <p className="text-xs text-muted-foreground mt-1">{task.team}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
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
