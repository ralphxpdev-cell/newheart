'use client'

import { useState } from 'react'
import { createAttendance } from '@/actions/attendance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Worker {
  id: string
  name: string
  role: string
}

interface AttendanceFormProps {
  projectId: string
  workers: Worker[]
}

export default function AttendanceForm({ projectId, workers }: AttendanceFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('project_id', projectId)
    formData.append('worker_id', selectedWorker)

    const result = await createAttendance(formData)

    if (result.error) {
      alert(`등록 실패: ${result.error}`)
    } else {
      alert('출퇴근이 등록되었습니다.')
      e.currentTarget.reset()
      setSelectedWorker('')
      window.location.reload()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="worker">작업자 *</Label>
          <Select value={selectedWorker} onValueChange={setSelectedWorker} required disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="작업자 선택" />
            </SelectTrigger>
            <SelectContent>
              {workers.map((worker) => (
                <SelectItem key={worker.id} value={worker.id}>
                  {worker.name} ({worker.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="check_in">출근시간</Label>
          <Input
            id="check_in"
            name="check_in"
            type="time"
            defaultValue="09:00"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="check_out">퇴근시간</Label>
          <Input
            id="check_out"
            name="check_out"
            type="time"
            defaultValue="18:00"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="work_hours">근무시간</Label>
          <Input
            id="work_hours"
            name="work_hours"
            type="number"
            step="0.5"
            placeholder="8"
            defaultValue="8"
            disabled={loading}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading || !selectedWorker}>
        {loading ? '등록 중...' : '출퇴근 등록'}
      </Button>
    </form>
  )
}
