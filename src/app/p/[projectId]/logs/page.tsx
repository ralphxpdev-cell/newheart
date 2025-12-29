import { getDailyLogs } from '@/actions/logs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'
import LogForm from '@/components/logs/log-form'

export default async function LogsPage({ params }: { params: { projectId: string } }) {
  const logs = await getDailyLogs(params.projectId)

  return (
    <div className="space-y-6">
      {/* Quick Add */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">빠른 추가</h3>
        <LogForm projectId={params.projectId} />
      </Card>

      {/* Logs List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">현장일지 목록</h3>
        {logs.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">작성된 현장일지가 없습니다.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{log.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(log.log_date).toLocaleDateString('ko-KR')}
                      {log.weather && ` · ${log.weather}`}
                      {log.temperature && ` · ${log.temperature}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={
                      log.work_status === 'normal' ? 'outline' :
                      log.work_status === 'delayed' ? 'secondary' : 'destructive'
                    }>
                      {log.work_status === 'normal' ? '정상' :
                       log.work_status === 'delayed' ? '지연' : '이슈'}
                    </Badge>
                    {log.follow_up_needed && (
                      <Badge variant="destructive">팔로우업 필요</Badge>
                    )}
                  </div>
                </div>

                {log.zones && log.zones.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium">작업 공간: </span>
                    <span className="text-sm text-muted-foreground">
                      {log.zones.join(', ')}
                    </span>
                  </div>
                )}

                {log.content && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {log.content}
                  </p>
                )}

                {log.follow_up_needed && log.follow_up_summary && (
                  <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-md">
                    <p className="text-sm font-medium text-orange-500 mb-1">팔로우업 내용</p>
                    <p className="text-sm text-orange-500/90">{log.follow_up_summary}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
