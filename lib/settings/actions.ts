'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'
import { canAccessErmSettings } from '@/lib/auth/permissions'
import type { ErmSettings, ActionResult } from '@/types'

const DEFAULT_AESTHETIC_TAGS = [
  'Minimal',
  'Modern',
  'Corporate',
  'Luxury',
  'Playful',
  'Bold',
  'Editorial',
  'Dark',
  'Clean',
  'Futuristic',
  'Professional',
  'Creative',
  'Colorful',
  'Other',
]

export async function getErmSettings(): Promise<ActionResult<ErmSettings>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const supabase = createServiceClient()

  // Ensure row exists
  const { data: existing, error: fetchErr } = await supabase
    .from('erm_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (existing) {
    return {
      success: true,
      data: {
        ...existing,
        aesthetic_tag_options: Array.isArray(existing.aesthetic_tag_options)
          ? existing.aesthetic_tag_options
          : DEFAULT_AESTHETIC_TAGS,
      } as ErmSettings,
    }
  }

  // Insert default row using env var for slack_workspace_id
  const { data: inserted, error: insertErr } = await supabase
    .from('erm_settings')
    .insert({
      default_commission_rate: 50.0,
      auto_approve_salespeople: false,
      slack_workspace_id: process.env.SLACK_TEAM_ID || 'T_EIGHT34_MAIN',
      aesthetic_tag_options: DEFAULT_AESTHETIC_TAGS,
    })
    .select('*')
    .single()

  if (insertErr || !inserted) {
    return {
      success: true,
      data: {
        id: 'default',
        default_commission_rate: 50.0,
        auto_approve_salespeople: false,
        slack_workspace_id: process.env.SLACK_TEAM_ID || 'T_EIGHT34_MAIN',
        aesthetic_tag_options: DEFAULT_AESTHETIC_TAGS,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: null,
      },
    }
  }

  return { success: true, data: inserted as ErmSettings }
}

export async function updateErmSettings(
  updates: Partial<Pick<ErmSettings, 'default_commission_rate' | 'auto_approve_salespeople' | 'aesthetic_tag_options'>>
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canAccessErmSettings(session.user.role)) {
    return { success: false, error: 'Exclusively accessible by Super Admins.' }
  }

  const supabase = createServiceClient()

  const safeUpdates = { ...updates }
  if (Array.isArray(safeUpdates.aesthetic_tag_options)) {
    const hasOther = safeUpdates.aesthetic_tag_options.some((t) => t.toLowerCase() === 'other')
    if (!hasOther) {
      safeUpdates.aesthetic_tag_options.push('Other')
    }
  }

  // Get current row id
  const { data: current } = await supabase.from('erm_settings').select('id').limit(1).maybeSingle()

  if (!current) {
    const { error } = await supabase.from('erm_settings').insert({
      ...safeUpdates,
      updated_by: session.user.id,
      updated_at: new Date().toISOString(),
    })
    if (error) return { success: false, error: 'Failed to initialize settings' }
  } else {
    const { error } = await supabase
      .from('erm_settings')
      .update({
        ...safeUpdates,
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', current.id)

    if (error) return { success: false, error: 'Failed to save settings' }
  }

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  revalidatePath('/leads/new')
  return { success: true }
}
