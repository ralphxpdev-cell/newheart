'use client'

import { useChat } from 'ai/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, Bot, User, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function ChatPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { projectId },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI 어시스턴트</h2>
        <p className="text-muted-foreground mt-2">
          현장 데이터를 조회하고 분석하세요
        </p>
      </div>

      {/* Chat Container */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-6 bg-primary/10 rounded-full">
                  <MessageCircle className="h-16 w-16 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI 어시스턴트에게 물어보세요</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    현장일지, 작업 현황, 인력 관리 등 프로젝트 데이터에 대해 질문하세요
                  </p>
                </div>
                <div className="grid gap-2 mt-4 w-full max-w-md">
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleInputChange({ target: { value: '이번주 지연된 작업이 몇 건이야?' } } as any)}
                  >
                    <span className="text-sm">이번주 지연된 작업이 몇 건이야?</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleInputChange({ target: { value: '오늘 출근한 인원은?' } } as any)}
                  >
                    <span className="text-sm">오늘 출근한 인원은?</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleInputChange({ target: { value: '최근 현장일지 요약해줘' } } as any)}
                  >
                    <span className="text-sm">최근 현장일지 요약해줘</span>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="질문을 입력하세요..."
                disabled={isLoading}
                className="flex-1 h-12"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="lg">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Claude 3 Haiku를 사용합니다. 데이터는 실시간으로 조회됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
