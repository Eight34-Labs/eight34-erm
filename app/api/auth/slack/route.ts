import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const state = Buffer.from(JSON.stringify({ redirectTo, nonce: Math.random().toString(36).slice(2) })).toString('base64url')

  const slackAuthUrl = new URL('https://slack.com/oauth/v2/authorize')
  slackAuthUrl.searchParams.set('client_id', process.env.SLACK_CLIENT_ID!)
  slackAuthUrl.searchParams.set('user_scope', 'users:read,users:read.email')
  slackAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/callback`)
  slackAuthUrl.searchParams.set('state', state)

  return NextResponse.redirect(slackAuthUrl.toString())
}
