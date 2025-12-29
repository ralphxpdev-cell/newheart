'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getProjects() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data
}

export async function getProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return data
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const status = (formData.get('status') as string) || 'active'

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        name,
        status,
        owner_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    return { error: error.message }
  }

  revalidatePath('/projects')
  return { data }
}

export async function updateProject(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const status = formData.get('status') as string

  const { data, error } = await supabase
    .from('projects')
    .update({
      name,
      status,
    })
    .eq('id', projectId)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    return { error: error.message }
  }

  revalidatePath('/projects')
  revalidatePath(`/p/${projectId}`)
  return { data }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) {
    console.error('Error deleting project:', error)
    return { error: error.message }
  }

  revalidatePath('/projects')
  return { success: true }
}
