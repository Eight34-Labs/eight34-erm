// ============================================================
// Eight34 ERM — Core TypeScript Types
// ============================================================

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'SALES'

export type LeadStatus =
  | 'NEW'
  | 'STILL_INQUIRING'
  | 'WEBSITE_IN_PROGRESS'
  | 'DELIVERY_IN_PROGRESS'
  | 'REJECTED'
  | 'COMPLETED'

export type ClientType = 'PERSONAL' | 'BUSINESS' | 'SAAS'

export interface User {
  id: string
  slack_user_id: string
  slack_team_id: string
  name: string
  email: string | null
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  is_approved: boolean
  training_completed: boolean
  training_version: number | null
  quiz_score: number | null
  training_completed_at: string | null
  created_at: string
  updated_at: string
}

export interface TrainingModule {
  id: string
  module_number: number
  title: string
  description: string | null
  content: TrainingModuleContent
  version: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface TrainingModuleContent {
  overview?: string
  sections: TrainingSection[]
  key_takeaways?: string[]
}

export interface TrainingSection {
  heading: string
  body: string
  bullets?: string[]
  callout?: { type: 'info' | 'warning' | 'tip'; text: string }
}

export interface TrainingProgress {
  id: string
  user_id: string
  module_id: string
  completed: boolean
  completed_at: string | null
  created_at: string
}

export interface QuizQuestion {
  id: string
  question: string
  question_type: string
  options: string[]
  correct_answer: string
  explanation: string
  module_id: string | null
  difficulty: 'easy' | 'medium' | 'hard'
  version: number
  is_active: boolean
  created_at: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  score: number
  total_questions: number
  passed: boolean
  answers: Record<string, string>
  training_version: number | null
  started_at: string
  completed_at: string | null
}

export interface Lead {
  id: string
  lead_number: string
  created_by: string
  client_name: string
  client_type: ClientType
  business_type: string | null
  business_type_other: string | null
  website_type: string
  website_type_other: string | null
  reason: 'NEW_WEBSITE' | 'REDO_WEBSITE'
  previous_website_url: string | null
  target_audience: string
  design_style: string[]
  design_style_other: string | null
  inspiration_urls: string[]
  budget: number | null
  special_features: string | null
  additional_information: string | null
  status: LeadStatus
  created_at: string
  updated_at: string
  completed_at: string | null
  // joined
  creator?: User
}

export interface LeadStatusHistory {
  id: string
  lead_id: string
  old_status: LeadStatus | null
  new_status: LeadStatus
  changed_by: string | null
  note: string | null
  created_at: string
  changer?: User
}

export interface PricingConfig {
  id: string
  region: 'US_EUROPE' | 'GLOBAL'
  website_type: string
  label: string
  min_price: number
  max_price: number | null
  notes: string | null
  is_active: boolean
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string
  token: string
  expires_at: string
  created_at: string
}

// ============================================================
// Lead form step types
// ============================================================

export interface LeadFormData {
  // Step 1
  client_name: string
  client_type: ClientType | ''
  // Step 2 (conditional)
  business_type: string
  business_type_other: string
  // Step 3
  website_type: string
  website_type_other: string
  // Step 4
  reason: 'NEW_WEBSITE' | 'REDO_WEBSITE' | ''
  previous_website_url: string
  // Step 5
  target_audience: string
  // Step 6
  design_style: string[]
  design_style_other: string
  // Step 7
  inspiration_urls: string[]
  budget: string
  special_features: string
  // Step 8
  additional_information: string
}

// ============================================================
// API / Server Action response types
// ============================================================

export interface ActionResult<T = undefined> {
  success: boolean
  data?: T
  error?: string
}

export interface DashboardMetrics {
  total_leads: number
  new_leads: number
  active_leads: number
  completed_leads: number
  rejected_leads: number
  pipeline_value: number
  completed_revenue: number
  conversion_rate: number
}
