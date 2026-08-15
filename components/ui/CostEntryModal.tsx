'use client'

import React, { useState } from 'react'
import Modal from './Modal'
import { formatCurrency } from '@/lib/utils'

interface CostEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (costAmount: number, note?: string) => void
  budget: number | null
  salespersonName?: string
  commissionRate?: number
  isLoading?: boolean
}

export default function CostEntryModal({
  isOpen,
  onClose,
  onSubmit,
  budget = 0,
  salespersonName = 'Salesperson',
  commissionRate = 50,
  isLoading = false,
}: CostEntryModalProps) {
  const [costStr, setCostStr] = useState('0')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const numericBudget = budget || 0
  const numericCost = parseFloat(costStr) || 0
  const netProfit = Math.max(0, numericBudget - numericCost)
  const salespersonShare = (netProfit * (commissionRate || 50)) / 100
  const companyShare = netProfit - salespersonShare

  const [costWarningAcknowledged, setCostWarningAcknowledged] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isNaN(numericCost) || numericCost < 0) {
      setError('Please enter a valid non-negative cost amount.')
      return
    }
    if (numericCost > numericBudget && numericBudget > 0 && !costWarningAcknowledged) {
      setError('Note: Production costs exceed total lead budget. Check the confirmation box below to proceed.')
      return
    }
    onSubmit(numericCost, note.trim() || undefined)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Lead & Set Production Costs"
      subtitle="Finalize commercial financials for this project."
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--paper)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ink-150)',
            }}
          >
            <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
              Quoted Website Price
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 650, color: 'var(--ink-900)' }}>
              {formatCurrency(numericBudget)}
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--paper)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ink-150)',
            }}
          >
            <div className="text-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
              Salesperson Rate
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 650, color: 'var(--e34-accent)' }}>
              {commissionRate}% ({salespersonName})
            </div>
          </div>
        </div>

        <div>
          <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '6px' }}>
            Production & Delivery Costs ($) <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input"
            style={{ width: '100%', fontVariantNumeric: 'tabular-nums' }}
            placeholder="0.00"
            value={costStr}
            onChange={(e) => {
              setCostStr(e.target.value)
              if (error) setError('')
            }}
            disabled={isLoading}
            autoFocus
          />
          {error && <p className="field-error" style={{ marginTop: '4px' }}>{error}</p>}
          {numericCost > numericBudget && numericBudget > 0 && (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '8px',
                padding: '8px 10px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                color: '#92400e',
              }}
            >
              <input
                type="checkbox"
                checked={costWarningAcknowledged}
                onChange={(e) => {
                  setCostWarningAcknowledged(e.target.checked)
                  if (error) setError('')
                }}
              />
              <span>I confirm that production costs exceed the quoted project budget.</span>
            </label>
          )}
          <span className="text-meta" style={{ fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
            Enter all direct production costs (hosting, domains, assets, subcontractor expenses, etc.).
          </span>
        </div>

        {/* Live Calculation Preview */}
        <div
          style={{
            padding: '14px',
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--ink-200)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.8125rem',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--ink-900)', borderBottom: '1px solid var(--ink-150)', paddingBottom: '6px' }}>
            Financial Breakdown Preview
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-meta">Quoted Total:</span>
            <span style={{ fontWeight: 500 }}>{formatCurrency(numericBudget)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-meta">Production Costs:</span>
            <span style={{ fontWeight: 500, color: '#dc2626' }}>- {formatCurrency(numericCost)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--ink-200)', paddingTop: '4px' }}>
            <span style={{ fontWeight: 600 }}>Net Gross Profit:</span>
            <span style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{formatCurrency(netProfit)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '12px' }}>
            <span className="text-meta">Company Share:</span>
            <span style={{ fontWeight: 500, color: '#166534' }}>{formatCurrency(companyShare)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '12px' }}>
            <span className="text-meta">Salesperson ({commissionRate}%):</span>
            <span style={{ fontWeight: 500, color: 'var(--e34-accent)' }}>{formatCurrency(salespersonShare)}</span>
          </div>
        </div>

        <div>
          <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '6px' }}>
            Completion Note (Optional)
          </label>
          <textarea
            className="input"
            rows={2}
            style={{ width: '100%', resize: 'vertical' }}
            placeholder="e.g. Website delivered, client approved final design."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-sm btn-solid"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Mark as Completed'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
