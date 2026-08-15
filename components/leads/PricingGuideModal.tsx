'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { formatCurrency } from '@/lib/utils'
import type { PricingConfig } from '@/types'

interface PricingGuideModalProps {
  isOpen: boolean
  onClose: () => void
  pricingConfigs: PricingConfig[]
  onSelectPrice?: (minPrice: number) => void
}

export default function PricingGuideModal({
  isOpen,
  onClose,
  pricingConfigs,
  onSelectPrice,
}: PricingGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'US_EUROPE' | 'GLOBAL'>('US_EUROPE')

  const filtered = pricingConfigs.filter(
    (c) => c.region === activeTab && c.is_active
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eight34 Website Pricing Guide"
      subtitle="Standard market pricing benchmarks and tier classifications."
      maxWidth="700px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Region Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--ink-200)',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('US_EUROPE')}
            style={{
              padding: '8px 16px',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'US_EUROPE' ? '2px solid var(--e34-accent)' : '2px solid transparent',
              color: activeTab === 'US_EUROPE' ? 'var(--e34-accent)' : 'var(--ink-500)',
              transition: 'color var(--transition), border-color var(--transition)',
            }}
          >
            US / Europe
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('GLOBAL')}
            style={{
              padding: '8px 16px',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'GLOBAL' ? '2px solid var(--e34-accent)' : '2px solid transparent',
              color: activeTab === 'GLOBAL' ? 'var(--e34-accent)' : 'var(--ink-500)',
              transition: 'color var(--transition), border-color var(--transition)',
            }}
          >
            Outside US / Europe (Global)
          </button>
        </div>

        {/* Pricing Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div className="text-meta" style={{ padding: '24px', textAlign: 'center' }}>
              No active pricing configurations found for this region.
            </div>
          ) : (
            filtered.map((item) => {
              const priceDisplay = item.max_price
                ? `${formatCurrency(item.min_price)} – ${formatCurrency(item.max_price)}`
                : `From ${formatCurrency(item.min_price)}`

              return (
                <div
                  key={item.id}
                  style={{
                    padding: '14px 16px',
                    backgroundColor: 'var(--paper)',
                    border: '1px solid var(--ink-200)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ fontWeight: 650, color: 'var(--ink-900)', fontSize: '0.9375rem' }}>
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--e34-accent)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {priceDisplay}
                    </div>
                  </div>

                  {item.notes && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8125rem',
                        color: 'var(--ink-600)',
                        lineHeight: 1.45,
                      }}
                    >
                      {item.notes}
                    </p>
                  )}

                  {onSelectPrice && (
                    <div style={{ marginTop: '4px' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                        onClick={() => {
                          onSelectPrice(item.min_price)
                          onClose()
                        }}
                      >
                        Use baseline quote ({formatCurrency(item.min_price)})
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
          <button type="button" className="btn btn-sm btn-solid" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}
