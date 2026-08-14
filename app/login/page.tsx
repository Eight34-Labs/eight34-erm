import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import LoginPage from '@/components/auth/LoginPage'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>
}) {
  const session = await getSession()
  if (session) redirect('/dashboard')

  const params = await searchParams
  return <LoginPage error={params.error} />
}
