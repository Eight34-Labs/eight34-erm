'use client'

import React, { useState } from 'react'
import { Globe, Users } from 'lucide-react'
import WebsiteAnalytics from './WebsiteAnalytics'
import SalesmanAnalytics from './SalesmanAnalytics'

interface AnalyticsClientProps {
  initialData: {
    websiteAnalytics: any
    salesmanAnalytics: any
  }
}

export default function AnalyticsClient({ initialData }: AnalyticsClientProps) {
  const [activeTab, setActiveTab] = useState<'WEBSITE' | 'SALESMAN'>('WEBSITE')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--ink-200)', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('WEBSITE')}
          className="badge"
          style={{
            cursor: 'pointer',
            padding: '8px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: activeTab === 'WEBSITE' ? 'var(--e34-accent)' : 'var(--surface)',
            color: activeTab === 'WEBSITE' ? '#fff' : 'var(--ink-700)',
            border: activeTab === 'WEBSITE' ? 'none' : '1px solid var(--ink-200)',
          }}
        >
          <Globe style={{ width: '15px', height: '15px' }} />
          Website Analytics
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SALESMAN')}
          className="badge"
          style={{
            cursor: 'pointer',
            padding: '8px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: activeTab === 'SALESMAN' ? 'var(--e34-accent)' : 'var(--surface)',
            color: activeTab === 'SALESMAN' ? '#fff' : 'var(--ink-700)',
            border: activeTab === 'SALESMAN' ? 'none' : '1px solid var(--ink-200)',
          }}
        >
          <Users style={{ width: '15px', height: '15px' }} />
          Salesman Analytics
        </button>
      </div>

      {activeTab === 'WEBSITE' ? (
        <WebsiteAnalytics data={initialData.websiteAnalytics} />
      ) : (
        <SalesmanAnalytics data={initialData.salesmanAnalytics} />
      )}
    </div>
  )
}
