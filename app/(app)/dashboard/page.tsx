import type { Metadata } from 'next'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { getDashboardMetrics, getLeads } from '@/lib/leads/actions'
import { getTeamMembers } from '@/lib/users/actions'
import { getTrainingProgress } from '@/lib/training/actions'
import { canAccessAdminDashboard } from '@/lib/auth/permissions'
import AdminDashboard from '@/components/dashboard/AdminDashboard'
import SalesDashboard from '@/components/dashboard/SalesDashboard'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const { user } = session
  const isAdmin = canAccessAdminDashboard(user.role)

  const [metricsResult, leadsResult, trainingResult, teamResult] = await Promise.all([
    getDashboardMetrics(),
    getLeads({ per_page: 10, sort: 'created_at', order: 'desc' }),
    getTrainingProgress(),
    isAdmin ? getTeamMembers() : Promise.resolve(null),
  ])

  return isAdmin ? (
    <AdminDashboard
      user={user}
      metrics={metricsResult}
      recentLeads={leadsResult.data?.leads || []}
      team={teamResult?.data || []}
    />
  ) : (
    <SalesDashboard
      user={user}
      myLeads={leadsResult.data?.leads || []}
      trainingProgress={trainingResult.data}
    />
  )
}
