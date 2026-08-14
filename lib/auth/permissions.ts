import type { UserRole } from '@/types'

export function canManageUsers(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export function canManageRoles(role: UserRole): boolean {
  return role === 'SUPER_ADMIN'
}

export function canViewAllLeads(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export function canChangeLeadStatus(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export function canManageTraining(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export function canManagePricing(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export function canAccessAdminDashboard(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export function isAtLeast(role: UserRole, minimum: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    SUPER_ADMIN: 3,
    ADMIN: 2,
    SALES: 1,
  }
  return hierarchy[role] >= hierarchy[minimum]
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 3,
  ADMIN: 2,
  SALES: 1,
}

// Determine which roles a given role can promote users to
export function getAssignableRoles(actorRole: UserRole): UserRole[] {
  if (actorRole === 'SUPER_ADMIN') return ['SUPER_ADMIN', 'ADMIN', 'SALES']
  if (actorRole === 'ADMIN') return ['SALES']
  return []
}
