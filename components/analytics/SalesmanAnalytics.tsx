'use client'

import React, { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import { formatCurrency, getInitials } from '@/lib/utils'

interface SalespersonData {
  id: string
  name: string
  email: string | null
  role: string
  commissionRate: number
  totalLeads: number
  completedLeads: number
  activeLeads: number
  totalRevenue: number
  earnedCommission: number
  companyProfitBrought: number
  websiteTypeBreakdown: { type: string; count: number }[]
  weeklyActivity: { week: string; count: number; revenue: number }[]
}

interface SalesmanAnalyticsProps {
  data: {
    salespeople: SalespersonData[]
  }
}

const COLORS = ['#1a2744', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b']

export default function SalesmanAnalytics({ data }: SalesmanAnalyticsProps) {
  const [selectedRepId, setSelectedRepId] = useState<string>('ALL')

  const salespeople = data.salespeople || []
  const selectedRep = salespeople.find((s) => s.id === selectedRepId)

  // Aggregates for All Reps
  const totalRevenueAll = salespeople.reduce((sum, s) => sum + s.totalRevenue, 0)
  const totalCommissionAll = salespeople.reduce((sum, s) => sum + s.earnedCommission, 0)
  const totalCompanyProfitAll = salespeople.reduce((sum, s) => sum + s.companyProfitBrought, 0)
  const totalDealsAll = salespeople.reduce((sum, s) => sum + s.completedLeads, 0)

  // Chart data for All Reps Comparison
  const repComparisonData = salespeople.map((s) => ({
    name: s.name.split(' ')[0],
    fullName: s.name,
    totalRevenue: s.totalRevenue,
    commission: s.earnedCommission,
    companyProfit: s.companyProfitBrought,
    leads: s.totalLeads,
    completed: s.completedLeads,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Controls Bar: Filter by Entire Team or Individual Salesperson */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: 'var(--surface)',
          padding: '14px 18px',
          border: '1px solid var(--ink-200)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--ink-800)' }}>
            Viewing Analytics For:
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className="select"
            style={{ minWidth: '220px' }}
            value={selectedRepId}
            onChange={(e) => setSelectedRepId(e.target.value)}
          >
            <option value="ALL">General Entire Sales Team</option>
            {salespeople.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.name} ({rep.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: ENTIRE SALES TEAM */}
      {selectedRepId === 'ALL' ? (
        <>
          {/* Summary Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            <div className="card" style={{ padding: '16px 20px' }}>
              <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                Total Revenue Generated
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink-900)' }}>
                {formatCurrency(totalRevenueAll)}
              </div>
              <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                Across {totalDealsAll} closed website projects
              </div>
            </div>

            <div className="card" style={{ padding: '16px 20px' }}>
              <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                Company Net Profit
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#166534' }}>
                {formatCurrency(totalCompanyProfitAll)}
              </div>
              <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                Retained by Eight34
              </div>
            </div>

            <div className="card" style={{ padding: '16px 20px' }}>
              <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                Sales Team Commissions Paid
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--e34-accent)' }}>
                {formatCurrency(totalCommissionAll)}
              </div>
              <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                Earned across all reps
              </div>
            </div>

            <div className="card" style={{ padding: '16px 20px' }}>
              <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                Active Sales Team
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink-900)' }}>
                {salespeople.length} Members
              </div>
              <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                Including admins &amp; reps
              </div>
            </div>
          </div>

          {/* Revenue & Commission Comparison Chart */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 className="section-title" style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>
              Revenue &amp; Earnings Leaderboard by Salesperson
            </h3>
            <p className="text-meta" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
              Comparison of total project value and commission payouts per team member.
            </p>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={repComparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ink-100)" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(val), '']}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid var(--ink-200)', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="totalRevenue" name="Total Revenue" fill="var(--e34-accent)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="commission" name="Commission Earned" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Leaderboard Table */}
          <div className="card" style={{ overflowX: 'auto' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ink-150)' }}>
              <h3 className="section-title" style={{ margin: 0, fontSize: '0.9375rem' }}>
                Team Members Performance Summary
              </h3>
            </div>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Salesperson</th>
                  <th>Role</th>
                  <th>Rate</th>
                  <th>Total Leads</th>
                  <th>Closed Deals</th>
                  <th>Revenue Generated</th>
                  <th>Earnings</th>
                  <th>Company Margin</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {salespeople.map((rep) => (
                  <tr key={rep.id} className="clickable" onClick={() => setSelectedRepId(rep.id)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="sidebar-avatar" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                          {getInitials(rep.name)}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{rep.name}</div>
                          <div className="text-meta" style={{ fontSize: '11px' }}>{rep.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline" style={{ fontSize: '11px' }}>{rep.role}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--e34-accent)' }}>
                      {rep.commissionRate}%
                    </td>
                    <td>{rep.totalLeads}</td>
                    <td style={{ fontWeight: 600, color: '#166534' }}>{rep.completedLeads}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(rep.totalRevenue)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--e34-accent)' }}>{formatCurrency(rep.earnedCommission)}</td>
                    <td style={{ fontWeight: 600, color: '#166534' }}>{formatCurrency(rep.companyProfitBrought)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedRepId(rep.id)
                        }}
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* VIEW 2: INDIVIDUAL SALESPERSON DRILLDOWN */
        selectedRep && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Rep Profile Card */}
            <div
              className="card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                borderLeft: '4px solid var(--e34-accent)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--ink-100)',
                    color: 'var(--ink-800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '16px',
                  }}
                >
                  {getInitials(selectedRep.name)}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 2px', color: 'var(--ink-900)' }}>
                    {selectedRep.name}
                  </h2>
                  <div className="text-meta" style={{ fontSize: '0.8125rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span>{selectedRep.email || 'No email'}</span>
                    <span>&middot;</span>
                    <span>Role: {selectedRep.role}</span>
                    <span>&middot;</span>
                    <span>Commission Rate: <strong>{selectedRep.commissionRate}%</strong></span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => setSelectedRepId('ALL')}
              >
                &larr; Back to Team Overview
              </button>
            </div>

            {/* Rep Summary KPIs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
              }}
            >
              <div className="card" style={{ padding: '16px' }}>
                <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                  Total Closed Revenue
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--ink-900)' }}>
                  {formatCurrency(selectedRep.totalRevenue)}
                </div>
                <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                  {selectedRep.completedLeads} completed projects
                </div>
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                  Commissions Earned
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--e34-accent)' }}>
                  {formatCurrency(selectedRep.earnedCommission)}
                </div>
                <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                  At {selectedRep.commissionRate}% rate
                </div>
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                  Company Margin Brought
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#166534' }}>
                  {formatCurrency(selectedRep.companyProfitBrought)}
                </div>
                <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                  Net Eight34 profit
                </div>
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                  Active Pipeline Leads
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--ink-900)' }}>
                  {selectedRep.activeLeads}
                </div>
                <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                  In negotiation &amp; progress
                </div>
              </div>
            </div>

            {/* Rep Charts: Website types + Weekly Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
              {/* Types Brought in */}
              <div className="card" style={{ padding: '20px' }}>
                <h3 className="section-title" style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>
                  Website Types Brought In
                </h3>
                <p className="text-meta" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
                  Category distribution of clients submitted by {selectedRep.name.split(' ')[0]}.
                </p>
                {selectedRep.websiteTypeBreakdown.length > 0 ? (
                  <div style={{ width: '100%', height: 240 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={selectedRep.websiteTypeBreakdown}
                          dataKey="count"
                          nameKey="type"
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          innerRadius={40}
                          paddingAngle={3}
                        >
                          {selectedRep.websiteTypeBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val: any, name: any) => [`${val} websites`, name]}
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid var(--ink-200)', borderRadius: '6px', fontSize: '12px' }}
                        />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-meta" style={{ padding: '36px 0', textAlign: 'center' }}>
                    No leads registered yet for this salesperson.
                  </div>
                )}
              </div>

              {/* Weekly Activity Timeline */}
              <div className="card" style={{ padding: '20px' }}>
                <h3 className="section-title" style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>
                  Weekly Lead Activity &amp; Output
                </h3>
                <p className="text-meta" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
                  Leads registered per weekly cohort.
                </p>
                {selectedRep.weeklyActivity.length > 0 ? (
                  <div style={{ width: '100%', height: 240 }}>
                    <ResponsiveContainer>
                      <BarChart data={selectedRep.weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ink-100)" />
                        <XAxis dataKey="week" fontSize={11} />
                        <YAxis fontSize={11} allowDecimals={false} />
                        <Tooltip
                          formatter={(val: any) => [`${val} leads`, 'Count']}
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid var(--ink-200)', borderRadius: '6px', fontSize: '12px' }}
                        />
                        <Bar dataKey="count" fill="var(--e34-accent)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-meta" style={{ padding: '36px 0', textAlign: 'center' }}>
                    No weekly timeline data available yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
