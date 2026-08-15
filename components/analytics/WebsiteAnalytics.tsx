'use client'

import React from 'react'
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
import { formatCurrency } from '@/lib/utils'

interface WebsiteAnalyticsProps {
  data: {
    websiteTypes: { name: string; count: number; totalBudget: number; avgBudget: number; completedProfit: number }[]
    statusDistribution: { status: string; label: string; count: number }[]
    categoryPrices: { category: string; min: number; avg: number; max: number; totalVolume: number }[]
    designTagFrequencies: { tag: string; count: number }[]
    revenueTrends: { date: string; revenue: number; leads: number }[]
  }
}

const COLORS = ['#1a2744', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b']

const STATUS_COLORS: Record<string, string> = {
  NEW: '#64748b',
  STILL_INQUIRING: '#f59e0b',
  WEBSITE_IN_PROGRESS: '#6366f1',
  DELIVERY_IN_PROGRESS: '#ea580c',
  REJECTED: '#ef4444',
  COMPLETED: '#10b981',
}

export default function WebsiteAnalytics({ data }: WebsiteAnalyticsProps) {
  const totalVolume = data.websiteTypes.reduce((sum, t) => sum + t.count, 0)
  const totalCompletedProfit = data.websiteTypes.reduce((sum, t) => sum + t.completedProfit, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top summary metrics strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
            Total Website Projects
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink-900)' }}>
            {totalVolume}
          </div>
          <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
            Across all active categories
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
            Total Production Net Profit
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#166534' }}>
            {formatCurrency(totalCompletedProfit)}
          </div>
          <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
            Delivered &amp; completed websites
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
            Most Popular Classification
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--e34-accent)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {data.websiteTypes[0]?.name || 'N/A'}
          </div>
          <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
            {data.websiteTypes[0]?.count || 0} builds requested
          </div>
        </div>
      </div>

      {/* Grid of Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Chart 1: Website Types Breakdown */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 className="section-title" style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>
            Website Types &amp; Classifications
          </h3>
          <p className="text-meta" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
            Distribution of website formats requested by prospects.
          </p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.websiteTypes}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {data.websiteTypes.map((entry, index) => (
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
        </div>

        {/* Chart 2: Pipeline Status Distribution */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 className="section-title" style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>
            Website Pipeline Statuses
          </h3>
          <p className="text-meta" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
            Current stage of all registered website leads.
          </p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={data.statusDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ink-100)" />
                <XAxis dataKey="label" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} leads`, 'Count']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid var(--ink-200)', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.statusDistribution.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#1a2744'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Category Price Ranges & Volume */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 className="section-title" style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>
            Average &amp; Max Prices per Category ($)
          </h3>
          <p className="text-meta" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
            Financial quote comparisons across categories.
          </p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={data.categoryPrices} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ink-100)" />
                <XAxis dataKey="category" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis fontSize={11} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), '']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid var(--ink-200)', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="avg" name="Avg Price" fill="var(--e34-accent)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="max" name="Max Quoted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Common Aesthetic Design Tags */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 className="section-title" style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>
            Aesthetic Tags &amp; Style Trends
          </h3>
          <p className="text-meta" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
            Most requested design tags and visual styles.
          </p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={data.designTagFrequencies.slice(0, 7)} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--ink-100)" />
                <XAxis type="number" fontSize={11} allowDecimals={false} />
                <YAxis type="category" dataKey="tag" fontSize={11} width={80} />
                <Tooltip
                  formatter={(val: any) => [`${val} requests`, 'Tags']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid var(--ink-200)', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Trends Line Chart */}
      {data.revenueTrends.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 className="section-title" style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>
            Monthly Website Intake &amp; Revenue Trends
          </h3>
          <p className="text-meta" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
            Completed project revenue and total lead volume month-over-month.
          </p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={data.revenueTrends} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ink-100)" />
                <XAxis dataKey="date" fontSize={11} />
                <YAxis yAxisId="left" fontSize={11} tickFormatter={(v) => `$${v}`} />
                <YAxis yAxisId="right" orientation="right" fontSize={11} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any, name: any) => [name === 'Revenue' ? formatCurrency(val) : val, name]}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid var(--ink-200)', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#166534" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="leads" name="Leads Intake" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
