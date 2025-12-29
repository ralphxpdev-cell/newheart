'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAttendanceByProject(projectId: string, date?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  let query = supabase
    .from('attendance')
    .select(`
      *,
      worker:workers(id, name, role, team)
    `)
    .eq('project_id', projectId)
    .eq('owner_id', user.id)

  if (date) {
    query = query.eq('work_date', date)
  }

  query = query.order('work_date', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Get attendance error:', error)
    return { error: error.message }
  }

  return { data }
}

export async function createAttendance(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const project_id = formData.get('project_id') as string
  const worker_id = formData.get('worker_id') as string
  const work_date = formData.get('work_date') as string
  const check_in = formData.get('check_in') as string
  const check_out = formData.get('check_out') as string
  const work_hours = formData.get('work_hours') as string

  const { error } = await supabase.from('attendance').insert({
    project_id,
    worker_id,
    work_date: work_date || new Date().toISOString().split('T')[0],
    check_in: check_in || null,
    check_out: check_out || null,
    work_hours: work_hours ? parseFloat(work_hours) : null,
    owner_id: user.id,
  })

  if (error) {
    console.error('Create attendance error:', error)
    return { error: error.message }
  }

  revalidatePath(`/p/${project_id}/attendance`)
  return { success: true }
}

export async function updateAttendance(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const check_in = formData.get('check_in') as string
  const check_out = formData.get('check_out') as string
  const work_hours = formData.get('work_hours') as string
  const status = formData.get('status') as string

  const { error } = await supabase
    .from('attendance')
    .update({
      check_in: check_in || null,
      check_out: check_out || null,
      work_hours: work_hours ? parseFloat(work_hours) : null,
      status: status as 'present' | 'absent' | 'half_day' | 'leave',
    })
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Update attendance error:', error)
    return { error: error.message }
  }

  revalidatePath('/attendance')
  return { success: true }
}

export async function getTodayAttendanceStats(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('attendance')
    .select('*, worker:workers(name, role)')
    .eq('project_id', projectId)
    .eq('work_date', today)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Get attendance stats error:', error)
    return { error: error.message }
  }

  const stats = {
    total: data.length,
    present: data.filter(a => a.status === 'present').length,
    absent: data.filter(a => a.status === 'absent').length,
    totalHours: data.reduce((sum, a) => sum + (a.work_hours || 0), 0),
    workers: data,
  }

  return { data: stats }
}
