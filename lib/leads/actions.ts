'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'
import { canChangeLeadStatus, canViewAllLeads, canEditLead, canTrashLead, canAccessAnalytics } from '@/lib/auth/permissions'
import type { Lead, LeadFormData, LeadStatus, ClientType, ActionResult } from '@/types'
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

export async function createLead(
  formData: LeadFormData,
  draftId?: string
): Promise<ActionResult<{ lead_number: string }>> {
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

  if (draftId) {
    // Upgrading existing draft to active lead
    const { data: updatedLead, error } = await supabase
      .from('leads')
      .update({
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
        is_draft: false,
        status: 'NEW',
      })
      .eq('id', draftId)
      .eq('created_by', user.id)
      .select('id, lead_number')
      .single()

    if (error || !updatedLead) {
      console.error('Lead draft promotion error:', error)
      return { success: false, error: 'Failed to submit draft lead. Please try again.' }
    }

    await supabase.from('lead_status_history').insert({
      lead_id: updatedLead.id,
      old_status: null,
      new_status: 'NEW',
      changed_by: user.id,
      note: 'Draft finalized and lead submitted',
    })

    revalidatePath('/leads')
    revalidatePath('/leads/drafts')
    revalidatePath('/dashboard')
    return { success: true, data: { lead_number: updatedLead.lead_number } }
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
      is_draft: false,
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

export async function saveLeadDraft(
  formData: Partial<LeadFormData>,
  draftId?: string
): Promise<ActionResult<{ draft_id: string }>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const { user } = session
  const supabase = createServiceClient()

  const clientName = formData.client_name?.trim() || 'Untitled Draft'
  const clientType = formData.client_type || 'BUSINESS'
  const websiteType = formData.website_type || 'Business Landing Page'
  const reason = formData.reason || 'NEW_WEBSITE'
  const targetAudience = formData.target_audience || 'Draft in progress'
  const designStyle = formData.design_style || []

  if (draftId) {
    const { data: draft, error } = await supabase
      .from('leads')
      .update({
        client_name: clientName,
        client_type: clientType,
        business_type: formData.business_type || null,
        business_type_other: formData.business_type_other || null,
        website_type: websiteType,
        website_type_other: formData.website_type_other || null,
        reason: reason,
        previous_website_url: formData.previous_website_url || null,
        target_audience: targetAudience,
        design_style: designStyle,
        design_style_other: formData.design_style_other || null,
        inspiration_urls: (formData.inspiration_urls || []).filter(Boolean),
        budget: formData.budget ? parseFloat(formData.budget) || null : null,
        special_features: formData.special_features || null,
        additional_information: formData.additional_information || null,
        is_draft: true,
      })
      .eq('id', draftId)
      .eq('created_by', user.id)
      .select('id')
      .single()

    if (error || !draft) {
      return { success: false, error: 'Failed to update draft' }
    }
    revalidatePath('/leads/drafts')
    return { success: true, data: { draft_id: draft.id } }
  }

  const { data: draft, error } = await supabase
    .from('leads')
    .insert({
      created_by: user.id,
      client_name: clientName,
      client_type: clientType,
      business_type: formData.business_type || null,
      business_type_other: formData.business_type_other || null,
      website_type: websiteType,
      website_type_other: formData.website_type_other || null,
      reason: reason,
      previous_website_url: formData.previous_website_url || null,
      target_audience: targetAudience,
      design_style: designStyle,
      design_style_other: formData.design_style_other || null,
      inspiration_urls: (formData.inspiration_urls || []).filter(Boolean),
      budget: formData.budget ? parseFloat(formData.budget) || null : null,
      special_features: formData.special_features || null,
      additional_information: formData.additional_information || null,
      is_draft: true,
      status: 'NEW',
    })
    .select('id')
    .single()

  if (error || !draft) {
    return { success: false, error: 'Failed to save draft' }
  }

  revalidatePath('/leads/drafts')
  return { success: true, data: { draft_id: draft.id } }
}

export async function getLeadDrafts(): Promise<ActionResult<Lead[]>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const { user } = session
  const supabase = createServiceClient()

  const { data: drafts, error } = await supabase
    .from('leads')
    .select('*')
    .eq('created_by', user.id)
    .eq('is_draft', true)
    .order('updated_at', { ascending: false })

  if (error) return { success: false, error: 'Failed to fetch drafts' }
  return { success: true, data: (drafts || []) as Lead[] }
}

