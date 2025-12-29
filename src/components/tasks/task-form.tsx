'use client'

import { useState } from 'react'
import { createTask } from '@/actions/tasks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function TaskForm({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createTask(projectId, formData)

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
          <Label htmlFor="title">작업명</Label>
          <Input id="title" name="title" placeholder="예: 전객실 벽지 시공" required disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team">담당 팀</Label>
          <Input id="team" name="team" placeholder="예: 목공팀" disabled={loading} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="contract_type">계약 구분</Label>
          <Select name="contract_type" defaultValue="contract" disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contract">계약 내</SelectItem>
              <SelectItem value="extra">추가 작업</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">상태</Label>
          <Select name="status" defaultValue="todo" disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">대기</SelectItem>
              <SelectItem value="doing">진행중</SelectItem>
              <SelectItem value="done">완료</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">마감일</Label>
          <Input id="due_date" name="due_date" type="date" disabled={loading} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="spaces">작업 공간 (쉼표로 구분)</Label>
        <Input id="spaces" name="spaces" placeholder="전객실, 로비, 201" disabled={loading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea id="description" name="description" placeholder="작업 상세 내용..." rows={3} disabled={loading} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? '저장 중...' : '저장'}
      </Button>
    </form>
  )
}
