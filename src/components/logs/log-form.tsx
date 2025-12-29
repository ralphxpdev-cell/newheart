'use client'

import { useState } from 'react'
import { createDailyLog } from '@/actions/logs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function LogForm({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false)
  const [followUpNeeded, setFollowUpNeeded] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('follow_up_needed', followUpNeeded.toString())

    const result = await createDailyLog(projectId, formData)

    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      e.currentTarget.reset()
      setFollowUpNeeded(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">제목</Label>
          <Input id="title" name="title" placeholder="예: 2024년 1월 15일 작업일지" required disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="log_date">날짜</Label>
          <Input id="log_date" name="log_date" type="date" required disabled={loading} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="weather">날씨</Label>
          <Input id="weather" name="weather" placeholder="맑음" disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="temperature">기온</Label>
          <Input id="temperature" name="temperature" placeholder="15℃" disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="work_status">작업 상태</Label>
          <Select name="work_status" defaultValue="normal" disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">정상</SelectItem>
              <SelectItem value="delayed">지연</SelectItem>
              <SelectItem value="issue">이슈</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zones">작업 공간 (쉼표로 구분)</Label>
        <Input id="zones" name="zones" placeholder="전객실, 로비, 복도" disabled={loading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">내용</Label>
        <Textarea id="content" name="content" placeholder="오늘의 작업 내용을 작성하세요..." rows={5} disabled={loading} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="follow_up_needed"
          checked={followUpNeeded}
          onCheckedChange={(checked) => setFollowUpNeeded(checked as boolean)}
          disabled={loading}
        />
        <Label htmlFor="follow_up_needed" className="text-sm font-normal cursor-pointer">
          팔로우업 필요
        </Label>
      </div>

      {followUpNeeded && (
        <div className="space-y-2">
          <Label htmlFor="follow_up_summary">팔로우업 내용</Label>
          <Textarea id="follow_up_summary" name="follow_up_summary" placeholder="조치가 필요한 내용을 작성하세요..." rows={3} disabled={loading} />
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? '저장 중...' : '저장'}
      </Button>
    </form>
  )
}
