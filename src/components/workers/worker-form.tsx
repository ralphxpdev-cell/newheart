'use client'

import { useState } from 'react'
import { createWorker } from '@/actions/workers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function WorkerForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createWorker(formData)

    if (result.error) {
      alert(`등록 실패: ${result.error}`)
    } else {
      alert('인력이 등록되었습니다.')
      e.currentTarget.reset()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="name">이름 *</Label>
          <Input
            id="name"
            name="name"
            placeholder="홍길동"
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="role">직책/직종 *</Label>
          <Input
            id="role"
            name="role"
            placeholder="전기, 설비, 목공 등"
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="phone">연락처</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="010-1234-5678"
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="team">소속팀</Label>
          <Input
            id="team"
            name="team"
            placeholder="A팀, B팀 등"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="daily_rate">일급 (원)</Label>
          <Input
            id="daily_rate"
            name="daily_rate"
            type="number"
            placeholder="150000"
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="hourly_rate">시급 (원)</Label>
          <Input
            id="hourly_rate"
            name="hourly_rate"
            type="number"
            placeholder="20000"
            disabled={loading}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? '등록 중...' : '인력 등록'}
      </Button>
    </form>
  )
}
