'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileEdit, Trash2, ArrowRight, Clock, DollarSign } from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import type { Lead } from '@/types'
import { deleteLeadDraft } from '@/lib/leads/actions'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface DraftsListProps {
  initialDrafts: Lead[]
}

export default function DraftsList({ initialDrafts }: DraftsListProps) {
  const router = useRouter()
  const [drafts, setDrafts] = useState(initialDrafts)
  const [isPending, startTransition] = useTransition()
  const [draftToDelete, setDraftToDelete] = useState<Lead | null>(null)

  const handleDeleteConfirm = () => {
    if (!draftToDelete) return
    const id = draftToDelete.id
    setDraftToDelete(null)

    startTransition(async () => {
      const res = await deleteLeadDraft(id)
      if (res.success) {
        setDrafts((prev) => prev.filter((d) => d.id !== id))
        router.refresh()
      }
    })
  }

  if (drafts.length === 0) {
    return (
      <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div className="empty-state-icon" style={{ margin: '0 auto 16px' }}>
          <FileEdit className="text-meta" style={{ width: '28px', height: '28px' }} />
        </div>
        <h3 className="empty-state-title" style={{ margin: '0 0 6px' }}>No saved drafts</h3>
        <p className="empty-state-desc" style={{ maxWidth: '420px', margin: '0 auto 20px' }}>
          When creating a new lead, you can save your progress at any time and resume here later.
        </p>
        <Link href="/leads/new" className="btn btn-solid btn-md">
          Start a Lead Intake
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {drafts.map((draft) => {
          return (
            <div
              key={draft.id}
              className="card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                transition: 'border-color var(--transition), box-shadow var(--transition)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-status-inquiring" style={{ fontSize: '0.75rem' }}>
                    Draft
                  </span>
                  <span className="text-meta" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock style={{ width: '12px', height: '12px' }} />
                    {formatRelativeTime(draft.updated_at)}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 650,
                    color: 'var(--ink-900)',
                    margin: '0 0 4px',
                    wordBreak: 'break-word',
                  }}
                >
                  {draft.client_name || 'Untitled Draft'}
                </h3>

                <div className="text-meta" style={{ fontSize: '0.8125rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ textTransform: 'capitalize' }}>{draft.client_type?.toLowerCase() || 'Business'}</span>
                  <span>&middot;</span>
                  <span>{draft.website_type || 'Website'}</span>
                </div>

                {draft.budget && (
                  <div style={{ marginTop: '10px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--e34-accent)' }}>
                    Est. Quote: {formatCurrency(draft.budget)}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--ink-150)',
                }}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  style={{ color: '#991b1b', padding: '4px 8px' }}
                  onClick={() => setDraftToDelete(draft)}
                  disabled={isPending}
                  title="Delete draft"
                >
                  <Trash2 style={{ width: '13px', height: '13px' }} />
                </button>

                <Link
                  href={`/leads/new?draftId=${draft.id}`}
                  className="btn btn-sm btn-solid"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Continue Intake <ArrowRight style={{ width: '13px', height: '13px' }} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <ConfirmModal
        isOpen={Boolean(draftToDelete)}
        onClose={() => setDraftToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead Draft"
        message={`Are you sure you want to permanently delete the draft for "${draftToDelete?.client_name || 'Untitled'}"?`}
        confirmText="Delete Draft"
        isDestructive
        isLoading={isPending}
      />
    </div>
  )
}
