'use client'

import React, { useState, useTransition } from 'react'
import Modal from '@/components/ui/Modal'
import { BUSINESS_TYPES, DESIGN_STYLES, WEBSITE_TYPES, isValidUrl } from '@/lib/utils'
import type { Lead, ClientType, LeadStatus } from '@/types'
import { updateLeadData } from '@/lib/leads/actions'

interface EditLeadModalProps {
  isOpen: boolean
  onClose: () => void
  lead: Lead
  onSaved: () => void
}

export default function EditLeadModal({
  isOpen,
  onClose,
  lead,
  onSaved,
}: EditLeadModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    client_name: lead.client_name || '',
    client_type: lead.client_type || ('BUSINESS' as ClientType),
    business_type: lead.business_type || '',
    business_type_other: lead.business_type_other || '',
    website_type: lead.website_type || '',
    website_type_other: lead.website_type_other || '',
    reason: lead.reason || 'NEW_WEBSITE',
    previous_website_url: lead.previous_website_url || '',
    target_audience: lead.target_audience || '',
    design_style: lead.design_style || [],
    design_style_other: lead.design_style_other || '',
    inspiration_urls: lead.inspiration_urls && lead.inspiration_urls.length > 0 ? lead.inspiration_urls : [''],
    budget: lead.budget ? String(lead.budget) : '',
    special_features: lead.special_features || '',
    additional_information: lead.additional_information || '',
  })

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleDesignStyle = (style: string) => {
    setFormData((prev) => {
      const exists = prev.design_style.includes(style)
      const next = exists
        ? prev.design_style.filter((s) => s !== style)
        : [...prev.design_style, style]
      return { ...prev, design_style: next }
    })
  }

  const handleUrlChange = (idx: number, val: string) => {
    const urls = [...formData.inspiration_urls]
    urls[idx] = val
    updateField('inspiration_urls', urls)
  }

  const addUrl = () => {
    if (formData.inspiration_urls.length < 5) {
      updateField('inspiration_urls', [...formData.inspiration_urls, ''])
    }
  }

  const removeUrl = (idx: number) => {
    const urls = formData.inspiration_urls.filter((_, i) => i !== idx)
    updateField('inspiration_urls', urls.length > 0 ? urls : [''])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.client_name.trim()) {
      setError('Client name is required.')
      return
    }

    startTransition(async () => {
      const res = await updateLeadData(lead.id, {
        client_name: formData.client_name,
        client_type: formData.client_type,
        business_type: formData.business_type || undefined,
        business_type_other: formData.business_type_other || undefined,
        website_type: formData.website_type,
        website_type_other: formData.website_type_other || undefined,
        reason: formData.reason,
        previous_website_url: formData.previous_website_url || undefined,
        target_audience: formData.target_audience,
        design_style: formData.design_style,
        design_style_other: formData.design_style_other || undefined,
        inspiration_urls: formData.inspiration_urls.filter(Boolean),
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        special_features: formData.special_features || undefined,
        additional_information: formData.additional_information || undefined,
      })

      if (res.success) {
        onSaved()
        onClose()
      } else {
        setError(res.error || 'Failed to update lead.')
      }
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Lead #${lead.lead_number}`}
      subtitle="Modify core client details, scope, pricing, and creative requirements."
      maxWidth="720px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius)',
              color: '#991b1b',
              fontSize: '0.8125rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Section 1: Client info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div>
            <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>
              Client Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              className="input"
              style={{ width: '100%' }}
              value={formData.client_name}
              onChange={(e) => updateField('client_name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>
              Client Classification
            </label>
            <select
              className="select"
              style={{ width: '100%' }}
              value={formData.client_type}
              onChange={(e) => updateField('client_type', e.target.value as ClientType)}
            >
              <option value="PERSONAL">Personal</option>
              <option value="BUSINESS">Business</option>
              <option value="SAAS">SaaS</option>
            </select>
          </div>
        </div>

        {/* Section 2: Website & Reason */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div>
            <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>
              Website Type
            </label>
            <input
              type="text"
              className="input"
              style={{ width: '100%' }}
              placeholder="e.g. Business Landing Page"
              value={formData.website_type}
              onChange={(e) => updateField('website_type', e.target.value)}
            />
          </div>

          <div>
            <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>
              Reason
            </label>
            <select
              className="select"
              style={{ width: '100%' }}
              value={formData.reason}
              onChange={(e) => updateField('reason', e.target.value)}
            >
              <option value="NEW_WEBSITE">New Website</option>
              <option value="REDO_WEBSITE">Redo Website</option>
            </select>
          </div>

          <div>
            <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>
              Previous / Existing Website URL
            </label>
            <input
              type="text"
              className="input"
              style={{ width: '100%' }}
              placeholder="https://example.com"
              value={formData.previous_website_url}
              onChange={(e) => updateField('previous_website_url', e.target.value)}
            />
          </div>
        </div>

        {/* Section 3: Commercials */}
        <div>
          <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>
            Quoted Budget / Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            className="input"
            style={{ width: '100%', maxWidth: '280px' }}
            placeholder="e.g. 500"
            value={formData.budget}
            onChange={(e) => updateField('budget', e.target.value)}
          />
        </div>

        {/* Section 4: Target Audience */}
        <div>
          <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>
            Target Audience
          </label>
          <textarea
            className="input"
            rows={3}
            style={{ width: '100%', resize: 'vertical' }}
            value={formData.target_audience}
            onChange={(e) => updateField('target_audience', e.target.value)}
          />
        </div>

        {/* Section 5: Design Styles */}
        <div>
          <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '6px' }}>
            Design Aesthetic Tags
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {DESIGN_STYLES.map((style) => {
              const selected = formData.design_style.includes(style)
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleDesignStyle(style)}
                  className={`badge ${selected ? 'badge-status-completed' : 'badge-outline'}`}
                  style={{ cursor: 'pointer', fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  {style}
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 6: Inspiration URLs */}
        <div>
          <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '6px' }}>
            Inspiration URLs
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {formData.inspiration_urls.map((url, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="input"
                  style={{ flex: 1 }}
                  placeholder="https://example.com/inspiration"
                  value={url}
                  onChange={(e) => handleUrlChange(idx, e.target.value)}
                />
                {formData.inspiration_urls.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => removeUrl(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {formData.inspiration_urls.length < 5 && (
              <button
                type="button"
                className="btn btn-sm btn-outline"
                style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                onClick={addUrl}
              >
                + Add Another URL
              </button>
            )}
          </div>
        </div>

        {/* Section 7: Special features & Additional Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div>
            <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>
              Special Features
            </label>
            <textarea
              className="input"
              rows={3}
              style={{ width: '100%', resize: 'vertical' }}
              value={formData.special_features}
              onChange={(e) => updateField('special_features', e.target.value)}
            />
          </div>

          <div>
            <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>
              Additional Information
            </label>
            <textarea
              className="input"
              rows={3}
              style={{ width: '100%', resize: 'vertical' }}
              value={formData.additional_information}
              onChange={(e) => updateField('additional_information', e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--ink-150)' }}>
          <button type="button" className="btn btn-sm btn-outline" onClick={onClose} disabled={isPending}>
            Cancel
          </button>
          <button type="submit" className="btn btn-sm btn-solid" disabled={isPending}>
            {isPending ? 'Saving Changes...' : 'Save Lead Changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
