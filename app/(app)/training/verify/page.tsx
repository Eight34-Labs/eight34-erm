import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import { getTrainingProgress } from '@/lib/training/actions'
import VerificationTask from '@/components/training/VerificationTask'

export const metadata: Metadata = { title: 'Sales Verification Task' }

export default async function TrainingVerifyPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const progressResult = await getTrainingProgress()
  const progress = progressResult.data
  const isAllModulesComplete = (progress?.completionPercent || 0) >= 100

  // Gating: If not all 5 modules completed and user not already verified, show prerequisite banner
  if (!isAllModulesComplete && !session.user.training_completed) {
    return (
      <div style={{ maxWidth: 640, margin: '60px auto', padding: '0 24px' }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--ink-150)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="text-heading-md" style={{ marginBottom: 8 }}>
            Curriculum Modules Incomplete
          </h1>
          <p className="text-body" style={{ color: 'var(--ink-600)', marginBottom: 24, fontSize: 14 }}>
            Please read and complete all 5 training modules before starting your Verification Task. Current curriculum progress: {progress?.completionPercent || 0}%.
          </p>

          <Link href="/training" className="btn btn-solid btn-md" style={{ margin: '0 auto' }}>
            Go to Training Modules
          </Link>
        </div>
      </div>
    )
  }

  return (
    <VerificationTask
      isVerified={Boolean(session.user.training_completed)}
    />
  )
}
