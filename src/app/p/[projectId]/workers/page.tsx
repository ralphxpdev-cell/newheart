import { getWorkers } from '@/actions/workers'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Phone } from 'lucide-react'
import WorkerForm from '@/components/workers/worker-form'

export default async function WorkersPage({ params }: { params: { projectId: string } }) {
  const result = await getWorkers()
  const workers = result.data || []

  const activeWorkers = workers.filter(w => w.status === 'active')
  const inactiveWorkers = workers.filter(w => w.status === 'inactive')

  return (
    <div className="space-y-6">
      {/* Add Worker */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">인력 등록</h3>
        <WorkerForm />
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">전체 인력</p>
          <p className="text-2xl font-bold">{workers.length}명</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">활성</p>
          <p className="text-2xl font-bold text-green-500">{activeWorkers.length}명</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">비활성</p>
          <p className="text-2xl font-bold text-muted-foreground">{inactiveWorkers.length}명</p>
        </Card>
      </div>

      {/* Active Workers */}
      <div>
        <h3 className="text-lg font-semibold mb-4">활성 인력 ({activeWorkers.length})</h3>
        {activeWorkers.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">등록된 인력이 없습니다.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeWorkers.map((worker) => (
              <Card key={worker.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{worker.name}</h4>
                    <p className="text-sm text-muted-foreground">{worker.role}</p>
                  </div>
                  <Badge variant="secondary">{worker.team || '미배정'}</Badge>
                </div>

                {worker.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Phone className="h-3 w-3" />
                    {worker.phone}
                  </div>
                )}

                {(worker.daily_rate || worker.hourly_rate) && (
                  <div className="mt-3 pt-3 border-t text-sm">
                    {worker.daily_rate && (
                      <p className="text-muted-foreground">
                        일급: <span className="font-semibold text-foreground">{worker.daily_rate.toLocaleString()}원</span>
                      </p>
                    )}
                    {worker.hourly_rate && (
                      <p className="text-muted-foreground">
                        시급: <span className="font-semibold text-foreground">{worker.hourly_rate.toLocaleString()}원</span>
                      </p>
                    )}
                  </div>
                )}

                {worker.notes && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {worker.notes}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Workers */}
      {inactiveWorkers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
            비활성 인력 ({inactiveWorkers.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inactiveWorkers.map((worker) => (
              <Card key={worker.id} className="p-4 opacity-60">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{worker.name}</h4>
                    <p className="text-sm text-muted-foreground">{worker.role}</p>
                  </div>
                  <Badge variant="outline">비활성</Badge>
                </div>
                {worker.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Phone className="h-3 w-3" />
                    {worker.phone}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
