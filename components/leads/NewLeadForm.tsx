'use client'

import { useState, useTransition, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Cloud, 
  CloudCheck, 
  Loader2, 
  Plus, 
  Trash2,
  Building2,
  User as UserIcon,
  Laptop,
  Compass,
  Layers,
  Palette,
  DollarSign,
  ClipboardCheck,
  Globe,
  ExternalLink
} from 'lucide-react'
import type { ClientType, LeadFormData, Lead, PricingConfig } from '@/types'
import { BUSINESS_TYPES, DESIGN_STYLES, WEBSITE_TYPES, formatCurrency, isValidUrl } from '@/lib/utils'
import { createLead, saveLeadDraft } from '@/lib/leads/actions'
import PricingGuideModal from '@/components/leads/PricingGuideModal'

const TOTAL_STEPS = 8

const STEP_DEFINITIONS = [
  { num: 1, label: 'Client Entity', icon: UserIcon, desc: 'Client identification' },
  { num: 2, label: 'Category', icon: Building2, desc: 'Enterprise vertical' },
  { num: 3, label: 'Classification', icon: Laptop, desc: 'Website functional model' },
  { num: 4, label: 'Scope', icon: Compass, desc: 'New build vs redesign' },
  { num: 5, label: 'Audience', icon: Layers, desc: 'Target demographics' },
  { num: 6, label: 'Aesthetics', icon: Palette, desc: 'Brand & visual tags' },
  { num: 7, label: 'Commercials', icon: DollarSign, desc: 'Quoting & features' },
  { num: 8, label: 'Review', icon: ClipboardCheck, desc: 'Pipeline submission' },
]

