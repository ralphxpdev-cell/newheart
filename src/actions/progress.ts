'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getRoomProgress(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('room_progress')
    .select('*')
    .eq('project_id', projectId)
    .order('room_code', { ascending: true })

  if (error) {
    console.error('Error fetching room progress:', error)
    return []
  }

  return data
}

export async function getRoomProgressWithPhotos(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('room_progress')
    .select(`
      *,
      room_photos (*)
    `)
    .eq('project_id', projectId)
    .order('room_code', { ascending: true })

  if (error) {
    console.error('Error fetching room progress with photos:', error)
    return []
  }

  return data
}

export async function createOrUpdateRoomProgress(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const room_code = formData.get('room_code') as string
  const room_type = formData.get('room_type') as string
  const demolition = parseInt(formData.get('demolition') as string) || 0
  const electrical = parseInt(formData.get('electrical') as string) || 0
  const plumbing = parseInt(formData.get('plumbing') as string) || 0
  const carpentry = parseInt(formData.get('carpentry') as string) || 0
  const waterproof = parseInt(formData.get('waterproof') as string) || 0
  const masonry = parseInt(formData.get('masonry') as string) || 0
  const plaster = parseInt(formData.get('plaster') as string) || 0
  const metal = parseInt(formData.get('metal') as string) || 0
  const tile = parseInt(formData.get('tile') as string) || 0
  const film = parseInt(formData.get('film') as string) || 0
  const paint = parseInt(formData.get('paint') as string) || 0
  const wallpaper = parseInt(formData.get('wallpaper') as string) || 0
  const floor = parseInt(formData.get('floor') as string) || 0
  const note = formData.get('note') as string

  // Check if room_code already exists
  const { data: existing } = await supabase
    .from('room_progress')
    .select('id')
    .eq('project_id', projectId)
    .eq('room_code', room_code)
    .single()

  let result

  if (existing) {
    // Update existing
    result = await supabase
      .from('room_progress')
      .update({
        room_type,
        demolition,
        electrical,
        plumbing,
        carpentry,
        waterproof,
        masonry,
        plaster,
        metal,
        tile,
        film,
        paint,
        wallpaper,
        floor,
        note,
      })
      .eq('id', existing.id)
      .select()
      .single()
  } else {
    // Insert new
    result = await supabase
      .from('room_progress')
      .insert([
        {
          project_id: projectId,
          room_code,
          room_type,
          demolition,
          electrical,
          plumbing,
          carpentry,
          waterproof,
          masonry,
          plaster,
          metal,
          tile,
          film,
          paint,
          wallpaper,
          floor,
          note,
          owner_id: user.id,
        },
      ])
      .select()
      .single()
  }

  if (result.error) {
    console.error('Error saving room progress:', result.error)
    return { error: result.error.message }
  }

  revalidatePath(`/p/${projectId}/progress`)
  revalidatePath(`/p/${projectId}`)
  return { data: result.data }
}

export async function deleteRoomProgress(progressId: string, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('room_progress')
    .delete()
    .eq('id', progressId)

  if (error) {
    console.error('Error deleting room progress:', error)
    return { error: error.message }
  }

  revalidatePath(`/p/${projectId}/progress`)
  revalidatePath(`/p/${projectId}`)
  return { success: true }
}

export async function uploadRoomPhoto(progressId: string, projectId: string, file: File, caption?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get room_code from progress
  const { data: progress } = await supabase
    .from('room_progress')
    .select('room_code')
    .eq('id', progressId)
    .single()

  if (!progress) {
    return { error: 'Room progress not found' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${user.id}/${projectId}/${progress.room_code}/${fileName}`

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('room-photos')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading photo:', uploadError)
    return { error: uploadError.message }
  }

  // Save to database
  const { data, error } = await supabase
    .from('room_photos')
    .insert([
      {
        project_id: projectId,
        progress_id: progressId,
        storage_path: filePath,
        caption,
        owner_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error saving photo record:', error)
    return { error: error.message }
  }

  revalidatePath(`/p/${projectId}/progress`)
  return { data }
}

export async function deleteRoomPhoto(photoId: string, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get photo info
  const { data: photo } = await supabase
    .from('room_photos')
    .select('storage_path')
    .eq('id', photoId)
    .single()

  if (!photo) {
    return { error: 'Photo not found' }
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('room-photos')
    .remove([photo.storage_path])

  if (storageError) {
    console.error('Error deleting photo from storage:', storageError)
  }

  // Delete from database
  const { error } = await supabase
    .from('room_photos')
    .delete()
    .eq('id', photoId)

  if (error) {
    console.error('Error deleting photo record:', error)
    return { error: error.message }
  }

  revalidatePath(`/p/${projectId}/progress`)
  return { success: true }
}
