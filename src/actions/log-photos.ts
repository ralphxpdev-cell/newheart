'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadLogPhoto(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const project_id = formData.get('project_id') as string
  const daily_log_id = formData.get('daily_log_id') as string
  const file = formData.get('file') as File
  const caption = formData.get('caption') as string

  if (!file) {
    return { error: 'No file provided' }
  }

  // 파일명 생성: {user_id}/{project_id}/logs/{daily_log_id}/{timestamp}.{ext}
  const timestamp = Date.now()
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${project_id}/logs/${daily_log_id}/${timestamp}.${fileExt}`

  // Storage에 업로드
  const { error: uploadError } = await supabase.storage
    .from('room-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return { error: uploadError.message }
  }

  // DB에 레코드 생성
  const { error: dbError } = await supabase.from('daily_log_photos').insert({
    daily_log_id,
    storage_path: fileName,
    caption: caption || null,
    owner_id: user.id,
  })

  if (dbError) {
    console.error('DB insert error:', dbError)
    // Storage 파일 삭제
    await supabase.storage.from('room-photos').remove([fileName])
    return { error: dbError.message }
  }

  revalidatePath(`/p/${project_id}/logs`)
  return { success: true }
}

export async function getLogPhotos(logId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('daily_log_photos')
    .select('*')
    .eq('daily_log_id', logId)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get photos error:', error)
    return { error: error.message }
  }

  // Public URL 생성
  const photosWithUrls = data.map(photo => ({
    ...photo,
    url: supabase.storage.from('room-photos').getPublicUrl(photo.storage_path).data.publicUrl,
  }))

  return { data: photosWithUrls }
}

export async function deleteLogPhoto(id: string, storagePath: string, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // DB 레코드 삭제
  const { error: dbError } = await supabase
    .from('daily_log_photos')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (dbError) {
    console.error('Delete photo error:', dbError)
    return { error: dbError.message }
  }

  // Storage 파일 삭제
  const { error: storageError } = await supabase.storage
    .from('room-photos')
    .remove([storagePath])

  if (storageError) {
    console.error('Storage delete error:', storageError)
  }

  revalidatePath(`/p/${projectId}/logs`)
  return { success: true }
}
