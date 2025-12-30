import { anthropic } from '@ai-sdk/anthropic'
import { streamText, tool } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages, projectId } = await req.json()

    const supabase = await createClient()

    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Fetch project data
    const [
      { data: logs },
      { data: tasks },
      { data: todos },
      { data: workers },
      { data: attendance }
    ] = await Promise.all([
      supabase
        .from('daily_logs')
        .select('*')
        .eq('project_id', projectId)
        .eq('owner_id', user.id)
        .order('log_date', { ascending: false })
        .limit(20),
      supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('todos')
        .select('*')
        .eq('project_id', projectId)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('workers')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('attendance')
        .select('*')
        .eq('owner_id', user.id)
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false })
    ])

    // Prepare context
    const context = `
# 현장 데이터

## 현장일지 (최근 20개)
${logs?.map(log => `- [${log.log_date}] ${log.title}: ${log.content || ''} (상태: ${log.work_status})`).join('\n') || '데이터 없음'}

## 작업 내용 (최근 50개)
${tasks?.map(task => `- [${task.status}] ${task.title} (팀: ${task.team || '미지정'}, 마감: ${task.due_date || '미지정'})`).join('\n') || '데이터 없음'}

## 관리 업무 (최근 50개)
${todos?.map(todo => `- [${todo.status}] ${todo.title} (우선순위: ${todo.priority || '보통'})`).join('\n') || '데이터 없음'}

## 인력 현황
${workers?.map(w => `- ${w.name} (${w.role}, 상태: ${w.status})`).join('\n') || '데이터 없음'}

## 최근 7일 출퇴근 기록
${attendance?.map(a => `- [${a.date}] 출근: ${a.check_in || '미체크'}, 퇴근: ${a.check_out || '미체크'}`).join('\n') || '데이터 없음'}
`

    const result = await streamText({
      model: anthropic('claude-3-haiku-20240307'),
      system: `당신은 새마음건축의 현장 관리 AI 어시스턴트입니다.
사용자는 현장 관리자이며, 프로젝트 데이터를 조회하고 분석하는 것을 도와줍니다.

다음 데이터를 참고하여 답변하세요:
${context}

답변 시 유의사항:
- 한국어로 답변하세요
- 구체적인 데이터를 기반으로 답변하세요
- 통계나 요약을 제공할 때는 숫자를 정확히 세세요
- 조언을 제공할 때는 건설 현장 관리 관점에서 실용적으로 답변하세요
- 데이터가 없거나 불충분하면 솔직히 말하세요
- 사용자가 데이터 등록/추가/생성을 요청하면 적절한 도구를 사용하세요`,
      messages,
      maxTokens: 1500,
      tools: {
        createDailyLog: tool({
          description: '새로운 현장일지를 작성합니다',
          parameters: z.object({
            title: z.string().describe('일지 제목'),
            content: z.string().describe('일지 내용'),
            weather: z.string().optional().describe('날씨'),
            temperature: z.string().optional().describe('기온'),
            work_status: z.enum(['normal', 'delayed', 'issue']).describe('작업 상태'),
          }),
          execute: async ({ title, content, weather, temperature, work_status }) => {
            const { data, error } = await supabase
              .from('daily_logs')
              .insert({
                project_id: projectId,
                owner_id: user.id,
                title,
                content,
                weather,
                temperature,
                work_status,
                log_date: new Date().toISOString().split('T')[0],
              })
              .select()
              .single()

            if (error) throw error
            return { success: true, data }
          },
        }),
        createTask: tool({
          description: '새로운 작업을 추가합니다',
          parameters: z.object({
            title: z.string().describe('작업 제목'),
            team: z.string().optional().describe('담당 팀'),
            contract_type: z.enum(['contract', 'additional']).describe('계약 유형'),
            status: z.enum(['todo', 'doing', 'done']).default('todo').describe('작업 상태'),
          }),
          execute: async ({ title, team, contract_type, status }) => {
            const { data, error } = await supabase
              .from('tasks')
              .insert({
                project_id: projectId,
                owner_id: user.id,
                title,
                team,
                contract_type,
                status,
              })
              .select()
              .single()

            if (error) throw error
            return { success: true, data }
          },
        }),
        createTodo: tool({
          description: '새로운 관리 업무를 추가합니다',
          parameters: z.object({
            title: z.string().describe('업무 제목'),
            priority: z.enum(['low', 'medium', 'high']).default('medium').describe('우선순위'),
          }),
          execute: async ({ title, priority }) => {
            const { data, error } = await supabase
              .from('todos')
              .insert({
                project_id: projectId,
                owner_id: user.id,
                title,
                priority,
                status: 'pending',
              })
              .select()
              .single()

            if (error) throw error
            return { success: true, data }
          },
        }),
        updateTaskStatus: tool({
          description: '작업 상태를 변경합니다',
          parameters: z.object({
            taskTitle: z.string().describe('변경할 작업의 제목'),
            newStatus: z.enum(['todo', 'doing', 'done']).describe('새로운 상태'),
          }),
          execute: async ({ taskTitle, newStatus }) => {
            // Find the task
            const { data: task } = await supabase
              .from('tasks')
              .select('id')
              .eq('project_id', projectId)
              .eq('owner_id', user.id)
              .ilike('title', `%${taskTitle}%`)
              .single()

            if (!task) {
              return { success: false, error: '해당 작업을 찾을 수 없습니다' }
            }

            const { data, error } = await supabase
              .from('tasks')
              .update({ status: newStatus })
              .eq('id', task.id)
              .select()
              .single()

            if (error) throw error
            return { success: true, data }
          },
        }),
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
