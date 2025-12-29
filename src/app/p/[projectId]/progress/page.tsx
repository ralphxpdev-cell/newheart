import { getRoomProgress } from '@/actions/progress'
import { getRoomPhotos } from '@/actions/photos'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'
import ProgressForm from '@/components/progress/progress-form'
import PhotoGallery from '@/components/progress/photo-gallery'

const PROCESS_FIELDS = [
  { key: 'demolition', label: '철거' },
  { key: 'electrical', label: '전기' },
  { key: 'plumbing', label: '설비' },
  { key: 'carpentry', label: '목공' },
  { key: 'waterproof', label: '방수' },
  { key: 'masonry', label: '조적' },
  { key: 'plaster', label: '미장' },
  { key: 'metal', label: '금속' },
  { key: 'tile', label: '타일' },
  { key: 'film', label: '필름' },
  { key: 'paint', label: '도장' },
  { key: 'wallpaper', label: '도배' },
  { key: 'floor', label: '바닥' },
]

function calculateOverallProgress(progress: any): number {
  const values = PROCESS_FIELDS.map(field => progress[field.key] || 0)
  const sum = values.reduce((a, b) => a + b, 0)
  return Math.round(sum / PROCESS_FIELDS.length)
}

export default async function ProgressPage({ params }: { params: { projectId: string } }) {
  const progressList = await getRoomProgress(params.projectId)

  // 각 progress에 대한 사진 가져오기
  const progressWithPhotos = await Promise.all(
    progressList.map(async (progress) => {
      const photosResult = await getRoomPhotos(progress.id)
      return {
        ...progress,
        photos: photosResult.data || [],
      }
    })
  )

  return (
    <div className="space-y-6">
      {/* Quick Add */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">공간 진행률 등록/수정</h3>
        <ProgressForm projectId={params.projectId} />
      </Card>

      {/* Progress List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">공간별 진행률</h3>
        {progressWithPhotos.length === 0 ? (
          <Card className="p-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">등록된 공간이 없습니다.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {progressWithPhotos.map((progress) => {
              const overallProgress = calculateOverallProgress(progress)

              return (
                <Card key={progress.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold">{progress.room_code}</h4>
                      {progress.room_type && (
                        <p className="text-sm text-muted-foreground">{progress.room_type}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{overallProgress}%</div>
                      <p className="text-xs text-muted-foreground">전체 진행률</p>
                    </div>
                  </div>

                  {/* Progress Grid */}
                  <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-5">
                    {PROCESS_FIELDS.map((field) => {
                      const value = progress[field.key] || 0
                      return (
                        <div key={field.key} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{field.label}</span>
                            <span className="font-semibold">{value}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {progress.note && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {progress.note}
                      </p>
                    </div>
                  )}

                  {/* Photo Gallery */}
                  <PhotoGallery
                    projectId={params.projectId}
                    progressId={progress.id}
                    photos={progress.photos}
                  />
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {progressWithPhotos.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">전체 요약</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">등록된 공간</p>
              <p className="text-2xl font-bold">{progressWithPhotos.length}개</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">평균 진행률</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  progressWithPhotos.reduce((sum, p) => sum + calculateOverallProgress(p), 0) /
                    progressWithPhotos.length
                )}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">완료된 공간</p>
              <p className="text-2xl font-bold">
                {progressWithPhotos.filter(p => calculateOverallProgress(p) === 100).length}개
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
