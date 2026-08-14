import { notFound, redirect } from 'next/navigation'
import { getLeadById } from '@/lib/leads/actions'
import { getSession } from '@/lib/auth/session'
import LeadDetail from '@/components/leads/LeadDetail'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const result = await getLeadById(resolvedParams.id)
  
  if (!result.success || !result.data) {
    return { title: 'Lead Not Found' }
  }
  
  return { title: `Lead #${result.data.lead_number}` }
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const resolvedParams = await params
  const result = await getLeadById(resolvedParams.id)
  
  if (!result.success || !result.data) {
    if (result.error === 'Access denied') {
      redirect('/leads')
    }
    notFound()
  }

  return <LeadDetail lead={result.data as any} currentUser={session.user} />
}
