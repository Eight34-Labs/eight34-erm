'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, ChevronUp, ChevronDown } from 'lucide-react'
import { cn, formatCurrency, formatDate, LEAD_STATUS_CONFIG } from '@/lib/utils'
import type { Lead } from '@/types'

interface LeadsTableProps {
  leads: Lead[]
  total: number
  isAdmin: boolean
  currentUserId: string
}

const STATUSES = ['ALL', 'NEW', 'STILL_INQUIRING', 'WEBSITE_IN_PROGRESS', 'DELIVERY_IN_PROGRESS', 'REJECTED', 'COMPLETED']

export default function LeadsTable({ leads, total, isAdmin }: LeadsTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter('search', searchQuery || null)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'ALL') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key !== 'page' && key !== 'sort' && key !== 'order') {
      params.delete('page')
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const currentStatus = searchParams.get('status') || 'ALL'
  const currentSort = searchParams.get('sort') || 'created_at'
  const currentOrder = searchParams.get('order') || 'desc'
  const currentClientType = searchParams.get('client_type') || 'ALL'
  const perPage = 20
  const currentPage = Number(searchParams.get('page') || 1)

  const handleSort = (field: string) => {
    const isAsc = currentSort === field && currentOrder === 'asc'
    updateFilter('order', isAsc ? 'desc' : 'asc')
    updateFilter('sort', field)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '28rem' }}>
            <Search className="text-meta" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px' }} />
            <input
              type="text"
              placeholder="Search leads..."
              className="input"
              style={{ width: '100%', paddingLeft: '36px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="select"
            style={{ width: '12rem' }}
            value={currentClientType}
            onChange={(e) => updateFilter('client_type', e.target.value)}
          >
            <option value="ALL">All Client Types</option>
            <option value="PERSONAL">Personal</option>
            <option value="BUSINESS">Business</option>
            <option value="SAAS">SaaS</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {STATUSES.map(status => {
            const isActive = currentStatus === status
            return (
              <button
                key={status}
                onClick={() => updateFilter('status', status)}
                className="badge"
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--e34-accent)' : 'var(--surface)',
                  color: isActive ? '#fff' : 'var(--ink-700)',
                  border: isActive ? 'none' : '1px solid var(--ink-200)'
                }}
              >
                {status === 'ALL' ? 'All Statuses' : LEAD_STATUS_CONFIG[status as keyof typeof LEAD_STATUS_CONFIG]?.label || status}
              </button>
            )
          })}
        </div>
      </div>

      <div className="card-inset" style={{ overflowX: 'auto', position: 'relative' }}>
        {isPending && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '9999px' }} />
          </div>
        )}
        
        {leads.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 0' }}>
            <div className="empty-state-icon"><Search className="text-meta" style={{ width: '24px', height: '24px' }} /></div>
            <h3 className="empty-state-title" style={{ marginTop: '16px' }}>No leads found</h3>
            <p className="empty-state-desc">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <table className="data-table" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface)' }}>
                <th className="text-meta" style={{ padding: '12px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Lead #
                    {currentSort === 'created_at' && (currentOrder === 'asc' ? <ChevronUp style={{ width: '12px', height: '12px' }} /> : <ChevronDown style={{ width: '12px', height: '12px' }} />)}
                  </div>
                </th>
                <th className="text-meta" style={{ padding: '12px 16px', fontWeight: 500 }}>Client</th>
                <th className="text-meta" style={{ padding: '12px 16px', fontWeight: 500 }}>Website Type</th>
                {isAdmin && <th className="text-meta" style={{ padding: '12px 16px', fontWeight: 500 }}>Salesperson</th>}
                <th className="text-meta" style={{ padding: '12px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleSort('budget')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Price
                    {currentSort === 'budget' && (currentOrder === 'asc' ? <ChevronUp style={{ width: '12px', height: '12px' }} /> : <ChevronDown style={{ width: '12px', height: '12px' }} />)}
                  </div>
                </th>
                <th className="text-meta" style={{ padding: '12px 16px', fontWeight: 500 }}>Status</th>
                <th className="text-meta" style={{ padding: '12px 16px', fontWeight: 500, textAlign: 'right' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const statusConfig = LEAD_STATUS_CONFIG[lead.status] || { label: lead.status, className: 'badge' }
                return (
                  <tr 
                    key={lead.id} 
                    style={{ borderBottom: '1px solid var(--surface)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onClick={() => router.push(`/leads/${lead.id}`)}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--ink-600)' }}>
                      {lead.lead_number}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="text-body" style={{ fontWeight: 500 }}>{lead.client_name}</div>
                      <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px', textTransform: 'capitalize' }}>{lead.client_type.toLowerCase()}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--ink-700)' }}>{lead.website_type}</td>
                    {isAdmin && (
                      <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--ink-700)' }}>
                        {lead.creator?.name || 'Unknown'}
                      </td>
                    )}
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 500 }}>
                      {lead.budget ? formatCurrency(lead.budget) : '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={cn("badge", statusConfig.className)}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="text-meta" style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.875rem' }}>
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      
      {leads.length > 0 && (
        <div className="text-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
          <div>Showing {leads.length} of {total} results</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-sm btn-outline" 
              disabled={currentPage <= 1}
              onClick={() => updateFilter('page', String(currentPage - 1))}
            >
              Previous
            </button>
            <button 
              className="btn btn-sm btn-outline"
              disabled={currentPage * perPage >= total}
              onClick={() => updateFilter('page', String(currentPage + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
