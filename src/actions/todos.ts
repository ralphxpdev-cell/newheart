'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getTodos(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching todos:', error)
    return []
  }

  return data
}

export async function getTodo(todoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('id', todoId)
    .single()

  if (error) {
    console.error('Error fetching todo:', error)
    return null
  }

  return data
}

export async function createTodo(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const category = (formData.get('category') as string) || 'todo'
  const due_date = formData.get('due_date') as string
  const priority = (formData.get('priority') as string) || 'mid'
  const status = (formData.get('status') as string) || 'todo'
  const requester = formData.get('requester') as string
  const assignee = formData.get('assignee') as string
  const spaces = formData.get('spaces') as string
  const memo = formData.get('memo') as string
  const related_task_id = formData.get('related_task_id') as string
  const related_log_id = formData.get('related_log_id') as string

  const { data, error } = await supabase
    .from('todos')
    .insert([
      {
        project_id: projectId,
        title,
        category,
        due_date: due_date || null,
        priority,
        status,
        requester,
        assignee,
        spaces: spaces ? spaces.split(',').map(s => s.trim()) : [],
        memo,
        related_task_id: related_task_id || null,
        related_log_id: related_log_id || null,
        owner_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating todo:', error)
    return { error: error.message }
  }

  revalidatePath(`/p/${projectId}/todos`)
  revalidatePath(`/p/${projectId}`)
  return { data }
}

export async function updateTodo(todoId: string, projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const due_date = formData.get('due_date') as string
  const priority = formData.get('priority') as string
  const status = formData.get('status') as string
  const requester = formData.get('requester') as string
  const assignee = formData.get('assignee') as string
  const spaces = formData.get('spaces') as string
  const memo = formData.get('memo') as string
  const related_task_id = formData.get('related_task_id') as string
  const related_log_id = formData.get('related_log_id') as string

  const { data, error } = await supabase
    .from('todos')
    .update({
      title,
      category,
      due_date: due_date || null,
      priority,
      status,
      requester,
      assignee,
      spaces: spaces ? spaces.split(',').map(s => s.trim()) : [],
      memo,
      related_task_id: related_task_id || null,
      related_log_id: related_log_id || null,
    })
    .eq('id', todoId)
    .select()
    .single()

  if (error) {
    console.error('Error updating todo:', error)
    return { error: error.message }
  }

  revalidatePath(`/p/${projectId}/todos`)
  revalidatePath(`/p/${projectId}`)
  revalidatePath(`/p/${projectId}/calendar`)
  return { data }
}

export async function deleteTodo(todoId: string, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', todoId)

  if (error) {
    console.error('Error deleting todo:', error)
    return { error: error.message }
  }

  revalidatePath(`/p/${projectId}/todos`)
  revalidatePath(`/p/${projectId}`)
  return { success: true }
}
