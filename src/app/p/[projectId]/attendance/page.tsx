import { getAttendanceByProject, getTodayAttendanceStats } from '@/actions/attendance'
import { getWorkers } from '@/actions/workers'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import AttendanceForm from '@/components/attendance/attendance-form'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export default async function AttendancePage({ params }: { params: { projectId: string } }) {
  const [workersResult, statsResult, attendanceResult] = await Promise.all([
    getWorkers(),
    getTodayAttendanceStats(params.projectId),
    getAttendanceByProject(params.projectId, new Date().toISOString().split('T')[0])
  ])

  const workers = workersResult.data || []
  const stats = statsResult.data
  const todayAttendance = attendanceResult.data || []

  const activeWorkers = workers.filter(w => w.status === 'active')
  const today = format(new Date(), 'yyyy년 M월 d일 (E)', { locale: ko })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">출퇴근 관리</h2>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* Today Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">출근 인원</p>
              <p className="text-2xl font-bold">{stats?.present || 0}명</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-red-500/10">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">결근</p>
              <p className="text-2xl font-bold">{stats?.absent || 0}명</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-blue-500/10">
              <CheckCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">총 근무시간</p>
              <p className="text-2xl font-bold">{stats?.totalHours?.toFixed(1) || 0}h</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">등록 인력</p>
              <p className="text-2xl font-bold">{activeWorkers.length}명</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">출퇴근 등록</h3>
        <AttendanceForm projectId={params.projectId} workers={activeWorkers} />
      </Card>

      {/* Today's Attendance */}
      <div>
        <h3 className="text-lg font-semibold mb-4">오늘 출근 현황</h3>
        {todayAttendance.length === 0 ? (
          <Card className="p-12 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">오늘 출근 기록이 없습니다.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayAttendance.map((attendance: any) => (
              <Card key={attendance.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{attendance.worker?.name}</h4>
                    <p className="text-sm text-muted-foreground">{attendance.worker?.role}</p>
                  </div>
                  <Badge
                    variant={attendance.status === 'present' ? 'default' : 'destructive'}
                  >
                    {attendance.status === 'present' ? '출근' : '결근'}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm">
                  {attendance.check_in && (
                    <p className="text-muted-foreground">
                      출근: <span className="font-medium text-foreground">{attendance.check_in}</span>
                    </p>
                  )}
                  {attendance.check_out && (
                    <p className="text-muted-foreground">
                      퇴근: <span className="font-medium text-foreground">{attendance.check_out}</span>
                    </p>
                  )}
                  {attendance.work_hours && (
                    <p className="text-muted-foreground">
                      근무: <span className="font-medium text-foreground">{attendance.work_hours}시간</span>
                    </p>
                  )}
                </div>

                {attendance.notes && (
                  <p className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                    {attendance.notes}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
