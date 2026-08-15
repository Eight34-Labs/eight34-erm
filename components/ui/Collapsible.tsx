'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CollapsibleProps {
  title?: string
  children: React.ReactNode
  defaultOpen?: boolean
  maxHeight?: number
  showMoreText?: string
  showLessText?: string
  asSection?: boolean
}

export default function Collapsible({
  title,
  children,
  defaultOpen = false,
  maxHeight = 160,
  showMoreText = 'Show more',
  showLessText = 'Show less',
  asSection = false,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  if (asSection && title) {
    return (
      <div style={{ border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: 'var(--surface)',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ink-800)' }}>
            {title}
          </span>
          <span style={{ color: 'var(--ink-400)', display: 'flex', alignItems: 'center' }}>
            {isOpen ? <ChevronUp style={{ width: '16px', height: '16px' }} /> : <ChevronDown style={{ width: '16px', height: '16px' }} />}
          </span>
        </button>
        {isOpen && (
          <div style={{ padding: '16px', borderTop: '1px solid var(--ink-150)', backgroundColor: 'var(--paper)' }}>
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          maxHeight: isOpen ? 'none' : `${maxHeight}px`,
          overflow: 'hidden',
          position: 'relative',
          transition: 'max-height 0.25s ease',
        }}
      >
        {children}
        {!isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50px',
              background: 'linear-gradient(to bottom, transparent, var(--surface))',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          marginTop: '6px',
          background: 'none',
          border: 'none',
          padding: 0,
          color: 'var(--e34-accent)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {isOpen ? (
          <>
            {showLessText} <ChevronUp style={{ width: '13px', height: '13px' }} />
          </>
        ) : (
          <>
            {showMoreText} <ChevronDown style={{ width: '13px', height: '13px' }} />
          </>
        )}
      </button>
    </div>
  )
}
