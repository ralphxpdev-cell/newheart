'use client'

import { useState } from 'react'
import { signInWithEmail } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await signInWithEmail(formData)

    setLoading(false)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.success) {
      setMessage({ type: 'success', text: result.message || '이메일을 확인해주세요.' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">NewHeart</CardTitle>
          <CardDescription>
            현장 프로젝트 관리 시스템
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <Mail className="mr-2 h-4 w-4" />
              {loading ? '전송 중...' : '로그인 링크 받기'}
            </Button>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === 'success'
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}
              >
                {message.text}
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            이메일로 매직 링크를 전송합니다.<br />
            이메일에서 링크를 클릭하면 자동으로 로그인됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
