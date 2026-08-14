'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building, User, Globe, Target, Palette, 
  DollarSign, Clock, Calendar, CheckCircle,
  MessageSquare, Hash, ArrowRight, UserCircle,
  Link as LinkIcon
} from 'lucide-react'
import { cn, formatCurrency, formatDate, LEAD_STATUS_CONFIG, formatRelativeTime, getInitials } from '@/lib/utils'
import { updateLeadStatus } from '@/lib/leads/actions'
import type { Lead, User as UserType, LeadStatus, LeadStatusHistory } from '@/types'

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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [statusError, setStatusError] = useState('')

  const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN'
  const statusConfig = LEAD_STATUS_CONFIG[lead.status] || { label: lead.status, className: 'badge' }

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (newStatus === lead.status) return
    
    setIsUpdatingStatus(true)
    setStatusError('')
    
    const note = prompt(`Optional note for changing status to ${LEAD_STATUS_CONFIG[newStatus]?.label || newStatus}:`)
    
    if (note === null) {
      setIsUpdatingStatus(false)
      return
    }

    startTransition(async () => {
      try {
        const result = await updateLeadStatus(lead.id, newStatus, note || undefined)
        if (!result.success) {
          setStatusError(result.error || 'Failed to update status')
        } else {
          router.refresh()
        }
      } catch (err) {
        setStatusError('Failed to update status')
      } finally {
        setIsUpdatingStatus(false)
      }
    })
  }

  return (
    <div className="page-content" style={{ maxWidth: '80rem', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px', padding: '20px', backgroundColor: 'var(--surface)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '1.125rem', fontWeight: 500, color: 'var(--ink-600)', backgroundColor: 'var(--surface)', padding: '4px 8px', borderRadius: '4px' }}>
                #{lead.lead_number}
              </span>
              <span className={cn("badge", statusConfig.className)}>
                {statusConfig.label}
              </span>
            </div>
            <h1 className="text-heading-xl" style={{ marginBottom: '8px' }}>{lead.client_name}</h1>
            <div className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
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
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px', minWidth: '200px' }}>
            {lead.budget && (
              <div style={{ textAlign: 'right' }}>
                <div className="text-meta" style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Budget</div>
                <div className="text-heading-lg" style={{ color: 'var(--e34-accent)' }}>
                  {formatCurrency(lead.budget)}
                </div>
              </div>
            )}
            
            {isAdmin && (
              <div style={{ width: '100%' }}>
                <label className="text-meta" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Update Status</label>
                <select 
                  className="select"
                  style={{ width: '100%' }}
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                  disabled={isPending || isUpdatingStatus}
                >
                  {STATUS_OPTIONS.map(status => (
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '2 1 600px' }}>
          
          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <User className="text-meta" style={{ width: '20px', height: '20px' }} />
              Client Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 32px' }}>
              <div>
                <div className="metric-label">Client Name</div>
                <div className="text-body" style={{ fontWeight: 500 }}>{lead.client_name}</div>
              </div>
              <div>
                <div className="metric-label">Client Type</div>
                <div className="text-body" style={{ textTransform: 'capitalize' }}>{lead.client_type.toLowerCase()}</div>
              </div>
              {(lead.business_type || lead.business_type_other) && (
                <div>
                  <div className="metric-label">Business Type</div>
                  <div className="text-body">
                    {lead.business_type === 'OTHER' ? lead.business_type_other : lead.business_type}
                  </div>
                </div>
              )}
            </div>
          </section>

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
                    style={{ color: 'var(--e34-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                  >
                    {lead.previous_website_url}
                    <LinkIcon style={{ width: '12px', height: '12px' }} />
                  </a>
                </div>
              )}

              <div>
                <div className="metric-label">Website Type</div>
                <div className="text-body" style={{ marginTop: '4px' }}>
                  {lead.website_type === 'OTHER' ? lead.website_type_other : lead.website_type}
                </div>
              </div>
            </div>
          </section>

          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Target className="text-meta" style={{ width: '20px', height: '20px' }} />
              Target Audience
            </h2>
            <p className="text-body" style={{ whiteSpace: 'pre-wrap' }}>{lead.target_audience}</p>
          </section>

          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Palette className="text-meta" style={{ width: '20px', height: '20px' }} />
              Design Preferences
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <div className="metric-label" style={{ marginBottom: '8px' }}>Selected Styles</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {lead.design_style.map(style => (
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
                        style={{ color: 'var(--e34-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', backgroundColor: 'var(--surface)', padding: '8px', borderRadius: '4px' }}
                      >
                        <LinkIcon style={{ width: '16px', height: '16px' }} />
                        {url}
                      </a>
                    </li>
                  ) : null)}
                </ul>
              </div>
            )}
          </section>

          {(lead.special_features || lead.additional_information) && (
            <section className="card" style={{ padding: '20px' }}>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <MessageSquare className="text-meta" style={{ width: '20px', height: '20px' }} />
                Additional Details
              </h2>
              
              {lead.special_features && (
                <div style={{ marginBottom: '24px' }}>
                  <div className="metric-label" style={{ marginBottom: '8px' }}>Special Features</div>
                  <p className="text-body" style={{ whiteSpace: 'pre-wrap', backgroundColor: 'var(--surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-200)' }}>
                    {lead.special_features}
                  </p>
                </div>
              )}

              {lead.additional_information && (
                <div>
                  <div className="metric-label" style={{ marginBottom: '8px' }}>Other Information</div>
                  <p className="text-body" style={{ whiteSpace: 'pre-wrap', backgroundColor: 'var(--surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-200)' }}>
                    {lead.additional_information}
                  </p>
                </div>
              )}
            </section>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1 1 300px' }}>
          
          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ marginBottom: '16px' }}>Salesperson</h2>
            {lead.creator ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {lead.creator.avatar_url ? (
                  <img src={lead.creator.avatar_url} alt={lead.creator.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--surface)' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--ink-100)', color: 'var(--ink-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500 }}>
                    {getInitials(lead.creator.name)}
                  </div>
                )}
                <div>
                  <div className="text-body" style={{ fontWeight: 500 }}>{lead.creator.name}</div>
                  <div className="text-meta" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{lead.creator.email || 'No email provided'}</div>
                </div>
              </div>
            ) : (
              <div className="text-meta" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCircle style={{ width: '20px', height: '20px' }} />
                System Generated
              </div>
            )}
          </section>

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

          <section className="card" style={{ padding: '20px' }}>
            <h2 className="section-title" style={{ marginBottom: '16px' }}>Status History</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {lead.history && lead.history.length > 0 ? (
                lead.history.map((entry, index) => {
                  const isLast = index === lead.history.length - 1
                  const newStatusConf = LEAD_STATUS_CONFIG[entry.new_status]
                  const oldStatusConf = entry.old_status ? LEAD_STATUS_CONFIG[entry.old_status] : null
                  
                  return (
                    <div key={entry.id} style={{ position: 'relative', paddingLeft: '24px' }}>
                      {!isLast && (
                        <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-24px', width: '2px', backgroundColor: 'var(--surface)' }} />
                      )}
                      
                      <div style={{ position: 'absolute', left: 0, top: '6px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--paper)', border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <div className={cn("w-2 h-2 rounded-full", newStatusConf?.dotClassName || "bg-[var(--ink-400)]")} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: newStatusConf?.dotClassName ? undefined : 'var(--ink-400)' }} />
                      </div>
                      
                      <div style={{ fontSize: '0.875rem' }}>
                        <div style={{ fontWeight: 500, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {oldStatusConf && (
                            <>
                              <span className="text-meta" style={{ textDecoration: 'line-through', opacity: 0.7 }}>{oldStatusConf.label}</span>
                              <ArrowRight className="text-meta" style={{ width: '12px', height: '12px' }} />
                            </>
                          )}
                          <span className={cn("badge", newStatusConf?.className)}>
                            {newStatusConf?.label || entry.new_status}
                          </span>
                        </div>
                        
                        <div className="text-meta" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', backgroundColor: 'var(--surface)', padding: '8px', borderRadius: '4px' }}>
                          <span style={{ fontWeight: 500, color: 'var(--ink-700)' }}>
                            {entry.changer?.name || 'System'}
                          </span>
                          <span>{formatRelativeTime(entry.created_at)}</span>
                        </div>
                        
                        {entry.note && (
                          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--ink-600)', fontStyle: 'italic', borderLeft: '2px solid var(--ink-200)', paddingLeft: '8px', paddingBottom: '4px', paddingTop: '4px' }}>
                            "{entry.note}"
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-meta" style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>No history recorded</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
