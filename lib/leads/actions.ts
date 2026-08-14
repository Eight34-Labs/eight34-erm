'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'
import { canChangeLeadStatus, canViewAllLeads } from '@/lib/auth/permissions'
import type { Lead, LeadFormData, LeadStatus, ActionResult } from '@/types'
import { z } from 'zod'
import { isValidUrl } from '@/lib/utils'

const LeadFormSchema = z.object({
  client_name: z.string().min(2, 'Client name is required').max(200),
  client_type: z.enum(['PERSONAL', 'BUSINESS', 'SAAS']),
  business_type: z.string().optional(),
  business_type_other: z.string().optional(),
  website_type: z.string().min(1, 'Website type is required'),
  website_type_other: z.string().optional(),
  reason: z.enum(['NEW_WEBSITE', 'REDO_WEBSITE']),
  previous_website_url: z.string().optional().refine(
    (val) => !val || isValidUrl(val),
    'Must be a valid URL'
  ),
  target_audience: z.string().min(20, 'Please provide more detail about the target audience'),
  design_style: z.array(z.string()).min(1, 'Select at least one design style'),
  design_style_other: z.string().optional(),
  inspiration_urls: z.array(z.string()).refine(
    (urls) => urls.every((u) => !u || isValidUrl(u)),
    'All inspiration URLs must be valid'
  ),
  budget: z.string().refine(
    (v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0),
    'Budget must be a valid number'
  ),
  special_features: z.string().optional(),
  additional_information: z.string().optional(),
})

export async function createLead(formData: LeadFormData): Promise<ActionResult<{ lead_number: string }>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const { user } = session

  // Must have completed training — but only SALES reps are gated; admins bypass
  if (user.role === 'SALES' && !user.training_completed) {
    return { success: false, error: 'Training must be completed before submitting leads' }
  }

  const parsed = LeadFormSchema.safeParse(formData)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]
    return { success: false, error: firstError.message }
  }

  const data = parsed.data
  const supabase = createServiceClient()

  // Validate conditional fields
  if (data.reason === 'REDO_WEBSITE' && !data.previous_website_url) {
    return { success: false, error: 'Previous website URL is required for a redo' }
  }

  if (data.client_type === 'BUSINESS' && !data.business_type) {
    return { success: false, error: 'Business type is required' }
  }

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      created_by: user.id,
      client_name: data.client_name,
      client_type: data.client_type,
      business_type: data.business_type || null,
      business_type_other: data.business_type_other || null,
      website_type: data.website_type,
      website_type_other: data.website_type_other || null,
      reason: data.reason,
      previous_website_url: data.previous_website_url || null,
      target_audience: data.target_audience,
      design_style: data.design_style,
      design_style_other: data.design_style_other || null,
      inspiration_urls: data.inspiration_urls.filter(Boolean),
      budget: data.budget ? parseFloat(data.budget) : null,
      special_features: data.special_features || null,
      additional_information: data.additional_information || null,
      status: 'NEW',
    })
    .select('id, lead_number')
    .single()

  if (error || !lead) {
    console.error('Lead creation error:', error)
    return { success: false, error: 'Failed to create lead. Please try again.' }
  }

  // Log initial status
  await supabase.from('lead_status_history').insert({
    lead_id: lead.id,
    old_status: null,
    new_status: 'NEW',
    changed_by: user.id,
    note: 'Lead submitted',
  })

  revalidatePath('/leads')
  revalidatePath('/dashboard')

  return { success: true, data: { lead_number: lead.lead_number } }
}

export async function getLeads(filters?: {
  status?: LeadStatus
  client_type?: string
  business_type?: string
  search?: string
  salesperson_id?: string
  sort?: 'created_at' | 'budget'
  order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}): Promise<ActionResult<{ leads: Lead[]; total: number }>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const { user } = session
  const supabase = createServiceClient()

  const page = filters?.page || 1
  const perPage = filters?.per_page || 30
  const offset = (page - 1) * perPage

  let query = supabase
    .from('leads')
    .select(`
      *,
      creator:users!leads_created_by_fkey(id, name, email, avatar_url, role)
    `, { count: 'exact' })

  // Role-based filtering
  if (!canViewAllLeads(user.role)) {
    query = query.eq('created_by', user.id)
  }

  // Apply filters
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.client_type) query = query.eq('client_type', filters.client_type)
  if (filters?.business_type) query = query.eq('business_type', filters.business_type)
  if (filters?.salesperson_id && canViewAllLeads(user.role)) {
    query = query.eq('created_by', filters.salesperson_id)
  }
  if (filters?.search) {
    query = query.or(
      `client_name.ilike.%${filters.search}%,lead_number.ilike.%${filters.search}%`
    )
  }

  // Sort
  const sortCol = filters?.sort || 'created_at'
  const sortOrder = filters?.order || 'desc'
  query = query.order(sortCol, { ascending: sortOrder === 'asc' })

  // Pagination
  query = query.range(offset, offset + perPage - 1)

  const { data: leads, error, count } = await query

  if (error) {
    console.error('Leads fetch error:', error)
    return { success: false, error: 'Failed to fetch leads' }
  }

  return { success: true, data: { leads: (leads || []) as Lead[], total: count || 0 } }
}

