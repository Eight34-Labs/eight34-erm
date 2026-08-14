import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import NewLeadForm from '@/components/leads/NewLeadForm'

export const metadata: Metadata = { title: 'New Lead Intake' }

export default async function NewLeadPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const { user } = session

  // Strict Gating: only SALES reps need training certification to submit leads.
  // ADMIN and SUPER_ADMIN bypass this requirement.
  const needsTraining = user.role === 'SALES' && !user.training_completed

  if (needsTraining) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px' }}>
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
            Certification Required
          </h1>
          <p className="text-body" style={{ color: 'var(--ink-600)', marginBottom: 24, fontSize: 14, lineHeight: 1.5 }}>
            To ensure all pipeline leads meet Eight34 qualification and scope guidelines, salespeople must complete the sales curriculum and achieve 80% or higher on the certification assessment before submitting leads.
          </p>

          <Link href="/training" className="btn btn-solid btn-md" style={{ margin: '0 auto' }}>
            Go to Sales Training
          </Link>
        </div>
      </div>
    )
  }

  return <NewLeadForm />
}
