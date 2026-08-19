'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { User, UserRole } from '@/types'
import { formatDate, ROLE_LABELS } from '@/lib/utils'
import { approveUser, toggleUserActive, updateUserRole, removeUser, updateUserCommissionRate, toggleUserVerification } from '@/lib/users/actions'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface TeamManagementProps {
  team: User[]
  currentUser: User
}

export default function TeamManagement({ team, currentUser }: TeamManagementProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Commission editing
  const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null)
  const [commissionVal, setCommissionVal] = useState<string>('50')

  // Modals
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    isDestructive?: boolean
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    onConfirm: () => {},
  })

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN'
  const isAdmin = currentUser.role === 'ADMIN' || isSuperAdmin

  const handleApprove = (userId: string) => {
    setActionError(null)
    setLoadingId(userId)
    startTransition(async () => {
      const res = await approveUser(userId)
      if (!res.success) {
        setActionError(res.error || 'Failed to approve user')
      } else {
        router.refresh()
      }
      setLoadingId(null)
    })
  }

  const handleToggleActive = (userId: string, currentStatus: boolean) => {
    setConfirmModal({
      isOpen: true,
      title: `${currentStatus ? 'Disable' : 'Enable'} User Account`,
      message: `Are you sure you want to ${currentStatus ? 'disable' : 'enable'} this user's account?`,
      confirmText: currentStatus ? 'Disable Account' : 'Enable Account',
      isDestructive: currentStatus,
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        setActionError(null)
        setLoadingId(userId)
        startTransition(async () => {
          const res = await toggleUserActive(userId, !currentStatus)
          if (!res.success) {
            setActionError(res.error || 'Failed to update user status')
          } else {
            router.refresh()
          }
          setLoadingId(null)
        })
      },
    })
  }

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    if (!isSuperAdmin) return
    setConfirmModal({
      isOpen: true,
      title: 'Change User Role',
      message: `Are you sure you want to change this member's role to ${ROLE_LABELS[newRole]}?`,
      confirmText: 'Update Role',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        setActionError(null)
        setLoadingId(userId)
        startTransition(async () => {
          const res = await updateUserRole(userId, newRole)
          if (!res.success) {
            setActionError(res.error || 'Failed to update role')
          } else {
            router.refresh()
          }
          setLoadingId(null)
        })
      },
    })
  }

  const handleRemove = (userId: string) => {
    if (!isSuperAdmin) return
    setConfirmModal({
      isOpen: true,
      title: 'Remove Member',
      message: 'Are you sure you want to remove this user from the workspace?',
      confirmText: 'Remove User',
      isDestructive: true,
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        setActionError(null)
        setLoadingId(userId)
        startTransition(async () => {
          const res = await removeUser(userId)
          if (!res.success) {
            setActionError(res.error || 'Failed to remove user')
          } else {
            router.refresh()
          }
          setLoadingId(null)
        })
      },
    })
  }

  const handleToggleVerification = (userId: string, currentStatus: boolean) => {
    setActionError(null)
    setLoadingId(userId)
    startTransition(async () => {
      const res = await toggleUserVerification(userId, !currentStatus)
      if (!res.success) {
        setActionError(res.error || 'Failed to update verification')
      } else {
        router.refresh()
      }
      setLoadingId(null)
    })
  }

  const handleSaveCommission = (userId: string) => {
    const rate = parseFloat(commissionVal)
    if (isNaN(rate) || rate < 0 || rate > 100) {
      setActionError('Commission rate must be between 0% and 100%')
      return
    }

    setEditingCommissionId(null)
    setLoadingId(userId)
    startTransition(async () => {
      const res = await updateUserCommissionRate(userId, rate)
      if (!res.success) {
        setActionError(res.error || 'Failed to update commission rate')
      } else {
        router.refresh()
      }
      setLoadingId(null)
    })
  }

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      {actionError && (
        <div style={{
          padding: '10px 16px',
          background: '#fef2f2',
          borderBottom: '1px solid #fecaca',
          color: '#991b1b',
          fontSize: 13,
        }}>
          {actionError}
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Role</th>
            <th>Commission Rate</th>
            <th>Certification</th>
            <th>Account Status</th>
            <th>Joined</th>
            <th style={{ textAlign: 'right' }}>Controls</th>
          </tr>
        </thead>
        <tbody>
          {team.map((member) => {
            const isSelf = member.id === currentUser.id
            const isLoading = loadingId === member.id || isPending
            const currentRate = member.commission_rate !== undefined ? Number(member.commission_rate) : 50

            return (
              <tr key={member.id}>
                <td>
                  <div style={{ fontWeight: 500, color: 'var(--ink-900)' }}>
                    {member.name || 'Unnamed Member'}
                  </div>
                  <div className="text-meta" style={{ fontSize: 12 }}>
                    {member.email || 'No email associated'}
                  </div>
                </td>

                <td>
                  <span className={`badge ${
                    member.role === 'SUPER_ADMIN' ? 'badge-role-super' : member.role === 'ADMIN' ? 'badge-role-admin' : 'badge-role'
                  }`}>
                    {ROLE_LABELS[member.role] || member.role}
                  </span>
                </td>

                <td>
                  {isAdmin ? (
                    editingCommissionId === member.id ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          className="input"
                          style={{ width: '60px', padding: '2px 6px', fontSize: '12px' }}
                          value={commissionVal}
                          onChange={(e) => setCommissionVal(e.target.value)}
                          autoFocus
                        />
                        <span style={{ fontSize: '12px' }}>%</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-solid"
                          style={{ padding: '2px 6px', fontSize: '11px' }}
                          onClick={() => handleSaveCommission(member.id)}
                          disabled={isLoading}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          style={{ padding: '2px 6px', fontSize: '11px' }}
                          onClick={() => setEditingCommissionId(null)}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                        onClick={() => {
                          setCommissionVal(String(currentRate))
                          setEditingCommissionId(member.id)
                        }}
                        title="Click to edit commission rate"
                      >
                        <span style={{ fontWeight: 650, color: 'var(--e34-accent)', fontSize: '13px' }}>
                          {currentRate}%
                        </span>
                        <span className="text-meta" style={{ fontSize: '11px', textDecoration: 'underline' }}>
                          Edit
                        </span>
                      </div>
                    )
                  ) : (
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{currentRate}%</span>
                  )}
                </td>

                <td>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {member.training_completed ? (
                      <span style={{ color: '#166534', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 500, fontSize: 13 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="text-meta" style={{ fontSize: 12 }}>
                        Unverified
                      </span>
                    )}

                    {isAdmin && !isSelf && (
                      <button
                        type="button"
                        onClick={() => handleToggleVerification(member.id, Boolean(member.training_completed))}
                        disabled={isLoading}
                        className="btn btn-sm btn-outline"
                        style={{ padding: '1px 6px', fontSize: '11px' }}
                        title={member.training_completed ? 'Manually unverify user' : 'Manually verify user'}
                      >
                        {member.training_completed ? 'Unverify' : 'Verify'}
                      </button>
                    )}
                  </div>
                </td>

                <td>
                  {!member.is_approved ? (
                    <span className="badge badge-status-inquiring">Pending Approval</span>
                  ) : member.is_active ? (
                    <span className="badge badge-status-completed">Active</span>
                  ) : (
                    <span className="badge badge-status-rejected">Disabled</span>
                  )}
                </td>

                <td className="text-meta" style={{ fontSize: 12 }}>
                  {formatDate(member.created_at)}
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {!member.is_approved && !isSelf && (
                      <button
                        type="button"
                        onClick={() => handleApprove(member.id)}
                        disabled={isLoading}
                        className="btn btn-sm btn-solid"
                      >
                        Approve Access
                      </button>
                    )}

                    {member.is_approved && !isSelf && (
                      <button
                        type="button"
                        onClick={() => handleToggleActive(member.id, member.is_active)}
                        disabled={isLoading}
                        className={`btn btn-sm ${member.is_active ? 'btn-outline' : 'btn-solid'}`}
                      >
                        {member.is_active ? 'Disable' : 'Enable'}
                      </button>
                    )}

                    {isSuperAdmin && !isSelf && (
                      <select
                        className="select"
                        style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value as UserRole)}
                        disabled={isLoading}
                      >
                        <option value="SALES">Sales</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    )}

                    {isSuperAdmin && !isSelf && (
                      <button
                        type="button"
                        onClick={() => handleRemove(member.id)}
                        disabled={isLoading}
                        className="btn btn-sm btn-danger"
                        title="Remove member"
                      >
                        Remove
                      </button>
                    )}

                    {isSelf && (
                      <span className="text-meta" style={{ fontSize: 11 }}>You</span>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDestructive={confirmModal.isDestructive}
        isLoading={isPending}
      />
    </div>
  )
}
