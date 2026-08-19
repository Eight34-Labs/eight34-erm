'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'
import type { ActionResult } from '@/types'
import { TRAINING_MODULES } from '@/lib/training/modules'

// In-memory flag so we don't query the DB count on every request
let isSeededInMemory = false

async function ensureModulesSeeded(supabase: ReturnType<typeof createServiceClient>) {
  if (isSeededInMemory) return

  try {
    const { count } = await supabase
      .from('training_modules')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true)

    if (count === TRAINING_MODULES.length) {
      isSeededInMemory = true
      return
    }

    // Clean up old modules > 5
    await supabase.from('training_modules').delete().gt('module_number', TRAINING_MODULES.length)

    for (const mod of TRAINING_MODULES) {
      await supabase.from('training_modules').upsert(
        {
          module_number: mod.module_number,
          title: mod.title,
          description: mod.description,
          content: mod.content as any,
          version: 2,
          is_published: true,
        },
        { onConflict: 'module_number' }
      )
    }
    isSeededInMemory = true
  } catch (err) {
    console.error('Failed to sync training modules:', err)
  }
}

export async function getTrainingProgress(): Promise<ActionResult<{
  completedModuleIds: string[]
  completedModuleNumbers: number[]
  totalModules: number
  completionPercent: number
  isVerified: boolean
}>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const supabase = createServiceClient()
  await ensureModulesSeeded(supabase)

  const totalModules = TRAINING_MODULES.length

  // Get user progress
  const { data: progress } = await supabase
    .from('training_progress')
    .select('module_id, completed')
    .eq('user_id', session.user.id)
    .eq('completed', true)

  // Get module mapping
  const { data: modules } = await supabase
    .from('training_modules')
    .select('id, module_number')
    .lte('module_number', totalModules)
    .eq('is_published', true)
    .order('module_number', { ascending: true })

  const idToNumber = new Map<string, number>()
  if (modules) {
    for (const m of modules) {
      idToNumber.set(m.id, m.module_number)
    }
  }

  const completedModuleIds: string[] = []
  const completedModuleNumbers: number[] = []

  if (progress) {
    for (const p of progress) {
      completedModuleIds.push(p.module_id)
      const num = idToNumber.get(p.module_id)
      if (num !== undefined) {
        completedModuleNumbers.push(num)
        completedModuleIds.push(String(num))
      }
    }
  }

  const uniqueCompletedNumbers = Array.from(new Set(completedModuleNumbers))
  const completionPercent =
    totalModules > 0 ? Math.min(100, Math.round((uniqueCompletedNumbers.length / totalModules) * 100)) : 0

  return {
    success: true,
    data: {
      completedModuleIds: Array.from(new Set(completedModuleIds)),
      completedModuleNumbers: uniqueCompletedNumbers,
      totalModules,
      completionPercent,
      isVerified: Boolean(session.user.training_completed),
    },
  }
}

export async function markModuleComplete(moduleIdentifier: string | number): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const supabase = createServiceClient()
  await ensureModulesSeeded(supabase)

  let targetModuleId: string | null = null
  const modNum = typeof moduleIdentifier === 'number' ? moduleIdentifier : parseInt(String(moduleIdentifier), 10)

  if (!isNaN(modNum) && modNum > 0) {
    const { data: modByNum } = await supabase
      .from('training_modules')
      .select('id')
      .eq('module_number', modNum)
      .maybeSingle()

    if (modByNum) {
      targetModuleId = modByNum.id
    }
  }

  if (!targetModuleId && typeof moduleIdentifier === 'string' && moduleIdentifier.length === 36) {
    const { data: modById } = await supabase
      .from('training_modules')
      .select('id')
      .eq('id', moduleIdentifier)
      .maybeSingle()

    if (modById) {
      targetModuleId = modById.id
    }
  }

  if (!targetModuleId) {
    return { success: false, error: `Module ${moduleIdentifier} not found` }
  }

  const { error } = await supabase
    .from('training_progress')
    .upsert(
      {
        user_id: session.user.id,
        module_id: targetModuleId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id' }
    )

  if (error) {
    console.error('Error marking module complete:', error)
    return { success: false, error: 'Failed to mark module complete' }
  }

  revalidatePath('/training')
  revalidatePath(`/training/${modNum}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function completeVerificationTask(): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const supabase = createServiceClient()

  // Mark user verified
  const { error } = await supabase
    .from('users')
    .update({
      training_completed: true,
      training_version: 2,
      training_completed_at: new Date().toISOString(),
    })
    .eq('id', session.user.id)

  if (error) {
    console.error('Error completing verification task:', error)
    return { success: false, error: 'Failed to complete verification' }
  }

  revalidatePath('/training')
  revalidatePath('/training/verify')
  revalidatePath('/dashboard')
  revalidatePath('/leads')
  revalidatePath('/leads/new')

  return { success: true }
}

