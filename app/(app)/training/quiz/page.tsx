import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import { getQuizQuestions, getTrainingProgress } from '@/lib/training/actions'
import QuizRunner from '@/components/training/QuizRunner'

export const metadata: Metadata = { title: 'Certification Assessment' }

export default async function TrainingQuizPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const progressResult = await getTrainingProgress()
  const progress = progressResult.data
  const isAllModulesComplete = (progress?.completionPercent || 0) >= 100

  // Gating: If not all modules completed, block quiz access
  if (!isAllModulesComplete) {
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
            Curriculum Prerequisites Incomplete
          </h1>
          <p className="text-body" style={{ color: 'var(--ink-600)', marginBottom: 24, fontSize: 14 }}>
            You must complete and mark all 16 training modules as done before unlocking the 20-question certification assessment. Current progress: {progress?.completionPercent || 0}%.
          </p>

          <Link href="/training" className="btn btn-solid btn-md" style={{ margin: '0 auto' }}>
            Go to Training Curriculum
          </Link>
        </div>
      </div>
    )
  }

  const questionsResult = await getQuizQuestions()
  const questions = questionsResult.data || []

  if (questions.length === 0) {
    return (
      <div style={{ maxWidth: 640, margin: '60px auto', padding: '0 24px' }}>
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <h2 className="text-heading-md">No Assessment Questions Available</h2>
          <p className="text-body-sm" style={{ marginTop: 8 }}>
            Please contact an administrator to initialize the question bank.
          </p>
        </div>
      </div>
    )
  }

  return (
    <QuizRunner
      questions={questions}
      userScore={session.user.quiz_score}
      isCertified={session.user.training_completed}
    />
  )
}
