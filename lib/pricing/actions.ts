'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'
import { canManagePricing } from '@/lib/auth/permissions'
import type { PricingConfig, ActionResult } from '@/types'

export const DEFAULT_PRICING_CONFIGS: Omit<PricingConfig, 'id' | 'created_at' | 'updated_at' | 'updated_by'>[] = [
  // US & Europe
  {
    region: 'US_EUROPE',
    website_type: 'PERSONAL_PORTFOLIO',
    label: 'Personal Portfolio / CV Website',
    min_price: 800,
    max_price: 2500,
    notes: 'Single page or multi-section personal brand showcases with custom typography, contact integration, and mobile optimization.',
    is_active: true,
  },
  {
    region: 'US_EUROPE',
    website_type: 'BUSINESS_LANDING',
    label: 'Business Landing Page',
    min_price: 1500,
    max_price: 3500,
    notes: 'Commercial service showcase, reviews, location maps, lead capture forms, and analytics integration.',
    is_active: true,
  },
  {
    region: 'US_EUROPE',
    website_type: 'BUSINESS_BOOKING',
    label: 'Business Booking & Appointments Page',
    min_price: 2500,
    max_price: 5000,
    notes: 'Real-time calendar scheduling, staff allocation, deposit payments (Stripe), and automated confirmation webhooks.',
    is_active: true,
  },
  {
    region: 'US_EUROPE',
    website_type: 'SAAS_MARKETING',
    label: 'SaaS Marketing & Product Website',
    min_price: 3000,
    max_price: 10000,
    notes: 'Multi-page feature breakdowns, interactive pricing tables, product demo flows, waitlist forms, and SEO architecture.',
    is_active: true,
  },
  // Global (Outside US / Europe)
  {
    region: 'GLOBAL',
    website_type: 'PERSONAL_PORTFOLIO',
    label: 'Personal Portfolio / CV Website (Global)',
    min_price: 500,
    max_price: 1500,
    notes: 'Calibrated to local purchasing power (30-50% baseline adjustment).',
    is_active: true,
  },
  {
    region: 'GLOBAL',
    website_type: 'BUSINESS_LANDING',
    label: 'Business Landing Page (Global)',
    min_price: 950,
    max_price: 2200,
    notes: 'Full commercial landing page for global clients.',
    is_active: true,
  },
  {
    region: 'GLOBAL',
    website_type: 'BUSINESS_BOOKING',
    label: 'Business Booking & Appointments (Global)',
    min_price: 1500,
    max_price: 3200,
    notes: 'Automated booking and scheduling for international businesses.',
    is_active: true,
  },
  {
    region: 'GLOBAL',
    website_type: 'SAAS_MARKETING',
    label: 'SaaS Marketing & Product (Global)',
    min_price: 2000,
    max_price: 6000,
    notes: 'Global SaaS marketing website with conversion optimization.',
    is_active: true,
  },
]

export async function getPricingConfigs(): Promise<ActionResult<PricingConfig[]>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const supabase = createServiceClient()

  // Ensure default configs seeded
  const { count } = await supabase
    .from('pricing_config')
    .select('*', { count: 'exact', head: true })

  if (!count || count === 0) {
    for (const conf of DEFAULT_PRICING_CONFIGS) {
      await supabase.from('pricing_config').insert(conf)
    }
  }

  const { data: configs, error } = await supabase
    .from('pricing_config')
    .select('*')
    .eq('is_active', true)
    .order('region', { ascending: false })
    .order('min_price', { ascending: true })

  if (error) return { success: false, error: 'Failed to fetch pricing configurations' }

  return { success: true, data: (configs || []) as PricingConfig[] }
}

export async function updatePricingConfig(
  id: string,
  updates: { min_price?: number; max_price?: number | null; notes?: string }
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canManagePricing(session.user.role)) {
    return { success: false, error: 'Only Admins can update pricing configurations' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('pricing_config')
    .update({
      ...updates,
      updated_by: session.user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { success: false, error: 'Failed to update pricing configuration' }

  revalidatePath('/dashboard')
  return { success: true }
}
