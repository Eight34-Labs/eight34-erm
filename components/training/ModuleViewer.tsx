'use client'

import { useState, useTransition, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { TrainingModuleData } from '@/lib/training/modules'
import { markModuleComplete } from '@/lib/training/actions'

interface ModuleViewerProps {
  currentModule: TrainingModuleData
  allModules: Array<{
    id: string
    module_number: number
    title: string
  }>
  completedModuleIds: string[]
  isCertified: boolean
}

export default function ModuleViewer({
  currentModule,
  allModules,
  completedModuleIds: initialCompletedIds,
  isCertified,
}: ModuleViewerProps) {
  const router = useRouter()
  const [completedIds, setCompletedIds] = useState<string[]>(initialCompletedIds)
  const [isPending, startTransition] = useTransition()
  const hasTriggeredRef = useRef(false)
  const bottomSentinelRef = useRef<HTMLDivElement>(null)

  const modNumStr = String(currentModule.module_number)
  const targetModule = allModules.find((m) => m.module_number === currentModule.module_number)
  const moduleId = targetModule?.id || modNumStr

  const isCompleted =
    completedIds.includes(modNumStr) ||
    completedIds.includes(moduleId) ||
    completedIds.includes(String(currentModule.module_number))

  const currentIndex = allModules.findIndex((m) => m.module_number === currentModule.module_number)
  const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null
  const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null

  const triggerCompletion = useCallback(() => {
    if (hasTriggeredRef.current || isCompleted) return
    hasTriggeredRef.current = true

    // Optimistically update local state
    setCompletedIds((prev) => Array.from(new Set([...prev, modNumStr, moduleId])))

    startTransition(async () => {
      const res = await markModuleComplete(currentModule.module_number)
      if (res.success) {
        router.refresh()
      }
    })
  }, [isCompleted, modNumStr, moduleId, currentModule.module_number, router, startTransition])

  // Scroll to bottom detection
  useEffect(() => {
    hasTriggeredRef.current = isCompleted
    if (isCompleted) return

    // 1. Check if content fits in viewport without scrolling
    const checkViewportFit = () => {
      if (typeof window === 'undefined') return
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight
      if (scrollHeight <= clientHeight + 60) {
        triggerCompletion()
      }
    }

    checkViewportFit()

    // 2. IntersectionObserver on bottom sentinel
    const sentinel = bottomSentinelRef.current
    let observer: IntersectionObserver | null = null

    if (sentinel && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              triggerCompletion()
            }
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px 100px 0px' }
      )
      observer.observe(sentinel)
    }

    // 3. Fallback window scroll listener
    const handleScroll = () => {
      if (typeof window === 'undefined') return
      const scrollPosition = window.innerHeight + window.scrollY
      const threshold = document.documentElement.scrollHeight - 120
      if (scrollPosition >= threshold) {
        triggerCompletion()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (observer && sentinel) observer.unobserve(sentinel)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [currentModule.module_number, isCompleted, triggerCompletion])

  const completedCount = allModules.filter(
    (m) => completedIds.includes(String(m.module_number)) || completedIds.includes(m.id)
  ).length
  const totalCount = allModules.length
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="training-layout">
      {/* Left Sidebar Curriculum Navigation */}
      <aside className="training-sidebar">
        <div className="training-sidebar-header">
          <Link href="/training" className="training-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All Modules
          </Link>
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="text-label" style={{ fontSize: 10 }}>Curriculum Progress</span>
              <span className="text-meta tabular-nums" style={{ fontSize: 11 }}>{progressPct}%</span>
            </div>
            <div className="progress-bar" style={{ height: 3 }}>
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        <nav className="training-nav-list">
          {allModules.map((mod) => {
            const isCurrent = mod.module_number === currentModule.module_number
            const isDone = completedIds.includes(mod.id) || completedIds.includes(String(mod.module_number))

            return (
              <Link
                key={mod.id || mod.module_number}
                href={`/training/${mod.module_number}`}
                className={`training-nav-item ${isCurrent ? 'active' : ''}`}
              >
                <div className={`nav-num-badge ${isDone ? 'done' : isCurrent ? 'current' : ''}`}>
                  {isDone ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    String(mod.module_number).padStart(2, '0')
                  )}
                </div>
                <span className="nav-item-title">{mod.title}</span>
              </Link>
            )
          })}
        </nav>

        <div className="training-sidebar-footer">
          <Link
            href="/training/quiz"
            className={`btn btn-sm ${progressPct >= 100 ? 'btn-solid' : 'btn-outline'}`}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isCertified ? 'View Certification' : 'Take Quiz Assessment'}
          </Link>
        </div>
      </aside>

      {/* Main Module Content */}
      <main className="training-content-area">
        <div className="module-container">
          {/* Header */}
          <div className="module-header-block">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="module-meta-tag">
                Module {String(currentModule.module_number).padStart(2, '0')} of {totalCount}
              </div>
              {isCompleted && (
                <div className="auto-complete-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Completed
                </div>
              )}
            </div>
            <h1 className="module-title">{currentModule.title}</h1>
            <p className="module-overview">{currentModule.content.overview}</p>
          </div>

          {/* Sections */}
          <div className="module-sections">
            {currentModule.content.sections.map((section, sIdx) => (
              <section key={sIdx} className="content-section">
                <h2 className="section-heading">{section.heading}</h2>
                <p className="section-body">{section.body}</p>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="section-bullets">
                    {section.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                )}

                {section.callout && (
                  <div className={`callout-box callout-${section.callout.type}`}>
                    <div className="callout-icon">
                      {section.callout.type === 'warning' ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      ) : section.callout.type === 'tip' ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                      )}
                    </div>
                    <div className="callout-text">{section.callout.text}</div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Key Takeaways */}
          {currentModule.content.key_takeaways && currentModule.content.key_takeaways.length > 0 && (
            <div className="takeaways-card">
              <div className="takeaways-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--e34-accent)" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Key Takeaways
              </div>
              <ul className="takeaways-list">
                {currentModule.content.key_takeaways.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Sentinel for Scroll-to-Bottom Trigger */}
          <div ref={bottomSentinelRef} style={{ height: 4, width: '100%', pointerEvents: 'none' }} />

          {/* Navigation Controls */}
          <div className="module-footer-nav">
            <div>
              {prevModule ? (
                <Link href={`/training/${prevModule.module_number}`} className="btn btn-outline btn-md">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Previous: Module {String(prevModule.module_number).padStart(2, '0')}
                </Link>
              ) : (
                <div />
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {/* Status Indicator */}
              {isCompleted ? (
                <span className="module-done-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Completed
                </span>
              ) : (
                <span className="module-reading-chip">
                  Scroll to bottom to complete
                </span>
              )}

              {nextModule ? (
                <Link href={`/training/${nextModule.module_number}`} className="btn btn-solid btn-md">
                  Next Module
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link href="/training/quiz" className="btn btn-solid btn-md" style={{ background: '#166534' }}>
                  Proceed to Assessment
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .training-layout {
          display: flex;
          min-height: 100vh;
        }

        .training-sidebar {
          width: 280px;
          flex-shrink: 0;
          background: var(--surface);
          border-right: 1px solid var(--ink-100);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .training-sidebar-header {
          padding: 16px 18px 12px;
          border-bottom: 1px solid var(--ink-100);
        }

        .training-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: var(--ink-500);
          text-decoration: none;
        }
        .training-back-link:hover {
          color: var(--ink-900);
        }

        .training-nav-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .training-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 10px;
          border-radius: var(--radius);
          text-decoration: none;
          color: var(--ink-600);
          font-size: 13px;
          font-weight: 450;
          transition: background var(--transition), color var(--transition);
        }

        .training-nav-item:hover {
          background: var(--ink-50);
          color: var(--ink-900);
        }

        .training-nav-item.active {
          background: var(--ink-100);
          color: var(--ink-900);
          font-weight: 600;
        }

        .nav-num-badge {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: var(--ink-100);
          color: var(--ink-500);
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-num-badge.done {
          background: var(--status-completed-bg);
          color: var(--status-completed-text);
        }

        .nav-num-badge.current {
          background: var(--e34-accent);
          color: white;
        }

        .nav-item-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .training-sidebar-footer {
          padding: 12px 14px;
          border-top: 1px solid var(--ink-100);
          background: var(--surface);
        }

        .training-content-area {
          flex: 1;
          padding: 40px 48px 80px;
          max-width: 860px;
        }

        .module-header-block {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--ink-150);
        }

        .module-meta-tag {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-400);
        }

        .module-title {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--ink-900);
          margin: 0 0 12px;
          line-height: 1.25;
        }

        .module-overview {
          font-size: 15px;
          line-height: 1.6;
          color: var(--ink-600);
          margin: 0;
        }

        .auto-complete-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          background: var(--status-completed-bg);
          border: 1px solid var(--status-completed-border);
          font-size: 11.5px;
          font-weight: 600;
          color: var(--status-completed-text);
        }

        .module-done-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 20px;
          background: var(--status-completed-bg);
          border: 1px solid var(--status-completed-border);
          color: var(--status-completed-text);
          font-size: 12.5px;
          font-weight: 600;
        }

        .module-reading-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 20px;
          background: var(--ink-50);
          border: 1px solid var(--ink-150);
          color: var(--ink-500);
          font-size: 12px;
          font-weight: 500;
        }

        .module-sections {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .content-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .section-heading {
          font-size: 17px;
          font-weight: 650;
          letter-spacing: -0.02em;
          color: var(--ink-900);
          margin: 0;
        }

        .section-body {
          font-size: 14.5px;
          line-height: 1.65;
          color: var(--ink-700);
          margin: 0;
        }

        .section-bullets {
          margin: 4px 0 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 14px;
          color: var(--ink-700);
          line-height: 1.5;
        }

        .callout-box {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius);
          margin-top: 8px;
          font-size: 13.5px;
          line-height: 1.5;
        }

        .callout-info {
          background: var(--ink-50);
          border: 1px solid var(--ink-150);
          color: var(--ink-800);
        }

        .callout-tip {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .callout-warning {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
        }

        .callout-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .takeaways-card {
          margin-top: 40px;
          padding: 20px 24px;
          background: var(--surface);
          border: 1px solid var(--ink-150);
          border-radius: var(--radius-md);
        }

        .takeaways-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 650;
          color: var(--ink-900);
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .takeaways-list {
          margin: 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13.5px;
          color: var(--ink-700);
          line-height: 1.5;
        }

        .module-footer-nav {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid var(--ink-150);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        @media (max-width: 1024px) {
          .training-sidebar {
            display: none;
          }
          .training-content-area {
            padding: 24px 20px 60px;
          }
        }
      `}</style>
    </div>
  )
}
