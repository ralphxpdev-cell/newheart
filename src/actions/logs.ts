'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getDailyLogs(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('project_id', projectId)
    .order('log_date', { ascending: false })

  if (error) {
    console.error('Error fetching logs:', error)
    return []
  }

  return data
}

export async function getDailyLog(logId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('id', logId)
    .single()

  if (error) {
    console.error('Error fetching log:', error)
    return null
  }

  return data
}

export async function createDailyLog(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const log_date = formData.get('log_date') as string
  const weather = formData.get('weather') as string
  const temperature = formData.get('temperature') as string
  const work_status = (formData.get('work_status') as string) || 'normal'
  const zones = formData.get('zones') as string
  const follow_up_needed = formData.get('follow_up_needed') === 'true'
  const follow_up_summary = formData.get('follow_up_summary') as string
  const content = formData.get('content') as string

  const { data, error } = await supabase
    .from('daily_logs')
    .insert([
      {
        project_id: projectId,
        title,
        log_date: log_date || new Date().toISOString().split('T')[0],
        weather,
        temperature,
        work_status,
        zones: zones ? zones.split(',').map(z => z.trim()) : [],
        follow_up_needed,
        follow_up_summary,
        content,
        owner_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating log:', error)
    return { error: error.message }
  }

  // Handle photo uploads
  const photos = formData.getAll('photos') as File[]
  if (photos && photos.length > 0) {
    for (const photo of photos) {
      if (photo.size > 0) {  // Check if file is not empty
        const timestamp = Date.now()
        const fileExt = photo.name.split('.').pop()
        const fileName = `${user.id}/${projectId}/logs/${data.id}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('room-photos')
          .upload(fileName, photo, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Photo upload error:', uploadError)
          continue  // Skip this photo but continue with others
        }

        // Save to DB
        await supabase.from('daily_log_photos').insert({
          daily_log_id: data.id,
          storage_path: fileName,
          owner_id: user.id,
        })
      }
    }
  }

  revalidatePath(`/p/${projectId}/logs`)
  revalidatePath(`/p/${projectId}`)
  return { data }
}

export async function updateDailyLog(logId: string, projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const log_date = formData.get('log_date') as string
  const weather = formData.get('weather') as string
  const temperature = formData.get('temperature') as string
  const work_status = formData.get('work_status') as string
  const zones = formData.get('zones') as string
  const follow_up_needed = formData.get('follow_up_needed') === 'true'
  const follow_up_summary = formData.get('follow_up_summary') as string
  const content = formData.get('content') as string

  const { data, error } = await supabase
    .from('daily_logs')
    .update({
      title,
      log_date,
      weather,
      temperature,
      work_status,
      zones: zones ? zones.split(',').map(z => z.trim()) : [],
      follow_up_needed,
      follow_up_summary,
      content,
    })
    .eq('id', logId)
    .select()
    .single()

  if (error) {
    console.error('Error updating log:', error)
    return { error: error.message }
  }

  revalidatePath(`/p/${projectId}/logs`)
  revalidatePath(`/p/${projectId}`)
  return { data }
}

export async function deleteDailyLog(logId: string, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('daily_logs')
    .delete()
    .eq('id', logId)

  if (error) {
    console.error('Error deleting log:', error)
    return { error: error.message }
  }

  revalidatePath(`/p/${projectId}/logs`)
  revalidatePath(`/p/${projectId}`)
  return { success: true }
}
