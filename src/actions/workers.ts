'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getWorkers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get workers error:', error)
    return { error: error.message }
  }

  return { data }
}

export async function createWorker(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const phone = formData.get('phone') as string
  const team = formData.get('team') as string
  const hourly_rate = formData.get('hourly_rate') as string
  const daily_rate = formData.get('daily_rate') as string

  const { error } = await supabase.from('workers').insert({
    name,
    role,
    phone: phone || null,
    team: team || null,
    hourly_rate: hourly_rate ? parseFloat(hourly_rate) : null,
    daily_rate: daily_rate ? parseFloat(daily_rate) : null,
    owner_id: user.id,
  })

  if (error) {
    console.error('Create worker error:', error)
    return { error: error.message }
  }

  revalidatePath('/workers')
  return { success: true }
}

export async function updateWorker(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const phone = formData.get('phone') as string
  const team = formData.get('team') as string
  const status = formData.get('status') as string
  const hourly_rate = formData.get('hourly_rate') as string
  const daily_rate = formData.get('daily_rate') as string

  const { error } = await supabase
    .from('workers')
    .update({
      name,
      role,
      phone: phone || null,
      team: team || null,
      status: status as 'active' | 'inactive',
      hourly_rate: hourly_rate ? parseFloat(hourly_rate) : null,
      daily_rate: daily_rate ? parseFloat(daily_rate) : null,
    })
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Update worker error:', error)
    return { error: error.message }
  }

  revalidatePath('/workers')
  return { success: true }
}

export async function deleteWorker(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('workers')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Delete worker error:', error)
    return { error: error.message }
  }

  revalidatePath('/workers')
  return { success: true }
}
