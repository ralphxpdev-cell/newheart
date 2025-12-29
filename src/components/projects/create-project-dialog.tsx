'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '@/actions/projects'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'

export default function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('active')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createProject(formData)

    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else if (result.data) {
      setOpen(false)
      setName('')
      setStatus('active')
      router.push(`/p/${result.data.id}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          새 프로젝트
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>새 프로젝트 생성</DialogTitle>
            <DialogDescription>
              새로운 현장 프로젝트를 시작합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">프로젝트 이름</Label>
              <Input
                id="name"
                name="name"
                placeholder="예: 00호텔 리모델링"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <Select name="status" value={status} onValueChange={setStatus} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">계획</SelectItem>
                  <SelectItem value="active">진행중</SelectItem>
                  <SelectItem value="paused">중단</SelectItem>
                  <SelectItem value="done">완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '생성 중...' : '생성'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
