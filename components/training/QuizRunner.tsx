'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { submitQuiz } from '@/lib/training/actions'

interface QuestionItem {
  id: string
  question: string
  options: string[]
}

interface QuizRunnerProps {
  questions: QuestionItem[]
  userScore: number | null
  isCertified: boolean
}

export default function QuizRunner({
  questions,
  userScore,
  isCertified: initialCertified,
}: QuizRunnerProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{
    score: number
    total: number
    passed: boolean
    incorrectAnswers: Array<{ questionId: string; correct: string; explanation: string }>
  } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const currentQ = questions[currentIndex]
  const selectedOption = currentQ ? answers[currentQ.id] : undefined
  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).length
  const isAllAnswered = answeredCount === totalQuestions

  const handleSelectOption = (option: string) => {
    if (result) return
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }))
  }

  const handleSubmit = () => {
    if (!isAllAnswered) {
      setErrorMsg(`Please answer all ${totalQuestions} questions before submitting (currently answered: ${answeredCount}/${totalQuestions}).`)
      return
    }

    setErrorMsg(null)
    startTransition(async () => {
      const res = await submitQuiz(answers)
      if (res.success && res.data) {
        setResult(res.data)
        router.refresh()
      } else {
        setErrorMsg(res.error || 'Failed to score assessment.')
      }
    })
  }

  // If already completed and user sees quiz screen
  if (result) {
    return (
      <div className="quiz-result-wrapper">
        <div className="result-card">
          <div className="result-header">
            <div className={`result-badge ${result.passed ? 'passed' : 'failed'}`}>
              {result.passed ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Assessment Passed — 80% Certification Standard Met
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Assessment Not Passed — Score Below 80%
                </>
              )}
            </div>

            <h1 className="result-score-title">
              Final Score: <span className="tabular-nums">{result.score} / {result.total}</span> ({Math.round((result.score / result.total) * 100)}%)
            </h1>

            <p className="result-description">
              {result.passed ? (
                'Congratulations. You have demonstrated a thorough understanding of Eight34 sales qualification, pricing structures, and lead submission standards. Lead intake is now unlocked.'
              ) : (
                'The passing score is 16/20 (80%). To uphold Eight34 agency lead quality, your training progress has been reset. Please review the curriculum modules and retake the assessment when prepared.'
              )}
            </p>

            <div className="result-action-buttons">
              {result.passed ? (
                <Link href="/leads/new" className="btn btn-solid btn-lg" style={{ background: '#166534' }}>
                  Submit First Lead
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link href="/training" className="btn btn-solid btn-lg">
                  Return to Training Curriculum
                </Link>
              )}
              <Link href="/dashboard" className="btn btn-outline btn-lg">
                Go to Dashboard
              </Link>
            </div>
          </div>

          {/* Incorrect Answers Review */}
          {result.incorrectAnswers.length > 0 && (
            <div className="review-section">
              <h2 className="review-title">Review Incorrect Questions ({result.incorrectAnswers.length})</h2>
              <div className="review-list">
                {result.incorrectAnswers.map((item, idx) => {
                  const originalQ = questions.find((q) => q.id === item.questionId)
                  const userChoice = answers[item.questionId]

                  return (
                    <div key={idx} className="review-card">
                      <div className="review-q-text">
                        <span className="q-num">Q{idx + 1}.</span> {originalQ?.question}
                      </div>

                      <div className="review-answers-grid">
                        <div className="ans-block user-ans">
                          <span className="ans-label">Your Answer:</span>
                          <span className="ans-val">{userChoice}</span>
                        </div>
                        <div className="ans-block correct-ans">
                          <span className="ans-label">Correct Answer:</span>
                          <span className="ans-val">{item.correct}</span>
                        </div>
                      </div>

                      <div className="explanation-block">
                        <strong>Reasoning:</strong> {item.explanation}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .quiz-result-wrapper {
            max-width: 760px;
            margin: 0 auto;
            padding: 40px 24px 80px;
          }
          .result-card {
            background: var(--surface);
            border: 1px solid var(--ink-150);
            border-radius: var(--radius-lg);
            overflow: hidden;
          }
          .result-header {
            padding: 36px 36px 28px;
            border-bottom: 1px solid var(--ink-100);
          }
          .result-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: var(--radius-sm);
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .result-badge.passed {
            background: var(--status-completed-bg);
            border: 1px solid var(--status-completed-border);
            color: var(--status-completed-text);
          }
          .result-badge.failed {
            background: var(--status-rejected-bg);
            border: 1px solid var(--status-rejected-border);
            color: var(--status-rejected-text);
          }
          .result-score-title {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.03em;
            color: var(--ink-900);
            margin: 0 0 10px;
          }
          .result-description {
            font-size: 14.5px;
            line-height: 1.6;
            color: var(--ink-600);
            margin: 0 0 24px;
          }
          .result-action-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }
          .review-section {
            padding: 32px 36px;
          }
          .review-title {
            font-size: 16px;
            font-weight: 650;
            color: var(--ink-900);
            margin: 0 0 20px;
            letter-spacing: -0.015em;
          }
          .review-list {
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          .review-card {
            padding: 16px 20px;
            background: var(--ink-50);
            border: 1px solid var(--ink-150);
            border-radius: var(--radius);
          }
          .review-q-text {
            font-size: 14px;
            font-weight: 600;
            color: var(--ink-900);
            margin-bottom: 12px;
            line-height: 1.45;
          }
          .q-num {
            color: var(--ink-400);
            margin-right: 4px;
          }
          .review-answers-grid {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 12px;
          }
          .ans-block {
            padding: 8px 12px;
            border-radius: var(--radius-sm);
            font-size: 13px;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .user-ans {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
          }
          .correct-ans {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #166534;
          }
          .ans-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            opacity: 0.8;
          }
          .ans-val {
            font-weight: 500;
          }
          .explanation-block {
            font-size: 12.5px;
            line-height: 1.5;
            color: var(--ink-600);
            border-top: 1px solid var(--ink-150);
            padding-top: 10px;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      {/* Top Header */}
      <div className="quiz-top-bar">
        <div>
          <div className="text-label" style={{ marginBottom: 4 }}>Eight34 ERM Certification</div>
          <h1 className="text-heading-lg" style={{ margin: 0 }}>Sales Qualification Assessment</h1>
        </div>

        <div className="quiz-stats-pill">
          <span className="pill-answered">
            <span className="tabular-nums">{answeredCount}</span> of <span className="tabular-nums">{totalQuestions}</span> answered
          </span>
          <span className="pill-divider" />
          <span className="pill-target">80% required to pass (16/20)</span>
        </div>
      </div>

      {/* Question Stepper / Progress Bar */}
      <div className="quiz-stepper-bar">
        <div className="stepper-track">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id]
            const isCurrent = idx === currentIndex

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`step-tick ${isCurrent ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                title={`Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Question Card */}
      {currentQ && (
        <div className="question-card">
          <div className="card-q-header">
            <div className="q-badge">Question {currentIndex + 1} of {totalQuestions}</div>
            <p className="q-text">{currentQ.question}</p>
          </div>

          <div className="options-stack">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedOption === option
              const letter = String.fromCharCode(65 + optIdx)

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`option-button ${isSelected ? 'selected' : ''}`}
                >
                  <div className="option-letter">{letter}</div>
                  <div className="option-label">{option}</div>
                </button>
              )
            })}
          </div>

          {errorMsg && (
            <div className="quiz-error-callout">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errorMsg}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="card-footer-controls">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="btn btn-outline btn-md"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="btn btn-solid btn-md"
                >
                  Next Question
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending || !isAllAnswered}
                  className="btn btn-solid btn-md"
                  style={{ background: isAllAnswered ? '#166534' : undefined }}
                >
                  {isPending ? 'Scoring Assessment...' : 'Submit Assessment'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .quiz-container {
          max-width: 820px;
          margin: 0 auto;
          padding: 36px 24px 80px;
        }

        .quiz-top-bar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .quiz-stats-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          background: var(--surface);
          border: 1px solid var(--ink-150);
          border-radius: 99px;
          font-size: 12.5px;
        }

        .pill-answered {
          font-weight: 600;
          color: var(--ink-800);
        }

        .pill-divider {
          width: 1px;
          height: 12px;
          background: var(--ink-200);
        }

        .pill-target {
          color: var(--ink-500);
          font-size: 12px;
        }

        .quiz-stepper-bar {
          margin-bottom: 24px;
          background: var(--surface);
          border: 1px solid var(--ink-100);
          border-radius: var(--radius-md);
          padding: 8px 12px;
        }

        .stepper-track {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 2px 0;
        }

        .step-tick {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: 1px solid var(--ink-150);
          background: var(--surface);
          color: var(--ink-500);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition);
          flex-shrink: 0;
        }

        .step-tick:hover {
          border-color: var(--ink-300);
          background: var(--ink-50);
        }

        .step-tick.answered {
          background: #eef2ff;
          border-color: #c7d2fe;
          color: #3730a3;
        }

        .step-tick.active {
          background: var(--e34-accent);
          border-color: var(--e34-accent);
          color: white;
        }

        .question-card {
          background: var(--surface);
          border: 1px solid var(--ink-150);
          border-radius: var(--radius-lg);
          padding: 32px;
          box-shadow: var(--shadow-xs);
        }

        .card-q-header {
          margin-bottom: 24px;
        }

        .q-badge {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-400);
          margin-bottom: 10px;
        }

        .q-text {
          font-size: 17px;
          font-weight: 600;
          line-height: 1.5;
          color: var(--ink-900);
          margin: 0;
          letter-spacing: -0.015em;
        }

        .options-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 28px;
        }

        .option-button {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 18px;
          background: var(--surface);
          border: 1px solid var(--ink-200);
          border-radius: var(--radius);
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: background var(--transition), border-color var(--transition), box-shadow var(--transition);
        }

        .option-button:hover {
          background: var(--ink-50);
          border-color: var(--ink-300);
        }

        .option-button.selected {
          background: #f4f6fb;
          border-color: var(--e34-accent);
          box-shadow: 0 0 0 2px rgb(26 39 68 / 0.12);
        }

        .option-letter {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          background: var(--ink-100);
          color: var(--ink-700);
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .option-button.selected .option-letter {
          background: var(--e34-accent);
          color: white;
        }

        .option-label {
          font-size: 14px;
          line-height: 1.5;
          color: var(--ink-800);
          flex: 1;
        }

        .quiz-error-callout {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius);
          color: #991b1b;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .card-footer-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid var(--ink-100);
        }
      `}</style>
    </div>
  )
}
