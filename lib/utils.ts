import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { LeadStatus, UserRole } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | null | undefined, compact = false): string {
  if (value === null || value === undefined) return '—'
  if (compact && value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDate(dateString: string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(dateString))
}

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; className: string; dotClassName: string }
> = {
  NEW: {
    label: 'New',
    className: 'badge-status-new',
    dotClassName: 'bg-slate-500',
  },
  STILL_INQUIRING: {
    label: 'Still Inquiring',
    className: 'badge-status-inquiring',
    dotClassName: 'bg-amber-500',
  },
  WEBSITE_IN_PROGRESS: {
    label: 'Website in Progress',
    className: 'badge-status-progress',
    dotClassName: 'bg-indigo-500',
  },
  DELIVERY_IN_PROGRESS: {
    label: 'Delivery in Progress',
    className: 'badge-status-delivery',
    dotClassName: 'bg-orange-500',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'badge-status-rejected',
    dotClassName: 'bg-red-500',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'badge-status-completed',
    dotClassName: 'bg-emerald-500',
  },
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  SALES: 'Sales',
}

export const CLIENT_TYPE_LABELS: Record<string, string> = {
  PERSONAL: 'Personal',
  BUSINESS: 'Business',
  SAAS: 'SaaS',
}

export const REASON_LABELS: Record<string, string> = {
  NEW_WEBSITE: 'New Website',
  REDO_WEBSITE: 'Redo Website',
}

export const BUSINESS_TYPES = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'BARBER_SHOP', label: 'Barber Shop' },
  { value: 'STORE', label: 'Store' },
  { value: 'NONPROFIT', label: 'Nonprofit / Organization' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'IT', label: 'IT' },
  { value: 'OTHER', label: 'Other' },
] as const

export const WEBSITE_TYPES = {
  PERSONAL: [
    { value: 'PORTFOLIO', label: 'Portfolio' },
    { value: 'RESUME_CV', label: 'Resume / CV Website' },
    { value: 'EVENT', label: 'Event Website' },
    { value: 'PERSONAL_LANDING', label: 'Personal Landing Page' },
    { value: 'OTHER', label: 'Other' },
  ],
  BUSINESS: [
    { value: 'BUSINESS_LANDING', label: 'Business Landing Page' },
    { value: 'BUSINESS_EVENT', label: 'Business Event Website' },
    { value: 'BUSINESS_BOOKING', label: 'Business Booking Page' },
  ],
  SAAS: [
    { value: 'SAAS_LANDING', label: 'SaaS Landing Page' },
    { value: 'SAAS_MARKETING', label: 'SaaS Marketing Website' },
    { value: 'SAAS_PRODUCT', label: 'SaaS Product Website' },
    { value: 'SAAS_REDESIGN', label: 'SaaS Redesign' },
    { value: 'OTHER', label: 'Other' },
  ],
} as const

export const DESIGN_STYLES = [
  'Minimal',
  'Modern',
  'Corporate',
  'Luxury',
  'Playful',
  'Bold',
  'Editorial',
  'Dark',
  'Clean',
  'Futuristic',
  'Professional',
  'Creative',
  'Colorful',
  'Other',
] as const

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}
