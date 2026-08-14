'use client'

import React from 'react'
import Link from 'next/link'
import type { User, Lead, DashboardMetrics } from '@/types'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import StatusBadge from './StatusBadge'
import TeamManagement from './TeamManagement'

interface AdminDashboardProps {
  user: User
  metrics: DashboardMetrics | null
  recentLeads: Lead[]
  team: User[]
}

export default function AdminDashboard({ user, metrics, recentLeads, team }: AdminDashboardProps) {
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

  const isAdminOrSuper = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'

  return (
    <div>
      <div className="page-header" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="text-heading-xl" style={{ margin: '0 0 4px' }}>
              {greeting}, {user.name?.split(' ')[0] || 'Admin'}
            </h1>
            <p className="text-body-sm" style={{ margin: 0 }}>
              Here is what is happening across the Eight34 sales and revenue pipeline.
            </p>
          </div>
          <div className="text-meta" style={{ alignSelf: 'center' }}>
            {todayDate}
          </div>
        </div>

        {/* Metrics Horizontal Strip */}
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
            <div className="text-label" style={{ fontSize: 10, marginBottom: 6 }}>Pipeline Value</div>
            <div className="metric-value" style={{ fontSize: 22 }}>
              {formatCurrency(metrics?.pipeline_value || 0)}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', padding: '16px 18px' }}>
            <div className="text-label" style={{ fontSize: 10, marginBottom: 6 }}>Completed Rev</div>
            <div className="metric-value" style={{ fontSize: 22, color: '#166534' }}>
              {formatCurrency(metrics?.completed_revenue || 0)}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', padding: '16px 18px' }}>
            <div className="text-label" style={{ fontSize: 10, marginBottom: 6 }}>Total Leads</div>
            <div className="metric-value" style={{ fontSize: 22 }}>
              {metrics?.total_leads || 0}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', padding: '16px 18px' }}>
            <div className="text-label" style={{ fontSize: 10, marginBottom: 6 }}>Active In-Flight</div>
            <div className="metric-value" style={{ fontSize: 22, color: 'var(--ink-700)' }}>
              {metrics?.active_leads || 0}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', padding: '16px 18px' }}>
            <div className="text-label" style={{ fontSize: 10, marginBottom: 6 }}>Conversion</div>
            <div className="metric-value" style={{ fontSize: 22 }}>
              {metrics?.conversion_rate || 0}%
            </div>
          </div>

          <div style={{ background: 'var(--surface)', padding: '16px 18px' }}>
            <div className="text-label" style={{ fontSize: 10, marginBottom: 6 }}>New Unreviewed</div>
            <div className="metric-value" style={{ fontSize: 22, color: '#1d4ed8' }}>
              {metrics?.new_leads || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Recent Leads Section */}
        <section style={{ marginBottom: 36 }}>
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 className="section-title">Recent Leads</h2>
              <span className="text-meta">({recentLeads.length})</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Link href="/leads/new" className="btn btn-sm btn-solid">
                + New Lead
              </Link>
              <Link href="/leads" className="btn btn-sm btn-outline">
                View All Leads &rarr;
              </Link>
            </div>
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            {recentLeads.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lead #</th>
                    <th>Client</th>
                    <th>Website Type</th>
                    <th>Salesperson</th>
                    <th>Quoted Price</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
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
                          {lead.client_type.toLowerCase()} {lead.business_type ? `· ${lead.business_type}` : ''}
                        </div>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--ink-700)' }}>
                        {lead.website_type === 'OTHER' ? lead.website_type_other : lead.website_type}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="sidebar-avatar" style={{ width: 20, height: 20, fontSize: 9 }}>
                            {lead.creator?.name ? getInitials(lead.creator.name) : '—'}
                          </span>
                          <span style={{ fontSize: 13 }}>{lead.creator?.name || 'Unassigned'}</span>
                        </div>
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
                <div className="empty-state-title">No leads in pipeline yet</div>
                <div className="empty-state-desc">
                  When sales reps submit qualified leads, they will populate here with status and commercial details.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Team Management Panel (for Admin/Super Admin) */}
        {isAdminOrSuper && (
          <section>
            <div className="section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 className="section-title">Sales Team &amp; Access Control</h2>
                <span className="text-meta">({team.length} members)</span>
              </div>
            </div>

            <TeamManagement team={team} currentUser={user} />
          </section>
        )}
      </div>
    </div>
  )
}
