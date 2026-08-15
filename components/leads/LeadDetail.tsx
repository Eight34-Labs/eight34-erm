'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building, User, Globe, Target, Palette, 
  DollarSign, Clock, Calendar, CheckCircle,
  MessageSquare, Hash, ArrowRight, UserCircle,
  Link as LinkIcon, Edit3, Trash2, RotateCcw,
  CheckSquare, Square, AlertCircle, PieChart
} from 'lucide-react'
import { cn, formatCurrency, formatDate, LEAD_STATUS_CONFIG, formatRelativeTime, getInitials } from '@/lib/utils'
import { updateLeadStatus, updateLeadCompletion, toggleLeadPayment, trashLead, restoreLead } from '@/lib/leads/actions'
import type { Lead, User as UserType, LeadStatus, LeadStatusHistory } from '@/types'
import NoteModal from '@/components/ui/NoteModal'
import CostEntryModal from '@/components/ui/CostEntryModal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import EditLeadModal from '@/components/leads/EditLeadModal'
import Collapsible from '@/components/ui/Collapsible'

interface LeadDetailProps {
  lead: Lead & { history: LeadStatusHistory[] }
  currentUser: UserType
}

const STATUS_OPTIONS: LeadStatus[] = [
  'NEW',
  'STILL_INQUIRING',
  'WEBSITE_IN_PROGRESS',
  'DELIVERY_IN_PROGRESS',
  'REJECTED',
  'COMPLETED'
]

