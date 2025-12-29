'use client'

import { useState } from 'react'
import { createOrUpdateRoomProgress } from '@/actions/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

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

export default function ProgressForm({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createOrUpdateRoomProgress(projectId, formData)

    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      e.currentTarget.reset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="room_code">공간 코드</Label>
          <Input
            id="room_code"
            name="room_code"
            placeholder="예: 201, 로비, 전객실"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="room_type">타입 (선택)</Label>
          <Input
            id="room_type"
            name="room_type"
            placeholder="예: 스탠다드A"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>공정 진행률 (0-100%)</Label>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {PROCESS_FIELDS.map((field) => (
            <div key={field.key} className="space-y-1">
              <Label htmlFor={field.key} className="text-sm font-normal">
                {field.label}
              </Label>
              <Input
                id={field.key}
                name={field.key}
                type="number"
                min="0"
                max="100"
                defaultValue="0"
                disabled={loading}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">메모 (선택)</Label>
        <Textarea
          id="note"
          name="note"
          placeholder="특이사항이나 참고사항을 입력하세요..."
          rows={3}
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? '저장 중...' : '저장'}
      </Button>
    </form>
  )
}
