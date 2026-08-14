import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth/session'

export async function POST() {
  await clearSession()
  return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL!))
}

export async function GET() {
  await clearSession()
  const response = NextResponse.redirect(
    new URL('/login', process.env.NEXTAUTH_URL || 'http://localhost:3000')
  )
  return response
}