export default function LeadDetail({ lead, currentUser }: LeadDetailProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [statusError, setStatusError] = useState('')

  // Modals state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<LeadStatus | null>(null)
  const [isCostModalOpen, setIsCostModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isTrashConfirmOpen, setIsTrashConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)

  // Local state for payment checks
  const [commissionPaid, setCommissionPaid] = useState(Boolean(lead.commission_paid))
  const [companyPaid, setCompanyPaid] = useState(Boolean(lead.company_paid))
  const [costsPaid, setCostsPaid] = useState(Boolean(lead.costs_paid))

  const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN'
  const statusConfig = LEAD_STATUS_CONFIG[lead.status] || { label: lead.status, className: 'badge' }

  // Salesperson and Commission Calculations
  const salesperson = lead.creator
  const commissionRate = salesperson?.commission_rate !== undefined ? Number(salesperson.commission_rate) : 50
  const budget = lead.budget || 0
  const costAmount = lead.cost_amount || 0
  const netProfit = Math.max(0, budget - costAmount)
  const salespersonCommission = (netProfit * commissionRate) / 100
  const companyProfit = netProfit - salespersonCommission

  // Status Change flow
  const initiateStatusChange = (newStatus: LeadStatus) => {
    if (newStatus === lead.status) return
    setStatusError('')
    setPendingStatus(newStatus)

    if (newStatus === 'COMPLETED') {
      setIsCostModalOpen(true)
    } else {
      setIsNoteModalOpen(true)
    }
  }

  const handleNoteSubmit = (note: string) => {
    if (!pendingStatus) return
    setIsNoteModalOpen(false)
    startTransition(async () => {
      try {
        const result = await updateLeadStatus(lead.id, pendingStatus, note || undefined)
        if (!result.success) {
          setStatusError(result.error || 'Failed to update status')
        } else {
          router.refresh()
        }
      } catch (err) {
        setStatusError('Failed to update status')
      } finally {
        setPendingStatus(null)
      }
    })
  }

  const handleCostSubmit = (costs: number, note?: string) => {
    setIsCostModalOpen(false)
    startTransition(async () => {
      try {
        const result = await updateLeadCompletion(lead.id, costs, note)
        if (!result.success) {
          setStatusError(result.error || 'Failed to complete lead')
        } else {
          router.refresh()
        }
      } catch (err) {
        setStatusError('Failed to complete lead')
      } finally {
        setPendingStatus(null)
      }
    })
  }

  const handleTogglePayment = (field: 'commission_paid' | 'company_paid' | 'costs_paid', currentVal: boolean) => {
    if (!isAdmin) return
    const newVal = !currentVal
    if (field === 'commission_paid') setCommissionPaid(newVal)
    if (field === 'company_paid') setCompanyPaid(newVal)
    if (field === 'costs_paid') setCostsPaid(newVal)

    startTransition(async () => {
      await toggleLeadPayment(lead.id, field, newVal)
      router.refresh()
    })
  }

  const handleTrashLead = () => {
    setIsTrashConfirmOpen(false)
    startTransition(async () => {
      const res = await trashLead(lead.id)
      if (res.success) {
        router.push('/leads')
        router.refresh()
      } else {
        setStatusError(res.error || 'Failed to trash lead')
      }
    })
  }

  const handleRestoreLead = () => {
    setIsRestoreConfirmOpen(false)
    startTransition(async () => {
      const res = await restoreLead(lead.id)
      if (res.success) {
        router.refresh()
      } else {
        setStatusError(res.error || 'Failed to restore lead')
      }
    })
  }

  return (
    <div className="page-content" style={{ maxWidth: '80rem', margin: '0 auto' }}>
      {/* Trashed Banner */}
      {lead.is_trashed && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b', fontSize: '0.875rem' }}>
            <Trash2 style={{ width: '16px', height: '16px' }} />
            <span>This lead has been marked as <strong>Trash</strong> and is hidden from main views.</span>
          </div>
          {isAdmin && (
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => setIsRestoreConfirmOpen(true)}
              disabled={isPending}
            >
              <RotateCcw style={{ width: '12px', height: '12px', marginRight: '4px' }} />
              Restore Lead
            </button>
          )}
        </div>
      )}

      {/* Main Header */}
      <header
        style={{
          marginBottom: '24px',
          padding: '20px 24px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--ink-200)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--ink-700)',
                  backgroundColor: 'var(--paper)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--ink-150)',
                }}
              >
                #{lead.lead_number}
              </span>
              <span className={cn('badge', statusConfig.className)}>
                {statusConfig.label}
              </span>
              {lead.is_trashed && (
                <span className="badge badge-status-rejected">Trash</span>
              )}
            </div>
            
            <h1
              className="text-heading-xl"
              style={{
                marginBottom: '8px',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {lead.client_name}
            </h1>

            <div
              className="text-meta"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ textTransform: 'capitalize' }}>{lead.client_type.toLowerCase()}</span>
              {lead.business_type && (
                <>
                  <span>&middot;</span>
                  <span>{lead.business_type === 'OTHER' ? lead.business_type_other : lead.business_type}</span>
                </>
              )}
              <span>&middot;</span>
              <span>{lead.website_type === 'OTHER' ? lead.website_type_other : lead.website_type}</span>
            </div>
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '14px',
              minWidth: '220px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isAdmin && (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => setIsEditModalOpen(true)}
                    disabled={isPending}
                    title="Edit lead info"
                  >
                    <Edit3 style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                    Edit Lead
                  </button>

                  {!lead.is_trashed ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      style={{ color: '#991b1b', borderColor: 'var(--ink-200)' }}
                      onClick={() => setIsTrashConfirmOpen(true)}
                      disabled={isPending}
                      title="Move to trash"
                    >
                      <Trash2 style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                      Trash
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => setIsRestoreConfirmOpen(true)}
                      disabled={isPending}
                    >
                      <RotateCcw style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                      Restore
                    </button>
                  )}
                </>
              )}
            </div>

            {lead.budget && (
              <div style={{ textAlign: 'right' }}>
                <div className="text-meta" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>
                  Quoted Budget
                </div>
                <div className="text-heading-lg" style={{ color: 'var(--e34-accent)' }}>
                  {formatCurrency(lead.budget)}
                </div>
              </div>
            )}
            
            {isAdmin && (
              <div style={{ width: '100%', maxWidth: '220px' }}>
                <label className="text-meta" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>
                  Update Status
                </label>
                <select 
                  className="select"
                  style={{ width: '100%' }}
                  value={lead.status}
                  onChange={(e) => initiateStatusChange(e.target.value as LeadStatus)}
                  disabled={isPending}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {LEAD_STATUS_CONFIG[status]?.label || status}
                    </option>
                  ))}
                </select>
                {statusError && <p className="field-error" style={{ marginTop: '4px' }}>{statusError}</p>}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Pricing Calculator & Costs Map on COMPLETED status */}
      {lead.status === 'COMPLETED' && (
        <section
          className="card"
          style={{
            marginBottom: '24px',
            padding: '22px 24px',
            backgroundColor: 'var(--surface)',
            border: '1.5px solid var(--e34-accent)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart style={{ width: '20px', height: '20px', color: 'var(--e34-accent)' }} />
              <h2 className="section-title" style={{ margin: 0 }}>
                Lead Pricing &amp; Costs Breakdown
              </h2>
            </div>
            <div className="text-meta" style={{ fontSize: '0.8125rem' }}>
              Salesperson: <strong>{salesperson?.name || 'Sales Rep'}</strong> ({commissionRate}% commission rate)
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
            }}
          >
            {/* Total Budget Card */}
            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--paper)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--ink-200)',
              }}
            >
              <div className="metric-label" style={{ marginBottom: '4px' }}>
                Quoted Website Price
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--ink-900)' }}>
                {formatCurrency(budget)}
              </div>
              <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                Total collected from client
              </div>
            </div>

            {/* Production Costs Card */}
            <div
              style={{
                padding: '16px',
                backgroundColor: costsPaid ? 'var(--ink-50)' : 'var(--surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--ink-200)',
                opacity: costsPaid ? 0.6 : 1,
                transition: 'opacity var(--transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div className="metric-label">Production Costs</div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleTogglePayment('costs_paid', costsPaid)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: costsPaid ? '#166534' : 'var(--ink-400)',
                      fontWeight: 600,
                    }}
                    title="Toggle paid"
                  >
                    {costsPaid ? <CheckSquare style={{ width: '15px', height: '15px' }} /> : <Square style={{ width: '15px', height: '15px' }} />}
                    {costsPaid ? 'Paid' : 'Mark Paid'}
                  </button>
                )}
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#dc2626' }}>
                {formatCurrency(costAmount)}
              </div>
              <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                Set on completion {costsPaid && '(Settled)'}
              </div>
            </div>

            {/* Company Profit Card */}
            <div
              style={{
                padding: '16px',
                backgroundColor: companyPaid ? 'var(--ink-50)' : 'var(--surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--ink-200)',
                opacity: companyPaid ? 0.6 : 1,
                transition: 'opacity var(--transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div className="metric-label">Company Portion</div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleTogglePayment('company_paid', companyPaid)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: companyPaid ? '#166534' : 'var(--ink-400)',
                      fontWeight: 600,
                    }}
                    title="Toggle paid"
                  >
                    {companyPaid ? <CheckSquare style={{ width: '15px', height: '15px' }} /> : <Square style={{ width: '15px', height: '15px' }} />}
                    {companyPaid ? 'Paid' : 'Mark Paid'}
                  </button>
                )}
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#166534' }}>
                {formatCurrency(companyProfit)}
              </div>
              <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                Retained by Eight34 {companyPaid && '(Transferred)'}
              </div>
            </div>

            {/* Salesperson Commission Card */}
            <div
              style={{
                padding: '16px',
                backgroundColor: commissionPaid ? 'var(--ink-50)' : 'var(--surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--ink-200)',
                opacity: commissionPaid ? 0.6 : 1,
                transition: 'opacity var(--transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div className="metric-label">Salesperson Profit ({commissionRate}%)</div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleTogglePayment('commission_paid', commissionPaid)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: commissionPaid ? '#166534' : 'var(--ink-400)',
                      fontWeight: 600,
                    }}
                    title="Toggle paid"
                  >
                    {commissionPaid ? <CheckSquare style={{ width: '15px', height: '15px' }} /> : <Square style={{ width: '15px', height: '15px' }} />}
                    {commissionPaid ? 'Paid' : 'Mark Paid'}
                  </button>
                )}
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--e34-accent)' }}>
                {formatCurrency(salespersonCommission)}
              </div>
              <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                {salesperson?.name?.split(' ')[0] || 'Sales Rep'} payout {commissionPaid && '(Paid Out)'}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '2 1 600px' }}>
          
          {/* Client Information */}
          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <User className="text-meta" style={{ width: '20px', height: '20px' }} />
              Client Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 32px' }}>
              <div>
                <div className="metric-label">Client Name</div>
                <div className="text-body" style={{ fontWeight: 500, wordBreak: 'break-word' }}>{lead.client_name}</div>
              </div>
              <div>
                <div className="metric-label">Client Type</div>
                <div className="text-body" style={{ textTransform: 'capitalize' }}>{lead.client_type.toLowerCase()}</div>
              </div>
              {(lead.business_type || lead.business_type_other) && (
                <div>
                  <div className="metric-label">Business Type</div>
                  <div className="text-body" style={{ wordBreak: 'break-word' }}>
                    {lead.business_type === 'OTHER' ? lead.business_type_other : lead.business_type}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Website Details */}
          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Globe className="text-meta" style={{ width: '20px', height: '20px' }} />
              Website Details
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div className="metric-label">Reason for Website</div>
                <div className="text-body" style={{ marginTop: '4px' }}>
                  {lead.reason === 'NEW_WEBSITE' ? 'New Website' : 'Redesign Existing Website'}
                </div>
              </div>
              
              {lead.reason === 'REDO_WEBSITE' && lead.previous_website_url && (
                <div>
                  <div className="metric-label">Current Website URL</div>
                  <a 
                    href={lead.previous_website_url.startsWith('http') ? lead.previous_website_url : `https://${lead.previous_website_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--e34-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', wordBreak: 'break-all' }}
                  >
                    {lead.previous_website_url}
                    <LinkIcon style={{ width: '12px', height: '12px', flexShrink: 0 }} />
                  </a>
                </div>
              )}

              <div>
                <div className="metric-label">Website Type</div>
                <div className="text-body" style={{ marginTop: '4px', wordBreak: 'break-word' }}>
                  {lead.website_type === 'OTHER' ? lead.website_type_other : lead.website_type}
                </div>
              </div>
            </div>
          </section>

          {/* Target Audience with Collapsible overflow */}
          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Target className="text-meta" style={{ width: '20px', height: '20px' }} />
              Target Audience
            </h2>
            <Collapsible maxHeight={120}>
              <p className="text-body" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', margin: 0 }}>
                {lead.target_audience}
              </p>
            </Collapsible>
          </section>

          {/* Design Preferences */}
          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Palette className="text-meta" style={{ width: '20px', height: '20px' }} />
              Design Preferences
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <div className="metric-label" style={{ marginBottom: '8px' }}>Selected Styles</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {lead.design_style.map((style) => (
                  <span key={style} className="badge badge-outline">
                    {style === 'OTHER' && lead.design_style_other ? lead.design_style_other : style.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            {lead.inspiration_urls && lead.inspiration_urls.length > 0 && (
              <div>
                <div className="metric-label" style={{ marginBottom: '8px' }}>Inspiration URLs</div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none' }}>
                  {lead.inspiration_urls.map((url, i) => url ? (
                    <li key={i}>
                      <a 
                        href={url.startsWith('http') ? url : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--e34-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', backgroundColor: 'var(--surface)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--ink-150)', wordBreak: 'break-all' }}
                      >
                        <LinkIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                        {url}
                      </a>
                    </li>
                  ) : null)}
                </ul>
              </div>
            )}
          </section>

          {/* Additional Details with Collapsible overflow */}
          {(lead.special_features || lead.additional_information) && (
            <section className="card" style={{ padding: '20px' }}>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <MessageSquare className="text-meta" style={{ width: '20px', height: '20px' }} />
                Additional Details
              </h2>
              
              {lead.special_features && (
                <div style={{ marginBottom: '20px' }}>
                  <div className="metric-label" style={{ marginBottom: '8px' }}>Special Features</div>
                  <Collapsible maxHeight={120}>
                    <p className="text-body" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', backgroundColor: 'var(--surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-200)', margin: 0 }}>
                      {lead.special_features}
                    </p>
                  </Collapsible>
                </div>
              )}

              {lead.additional_information && (
                <div>
                  <div className="metric-label" style={{ marginBottom: '8px' }}>Other Information</div>
                  <Collapsible maxHeight={120}>
                    <p className="text-body" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', backgroundColor: 'var(--surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-200)', margin: 0 }}>
                      {lead.additional_information}
                    </p>
                  </Collapsible>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1 1 300px' }}>
          
          {/* Salesperson Card */}
          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ marginBottom: '16px' }}>Assigned Salesperson</h2>
            {salesperson ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {salesperson.avatar_url ? (
                  <img src={salesperson.avatar_url} alt={salesperson.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--surface)' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--ink-100)', color: 'var(--ink-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500 }}>
                    {getInitials(salesperson.name)}
                  </div>
                )}
                <div>
                  <div className="text-body" style={{ fontWeight: 600 }}>{salesperson.name}</div>
                  <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{salesperson.email || 'No email provided'}</div>
                  <div className="text-meta" style={{ fontSize: '0.75rem', color: 'var(--e34-accent)', marginTop: '2px', fontWeight: 500 }}>
                    Commission Rate: {commissionRate}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-meta" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCircle style={{ width: '20px', height: '20px' }} />
                System Generated
              </div>
            )}
          </section>

          {/* Timeline Dates */}
          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ marginBottom: '16px' }}>Timeline Dates</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar style={{ width: '16px', height: '16px' }} />
                  Created
                </span>
                <span style={{ fontWeight: 500 }}>{formatDate(lead.created_at)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock style={{ width: '16px', height: '16px' }} />
                  Updated
                </span>
                <span style={{ fontWeight: 500 }}>{formatDate(lead.updated_at)}</span>
              </div>
              {lead.completed_at && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--e34-accent)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle style={{ width: '16px', height: '16px' }} />
                    Completed
                  </span>
                  <span style={{ fontWeight: 500 }}>{formatDate(lead.completed_at)}</span>
                </div>
              )}
            </div>
          </section>

          {/* Status History with Collapsible Menu */}
          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ marginBottom: '16px' }}>Status History</h2>
            {lead.history && lead.history.length > 0 ? (
              <Collapsible
                maxHeight={260}
                showMoreText={`Show all ${lead.history.length} status logs`}
                showLessText="Show fewer status logs"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {lead.history.map((entry, index) => {
                    const isLast = index === lead.history.length - 1
                    const newStatusConf = LEAD_STATUS_CONFIG[entry.new_status]
                    const oldStatusConf = entry.old_status ? LEAD_STATUS_CONFIG[entry.old_status] : null
                    
                    return (
                      <div key={entry.id} style={{ position: 'relative', paddingLeft: '24px' }}>
                        {!isLast && (
                          <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-24px', width: '2px', backgroundColor: 'var(--surface)' }} />
                        )}
                        
                        <div style={{ position: 'absolute', left: 0, top: '6px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--paper)', border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: newStatusConf?.dotClassName ? undefined : 'var(--ink-400)' }} />
                        </div>
                        
                        <div style={{ fontSize: '0.875rem' }}>
                          <div style={{ fontWeight: 500, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {oldStatusConf && (
                              <>
                                <span className="text-meta" style={{ textDecoration: 'line-through', opacity: 0.7 }}>{oldStatusConf.label}</span>
                                <ArrowRight className="text-meta" style={{ width: '12px', height: '12px' }} />
                              </>
                            )}
                            <span className={cn('badge', newStatusConf?.className)}>
                              {newStatusConf?.label || entry.new_status}
                            </span>
                          </div>
                          
                          <div className="text-meta" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', backgroundColor: 'var(--surface)', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--ink-150)' }}>
                            <span style={{ fontWeight: 500, color: 'var(--ink-700)' }}>
                              {entry.changer?.name || 'System'}
                            </span>
                            <span>{formatRelativeTime(entry.created_at)}</span>
                          </div>
                          
                          {entry.note && (
                            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--ink-600)', fontStyle: 'italic', borderLeft: '2px solid var(--ink-200)', paddingLeft: '8px', paddingBottom: '4px', paddingTop: '4px', wordBreak: 'break-word' }}>
                              "{entry.note}"
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Collapsible>
            ) : (
              <div className="text-meta" style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>No history recorded</div>
            )}
          </section>
        </div>
      </div>

      {/* Note Modal for regular status change */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false)
          setPendingStatus(null)
        }}
        onSubmit={handleNoteSubmit}
        title={`Change Status to ${pendingStatus ? LEAD_STATUS_CONFIG[pendingStatus]?.label || pendingStatus : ''}`}
        subtitle="Provide an optional context note for the status transition history."
        label="Transition Note"
        placeholder="e.g. Scope confirmed with client, starting mockups."
        submitText="Update Status"
        isLoading={isPending}
      />

      {/* Cost Entry Modal for COMPLETED status */}
      <CostEntryModal
        isOpen={isCostModalOpen}
        onClose={() => {
          setIsCostModalOpen(false)
          setPendingStatus(null)
        }}
        onSubmit={handleCostSubmit}
        budget={lead.budget}
        salespersonName={salesperson?.name || 'Sales Rep'}
        commissionRate={commissionRate}
        isLoading={isPending}
      />

      {/* Edit Lead Modal */}
      {isAdmin && (
        <EditLeadModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          lead={lead}
          onSaved={() => router.refresh()}
        />
      )}

      {/* Confirm Trash Modal */}
      <ConfirmModal
        isOpen={isTrashConfirmOpen}
        onClose={() => setIsTrashConfirmOpen(false)}
        onConfirm={handleTrashLead}
        title="Move Lead to Trash"
        message={`Are you sure you want to mark "${lead.client_name}" as Trash? It will be hidden from the active leads table and accessible only in the collapsible Trash menu.`}
        confirmText="Mark as Trash"
        isDestructive
        isLoading={isPending}
      />

      {/* Confirm Restore Modal */}
      <ConfirmModal
        isOpen={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={handleRestoreLead}
        title="Restore Lead"
        message={`Are you sure you want to restore "${lead.client_name}" back to the active pipeline?`}
        confirmText="Restore Lead"
        isLoading={isPending}
      />
    </div>
  )
}
