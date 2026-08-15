import { getLeads, getTrashedLeads } from '@/lib/leads/actions'
import { getSession } from '@/lib/auth/session'
import Link from 'next/link'
import LeadsTable from '@/components/leads/LeadsTable'
import type { LeadStatus } from '@/types'

export const metadata = {
  title: 'Leads',
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession()
  if (!session) return null

  const { user } = session
  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'

  const resolvedParams = await searchParams

  const page = Number(resolvedParams.page) || 1
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined
  const status = typeof resolvedParams.status === 'string' ? (resolvedParams.status as LeadStatus) : undefined
  const client_type = typeof resolvedParams.client_type === 'string' ? resolvedParams.client_type : undefined
  const sort = typeof resolvedParams.sort === 'string' ? (resolvedParams.sort as 'created_at' | 'budget') : undefined
  const order = typeof resolvedParams.order === 'string' ? (resolvedParams.order as 'asc' | 'desc') : undefined

  const [result, trashedResult] = await Promise.all([
    getLeads({
      page,
      search,
      status,
      client_type,
      sort,
      order,
      per_page: 20,
    }),
    isAdmin ? getTrashedLeads() : Promise.resolve({ success: true, data: [] }),
  ])

  const leads = result.success && result.data ? result.data.leads : []
  const total = result.success && result.data ? result.data.total : 0
  const trashedLeads = trashedResult.success && trashedResult.data ? trashedResult.data : []

  return (
    <div>
      <div className="page-header" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="text-heading-xl" style={{ margin: '0 0 4px' }}>Lead Pipeline</h1>
            <p className="text-meta" style={{ margin: 0 }}>
              {total} registered {total === 1 ? 'lead' : 'leads'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/leads/drafts" className="btn btn-outline btn-md">
              Lead Drafts
            </Link>
            {user.training_completed && (
              <Link href="/leads/new" className="btn btn-solid btn-md">
                + Submit Lead
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="page-content">
        <LeadsTable
          leads={leads}
          total={total}
          isAdmin={isAdmin}
          currentUserId={user.id}
          trashedLeads={trashedLeads}
        />
      </div>
    </div>
  )
}
