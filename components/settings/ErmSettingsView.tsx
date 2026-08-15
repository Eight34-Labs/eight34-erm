'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Sliders, Shield, Tag, DollarSign, Check, Plus, X, Edit2 } from 'lucide-react'
import type { ErmSettings, PricingConfig, User } from '@/types'
import { updateErmSettings } from '@/lib/settings/actions'
import { updatePricingConfig } from '@/lib/pricing/actions'
import { formatCurrency } from '@/lib/utils'

interface ErmSettingsViewProps {
  settings: ErmSettings
  pricingConfigs: PricingConfig[]
  currentUser: User
}

export default function ErmSettingsView({
  settings: initialSettings,
  pricingConfigs: initialConfigs,
  currentUser,
}: ErmSettingsViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Form states
  const [defaultRate, setDefaultRate] = useState(String(initialSettings.default_commission_rate || 50))
  const [autoApprove, setAutoApprove] = useState(Boolean(initialSettings.auto_approve_salespeople))
  const [tags, setTags] = useState<string[]>(initialSettings.aesthetic_tag_options || [])
  const [newTagInput, setNewTagInput] = useState('')

  // Pricing configs editing state
  const [pricingList, setPricingList] = useState<PricingConfig[]>(initialConfigs)
  const [editingPricingId, setEditingPricingId] = useState<string | null>(null)
  const [editingMinPrice, setEditingMinPrice] = useState<string>('')
  const [editingMaxPrice, setEditingMaxPrice] = useState<string>('')
  const [editingNotes, setEditingNotes] = useState<string>('')

  // Toast and error notifications
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg)
    setErrorMessage(null)
    setTimeout(() => setFeedbackMessage(null), 3500)
  }

  const showError = (err: string) => {
    setErrorMessage(err)
    setFeedbackMessage(null)
  }

  // Save general settings
  const handleSaveGeneral = () => {
    const rateNum = parseFloat(defaultRate)
    if (isNaN(rateNum) || rateNum < 0 || rateNum > 100) {
      showError('Default commission rate must be between 0% and 100%')
      return
    }

    startTransition(async () => {
      const res = await updateErmSettings({
        default_commission_rate: rateNum,
        auto_approve_salespeople: autoApprove,
        aesthetic_tag_options: tags,
      })

      if (res.success) {
        showFeedback('ERM Platform settings updated successfully!')
        router.refresh()
      } else {
        showError(res.error || 'Failed to update settings')
      }
    })
  }

  // Tag management
  const handleAddTag = () => {
    const trimmed = newTagInput.trim()
    if (!trimmed) return
    if (tags.includes(trimmed)) {
      setNewTagInput('')
      return
    }
    const updated = [...tags, trimmed]
    setTags(updated)
    setNewTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  // Start editing a pricing row
  const handleStartEditPricing = (config: PricingConfig) => {
    setEditingPricingId(config.id)
    setEditingMinPrice(String(config.min_price))
    setEditingMaxPrice(config.max_price ? String(config.max_price) : '')
    setEditingNotes(config.notes || '')
    setErrorMessage(null)
  }

  // Save pricing row
  const handleSavePricingRow = (id: string) => {
    const min = parseFloat(editingMinPrice)
    const max = editingMaxPrice ? parseFloat(editingMaxPrice) : null

    if (isNaN(min) || min < 0) {
      showError('Please enter a valid positive minimum price.')
      return
    }

    startTransition(async () => {
      const res = await updatePricingConfig(id, {
        min_price: min,
        max_price: max,
        notes: editingNotes.trim() || undefined,
      })

      if (res.success) {
        setPricingList((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, min_price: min, max_price: max, notes: editingNotes } : item
          )
        )
        setEditingPricingId(null)
        showFeedback('Pricing tier updated in database!')
        router.refresh()
      } else {
        showError(res.error || 'Failed to update pricing')
      }
    })
  }

  // Toggle active pricing row
  const handleTogglePricingActive = (id: string, currentActive: boolean) => {
    startTransition(async () => {
      const res = await updatePricingConfig(id, { is_active: !currentActive })
      if (res.success) {
        setPricingList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, is_active: !currentActive } : item))
        )
        showFeedback(`Pricing tier ${!currentActive ? 'activated' : 'disabled'}!`)
        router.refresh()
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1000px' }}>
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius)',
            color: '#166534',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check style={{ width: '16px', height: '16px' }} />
          {feedbackMessage}
        </div>
      )}

      {/* Error Feedback */}
      {errorMessage && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius)',
            color: '#991b1b',
            fontSize: '0.875rem',
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Section 1: General Platform Controls */}
      <section className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sliders style={{ width: '18px', height: '18px', color: 'var(--e34-accent)' }} />
          <h2 className="section-title" style={{ margin: 0 }}>
            Platform &amp; Sales Defaults
          </h2>
        </div>
        <p className="text-meta" style={{ fontSize: '0.8125rem', marginBottom: '20px' }}>
          Global configurations for the Eight34 ERM application.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Default Commission Rate */}
          <div>
            <label className="text-label" style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px' }}>
              Default Salesperson Commission Rate (%)
            </label>
            <div style={{ position: 'relative', maxWidth: '200px' }}>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                className="input"
                style={{ width: '100%', paddingRight: '28px' }}
                value={defaultRate}
                onChange={(e) => setDefaultRate(e.target.value)}
              />
              <span style={{ position: 'absolute', right: '10px', top: '9px', color: 'var(--ink-400)', fontWeight: 600, fontSize: '13px' }}>
                %
              </span>
            </div>
            <span className="text-meta" style={{ display: 'block', fontSize: '0.75rem', marginTop: '4px' }}>
              Applied automatically to all newly registered salespeople.
            </span>
          </div>

          {/* Auto-Approve Salespeople Toggle */}
          <div>
            <label className="text-label" style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px' }}>
              Auto-Approve New Salespeople
            </label>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--ink-200)',
                backgroundColor: 'var(--paper)',
              }}
            >
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink-900)' }}>
                {autoApprove ? 'Auto-Approve Enabled (Instant Access)' : 'Manual Approval Required (Default)'}
              </span>
            </label>
            <span className="text-meta" style={{ display: 'block', fontSize: '0.75rem', marginTop: '4px' }}>
              When enabled, incoming Slack signups bypass admin review.
            </span>
          </div>

          {/* Slack Workspace ID — read-only, set via SLACK_TEAM_ID env var */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="text-label" style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px' }}>
              Eight34 Slack Workspace Team ID
            </label>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'var(--ink-50)',
              border: '1px solid var(--ink-150)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              color: 'var(--ink-700)',
            }}>
              <Shield style={{ width: '13px', height: '13px', color: 'var(--ink-400)' }} />
              {initialSettings.slack_workspace_id || 'Set via SLACK_TEAM_ID environment variable'}
            </div>
            <span className="text-meta" style={{ display: 'block', fontSize: '0.75rem', marginTop: '4px' }}>
              Managed via the <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>SLACK_TEAM_ID</code> environment variable. Contact your infrastructure team to change this.
            </span>
          </div>
        </div>

        {/* Section 2: Aesthetic Tag Options */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--ink-150)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Tag style={{ width: '16px', height: '16px', color: 'var(--e34-accent)' }} />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 650, margin: 0, color: 'var(--ink-900)' }}>
              Aesthetic Style Tags
            </h3>
          </div>
          <p className="text-meta" style={{ fontSize: '0.75rem', marginBottom: '14px' }}>
            Aesthetic options presented during lead intake and tracked across analytics.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {tags.map((tag) => (
              <span
                key={tag}
                className="badge badge-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  fontSize: '0.8125rem',
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'var(--ink-400)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={`Remove ${tag}`}
                >
                  <X style={{ width: '12px', height: '12px' }} />
                </button>
              </span>
            ))}
          </div>

          {/* Add Tag Row */}
          <div style={{ display: 'flex', gap: '8px', maxWidth: '360px' }}>
            <input
              type="text"
              className="input"
              style={{ flex: 1 }}
              placeholder="New aesthetic tag name..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleAddTag}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus style={{ width: '13px', height: '13px' }} /> Add
            </button>
          </div>
        </div>

        {/* Save General Settings Button */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-solid btn-md"
            onClick={handleSaveGeneral}
            disabled={isPending}
          >
            {isPending ? 'Saving Settings...' : 'Save General Settings'}
          </button>
        </div>
      </section>

      {/* Section 3: Pricing Guides Database Management */}
      <section className="card" style={{ padding: '24px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign style={{ width: '18px', height: '18px', color: 'var(--e34-accent)' }} />
            <h2 className="section-title" style={{ margin: 0 }}>
              Pricing Guides Database
            </h2>
          </div>
        </div>
        <p className="text-meta" style={{ fontSize: '0.8125rem', marginBottom: '20px' }}>
          Live pricing structure in Supabase (`pricing_config`). Changes take effect immediately in the New Lead intake Pricing Guide modal.
        </p>

        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Region</th>
              <th>Website Category</th>
              <th>Baseline / Min</th>
              <th>Max Price</th>
              <th>Status</th>
              <th>Notes / Scope Description</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pricingList.map((config) => {
              const isEditing = editingPricingId === config.id

              return (
                <tr key={config.id}>
                  <td>
                    <span className="badge badge-outline" style={{ fontSize: '11px' }}>
                      {config.region === 'US_EUROPE' ? 'US / Europe' : 'Global'}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>
                      {config.label}
                    </div>
                    <div className="text-meta" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                      {config.website_type}
                    </div>
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="10"
                        className="input"
                        style={{ width: '80px', padding: '2px 6px', fontSize: '12px' }}
                        value={editingMinPrice}
                        onChange={(e) => setEditingMinPrice(e.target.value)}
                      />
                    ) : (
                      <span style={{ fontWeight: 650, fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(config.min_price)}
                      </span>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="10"
                        className="input"
                        style={{ width: '80px', padding: '2px 6px', fontSize: '12px' }}
                        placeholder="None"
                        value={editingMaxPrice}
                        onChange={(e) => setEditingMaxPrice(e.target.value)}
                      />
                    ) : (
                      <span style={{ fontWeight: 650, fontVariantNumeric: 'tabular-nums' }}>
                        {config.max_price ? formatCurrency(config.max_price) : '—'}
                      </span>
                    )}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() => handleTogglePricingActive(config.id, config.is_active)}
                      className={`badge ${config.is_active ? 'badge-status-completed' : 'badge-status-rejected'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle active"
                    >
                      {config.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td style={{ maxWidth: '280px' }}>
                    {isEditing ? (
                      <textarea
                        className="input"
                        rows={2}
                        style={{ width: '100%', fontSize: '11px', resize: 'vertical' }}
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                      />
                    ) : (
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-600)', lineHeight: 1.4 }}>
                        {config.notes || '—'}
                      </p>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    {isEditing ? (
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-solid"
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                          onClick={() => handleSavePricingRow(config.id)}
                          disabled={isPending}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                          onClick={() => setEditingPricingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                        onClick={() => handleStartEditPricing(config)}
                        disabled={isPending}
                      >
                        <Edit2 style={{ width: '11px', height: '11px', marginRight: '3px' }} />
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
