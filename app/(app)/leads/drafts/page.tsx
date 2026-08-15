import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { getLeadDrafts } from '@/lib/leads/actions'
import DraftsList from '@/components/leads/DraftsList'
import Link from 'next/link'

export const metadata = {
  title: 'Lead Drafts',
}

export default async function LeadDraftsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const res = await getLeadDrafts()
  const drafts = res.success && res.data ? res.data : []

  return (
    <div>
      <div className="page-header" style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Link href="/leads" className="text-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                All Leads
              </Link>
              <span className="text-meta">/</span>
              <span className="text-meta" style={{ color: 'var(--ink-800)', fontWeight: 500 }}>Drafts</span>
            </div>
            <h1 className="text-heading-xl" style={{ margin: '0 0 4px' }}>Lead Drafts</h1>
            <p className="text-body-sm" style={{ margin: 0 }}>
              Partially completed lead intakes. Resume editing anytime before submitting into the pipeline.
            </p>
          </div>

          <Link href="/leads/new" className="btn btn-solid btn-md">
            + Start New Lead
          </Link>
        </div>
      </div>

      <div className="page-content">
        <DraftsList initialDrafts={drafts} />
      </div>
    </div>
  )
}