interface NewLeadFormProps {
  pricingConfigs?: PricingConfig[]
  initialDraft?: Lead
  draftId?: string
}

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function NewLeadForm({
  pricingConfigs = [],
  initialDraft,
  draftId: initialDraftId,
}: NewLeadFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, startTransition] = useTransition()
  const [draftId, setDraftId] = useState<string | undefined>(initialDraftId)
  const [saveStatus, setSaveStatus] = useState<AutoSaveStatus>('idle')
  const [isPricingGuideOpen, setIsPricingGuideOpen] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [formData, setFormData] = useState<LeadFormData>({
    client_name: initialDraft?.client_name || '',
    client_type: (initialDraft?.client_type as ClientType) || '',
    business_type: initialDraft?.business_type || '',
    business_type_other: initialDraft?.business_type_other || '',
    website_type: initialDraft?.website_type || '',
    website_type_other: initialDraft?.website_type_other || '',
    reason: (initialDraft?.reason as 'NEW_WEBSITE' | 'REDO_WEBSITE') || '',
    previous_website_url: initialDraft?.previous_website_url || '',
    target_audience: initialDraft?.target_audience || '',
    design_style: initialDraft?.design_style || [],
    design_style_other: initialDraft?.design_style_other || '',
    inspiration_urls: initialDraft?.inspiration_urls && initialDraft.inspiration_urls.length > 0 ? initialDraft.inspiration_urls : [''],
    budget: initialDraft?.budget ? String(initialDraft.budget) : '',
    special_features: initialDraft?.special_features || '',
    additional_information: initialDraft?.additional_information || '',
  })

  // Ref to hold current draft ID and form data to prevent stale closures during async auto-save
  const currentDraftIdRef = useRef<string | undefined>(draftId)
  const formDataRef = useRef<LeadFormData>(formData)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    currentDraftIdRef.current = draftId
  }, [draftId])

  useEffect(() => {
    formDataRef.current = formData
  }, [formData])

  // Core Auto-Save Function
  const autoSaveDraftNow = useCallback(async (dataToSave: LeadFormData) => {
    // Only auto-save if at least client_name or some fields have been touched
    const hasData = 
      dataToSave.client_name.trim() || 
      dataToSave.client_type || 
      dataToSave.website_type || 
      dataToSave.reason || 
      dataToSave.target_audience.trim() || 
      dataToSave.budget.trim()

    if (!hasData) return

    setSaveStatus('saving')
    try {
      const res = await saveLeadDraft(dataToSave, currentDraftIdRef.current)
      if (res.success && res.data) {
        if (!currentDraftIdRef.current) {
          setDraftId(res.data.draft_id)
          currentDraftIdRef.current = res.data.draft_id
        }
        setSaveStatus('saved')
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = setTimeout(() => {
          setSaveStatus('idle')
        }, 3000)
      } else {
        setSaveStatus('error')
      }
    } catch (err) {
      console.error('Auto-save failed:', err)
      setSaveStatus('error')
    }
  }, [])

  // Handle immediate field change (for radio cards, selects, tags) -> auto-saves immediately
  const updateFieldAndAutoSave = (field: keyof LeadFormData, value: any) => {
    const nextData = { ...formData, [field]: value }
    setFormData(nextData)
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    // Auto-save immediately on selection changes
    autoSaveDraftNow(nextData)
  }

  // Handle text input change (updates state without immediate network save; waits for onBlur)
  const updateTextField = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  // Text box onBlur handler -> trigger auto-save when user leaves the textbox
  const handleTextBlur = () => {
    autoSaveDraftNow(formDataRef.current)
  }

  // Handle multi-select toggle for design styles
  const toggleDesignStyle = (style: string) => {
    const exists = formData.design_style.includes(style)
    const nextStyles = exists
      ? formData.design_style.filter((s) => s !== style)
      : [...formData.design_style, style]
    const nextData = { ...formData, design_style: nextStyles }
    setFormData(nextData)
    if (errors.design_style) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.design_style
        return next
      })
    }
    autoSaveDraftNow(nextData)
  }

  // Handle inspiration URLs
  const updateInspirationUrl = (index: number, val: string) => {
    const urls = [...formData.inspiration_urls]
    urls[index] = val
    setFormData((prev) => ({ ...prev, inspiration_urls: urls }))
  }

  const addInspirationUrl = () => {
    if (formData.inspiration_urls.length < 5) {
      const urls = [...formData.inspiration_urls, '']
      const nextData = { ...formData, inspiration_urls: urls }
      setFormData(nextData)
      autoSaveDraftNow(nextData)
    }
  }

  const removeInspirationUrl = (index: number) => {
    const urls = formData.inspiration_urls.filter((_, i) => i !== index)
    const nextUrls = urls.length > 0 ? urls : ['']
    const nextData = { ...formData, inspiration_urls: nextUrls }
    setFormData(nextData)
    autoSaveDraftNow(nextData)
  }

  // Validation per step
  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.client_name.trim()) stepErrors.client_name = 'Client or business name is required.'
      if (!formData.client_type) stepErrors.client_type = 'Please select a client classification.'
    } else if (step === 2) {
      if (formData.client_type === 'BUSINESS') {
        if (!formData.business_type) stepErrors.business_type = 'Please select a business category.'
        if (formData.business_type === 'OTHER' && !formData.business_type_other.trim()) {
          stepErrors.business_type_other = 'Please specify the business category.'
        }
      }
    } else if (step === 3) {
      if (!formData.website_type) stepErrors.website_type = 'Please select a website classification.'
      if (formData.website_type === 'OTHER' && !formData.website_type_other.trim()) {
        stepErrors.website_type_other = 'Please specify the custom website type.'
      }
    } else if (step === 4) {
      if (!formData.reason) stepErrors.reason = 'Please indicate if this is a new website or redesign.'
      if (formData.reason === 'REDO_WEBSITE') {
        if (!formData.previous_website_url.trim()) {
          stepErrors.previous_website_url = 'Existing website URL is required for a redesign.'
        } else if (!isValidUrl(formData.previous_website_url)) {
          stepErrors.previous_website_url = 'Please enter a valid URL (e.g., https://example.com).'
        }
      }
    } else if (step === 5) {
      if (!formData.target_audience.trim()) {
        stepErrors.target_audience = 'Target audience definition is required.'
      } else if (formData.target_audience.trim().length < 20) {
        stepErrors.target_audience = 'Please provide more specific details about the target demographic, geography, and primary problem (min 20 characters).'
      }
    } else if (step === 6) {
      if (formData.design_style.length === 0) {
        stepErrors.design_style = 'Please select at least one design aesthetic tag.'
      }
      if (formData.design_style.includes('Other') && !formData.design_style_other.trim()) {
        stepErrors.design_style_other = 'Please specify the custom design style.'
      }
    } else if (step === 7) {
      if (formData.budget.trim()) {
        const num = parseFloat(formData.budget)
        if (isNaN(num) || num < 0) {
          stepErrors.budget = 'Quoted price must be a valid positive number.'
        }
      }
      for (const u of formData.inspiration_urls) {
        if (u.trim() && !isValidUrl(u)) {
          stepErrors.inspiration_urls = `Invalid URL: "${u}". Please enter web addresses with http:// or https://.`
          break
        }
      }
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  // Handle Step Forward
  const handleNext = () => {
    if (!validateStep(currentStep)) return

    // Auto-save on next
    autoSaveDraftNow(formData)

    if (currentStep === 1 && formData.client_type !== 'BUSINESS') {
      setCurrentStep(3)
    } else {
      setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1))
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle Step Backward
  const handlePrev = () => {
    autoSaveDraftNow(formData)
    if (currentStep === 3 && formData.client_type !== 'BUSINESS') {
      setCurrentStep(1)
    } else {
      setCurrentStep((prev) => Math.max(1, prev - 1))
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Final Submission
  const handleSubmitLead = () => {
    setSubmitError(null)
    startTransition(async () => {
      const res = await createLead(formData, draftId)
      if (res.success && res.data) {
        router.push('/leads')
        router.refresh()
      } else {
        setSubmitError(res.error || 'Failed to submit lead. Please check all fields.')
      }
    })
  }

  const getWebsiteTypeOptions = () => {
    if (formData.client_type === 'PERSONAL') return WEBSITE_TYPES.PERSONAL
    if (formData.client_type === 'BUSINESS') return WEBSITE_TYPES.BUSINESS
    if (formData.client_type === 'SAAS') return WEBSITE_TYPES.SAAS
    return []
  }

  const activeStepsCount = formData.client_type === 'BUSINESS' ? 8 : 7
  const currentStepDisplayNum = formData.client_type !== 'BUSINESS' && currentStep > 2 ? currentStep - 1 : currentStep
  const progressPercent = Math.round((currentStepDisplayNum / activeStepsCount) * 100)

  return (
    <div className="new-lead-container" style={{ maxWidth: '860px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Link 
              href="/leads" 
              className="text-meta" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
            >
              <ArrowLeft style={{ width: '13px', height: '13px' }} />
              Leads
            </Link>
            <span className="text-meta" style={{ color: 'var(--ink-300)' }}>/</span>
            <span className="text-meta" style={{ color: 'var(--ink-700)', fontWeight: 500 }}>
              {draftId ? 'Draft Intake' : 'New Lead'}
            </span>
          </div>
          <h1 className="text-heading-xl" style={{ margin: 0 }}>
            {draftId && formData.client_name ? `Intake: ${formData.client_name}` : 'Register New Lead'}
          </h1>
        </div>

        {/* Live Subtle Auto-Save Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--ink-400)' }}>
          {saveStatus === 'saving' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--ink-500)' }}>
              <Loader2 style={{ width: '13px', height: '13px', animation: 'spin 1s linear infinite' }} />
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#166534' }}>
              <Check style={{ width: '13px', height: '13px' }} />
              Auto-saved
            </span>
          )}
          {saveStatus === 'idle' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--ink-400)' }}>
              <Cloud style={{ width: '13px', height: '13px', opacity: 0.6 }} />
              Draft auto-saves
            </span>
          )}
          {saveStatus === 'error' && (
            <span style={{ color: '#dc2626' }}>
              Auto-save failed
            </span>
          )}
        </div>
      </div>

      {/* Modern Step Wizard Navigation */}
      <div 
        className="card" 
        style={{ 
          marginBottom: '24px', 
          padding: '16px 20px', 
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--ink-150)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink-800)' }}>
            Step {currentStepDisplayNum} of {activeStepsCount}: {STEP_DEFINITIONS[currentStep - 1]?.label}
          </div>
          <div className="text-meta" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
            {progressPercent}% Complete
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '5px', width: '100%', backgroundColor: 'var(--ink-100)', borderRadius: '99px', overflow: 'hidden', marginBottom: '16px' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${progressPercent}%`, 
              backgroundColor: 'var(--e34-accent)', 
              borderRadius: '99px',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
            }} 
          />
        </div>

        {/* Step Nodes Pills */}
        <div 
          className="step-pills-scroll"
          style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto', 
            paddingBottom: '2px',
            scrollbarWidth: 'none',
          }}
        >
          {STEP_DEFINITIONS.map((def) => {
            const stepNum = def.num
            const isSkipped = stepNum === 2 && formData.client_type && formData.client_type !== 'BUSINESS'
            if (isSkipped) return null

            const isDone = currentStep > stepNum
            const isActive = currentStep === stepNum
            const StepIcon = def.icon

            return (
              <div
                key={stepNum}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 650 : 500,
                  color: isActive ? 'var(--e34-accent)' : isDone ? 'var(--ink-700)' : 'var(--ink-400)',
                  backgroundColor: isActive ? 'var(--ink-50)' : 'transparent',
                  border: isActive ? '1px solid var(--ink-200)' : '1px solid transparent',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all var(--transition)',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    backgroundColor: isDone ? '#dcfce7' : isActive ? 'var(--e34-accent)' : 'var(--ink-100)',
                    color: isDone ? '#166534' : isActive ? '#ffffff' : 'var(--ink-500)',
                  }}
                >
                  {isDone ? <Check style={{ width: '10px', height: '10px' }} /> : stepNum}
                </div>
                <span>{def.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Step Form Card */}
      <div 
        className="card" 
        style={{ 
          padding: '32px', 
          backgroundColor: 'var(--surface)', 
          border: '1px solid var(--ink-150)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Step 1: Client Entity */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div className="text-label" style={{ marginBottom: '4px' }}>Step 1 — Entity</div>
              <h2 className="text-heading-lg" style={{ margin: '0 0 4px 0' }}>Client Information</h2>
              <p className="text-meta" style={{ fontSize: '0.875rem', margin: 0 }}>
                Enter the client entity or stakeholder name and choose their core classification.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px' }}>
                Client or Business Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                className={`input ${errors.client_name ? 'input-error' : ''}`}
                style={{ width: '100%', fontSize: '0.9375rem', padding: '10px 14px' }}
                placeholder="e.g. Acme Studio, Marcus Vance, or Hyperion Logistics"
                value={formData.client_name}
                onChange={(e) => updateTextField('client_name', e.target.value)}
                onBlur={handleTextBlur}
                autoFocus
              />
              {errors.client_name && <p className="field-error" style={{ marginTop: '6px' }}>{errors.client_name}</p>}
            </div>

            <div>
              <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '10px' }}>
                Client Classification <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                  gap: '14px' 
                }}
              >
                {[
                  {
                    type: 'PERSONAL' as ClientType,
                    icon: UserIcon,
                    title: 'Personal',
                    desc: 'Individuals, creatives, consultants, and public figures needing a portfolio or personal CV landing.',
                  },
                  {
                    type: 'BUSINESS' as ClientType,
                    icon: Building2,
                    title: 'Business',
                    desc: 'Local & regional commercial services, clinics, hospitality, retail, and corporate companies.',
                  },
                  {
                    type: 'SAAS' as ClientType,
                    icon: Laptop,
                    title: 'SaaS / Tech',
                    desc: 'Software startups, developer products, and B2B tech platforms requiring high-conversion funnels.',
                  },
                ].map((item) => {
                  const isSelected = formData.client_type === item.type
                  const CardIcon = item.icon
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => updateFieldAndAutoSave('client_type', item.type)}
                      style={{
                        textAlign: 'left',
                        padding: '18px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--e34-accent)' : '1px solid var(--ink-200)',
                        backgroundColor: isSelected ? 'var(--ink-50)' : 'var(--surface)',
                        cursor: 'pointer',
                        transition: 'all var(--transition)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CardIcon style={{ width: '18px', height: '18px', color: isSelected ? 'var(--e34-accent)' : 'var(--ink-500)' }} />
                          <span style={{ fontWeight: 650, fontSize: '0.9375rem', color: 'var(--ink-900)' }}>{item.title}</span>
                        </div>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: isSelected ? '5px solid var(--e34-accent)' : '2px solid var(--ink-300)',
                            backgroundColor: 'var(--surface)',
                          }}
                        />
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ink-500)', lineHeight: 1.45 }}>
                        {item.desc}
                      </p>
                    </button>
                  )
                })}
              </div>
              {errors.client_type && <p className="field-error" style={{ marginTop: '8px' }}>{errors.client_type}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Business Category (Conditional for BUSINESS clients) */}
        {currentStep === 2 && formData.client_type === 'BUSINESS' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div className="text-label" style={{ marginBottom: '4px' }}>Step 2 — Business Category</div>
              <h2 className="text-heading-lg" style={{ margin: '0 0 4px 0' }}>Industry &amp; Commercial Vertical</h2>
              <p className="text-meta" style={{ fontSize: '0.875rem', margin: 0 }}>
                Select the specific market vertical that best characterizes this business.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px' }}>
                Business Category <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                className={`select ${errors.business_type ? 'input-error' : ''}`}
                style={{ width: '100%', fontSize: '0.9375rem', padding: '10px 14px' }}
                value={formData.business_type}
                onChange={(e) => updateFieldAndAutoSave('business_type', e.target.value)}
              >
                <option value="">-- Select business category --</option>
                {BUSINESS_TYPES.map((bt) => (
                  <option key={bt.value} value={bt.value}>
                    {bt.label}
                  </option>
                ))}
              </select>
              {errors.business_type && <p className="field-error" style={{ marginTop: '6px' }}>{errors.business_type}</p>}
            </div>

            {formData.business_type === 'OTHER' && (
              <div>
                <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px' }}>
                  Specify Business Category <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  className={`input ${errors.business_type_other ? 'input-error' : ''}`}
                  style={{ width: '100%', fontSize: '0.9375rem' }}
                  placeholder="e.g. Marine Logistics, Architecture Studio, Biotech Lab"
                  value={formData.business_type_other}
                  onChange={(e) => updateTextField('business_type_other', e.target.value)}
                  onBlur={handleTextBlur}
                  autoFocus
                />
                {errors.business_type_other && <p className="field-error" style={{ marginTop: '6px' }}>{errors.business_type_other}</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Website Classification */}
        {currentStep === 3 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div className="text-label" style={{ marginBottom: '4px' }}>Step 3 — Classification</div>
              <h2 className="text-heading-lg" style={{ margin: '0 0 4px 0' }}>Website Functional Model</h2>
              <p className="text-meta" style={{ fontSize: '0.875rem', margin: 0 }}>
                Identify the primary structure and functionality required for this website build.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px' }}>
                Website Type <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                className={`select ${errors.website_type ? 'input-error' : ''}`}
                style={{ width: '100%', fontSize: '0.9375rem', padding: '10px 14px' }}
                value={formData.website_type}
                onChange={(e) => updateFieldAndAutoSave('website_type', e.target.value)}
              >
                <option value="">-- Choose functional classification --</option>
                {getWebsiteTypeOptions().map((wt) => (
                  <option key={wt.value} value={wt.label}>
                    {wt.label}
                  </option>
                ))}
                <option value="OTHER">Other Custom Architecture</option>
              </select>
              {errors.website_type && <p className="field-error" style={{ marginTop: '6px' }}>{errors.website_type}</p>}
            </div>

            {formData.website_type === 'OTHER' && (
              <div>
                <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px' }}>
                  Specify Custom Website Architecture <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  className={`input ${errors.website_type_other ? 'input-error' : ''}`}
                  style={{ width: '100%', fontSize: '0.9375rem' }}
                  placeholder="e.g. Member Portal, Digital Archive, Multi-vendor Hub"
                  value={formData.website_type_other}
                  onChange={(e) => updateTextField('website_type_other', e.target.value)}
                  onBlur={handleTextBlur}
                  autoFocus
                />
                {errors.website_type_other && <p className="field-error" style={{ marginTop: '6px' }}>{errors.website_type_other}</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Scope & Project Reason */}
        {currentStep === 4 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div className="text-label" style={{ marginBottom: '4px' }}>Step 4 — Scope</div>
              <h2 className="text-heading-lg" style={{ margin: '0 0 4px 0' }}>Project Reason &amp; Existing Presence</h2>
              <p className="text-meta" style={{ fontSize: '0.875rem', margin: 0 }}>
                Is Eight34 building from a clean slate or replacing an existing digital property?
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '10px' }}>
                Project Scope <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <button
                  type="button"
                  onClick={() => updateFieldAndAutoSave('reason', 'NEW_WEBSITE')}
                  style={{
                    textAlign: 'left',
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    border: formData.reason === 'NEW_WEBSITE' ? '2px solid var(--e34-accent)' : '1px solid var(--ink-200)',
                    backgroundColor: formData.reason === 'NEW_WEBSITE' ? 'var(--ink-50)' : 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                  }}
                >
                  <div style={{ fontWeight: 650, fontSize: '0.9375rem', marginBottom: '4px', color: 'var(--ink-900)' }}>
                    New Website Build
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)', lineHeight: 1.4 }}>
                    Client has no current website or is creating a brand-new entity from scratch.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateFieldAndAutoSave('reason', 'REDO_WEBSITE')}
                  style={{
                    textAlign: 'left',
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    border: formData.reason === 'REDO_WEBSITE' ? '2px solid var(--e34-accent)' : '1px solid var(--ink-200)',
                    backgroundColor: formData.reason === 'REDO_WEBSITE' ? 'var(--ink-50)' : 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                  }}
                >
                  <div style={{ fontWeight: 650, fontSize: '0.9375rem', marginBottom: '4px', color: 'var(--ink-900)' }}>
                    Redesign Existing Website
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ink-500)', lineHeight: 1.4 }}>
                    Client has an active website that needs to be modernized, rebuilt, or migrated.
                  </div>
                </button>
              </div>
              {errors.reason && <p className="field-error" style={{ marginTop: '8px' }}>{errors.reason}</p>}
            </div>

            {formData.reason === 'REDO_WEBSITE' && (
              <div>
                <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px' }}>
                  Current Website URL <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="url"
                  className={`input ${errors.previous_website_url ? 'input-error' : ''}`}
                  style={{ width: '100%', fontSize: '0.9375rem' }}
                  placeholder="https://clientcurrentwebsite.com"
                  value={formData.previous_website_url}
                  onChange={(e) => updateTextField('previous_website_url', e.target.value)}
                  onBlur={handleTextBlur}
                  autoFocus
                />
                {errors.previous_website_url && <p className="field-error" style={{ marginTop: '6px' }}>{errors.previous_website_url}</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Target Audience */}
        {currentStep === 5 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div className="text-label" style={{ marginBottom: '4px' }}>Step 5 — Audience</div>
              <h2 className="text-heading-lg" style={{ margin: '0 0 4px 0' }}>Target Audience Profile</h2>
              <p className="text-meta" style={{ fontSize: '0.875rem', margin: 0 }}>
                Define who will visit this site, their demographic context, geography, and what pain point brings them here.
              </p>
            </div>

            <div>
              <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px' }}>
                Audience Description &amp; Behavioral Profile <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                className={`input textarea ${errors.target_audience ? 'input-error' : ''}`}
                rows={5}
                style={{ width: '100%', fontSize: '0.9375rem', lineHeight: 1.5, resize: 'vertical' }}
                placeholder="Describe: Demographics, geographic scope, key problem they need solved, buying motivation, aesthetic expectations..."
                value={formData.target_audience}
                onChange={(e) => updateTextField('target_audience', e.target.value)}
                onBlur={handleTextBlur}
                autoFocus
              />
              <div 
                style={{ 
                  backgroundColor: 'var(--ink-50)', 
                  border: '1px solid var(--ink-150)', 
                  padding: '12px 14px', 
                  borderRadius: 'var(--radius-md)', 
                  marginTop: '10px', 
                  fontSize: '0.75rem', 
                  color: 'var(--ink-600)',
                  lineHeight: 1.45
                }}
              >
                <strong>Eight34 Quality Benchmark:</strong> Avoid vague statements like &ldquo;anyone who wants services&rdquo;. Specific entries describe real visitors (e.g. &ldquo;B2B procurement officers and engineering leads at mid-market manufacturing companies across North America evaluating ERP automation&rdquo;).
              </div>
              {errors.target_audience && <p className="field-error" style={{ marginTop: '6px' }}>{errors.target_audience}</p>}
            </div>
          </div>
        )}

        {/* Step 6: Design Aesthetics */}
        {currentStep === 6 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div className="text-label" style={{ marginBottom: '4px' }}>Step 6 — Aesthetics</div>
              <h2 className="text-heading-lg" style={{ margin: '0 0 4px 0' }}>Design Style Tags</h2>
              <p className="text-meta" style={{ fontSize: '0.875rem', margin: 0 }}>
                Select all visual directions and aesthetics that align with the client&apos;s brand goals.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '10px' }}>
                Aesthetic Tags (Select All That Apply) <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DESIGN_STYLES.map((style) => {
                  const isSelected = formData.design_style.includes(style)
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleDesignStyle(style)}
                      className={`badge ${isSelected ? 'badge-status-completed' : 'badge-outline'}`}
                      style={{
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all var(--transition)',
                      }}
                    >
                      {isSelected ? <Check style={{ width: '13px', height: '13px' }} /> : null}
                      {style}
                    </button>
                  )
                })}
              </div>
              {errors.design_style && <p className="field-error" style={{ marginTop: '8px' }}>{errors.design_style}</p>}
            </div>

            {formData.design_style.includes('Other') && (
              <div>
                <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px' }}>
                  Specify Custom Aesthetic Style <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  className={`input ${errors.design_style_other ? 'input-error' : ''}`}
                  style={{ width: '100%', fontSize: '0.9375rem' }}
                  placeholder="e.g. Brutalist, Swiss Typography, Dark Bauhaus, Warm Editorial"
                  value={formData.design_style_other}
                  onChange={(e) => updateTextField('design_style_other', e.target.value)}
                  onBlur={handleTextBlur}
                  autoFocus
                />
                {errors.design_style_other && <p className="field-error" style={{ marginTop: '6px' }}>{errors.design_style_other}</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 7: Commercials & Scope with PRICING GUIDE MODAL */}
        {currentStep === 7 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div className="text-label" style={{ marginBottom: '4px' }}>Step 7 — Commercials</div>
              <h2 className="text-heading-lg" style={{ margin: '0 0 4px 0' }}>Commercials &amp; Technical Scope</h2>
              <p className="text-meta" style={{ fontSize: '0.875rem', margin: 0 }}>
                Set the agreed quoted price, reference websites, and specialized technical integrations.
              </p>
            </div>

            {/* Quoted Price */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <label className="text-label" style={{ fontSize: '0.75rem', margin: 0 }}>
                  Quoted Website Price ($ USD)
                </label>
                <button
                  type="button"
                  onClick={() => setIsPricingGuideOpen(true)}
                  className="btn btn-sm btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--e34-accent)', borderColor: 'var(--ink-200)' }}
                >
                  <Sparkles style={{ width: '13px', height: '13px' }} />
                  View Pricing Guide
                </button>
              </div>

              <div style={{ position: 'relative', maxWidth: '340px' }}>
                <span style={{ position: 'absolute', left: 14, top: 10, color: 'var(--ink-400)', fontWeight: 600, fontSize: '0.9375rem' }}>$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`input ${errors.budget ? 'input-error' : ''}`}
                  style={{ paddingLeft: '30px', width: '100%', fontSize: '0.9375rem', fontVariantNumeric: 'tabular-nums' }}
                  placeholder="e.g. 500.00"
                  value={formData.budget}
                  onChange={(e) => updateTextField('budget', e.target.value)}
                  onBlur={handleTextBlur}
                />
              </div>
              <span className="text-meta" style={{ display: 'block', fontSize: '0.75rem', marginTop: '6px' }}>
                Click &ldquo;View Pricing Guide&rdquo; to benchmark official regional and international price ranges.
              </span>
              {errors.budget && <p className="field-error" style={{ marginTop: '6px' }}>{errors.budget}</p>}
            </div>

            {/* Inspiration URLs */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="text-label" style={{ fontSize: '0.75rem', margin: 0 }}>
                  Inspiration Reference URLs (Optional, Max 5)
                </label>
                {formData.inspiration_urls.length < 5 && (
                  <button 
                    type="button" 
                    onClick={addInspirationUrl} 
                    className="btn btn-sm btn-outline" 
                    style={{ fontSize: '0.75rem', padding: '3px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus style={{ width: '12px', height: '12px' }} /> Add URL
                  </button>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {formData.inspiration_urls.map((url, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Globe style={{ position: 'absolute', left: 12, top: 11, width: '14px', height: '14px', color: 'var(--ink-400)' }} />
                      <input
                        type="url"
                        className="input"
                        style={{ paddingLeft: '34px', width: '100%', fontSize: '0.875rem' }}
                        placeholder="https://example-inspiration.com"
                        value={url}
                        onChange={(e) => updateInspirationUrl(idx, e.target.value)}
                        onBlur={handleTextBlur}
                      />
                    </div>
                    {formData.inspiration_urls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInspirationUrl(idx)}
                        className="btn btn-sm btn-outline"
                        style={{ color: '#dc2626', borderColor: 'var(--ink-200)', padding: '8px 10px' }}
                        title="Remove URL"
                      >
                        <Trash2 style={{ width: '13px', height: '13px' }} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.inspiration_urls && <p className="field-error" style={{ marginTop: '6px' }}>{errors.inspiration_urls}</p>}
            </div>

            {/* Special Technical Features */}
            <div>
              <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px' }}>
                Special Technical Features &amp; Integrations
              </label>
              <textarea
                className="input textarea"
                rows={3}
                style={{ width: '100%', fontSize: '0.875rem', resize: 'vertical' }}
                placeholder="e.g. Stripe payment checkout, Calendly scheduler, HubSpot webhook, Custom animations, Multi-language switcher..."
                value={formData.special_features}
                onChange={(e) => updateTextField('special_features', e.target.value)}
                onBlur={handleTextBlur}
              />
            </div>
          </div>
        )}

        {/* Step 8: Review & Submission */}
        {currentStep === 8 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div className="text-label" style={{ marginBottom: '4px' }}>Step 8 — Review</div>
              <h2 className="text-heading-lg" style={{ margin: '0 0 4px 0' }}>Review &amp; Submit to Pipeline</h2>
              <p className="text-meta" style={{ fontSize: '0.875rem', margin: 0 }}>
                Verify all lead details before registering this opportunity into the active Eight34 production pipeline.
              </p>
            </div>

            {submitError && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius-md)',
                  color: '#991b1b',
                  fontSize: '0.875rem',
                  marginBottom: '20px',
                }}
              >
                {submitError}
              </div>
            )}

            {/* Clean Structured Review Card */}
            <div 
              style={{ 
                backgroundColor: 'var(--paper)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--ink-200)', 
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '18px 24px',
                marginBottom: '20px'
              }}
            >
              <div>
                <div className="metric-label">Client Entity</div>
                <div style={{ fontWeight: 650, color: 'var(--ink-900)', marginTop: '2px', fontSize: '0.9375rem' }}>
                  {formData.client_name}
                </div>
                <div className="text-meta" style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                  {formData.client_type.toLowerCase()}
                </div>
              </div>

              <div>
                <div className="metric-label">Website Classification</div>
                <div style={{ fontWeight: 600, color: 'var(--ink-900)', marginTop: '2px', fontSize: '0.9375rem' }}>
                  {formData.website_type === 'OTHER' ? formData.website_type_other : formData.website_type}
                </div>
                <div className="text-meta" style={{ fontSize: '0.75rem' }}>
                  {formData.reason === 'NEW_WEBSITE' ? 'New Build' : 'Redesign Existing'}
                </div>
              </div>

              <div>
                <div className="metric-label">Quoted Commercial Budget</div>
                <div style={{ fontWeight: 700, color: 'var(--e34-accent)', marginTop: '2px', fontSize: '1.125rem' }}>
                  {formData.budget ? formatCurrency(parseFloat(formData.budget)) : 'Not Quoted'}
                </div>
              </div>

              {formData.reason === 'REDO_WEBSITE' && formData.previous_website_url && (
                <div>
                  <div className="metric-label">Current Website</div>
                  <a
                    href={formData.previous_website_url.startsWith('http') ? formData.previous_website_url : `https://${formData.previous_website_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--e34-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontSize: '0.8125rem' }}
                  >
                    {formData.previous_website_url} <ExternalLink style={{ width: '11px', height: '11px' }} />
                  </a>
                </div>
              )}

              <div style={{ gridColumn: '1 / -1' }}>
                <div className="metric-label" style={{ marginBottom: '4px' }}>Target Audience Profile</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--ink-800)', whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>
                  {formData.target_audience}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div className="metric-label" style={{ marginBottom: '6px' }}>Aesthetic Tags</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {formData.design_style.map((tag) => (
                    <span key={tag} className="badge badge-outline" style={{ fontSize: '0.75rem' }}>{tag}</span>
                  ))}
                  {formData.design_style_other && (
                    <span className="badge badge-outline" style={{ fontSize: '0.75rem' }}>Custom: {formData.design_style_other}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Internal Notes */}
            <div>
              <label className="text-label" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px' }}>
                Additional Internal Notes (Optional)
              </label>
              <textarea
                className="input textarea"
                rows={2}
                style={{ width: '100%', fontSize: '0.875rem', resize: 'vertical' }}
                placeholder="Any special handling notes, stakeholder contacts, or internal comments..."
                value={formData.additional_information}
                onChange={(e) => updateTextField('additional_information', e.target.value)}
                onBlur={handleTextBlur}
              />
            </div>
          </div>
        )}

        {/* Step Actions Footer */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '32px', 
            paddingTop: '20px', 
            borderTop: '1px solid var(--ink-150)' 
          }}
        >
          {currentStep > 1 ? (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handlePrev}
              disabled={isSubmitting}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft style={{ width: '14px', height: '14px' }} />
              Previous
            </button>
          ) : (
            <div />
          )}

          <div>
            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                className="btn btn-solid"
                onClick={handleNext}
                disabled={isSubmitting}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', fontSize: '0.875rem' }}
              >
                Continue
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-solid"
                onClick={handleSubmitLead}
                disabled={isSubmitting}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 24px', fontSize: '0.9375rem', backgroundColor: 'var(--e34-accent)' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                    Submitting Lead...
                  </>
                ) : (
                  <>
                    Submit Lead to Pipeline
                    <Check style={{ width: '14px', height: '14px' }} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Guide Modal */}
      <PricingGuideModal
        isOpen={isPricingGuideOpen}
        onClose={() => setIsPricingGuideOpen(false)}
        pricingConfigs={pricingConfigs}
        onSelectPrice={(price) => {
          updateFieldAndAutoSave('budget', String(price))
          setIsPricingGuideOpen(false)
        }}
      />
    </div>
  )
}
