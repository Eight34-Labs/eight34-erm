import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'
import type { User } from '@/types'

const SESSION_COOKIE = 'e34_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export async function getSession(): Promise<{ user: User; token: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return null

  const supabase = createServiceClient()

  const { data: session } = await supabase
    .from('sessions')
    .select(`
      *,
      user:users(*)
    `)
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!session || !session.user) return null

  const user = session.user as User

  if (!user.is_active || !user.is_approved) return null

  return { user, token }
}

export async function createSession(userId: string): Promise<string> {
  const supabase = createServiceClient()

  // Generate a cryptographically secure token
  const tokenBytes = new Uint8Array(32)
  crypto.getRandomValues(tokenBytes)
  const token = Array.from(tokenBytes, (b) => b.toString(16).padStart(2, '0')).join('')

  const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString()

  await supabase.from('sessions').insert({
    user_id: userId,
    token,
    expires_at: expiresAt,
  })

  return token
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    const supabase = createServiceClient()
    await supabase.from('sessions').delete().eq('token', token)
  }

  cookieStore.delete(SESSION_COOKIE)
}

export async function cleanExpiredSessions() {
  const supabase = createServiceClient()
  await supabase.from('sessions').delete().lt('expires_at', new Date().toISOString())
}
