import { getDailyLogs } from '@/actions/logs'
import { getLogPhotos } from '@/actions/log-photos'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Cloud, Thermometer, MapPin, AlertCircle, PlusCircle } from 'lucide-react'
import LogForm from '@/components/logs/log-form'
import LogPhotoGallery from '@/components/logs/log-photo-gallery'

export default async function LogsPage({ params }: { params: { projectId: string } }) {
  const logs = await getDailyLogs(params.projectId)

  // Fetch photos for each log
  const logsWithPhotos = await Promise.all(
    logs.map(async (log) => {
      const photosResult = await getLogPhotos(log.id)
      return { ...log, photos: photosResult.data || [] }
    })
  )

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">현장일지</h2>
        <p className="text-muted-foreground mt-2">일일 작업 내용을 기록하고 관리하세요</p>
      </div>

      {/* Quick Add Section */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-500/20 rounded-xl">
              <PlusCircle className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="text-xl font-bold">새 일지 작성</h3>
          </div>
          <LogForm projectId={params.projectId} />
        </CardContent>
      </Card>

      {/* Logs List */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">작성된 일지 ({logsWithPhotos.length})</h3>
        </div>

        {logsWithPhotos.length === 0 ? (
          <Card className="border-none shadow-md">
            <CardContent className="p-16 text-center">
              <div className="p-6 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-2">작성된 현장일지가 없습니다</h4>
              <p className="text-sm text-muted-foreground">위의 양식을 사용하여 첫 일지를 작성해보세요</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {logsWithPhotos.map((log) => (
              <Card key={log.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-2">{log.title}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(log.log_date).toLocaleDateString('ko-KR')}</span>
                        </div>
                        {log.weather && (
                          <div className="flex items-center gap-1.5">
                            <Cloud className="h-4 w-4" />
                            <span>{log.weather}</span>
                          </div>
                        )}
                        {log.temperature && (
                          <div className="flex items-center gap-1.5">
                            <Thermometer className="h-4 w-4" />
                            <span>{log.temperature}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          log.work_status === 'normal' ? 'outline' :
                          log.work_status === 'delayed' ? 'secondary' : 'destructive'
                        }
                        className="h-7 px-3"
                      >
                        {log.work_status === 'normal' ? '정상' :
                         log.work_status === 'delayed' ? '지연' : '이슈'}
                      </Badge>
                      {log.follow_up_needed && (
                        <Badge variant="destructive" className="h-7 px-3">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          팔로우업
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Work Zones */}
                  {log.zones && log.zones.length > 0 && (
                    <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">작업 공간</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {log.zones.map((zone, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {zone}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  {log.content && (
                    <div className="mb-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                        {log.content}
                      </p>
                    </div>
                  )}

                  {/* Follow-up */}
                  {log.follow_up_needed && log.follow_up_summary && (
                    <div className="mb-4 p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">팔로우업 내용</p>
                      </div>
                      <p className="text-sm text-orange-700 dark:text-orange-300">{log.follow_up_summary}</p>
                    </div>
                  )}

                  {/* Photo Gallery */}
                  <LogPhotoGallery
                    projectId={params.projectId}
                    dailyLogId={log.id}
                    photos={log.photos}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