export async function deleteLeadDraft(draftId: string): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const { user } = session
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', draftId)
    .eq('created_by', user.id)
    .eq('is_draft', true)

  if (error) return { success: false, error: 'Failed to delete draft' }

  revalidatePath('/leads/drafts')
  return { success: true }
}

export interface UpdateLeadInput {
  client_name?: string
  client_type?: ClientType
  business_type?: string | null
  business_type_other?: string | null
  website_type?: string
  website_type_other?: string | null
  reason?: 'NEW_WEBSITE' | 'REDO_WEBSITE'
  previous_website_url?: string | null
  target_audience?: string
  design_style?: string[]
  design_style_other?: string | null
  inspiration_urls?: string[]
  budget?: number | null
  special_features?: string | null
  additional_information?: string | null
  status?: LeadStatus
}

export async function updateLeadData(
  leadId: string,
  data: UpdateLeadInput
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canEditLead(session.user.role)) {
    return { success: false, error: 'Only Admins and Super Admins can edit lead details.' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('leads')
    .update({
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
      inspiration_urls: data.inspiration_urls,
      budget: data.budget !== undefined ? data.budget : undefined,
      special_features: data.special_features || null,
      additional_information: data.additional_information || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)

  if (error) {
    console.error('Lead update error:', error)
    return { success: false, error: 'Failed to update lead data.' }
  }

  revalidatePath(`/leads/${leadId}`)
  revalidatePath('/leads')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function trashLead(leadId: string): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canTrashLead(session.user.role)) {
    return { success: false, error: 'Only Admins and Super Admins can trash leads.' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('leads')
    .update({ is_trashed: true, updated_at: new Date().toISOString() })
    .eq('id', leadId)

  if (error) return { success: false, error: 'Failed to trash lead' }

  revalidatePath('/leads')
  revalidatePath(`/leads/${leadId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function restoreLead(leadId: string): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canTrashLead(session.user.role)) {
    return { success: false, error: 'Only Admins and Super Admins can restore leads.' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('leads')
    .update({ is_trashed: false, updated_at: new Date().toISOString() })
    .eq('id', leadId)

  if (error) return { success: false, error: 'Failed to restore lead' }

  revalidatePath('/leads')
  revalidatePath(`/leads/${leadId}`)
  revalidatePath('/dashboard')
  return { success: true }
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
  trashedOnly?: boolean
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
      creator:users!leads_created_by_fkey(id, name, email, avatar_url, role, commission_rate)
    `, { count: 'exact' })

  // Draft filter
  query = query.eq('is_draft', false)

  // Trash filter
  if (filters?.trashedOnly) {
    query = query.eq('is_trashed', true)
  } else {
    query = query.eq('is_trashed', false)
  }

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

export async function getTrashedLeads(): Promise<ActionResult<Lead[]>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canTrashLead(session.user.role)) {
    return { success: true, data: [] }
  }

  const supabase = createServiceClient()
  const { data: leads, error } = await supabase
    .from('leads')
    .select(`
      *,
      creator:users!leads_created_by_fkey(id, name, email, avatar_url, role)
    `)
    .eq('is_draft', false)
    .eq('is_trashed', true)
    .order('updated_at', { ascending: false })

  if (error) return { success: false, error: 'Failed to fetch trashed leads' }
  return { success: true, data: (leads || []) as Lead[] }
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
      creator:users!leads_created_by_fkey(id, name, email, avatar_url, role, commission_rate)
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
    .update({ 
      status: newStatus,
      completed_at: newStatus === 'COMPLETED' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('id', leadId)

  if (error) {
    return { success: false, error: 'Failed to update status' }
  }

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

export async function updateLeadCompletion(
  leadId: string,
  costAmount: number,
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
    .update({
      status: 'COMPLETED',
      cost_amount: costAmount,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)

  if (error) {
    return { success: false, error: 'Failed to complete lead' }
  }

  await supabase.from('lead_status_history').insert({
    lead_id: leadId,
    old_status: lead.status,
    new_status: 'COMPLETED',
    changed_by: session.user.id,
    note: note || `Lead completed with production costs of $${costAmount.toFixed(2)}`,
  })

  revalidatePath('/leads')
  revalidatePath(`/leads/${leadId}`)
  revalidatePath('/dashboard')

  return { success: true }
}

export async function toggleLeadPayment(
  leadId: string,
  field: 'commission_paid' | 'company_paid' | 'costs_paid',
  value: boolean
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canChangeLeadStatus(session.user.role)) {
    return { success: false, error: 'Only Admins can update payment records' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('leads')
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq('id', leadId)

  if (error) return { success: false, error: 'Failed to update payment status' }

  revalidatePath(`/leads/${leadId}`)
  return { success: true }
}

export async function getDashboardMetrics() {
  const session = await getSession()
  if (!session) return null

  const { user } = session
  const supabase = createServiceClient()

  let query = supabase
    .from('leads')
    .select('status, budget, created_by')
    .eq('is_draft', false)
    .eq('is_trashed', false)

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

export async function getAnalyticsData(): Promise<ActionResult<{
  websiteAnalytics: {
    websiteTypes: { name: string; count: number; totalBudget: number; avgBudget: number; completedProfit: number }[]
    statusDistribution: { status: string; label: string; count: number }[]
    categoryPrices: { category: string; min: number; avg: number; max: number; totalVolume: number }[]
    designTagFrequencies: { tag: string; count: number }[]
    revenueTrends: { date: string; revenue: number; leads: number }[]
  }
  salesmanAnalytics: {
    salespeople: {
      id: string
      name: string
      email: string | null
      role: string
      commissionRate: number
      totalLeads: number
      completedLeads: number
      activeLeads: number
      totalRevenue: number
      earnedCommission: number
      companyProfitBrought: number
      websiteTypeBreakdown: { type: string; count: number }[]
      weeklyActivity: { week: string; count: number; revenue: number }[]
    }[]
  }
}>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  if (!canAccessAnalytics(session.user.role)) {
    return { success: false, error: 'Insufficient permissions to view analytics.' }
  }

  const supabase = createServiceClient()

  // Fetch all non-draft, non-trashed leads and all users
  const [leadsRes, usersRes] = await Promise.all([
    supabase
      .from('leads')
      .select(`
        *,
        creator:users!leads_created_by_fkey(id, name, email, role, commission_rate)
      `)
      .eq('is_draft', false)
      .eq('is_trashed', false)
      .order('created_at', { ascending: true }),
    supabase
      .from('users')
      .select('id, name, email, role, commission_rate')
      .order('name', { ascending: true })
  ])

  if (leadsRes.error) return { success: false, error: 'Failed to fetch leads for analytics' }
  const leads = (leadsRes.data || []) as Lead[]
  const users = (usersRes.data || []) as any[]

  // 1. Website Types Breakdown
  const typeMap: Record<string, { count: number; totalBudget: number; budgets: number[]; completedProfit: number }> = {}
  const statusMap: Record<string, number> = {}
  const designTagMap: Record<string, number> = {}
  const dateMap: Record<string, { revenue: number; leads: number }> = {}

  for (const lead of leads) {
    const rawType = lead.website_type === 'OTHER' && lead.website_type_other ? lead.website_type_other : lead.website_type
    const typeKey = rawType || 'Unspecified'
    const budget = lead.budget || 0
    const cost = lead.cost_amount || 0
    const profit = Math.max(0, budget - cost)

    if (!typeMap[typeKey]) {
      typeMap[typeKey] = { count: 0, totalBudget: 0, budgets: [], completedProfit: 0 }
    }
    typeMap[typeKey].count += 1
    typeMap[typeKey].totalBudget += budget
    if (budget > 0) typeMap[typeKey].budgets.push(budget)
    if (lead.status === 'COMPLETED') {
      typeMap[typeKey].completedProfit += profit
    }

    // Status map
    statusMap[lead.status] = (statusMap[lead.status] || 0) + 1

    // Design styles
    if (Array.isArray(lead.design_style)) {
      for (const tag of lead.design_style) {
        if (tag) designTagMap[tag] = (designTagMap[tag] || 0) + 1
      }
    }

    // Date trends (YYYY-MM)
    if (lead.created_at) {
      const monthKey = lead.created_at.slice(0, 7)
      if (!dateMap[monthKey]) dateMap[monthKey] = { revenue: 0, leads: 0 }
      dateMap[monthKey].leads += 1
      if (lead.status === 'COMPLETED') {
        dateMap[monthKey].revenue += budget
      }
    }
  }

  const websiteTypes = Object.entries(typeMap).map(([name, data]) => ({
    name,
    count: data.count,
    totalBudget: data.totalBudget,
    avgBudget: data.budgets.length ? Math.round(data.totalBudget / data.budgets.length) : 0,
    completedProfit: data.completedProfit,
  })).sort((a, b) => b.count - a.count)

  const statusLabels: Record<string, string> = {
    NEW: 'New',
    STILL_INQUIRING: 'Still Inquiring',
    WEBSITE_IN_PROGRESS: 'In Progress',
    DELIVERY_IN_PROGRESS: 'Delivery',
    REJECTED: 'Rejected',
    COMPLETED: 'Completed',
  }

  const statusDistribution = Object.entries(statusMap).map(([status, count]) => ({
    status,
    label: statusLabels[status] || status,
    count,
  }))

  const categoryPrices = Object.entries(typeMap).map(([category, data]) => {
    const sorted = [...data.budgets].sort((a, b) => a - b)
    return {
      category,
      min: sorted.length ? sorted[0] : 0,
      avg: sorted.length ? Math.round(data.totalBudget / sorted.length) : 0,
      max: sorted.length ? sorted[sorted.length - 1] : 0,
      totalVolume: data.count,
    }
  }).sort((a, b) => b.totalVolume - a.totalVolume)

  const designTagFrequencies = Object.entries(designTagMap).map(([tag, count]) => ({
    tag,
    count,
  })).sort((a, b) => b.count - a.count)

  const revenueTrends = Object.entries(dateMap).map(([date, val]) => ({
    date,
    revenue: val.revenue,
    leads: val.leads,
  })).sort((a, b) => a.date.localeCompare(b.date))

  // 2. Salespeople Analytics
  const salespeople = users.map((u) => {
    const userLeads = leads.filter((l) => l.created_by === u.id)
    const completed = userLeads.filter((l) => l.status === 'COMPLETED')
    const active = userLeads.filter((l) => ['NEW', 'STILL_INQUIRING', 'WEBSITE_IN_PROGRESS', 'DELIVERY_IN_PROGRESS'].includes(l.status))
    const totalRev = completed.reduce((sum, l) => sum + (l.budget || 0), 0)
    const rate = u.commission_rate !== undefined && u.commission_rate !== null ? Number(u.commission_rate) : 50

    // Commission is calculated from net profit of completed leads: (budget - cost_amount) * rate / 100
    let totalCommission = 0
    let totalCompanyProfit = 0

    for (const lead of completed) {
      const budget = lead.budget || 0
      const cost = lead.cost_amount || 0
      const netProfit = Math.max(0, budget - cost)
      const comm = (netProfit * rate) / 100
      totalCommission += comm
      totalCompanyProfit += (netProfit - comm)
    }

    const typeCounts: Record<string, number> = {}
    for (const l of userLeads) {
      const t = l.website_type === 'OTHER' && l.website_type_other ? l.website_type_other : l.website_type
      typeCounts[t] = (typeCounts[t] || 0) + 1
    }
    const websiteTypeBreakdown = Object.entries(typeCounts).map(([type, count]) => ({ type, count }))

    // Weekly activity map (YYYY-WW)
    const weekMap: Record<string, { count: number; revenue: number }> = {}
    for (const l of userLeads) {
      if (l.created_at) {
        const d = new Date(l.created_at)
        const weekNum = Math.ceil((((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000) + 1) / 7)
        const weekKey = `W${weekNum} (${d.toLocaleString('default', { month: 'short' })})`
        if (!weekMap[weekKey]) weekMap[weekKey] = { count: 0, revenue: 0 }
        weekMap[weekKey].count += 1
        if (l.status === 'COMPLETED') weekMap[weekKey].revenue += (l.budget || 0)
      }
    }
    const weeklyActivity = Object.entries(weekMap).map(([week, v]) => ({ week, count: v.count, revenue: v.revenue }))

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      commissionRate: rate,
      totalLeads: userLeads.length,
      completedLeads: completed.length,
      activeLeads: active.length,
      totalRevenue: totalRev,
      earnedCommission: totalCommission,
      companyProfitBrought: totalCompanyProfit,
      websiteTypeBreakdown,
      weeklyActivity,
    }
  }).sort((a, b) => b.totalRevenue - a.totalRevenue)

  return {
    success: true,
    data: {
      websiteAnalytics: {
        websiteTypes,
        statusDistribution,
        categoryPrices,
        designTagFrequencies,
        revenueTrends,
      },
      salesmanAnalytics: {
        salespeople,
      },
    },
  }
}