export async function getLeadById(id: string): Promise<ActionResult<Lead & { history: any[] }>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const { user } = session
  const supabase = createServiceClient()

  const { data: lead, error } = await supabase
    .from('leads')
    .select(`
      *,
      creator:users!leads_created_by_fkey(id, name, email, avatar_url, role)
    `)
    .or(`id.eq.${id},lead_number.eq.${id}`)
    .single()

  if (error || !lead) {
    return { success: false, error: 'Lead not found' }
  }

  // Check access
  if (!canViewAllLeads(user.role) && lead.created_by !== user.id) {
    return { success: false, error: 'Access denied' }
  }

  const { data: history } = await supabase
    .from('lead_status_history')
    .select(`
      *,
      changer:users!lead_status_history_changed_by_fkey(id, name, avatar_url)
    `)
    .eq('lead_id', lead.id)
    .order('created_at', { ascending: true })

  return { success: true, data: { ...lead, history: history || [] } }
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadStatus,
  note?: string
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canChangeLeadStatus(session.user.role)) {
    return { success: false, error: 'Insufficient permissions' }
  }

  const supabase = createServiceClient()

  const { data: lead, error: fetchError } = await supabase
    .from('leads')
    .select('id, status')
    .eq('id', leadId)
    .single()

  if (fetchError || !lead) {
    return { success: false, error: 'Lead not found' }
  }

  const { error } = await supabase
    .from('leads')
    .update({ status: newStatus })
    .eq('id', leadId)

  if (error) {
    return { success: false, error: 'Failed to update status' }
  }

  // Manually log the status change (trigger also does this, belt-and-suspenders)
  await supabase.from('lead_status_history').insert({
    lead_id: leadId,
    old_status: lead.status,
    new_status: newStatus,
    changed_by: session.user.id,
    note: note || null,
  })

  revalidatePath('/leads')
  revalidatePath(`/leads/${leadId}`)
  revalidatePath('/dashboard')

  return { success: true }
}

export async function getDashboardMetrics() {
  const session = await getSession()
  if (!session) return null

  const { user } = session
  const supabase = createServiceClient()

  let query = supabase.from('leads').select('status, budget, created_by')

  if (!canViewAllLeads(user.role)) {
    query = query.eq('created_by', user.id)
  }

  const { data: leads } = await query

  if (!leads) return null

  const total_leads = (leads || []).length
  const new_leads = (leads || []).filter((l: { status: string }) => l.status === 'NEW').length
  const active_leads = (leads || []).filter((l: { status: string }) =>
    ['STILL_INQUIRING', 'WEBSITE_IN_PROGRESS', 'DELIVERY_IN_PROGRESS'].includes(l.status)
  ).length
  const completed_leads = (leads || []).filter((l: { status: string }) => l.status === 'COMPLETED').length
  const rejected_leads = (leads || []).filter((l: { status: string }) => l.status === 'REJECTED').length
  const pipeline_value = (leads || [])
    .filter((l: { status: string; budget: number | null }) => !['COMPLETED', 'REJECTED'].includes(l.status))
    .reduce((sum: number, l: { budget: number | null }) => sum + (l.budget || 0), 0)
  const completed_revenue = (leads || [])
    .filter((l: { status: string; budget: number | null }) => l.status === 'COMPLETED')
    .reduce((sum: number, l: { budget: number | null }) => sum + (l.budget || 0), 0)
  const conversion_rate =
    total_leads > 0 ? Math.round((completed_leads / total_leads) * 100) : 0

  return {
    total_leads,
    new_leads,
    active_leads,
    completed_leads,
    rejected_leads,
    pipeline_value,
    completed_revenue,
    conversion_rate,
  }
}
