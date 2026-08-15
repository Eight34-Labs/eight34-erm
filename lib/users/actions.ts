'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'
import { canManageUsers, canManageRoles, getAssignableRoles } from '@/lib/auth/permissions'
import type { User, UserRole, ActionResult } from '@/types'

export async function getTeamMembers(): Promise<ActionResult<User[]>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canManageUsers(session.user.role)) {
    return { success: false, error: 'Insufficient permissions' }
  }

  const supabase = createServiceClient()
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('slack_team_id', session.user.slack_team_id)
    .order('created_at', { ascending: true })

  if (error) return { success: false, error: 'Failed to fetch team members' }
  return { success: true, data: users || [] }
}

export async function updateUserRole(
  targetUserId: string,
  newRole: UserRole
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canManageRoles(session.user.role)) {
    return { success: false, error: 'Only Super Admins can change roles' }
  }

  const assignable = getAssignableRoles(session.user.role)
  if (!assignable.includes(newRole)) {
    return { success: false, error: 'You cannot assign this role' }
  }

  const supabase = createServiceClient()

  // Cannot demote the last SUPER_ADMIN
  if (newRole !== 'SUPER_ADMIN') {
    const { data: target } = await supabase
      .from('users')
      .select('role')
      .eq('id', targetUserId)
      .single()

    if (target?.role === 'SUPER_ADMIN') {
      const { count } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'SUPER_ADMIN')
        .eq('is_active', true)

      if ((count || 0) <= 1) {
        return { success: false, error: 'Cannot demote the last Super Admin' }
      }
    }
  }

  // Cannot change your own role
  if (targetUserId === session.user.id) {
    return { success: false, error: 'Cannot change your own role' }
  }

  const { error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', targetUserId)

  if (error) return { success: false, error: 'Failed to update role' }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function approveUser(targetUserId: string): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canManageUsers(session.user.role)) {
    return { success: false, error: 'Insufficient permissions' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('users')
    .update({ is_approved: true, is_active: true })
    .eq('id', targetUserId)

  if (error) return { success: false, error: 'Failed to approve user' }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateUserCommissionRate(
  targetUserId: string,
  rate: number
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canManageUsers(session.user.role)) {
    return { success: false, error: 'Insufficient permissions to update commission rate' }
  }

  if (isNaN(rate) || rate < 0 || rate > 100) {
    return { success: false, error: 'Commission rate must be between 0% and 100%' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('users')
    .update({ commission_rate: rate, updated_at: new Date().toISOString() })
    .eq('id', targetUserId)

  if (error) return { success: false, error: 'Failed to update commission rate' }

  revalidatePath('/dashboard')
  revalidatePath('/settings')
  return { success: true }
}

export async function toggleUserActive(
  targetUserId: string,
  isActive: boolean
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canManageUsers(session.user.role)) {
    return { success: false, error: 'Insufficient permissions' }
  }

  // Cannot disable yourself
  if (targetUserId === session.user.id) {
    return { success: false, error: 'Cannot disable your own account' }
  }

  const supabase = createServiceClient()

  // Cannot disable last SUPER_ADMIN
  if (!isActive) {
    const { data: target } = await supabase
      .from('users')
      .select('role')
      .eq('id', targetUserId)
      .single()

    if (target?.role === 'SUPER_ADMIN') {
      const { count } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'SUPER_ADMIN')
        .eq('is_active', true)

      if ((count || 0) <= 1) {
        return { success: false, error: 'Cannot disable the last Super Admin' }
      }
    }
  }

  const { error } = await supabase
    .from('users')
    .update({ is_active: isActive })
    .eq('id', targetUserId)

  if (error) return { success: false, error: 'Failed to update user status' }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function removeUser(targetUserId: string): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (session.user.role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Only Super Admins can remove users' }
  }

  if (targetUserId === session.user.id) {
    return { success: false, error: 'Cannot remove your own account' }
  }

  const supabase = createServiceClient()

  const { data: target } = await supabase
    .from('users')
    .select('role')
    .eq('id', targetUserId)
    .single()

  if (target?.role === 'SUPER_ADMIN') {
    const { count } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'SUPER_ADMIN')
      .eq('is_active', true)

    if ((count || 0) <= 1) {
      return { success: false, error: 'Cannot remove the last Super Admin' }
    }
  }

  // Soft delete — just disable
  const { error } = await supabase
    .from('users')
    .update({ is_active: false, is_approved: false })
    .eq('id', targetUserId)

  if (error) return { success: false, error: 'Failed to remove user' }

  revalidatePath('/dashboard')
  return { success: true }
}
