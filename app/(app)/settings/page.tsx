import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { canAccessErmSettings } from '@/lib/auth/permissions'
import { getErmSettings } from '@/lib/settings/actions'
import { getAllPricingConfigs } from '@/lib/pricing/actions'
import ErmSettingsView from '@/components/settings/ErmSettingsView'

export const metadata: Metadata = { title: 'ERM Settings' }

export default async function ErmSettingsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  // EXCLUSIVELY for Super Admins
  if (!canAccessErmSettings(session.user.role)) {
    redirect('/dashboard')
  }

  const [settingsRes, pricingRes] = await Promise.all([
    getErmSettings(),
    getAllPricingConfigs(),
  ])

  const settings = settingsRes.success && settingsRes.data ? settingsRes.data : {
    id: 'default',
    default_commission_rate: 50.0,
    auto_approve_salespeople: false,
    slack_workspace_id: process.env.SLACK_TEAM_ID || 'T_EIGHT34_MAIN',
    aesthetic_tag_options: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    updated_by: null,
  }

  const pricingConfigs = pricingRes.success && pricingRes.data ? pricingRes.data : []

  return (
    <div>
      <div className="page-header" style={{ paddingBottom: 24 }}>
        <h1 className="text-heading-xl" style={{ margin: '0 0 4px' }}>ERM Platform Settings</h1>
        <p className="text-body-sm" style={{ margin: 0 }}>
          Super Admin master configuration for commissions, auto-approval, aesthetic tags, and dynamic pricing guides.
        </p>
      </div>

      <div className="page-content">
        <ErmSettingsView
          settings={settings}
          pricingConfigs={pricingConfigs}
          currentUser={session.user}
        />
      </div>
    </div>
  )
}
