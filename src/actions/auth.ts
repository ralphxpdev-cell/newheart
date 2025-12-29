'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  // Get origin dynamically from request headers
  const headersList = await headers()
  const origin = headersList.get('origin') || headersList.get('referer')?.split('/').slice(0, 3).join('/') || 'http://localhost:3000'

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Sign in error:', error)
    return { error: error.message }
  }

  return { success: true, message: '이메일로 로그인 링크를 전송했습니다. 이메일을 확인해주세요.' }
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign out error:', error)
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
