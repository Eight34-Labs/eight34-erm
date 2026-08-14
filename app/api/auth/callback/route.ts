import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createSession, setSessionCookie } from '@/lib/auth/session'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const baseUrl = process.env.NEXTAUTH_URL!

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_denied`)
  }

  let redirectTo = '/dashboard'
  if (state) {
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64url').toString())
      redirectTo = parsed.redirectTo || '/dashboard'
    } catch {
      // ignore malformed state
    }
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        code,
        redirect_uri: `${baseUrl}/api/auth/callback`,
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.ok) {
      console.error('Slack token exchange failed:', tokenData.error)
      return NextResponse.redirect(`${baseUrl}/login?error=token_exchange`)
    }

    // Extract the user token (not bot token)
    const userToken = tokenData.authed_user?.access_token
    const slackUserId = tokenData.authed_user?.id
    const teamId = tokenData.team?.id

    if (!userToken || !slackUserId || !teamId) {
      return NextResponse.redirect(`${baseUrl}/login?error=missing_user_data`)
    }

    // Verify the workspace
    const authorizedTeamId = process.env.SLACK_TEAM_ID
    if (authorizedTeamId && teamId !== authorizedTeamId) {
      return NextResponse.redirect(`${baseUrl}/login?error=unauthorized_workspace`)
    }

    // Fetch user profile from Slack
    const profileRes = await fetch('https://slack.com/api/users.info?user=' + slackUserId, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    const profileData = await profileRes.json()

    if (!profileData.ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=profile_fetch`)
    }

    const slackUser = profileData.user
    const profile = slackUser.profile

    const name = profile.real_name || slackUser.name || 'Unknown'
    const email = profile.email || null
    const avatarUrl = profile.image_512 || profile.image_192 || null

    // Check if a SUPER_ADMIN exists already
    const supabase = createServiceClient()
    const { data: existingSuperAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'SUPER_ADMIN')
      .eq('is_active', true)
      .limit(1)
      .single()

    const isFirstUser = !existingSuperAdmin

    // Upsert the user
    const { data: user, error: upsertError } = await supabase
      .from('users')
      .upsert(
        {
          slack_user_id: slackUserId,
          slack_team_id: teamId,
          name,
          email,
          avatar_url: avatarUrl,
          // First user gets SUPER_ADMIN and auto-approved
          ...(isFirstUser
            ? { role: 'SUPER_ADMIN', is_approved: true, is_active: true }
            : {}),
        },
        {
          onConflict: 'slack_user_id',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single()

    if (upsertError || !user) {
      console.error('User upsert failed:', upsertError)
      return NextResponse.redirect(`${baseUrl}/login?error=user_creation`)
    }

    // Reject unapproved or inactive users
    if (!user.is_active) {
      return NextResponse.redirect(`${baseUrl}/login?error=account_disabled`)
    }

    if (!user.is_approved) {
      return NextResponse.redirect(`${baseUrl}/login?error=awaiting_approval`)
    }

    // Create session
    const token = await createSession(user.id)
    await setSessionCookie(token)

    return NextResponse.redirect(`${baseUrl}${redirectTo}`)
  } catch (err) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(`${baseUrl}/login?error=server_error`)
  }
}
