import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Sparkles, ArrowRight, Check } from 'lucide-react'
import { getSession } from '@/lib/auth/session'
import { getTrainingProgress } from '@/lib/training/actions'
import { TRAINING_MODULES } from '@/lib/training/modules'

export const metadata: Metadata = { title: 'Training & Verification' }

export default async function TrainingPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const { user } = session
  const modules = TRAINING_MODULES

  const progressResult = await getTrainingProgress()
  const progress = progressResult.data
  const completedIds = new Set(progress?.completedModuleIds || [])

  const completedCount = modules.filter((m) =>
    completedIds.has(String(m.module_number))
  ).length
  const totalCount = modules.length
  const allComplete = totalCount > 0 && completedCount === totalCount

  return (
    <div>
      <div className="page-header" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="text-heading-xl" style={{ marginBottom: 4 }}>Sales Training &amp; Verification</h1>
            <p className="text-body-sm" style={{ margin: 0 }}>
              Read through the {totalCount} platform guides, then complete your guided Verification Task to unlock lead creation.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user.training_completed ? (
              <span className="badge badge-status-completed" style={{ padding: '6px 12px', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck style={{ width: 15, height: 15 }} />
                Verified Salesperson
              </span>
            ) : allComplete ? (
              <Link href="/training/verify" className="btn btn-solid btn-md" style={{ background: '#166534', color: 'white', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Sparkles style={{ width: 15, height: 15 }} />
                Start Verification Task &rarr;
              </Link>
            ) : (
              <span className="text-meta">
                {progress?.completionPercent || 0}% completed
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="text-label">Curriculum Progress</span>
            <span className="text-meta tabular-nums">
              {completedCount} / {totalCount} modules read
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress?.completionPercent || 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Module list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {modules.map((moduleItem, idx: number) => {
            const isCompleted = completedIds.has(String(moduleItem.module_number))
            const isNext = !isCompleted && idx === completedCount

            return (
              <Link
                key={moduleItem.module_number}
                href={`/training/${moduleItem.module_number}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px 18px',
                  borderRadius: 'var(--radius)',
                  background: isNext ? 'var(--ink-50)' : 'var(--surface)',
                  border: `1px solid ${isNext ? 'var(--ink-300)' : 'var(--ink-100)'}`,
                  textDecoration: 'none',
                  transition: 'background var(--transition), border-color var(--transition)',
                }}
              >
                {/* Module number / status */}
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 'var(--radius-sm)',
                  background: isCompleted ? 'var(--status-completed-bg)' : isNext ? 'var(--e34-accent)' : 'var(--ink-100)',
                  border: `1px solid ${isCompleted ? 'var(--status-completed-border)' : 'transparent'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: isCompleted ? 'var(--status-completed-text)' : isNext ? 'white' : 'var(--ink-500)',
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  {isCompleted ? (
                    <Check style={{ width: 16, height: 16 }} />
                  ) : (
                    String(moduleItem.module_number).padStart(2, '0')
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14.5,
                    fontWeight: 650,
                    color: isCompleted ? 'var(--ink-600)' : 'var(--ink-900)',
                    letterSpacing: '-0.01em',
                    marginBottom: 2,
                  }}>
                    {moduleItem.title}
                  </div>
                  {moduleItem.description && (
                    <div className="text-meta" style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {moduleItem.description}
                    </div>
                  )}
                </div>

                <div style={{ flexShrink: 0 }}>
                  {isCompleted ? (
                    <span className="badge badge-status-completed" style={{ fontSize: 11 }}>Read</span>
                  ) : isNext ? (
                    <span className="btn btn-sm btn-solid" style={{ fontSize: 12 }}>Read Module</span>
                  ) : (
                    <span className="text-meta" style={{ fontSize: 12 }}>View &rarr;</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Verification Task CTA Banner */}
        {allComplete && !user.training_completed && (
          <div style={{
            marginTop: 32,
            padding: '24px 28px',
            background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: 'var(--shadow-md)',
            color: 'white',
          }}>
            <div>
              <div style={{ fontWeight: 700, color: 'white', marginBottom: 4, fontSize: 16 }}>
                All 5 Curriculum Modules Completed!
              </div>
              <div style={{ fontSize: 13.5, color: 'rgba(255, 255, 255, 0.9)' }}>
                Complete your interactive guided test lead simulation to unlock lead creation access.
              </div>
            </div>
            <Link href="/training/verify" className="btn btn-md" style={{
              background: 'white',
              color: '#166534',
              fontWeight: 700,
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}>
              Launch Verification Task <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

