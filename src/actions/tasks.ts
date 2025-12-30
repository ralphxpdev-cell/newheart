'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getTasks(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tasks:', error)
    return []
  }

  return data
}

export async function getTask(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single()

  if (error) {
    console.error('Error fetching task:', error)
    return null
  }

  return data
}

export async function createTask(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const contract_type = (formData.get('contract_type') as string) || 'contract'
  const status = (formData.get('status') as string) || 'todo'
  const team = formData.get('team') as string
  const due_date = formData.get('due_date') as string
  const spaces = formData.get('spaces') as string
  const description = formData.get('description') as string
  const related_log_id = formData.get('related_log_id') as string

  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        project_id: projectId,
        title,
        contract_type,
        status,
        team,
        due_date: due_date || null,
        spaces: spaces ? spaces.split(',').map(s => s.trim()) : [],
        description,
        related_log_id: related_log_id || null,
        owner_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating task:', error)
    return { error: error.message }
  }

  // Handle photo uploads
  const photos = formData.getAll('photos') as File[]
  if (photos && photos.length > 0) {
    for (const photo of photos) {
      if (photo.size > 0) {  // Check if file is not empty
        const timestamp = Date.now()
        const fileExt = photo.name.split('.').pop()
        const fileName = `${user.id}/${projectId}/tasks/${data.id}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`

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
        await supabase.from('task_photos').insert({
          task_id: data.id,
          storage_path: fileName,
          owner_id: user.id,
        })
      }
    }
  }

  revalidatePath(`/p/${projectId}/tasks`)
  revalidatePath(`/p/${projectId}`)
  return { data }
}

export async function updateTask(taskId: string, projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const contract_type = formData.get('contract_type') as string
  const status = formData.get('status') as string
  const team = formData.get('team') as string
  const due_date = formData.get('due_date') as string
  const spaces = formData.get('spaces') as string
  const description = formData.get('description') as string
  const related_log_id = formData.get('related_log_id') as string

  const { data, error } = await supabase
    .from('tasks')
    .update({
      title,
      contract_type,
      status,
      team,
      due_date: due_date || null,
      spaces: spaces ? spaces.split(',').map(s => s.trim()) : [],
      description,
      related_log_id: related_log_id || null,
    })
    .eq('id', taskId)
    .select()
    .single()

  if (error) {
    console.error('Error updating task:', error)
    return { error: error.message }
  }

  revalidatePath(`/p/${projectId}/tasks`)
  revalidatePath(`/p/${projectId}`)
  revalidatePath(`/p/${projectId}/calendar`)
  return { data }
}

export async function deleteTask(taskId: string, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) {
    console.error('Error deleting task:', error)
    return { error: error.message }
  }

  revalidatePath(`/p/${projectId}/tasks`)
  revalidatePath(`/p/${projectId}`)
  return { success: true }
}
