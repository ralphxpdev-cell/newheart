'use client'

import { useState } from 'react'
import { createTodo } from '@/actions/todos'
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

export default function TodoForm({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createTodo(projectId, formData)

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
          <Label htmlFor="title">업무명</Label>
          <Input id="title" name="title" placeholder="예: 안전 점검 보고서 작성" required disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">마감일</Label>
          <Input id="due_date" name="due_date" type="date" disabled={loading} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="category">카테고리</Label>
          <Select name="category" defaultValue="todo" disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">현장 업무</SelectItem>
              <SelectItem value="admin">관리 업무</SelectItem>
              <SelectItem value="todo">일반 Todo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">우선순위</Label>
          <Select name="priority" defaultValue="mid" disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">높음</SelectItem>
              <SelectItem value="mid">중간</SelectItem>
              <SelectItem value="low">낮음</SelectItem>
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="requester">요청자</Label>
          <Input id="requester" name="requester" placeholder="홍길동" disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignee">담당자</Label>
          <Input id="assignee" name="assignee" placeholder="김철수" disabled={loading} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="spaces">관련 공간 (쉼표로 구분)</Label>
        <Input id="spaces" name="spaces" placeholder="전객실, 로비" disabled={loading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="memo">메모</Label>
        <Textarea id="memo" name="memo" placeholder="상세 내용..." rows={3} disabled={loading} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? '저장 중...' : '저장'}
      </Button>
    </form>
  )
}
