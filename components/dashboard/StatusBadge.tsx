'use client'

import React from 'react'
import type { LeadStatus } from '@/types'
import { LEAD_STATUS_CONFIG } from '@/lib/utils'

interface StatusBadgeProps {
  status: LeadStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = LEAD_STATUS_CONFIG[status] || {
    label: status,
    className: 'badge-status-new',
    dotClassName: 'bg-slate-500',
  }

  return (
    <span className={`badge ${config.className}`}>
      <span className={`badge-dot ${config.dotClassName}`} />
      {config.label}
    </span>
  )
}
