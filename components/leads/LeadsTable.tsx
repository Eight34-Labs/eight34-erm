'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, ChevronUp, ChevronDown, Trash2, RotateCcw } from 'lucide-react'
import { cn, formatCurrency, formatDate, LEAD_STATUS_CONFIG } from '@/lib/utils'
import type { Lead } from '@/types'
import { restoreLead } from '@/lib/leads/actions'
import Collapsible from '@/components/ui/Collapsible'

interface LeadsTableProps {
  leads: Lead[]
  total: number
  isAdmin: boolean
  currentUserId: string
  trashedLeads?: Lead[]
}

const STATUSES = ['ALL', 'NEW', 'STILL_INQUIRING', 'WEBSITE_IN_PROGRESS', 'DELIVERY_IN_PROGRESS', 'REJECTED', 'COMPLETED']

export default function LeadsTable({ leads, total, isAdmin, trashedLeads = [] }: LeadsTableProps) {
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

  const handleRestore = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    startTransition(async () => {
      await restoreLead(leadId)
      router.refresh()
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
      {/* Search and Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '28rem' }}>
            <Search className="text-meta" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px' }} />
            <input
              type="text"
              placeholder="Search leads by client name or lead #..."
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

      {/* Main Leads Table */}
      <div className="card-inset" style={{ overflowX: 'auto', position: 'relative' }}>
        {isPending && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '9999px' }} />
          </div>
        )}
        
        {leads.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 0' }}>
            <div className="empty-state-icon"><Search className="text-meta" style={{ width: '24px', height: '24px' }} /></div>
            <h3 className="empty-state-title" style={{ marginTop: '16px' }}>No active leads found</h3>
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
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-700)', fontWeight: 600 }}>
                      {lead.lead_number}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="text-body" style={{ fontWeight: 500 }}>{lead.client_name}</div>
                      <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px', textTransform: 'capitalize' }}>{lead.client_type.toLowerCase()}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--ink-700)' }}>
                      {lead.website_type === 'OTHER' ? lead.website_type_other : lead.website_type}
                    </td>
                    {isAdmin && (
                      <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--ink-700)' }}>
                        {lead.creator?.name || 'Unknown'}
                      </td>
                    )}
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {lead.budget ? formatCurrency(lead.budget) : '—'}
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
      
      {/* Pagination */}
      {leads.length > 0 && (
        <div className="text-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', flexWrap: 'wrap', gap: '12px' }}>
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

      {/* Trashed Leads Collapsible Menu (Admins & Super Admins) */}
      {isAdmin && (
        <div style={{ marginTop: '20px' }}>
          <Collapsible
            asSection
            title={`Trash (${trashedLeads.length} ${trashedLeads.length === 1 ? 'lead' : 'leads'})`}
            defaultOpen={false}
          >
            {trashedLeads.length === 0 ? (
              <div className="text-meta" style={{ textAlign: 'center', padding: '16px 0', fontSize: '0.875rem' }}>
                No leads in trash.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', textAlign: 'left', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--ink-200)' }}>
                      <th style={{ padding: '8px 12px', fontWeight: 500 }}>Lead #</th>
                      <th style={{ padding: '8px 12px', fontWeight: 500 }}>Client</th>
                      <th style={{ padding: '8px 12px', fontWeight: 500 }}>Website Type</th>
                      <th style={{ padding: '8px 12px', fontWeight: 500 }}>Salesperson</th>
                      <th style={{ padding: '8px 12px', fontWeight: 500 }}>Quoted Price</th>
                      <th style={{ padding: '8px 12px', fontWeight: 500, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trashedLeads.map((trashed) => (
                      <tr key={trashed.id} style={{ borderBottom: '1px solid var(--ink-150)' }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink-700)' }}>
                          <Link href={`/leads/${trashed.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {trashed.lead_number}
                          </Link>
                        </td>
                        <td style={{ padding: '8px 12px', fontWeight: 500 }}>
                          <Link href={`/leads/${trashed.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {trashed.client_name}
                          </Link>
                        </td>
                        <td style={{ padding: '8px 12px', color: 'var(--ink-600)' }}>
                          {trashed.website_type === 'OTHER' ? trashed.website_type_other : trashed.website_type}
                        </td>
                        <td style={{ padding: '8px 12px', color: 'var(--ink-600)' }}>
                          {trashed.creator?.name || 'Unknown'}
                        </td>
                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>
                          {trashed.budget ? formatCurrency(trashed.budget) : '—'}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <Link href={`/leads/${trashed.id}`} className="btn btn-sm btn-outline" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                              View
                            </Link>
                            <button
                              type="button"
                              onClick={(e) => handleRestore(trashed.id, e)}
                              className="btn btn-sm btn-outline"
                              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                              disabled={isPending}
                            >
                              <RotateCcw style={{ width: '11px', height: '11px', marginRight: '3px' }} />
                              Restore
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Collapsible>
        </div>
      )}
    </div>
  )
}
