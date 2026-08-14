import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import { getTrainingProgress } from '@/lib/training/actions'
import { TRAINING_MODULES } from '@/lib/training/modules'

export const metadata: Metadata = { title: 'Training' }

export default async function TrainingPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const { user } = session
  const modules = TRAINING_MODULES

  const progressResult = await getTrainingProgress()
  const progress = progressResult.data
  const completedIds = new Set(progress?.completedModuleIds || [])

  const allComplete = modules.every((m) =>
    completedIds.has(String(m.module_number)) || completedIds.has(String(m.module_number))
  )

  const completedCount = completedIds.size
  const totalCount = modules.length

  return (
    <div>
      <div className="page-header" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="text-heading-xl" style={{ marginBottom: 4 }}>Sales Training Curriculum</h1>
            <p className="text-body-sm" style={{ margin: 0 }}>
              Complete all {totalCount} qualification modules to unlock lead submission.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user.training_completed ? (
              <span className="badge badge-status-completed" style={{ padding: '6px 12px', fontSize: 13, fontWeight: 600 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Certified Sales Rep
              </span>
            ) : allComplete ? (
              <Link href="/training/quiz" className="btn btn-solid btn-md" style={{ background: '#166534' }}>
                Take Certification Assessment &rarr;
              </Link>
            ) : (
              <span className="text-meta">
                {progress?.completionPercent || 0}% complete
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="text-label">Curriculum Progress</span>
            <span className="text-meta tabular-nums">
              {completedCount} / {totalCount} modules
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
        {/* Failed quiz notice */}
        {!user.training_completed && user.quiz_score !== null && user.quiz_score !== undefined && (
          <div style={{
            padding: '14px 18px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius)',
            color: '#991b1b',
            fontSize: 13.5,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: 1, flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <strong>Assessment not passed.</strong> You scored {user.quiz_score}/20 ({Math.round((user.quiz_score / 20) * 100)}%).
              The passing score is 16/20 (80%). Your training progress has been reset — please review the modules and retake the assessment.
            </div>
          </div>
        )}

        {/* Module list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                  padding: '14px 16px',
                  borderRadius: 'var(--radius)',
                  background: isNext ? 'var(--ink-50)' : 'var(--surface)',
                  border: `1px solid ${isNext ? 'var(--ink-200)' : 'var(--ink-100)'}`,
                  textDecoration: 'none',
                  transition: 'background var(--transition), border-color var(--transition)',
                }}
              >
                {/* Module number / status */}
                <div style={{
                  width: 32,
                  height: 32,
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    String(moduleItem.module_number).padStart(2, '0')
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isCompleted ? 'var(--ink-600)' : 'var(--ink-900)',
                    letterSpacing: '-0.01em',
                    marginBottom: 2,
                  }}>
                    {moduleItem.title}
                  </div>
                  {moduleItem.description && (
                    <div className="text-meta" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {moduleItem.description}
                    </div>
                  )}
                </div>

                <div style={{ flexShrink: 0 }}>
                  {isCompleted ? (
                    <span className="badge badge-status-completed" style={{ fontSize: 11 }}>Complete</span>
                  ) : isNext ? (
                    <span className="btn btn-sm btn-solid" style={{ fontSize: 12 }}>Start Module</span>
                  ) : (
                    <span className="text-meta" style={{ fontSize: 12 }}>View &rarr;</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Assessment CTA Banner */}
        {allComplete && !user.training_completed && (
          <div style={{
            marginTop: 32,
            padding: '24px 28px',
            background: 'var(--e34-accent)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}>
            <div>
              <div style={{ fontWeight: 700, color: 'white', marginBottom: 4, fontSize: 16 }}>
                All 16 curriculum modules completed
              </div>
              <div style={{ fontSize: 13.5, color: 'rgb(255 255 255 / 0.75)' }}>
                Take the 20-question certification assessment (80% passing standard) to unlock lead submission.
              </div>
            </div>
            <Link href="/training/quiz" className="btn btn-md" style={{
              background: 'white',
              color: 'var(--e34-accent)',
              fontWeight: 600,
              flexShrink: 0,
            }}>
              Start Assessment &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
