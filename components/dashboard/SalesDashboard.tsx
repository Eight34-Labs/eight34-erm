'use client'

import React from 'react'
import Link from 'next/link'
import type { User, Lead } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import StatusBadge from './StatusBadge'

interface SalesDashboardProps {
  user: User
  myLeads: Lead[]
  trainingProgress: {
    completedModuleIds: string[]
    totalModules: number
    completionPercent: number
  } | null | undefined
}

export default function SalesDashboard({ user, myLeads, trainingProgress }: SalesDashboardProps) {
  const currentHour = new Date().getHours()
  let greeting = 'Good evening'
  if (currentHour < 12) greeting = 'Good morning'
  else if (currentHour < 18) greeting = 'Good afternoon'

  const todayDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  const isCertified = user.training_completed
  const progressPct = trainingProgress?.completionPercent || 0
  const completedModulesCount = trainingProgress?.completedModuleIds?.length || 0
  const totalModulesCount = trainingProgress?.totalModules || 16

  const totalLeadsCount = myLeads.length
  const activeLeadsCount = myLeads.filter((l) =>
    ['NEW', 'STILL_INQUIRING', 'WEBSITE_IN_PROGRESS', 'DELIVERY_IN_PROGRESS'].includes(l.status)
  ).length
  const completedLeadsCount = myLeads.filter((l) => l.status === 'COMPLETED').length
  const pipelineSum = myLeads
    .filter((l) => !['COMPLETED', 'REJECTED'].includes(l.status))
    .reduce((acc, l) => acc + (l.budget || 0), 0)

  return (
    <div>
      <div className="page-header" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="text-heading-xl" style={{ margin: '0 0 4px' }}>
              {greeting}, {user.name?.split(' ')[0] || 'Sales Rep'}
            </h1>
            <p className="text-body-sm" style={{ margin: 0 }}>
              Welcome back to your Eight34 ERM sales workbench.
            </p>
          </div>
          <div className="text-meta" style={{ alignSelf: 'center' }}>
            {todayDate}
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div style={{
          marginTop: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 1,
          background: 'var(--ink-150)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--ink-150)',
          overflow: 'hidden',
        }}>
          <div style={{ background: 'var(--surface)', padding: '16px 18px' }}>
            <div className="text-label" style={{ fontSize: 10, marginBottom: 6 }}>My Active Pipeline</div>
            <div className="metric-value" style={{ fontSize: 22 }}>
              {formatCurrency(pipelineSum)}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', padding: '16px 18px' }}>
            <div className="text-label" style={{ fontSize: 10, marginBottom: 6 }}>My Total Leads</div>
            <div className="metric-value" style={{ fontSize: 22 }}>
              {totalLeadsCount}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', padding: '16px 18px' }}>
            <div className="text-label" style={{ fontSize: 10, marginBottom: 6 }}>In-Flight Deals</div>
            <div className="metric-value" style={{ fontSize: 22, color: 'var(--ink-700)' }}>
              {activeLeadsCount}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', padding: '16px 18px' }}>
            <div className="text-label" style={{ fontSize: 10, marginBottom: 6 }}>Closed Deals</div>
            <div className="metric-value" style={{ fontSize: 22, color: '#166534' }}>
              {completedLeadsCount}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', padding: '16px 18px' }}>
            <div className="text-label" style={{ fontSize: 10, marginBottom: 6 }}>Certification</div>
            <div style={{ marginTop: 4 }}>
              {isCertified ? (
                <span className="badge badge-status-completed" style={{ fontWeight: 600 }}>
                  <span className="badge-dot" style={{ background: '#166534' }} /> Certified Rep
                </span>
              ) : (
                <span className="badge badge-status-inquiring" style={{ fontWeight: 600 }}>
                  <span className="badge-dot" style={{ background: '#d97706' }} /> In Progress ({progressPct}%)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Training Callout if not certified */}
        {!isCertified && (
          <div style={{
            padding: '20px 24px',
            background: 'var(--surface)',
            border: '1px solid var(--ink-200)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 32,
            boxShadow: 'var(--shadow-xs)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
              <div>
                <div className="text-label" style={{ color: 'var(--e34-accent)', marginBottom: 4 }}>Required Sales Training</div>
                <h3 style={{ fontSize: 16, fontWeight: 650, margin: '0 0 4px', color: 'var(--ink-900)' }}>
                  Complete your curriculum to unlock lead submission
                </h3>
                <p className="text-body-sm" style={{ margin: 0, color: 'var(--ink-600)' }}>
                  You have completed {completedModulesCount} of {totalModulesCount} training modules ({progressPct}%).
                </p>
              </div>
              <Link href="/training" className="btn btn-md btn-solid">
                Continue Training &rarr;
              </Link>
            </div>

            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {/* My Leads Section */}
        <section>
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 className="section-title">My Submitted Leads</h2>
              <span className="text-meta">({myLeads.length})</span>
            </div>
            {isCertified && (
              <Link href="/leads/new" className="btn btn-sm btn-solid">
                + Submit New Lead
              </Link>
            )}
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            {myLeads.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lead #</th>
                    <th>Client</th>
                    <th>Website Type</th>
                    <th>Quoted Price</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeads.map((lead) => (
                    <tr key={lead.id} className="clickable">
                      <td>
                        <Link href={`/leads/${lead.id}`} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink-700)' }}>
                          {lead.lead_number}
                        </Link>
                      </td>
                      <td>
                        <Link href={`/leads/${lead.id}`} style={{ fontWeight: 500, color: 'var(--ink-900)' }}>
                          {lead.client_name}
                        </Link>
                        <div className="text-meta" style={{ fontSize: 11, textTransform: 'capitalize' }}>
                          {lead.client_type.toLowerCase()}
                        </div>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--ink-700)' }}>
                        {lead.website_type === 'OTHER' ? lead.website_type_other : lead.website_type}
                      </td>
                      <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {lead.budget ? formatCurrency(lead.budget) : '—'}
                      </td>
                      <td>
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="text-meta" style={{ textAlign: 'right', fontSize: 12 }}>
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-state-title">No leads submitted yet</div>
                <div className="empty-state-desc" style={{ marginBottom: 16 }}>
                  {isCertified
                    ? 'Start scouting qualified businesses and submit your first lead.'
                    : 'Complete the training curriculum to become certified and submit your first lead.'}
                </div>
                {isCertified ? (
                  <Link href="/leads/new" className="btn btn-md btn-solid">
                    + Submit First Lead
                  </Link>
                ) : (
                  <Link href="/training" className="btn btn-md btn-outline">
                    Go to Training
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
