import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { canAccessAnalytics } from '@/lib/auth/permissions'
import { getAnalyticsData } from '@/lib/leads/actions'
import AnalyticsClient from '@/components/analytics/AnalyticsClient'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AnalyticsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  if (!canAccessAnalytics(session.user.role)) {
    redirect('/dashboard')
  }

  const res = await getAnalyticsData()
  const data = res.success && res.data ? res.data : {
    websiteAnalytics: {
      websiteTypes: [],
      statusDistribution: [],
      categoryPrices: [],
      designTagFrequencies: [],
      revenueTrends: [],
    },
    salesmanAnalytics: {
      salespeople: [],
    },
  }

  return (
    <div>
      <div className="page-header" style={{ paddingBottom: 24 }}>
        <h1 className="text-heading-xl" style={{ margin: '0 0 4px' }}>Analytics &amp; Intelligence</h1>
        <p className="text-body-sm" style={{ margin: 0 }}>
          Live operational intelligence on website productions, pricing trends, and sales performance.
        </p>
      </div>

      <div className="page-content">
        <AnalyticsClient initialData={data} />
      </div>
    </div>
  )
}
