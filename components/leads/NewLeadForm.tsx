'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HelpCircle, Bookmark, Check, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import type { ClientType, LeadFormData, Lead, PricingConfig } from '@/types'
import { BUSINESS_TYPES, DESIGN_STYLES, WEBSITE_TYPES, formatCurrency, isValidUrl } from '@/lib/utils'
import { createLead, saveLeadDraft } from '@/lib/leads/actions'
import PricingGuideModal from '@/components/leads/PricingGuideModal'

const TOTAL_STEPS = 8

const STEP_LABELS = [
  'Client Entity',
  'Business Category',
  'Website Classification',
  'Project Reason',
  'Target Audience',
  'Design Aesthetics',
  'Commercials & Scope',
  'Review & Submission',
]

interface NewLeadFormProps {
  pricingConfigs?: PricingConfig[]
  initialDraft?: Lead
  draftId?: string
}

export default function NewLeadForm({
  pricingConfigs = [],
  initialDraft,
  draftId: initialDraftId,
}: NewLeadFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [draftId, setDraftId] = useState<string | undefined>(initialDraftId)
  const [draftSavedToast, setDraftSavedToast] = useState(false)
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

  // Handle field change
  const updateField = (field: keyof LeadFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  // Handle multi-select toggle
  const toggleDesignStyle = (style: string) => {
    setFormData((prev) => {
      const exists = prev.design_style.includes(style)
      const nextStyles = exists
        ? prev.design_style.filter((s) => s !== style)
        : [...prev.design_style, style]
      return { ...prev, design_style: nextStyles }
    })
    if (errors.design_style) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.design_style
        return next
      })
    }
  }

  // Handle inspiration URL array
  const updateInspirationUrl = (index: number, val: string) => {
    const urls = [...formData.inspiration_urls]
    urls[index] = val
    updateField('inspiration_urls', urls)
  }

  const addInspirationUrl = () => {
    if (formData.inspiration_urls.length < 5) {
      updateField('inspiration_urls', [...formData.inspiration_urls, ''])
    }
  }

  const removeInspirationUrl = (index: number) => {
    const urls = formData.inspiration_urls.filter((_, i) => i !== index)
    updateField('inspiration_urls', urls.length > 0 ? urls : [''])
  }

  // Save partial lead draft
  const handleSaveDraft = async () => {
    setIsSavingDraft(true)
    try {
      const res = await saveLeadDraft(formData, draftId)
      if (res.success && res.data) {
        setDraftId(res.data.draft_id)
        setDraftSavedToast(true)
        setTimeout(() => setDraftSavedToast(false), 3500)
      }
    } catch (err) {
      console.error('Draft save failed:', err)
    } finally {
      setIsSavingDraft(false)
    }
  }

  // Validation per step
  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.client_name.trim()) stepErrors.client_name = 'Client or business name is required.'
      if (!formData.client_type) stepErrors.client_type = 'Please select a client type.'
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
        stepErrors.target_audience = 'Please provide more specific details about the target demographic, geography, and primary problem.'
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
          stepErrors.inspiration_urls = `Invalid URL: "${u}". Please enter full web addresses with https://.`
          break
        }
      }
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1 && formData.client_type !== 'BUSINESS') {
        setCurrentStep(3)
      } else {
        setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1))
      }
    }
  }

  const handlePrev = () => {
    if (currentStep === 3 && formData.client_type !== 'BUSINESS') {
      setCurrentStep(1)
    } else {
      setCurrentStep((prev) => Math.max(1, prev - 1))
    }
  }

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

  return (
    <div className="lead-intake-wrapper" style={{ maxWidth: '820px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Header */}
      <div className="lead-intake-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Link href="/leads" className="text-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ArrowLeft style={{ width: '12px', height: '12px' }} />
                Leads
              </Link>
              <span className="text-meta">/</span>
              <span className="text-meta" style={{ color: 'var(--ink-800)', fontWeight: 500 }}>
                {draftId ? 'Resume Draft Intake' : 'New Lead Intake'}
              </span>
            </div>
            <h1 className="text-heading-lg" style={{ margin: 0 }}>
              {draftId ? `Edit Draft: ${formData.client_name || 'Untitled'}` : 'Submit Qualified Lead'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isPending}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Bookmark style={{ width: '13px', height: '13px' }} />
              {isSavingDraft ? 'Saving Draft...' : 'Save as Draft'}
            </button>
          </div>
        </div>

        {/* Draft Saved Feedback Toast */}
        {draftSavedToast && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius)',
              color: '#166534',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check style={{ width: '15px', height: '15px' }} />
            Progress saved to drafts! You can return to this lead at any time in the <strong>Lead Drafts</strong> tab.
          </div>
        )}
      </div>

      {/* Step Indicator */}
      <div className="steps-bar" style={{ marginBottom: '24px' }}>
        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1
          const isSkipped = stepNum === 2 && formData.client_type && formData.client_type !== 'BUSINESS'
          if (isSkipped) return null

          const isDone = currentStep > stepNum
          const isActive = currentStep === stepNum

          return (
            <div key={stepNum} className={`step-node ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
              <div className="step-node-circle">
                {isDone ? (
                  <Check style={{ width: '10px', height: '10px' }} />
                ) : (
                  stepNum
                )}
              </div>
              <span className="step-node-text">{label}</span>
            </div>
          )
        })}
      </div>

      {/* Main Intake Form Box */}
      <div className="form-card card" style={{ padding: '24px 28px', backgroundColor: 'var(--surface)', border: '1px solid var(--ink-200)' }}>
        {/* Step 1: Client Entity */}
        {currentStep === 1 && (
          <div className="step-pane">
            <div className="pane-header" style={{ marginBottom: '20px' }}>
              <div className="step-badge">Step 1 of 8</div>
              <h2 className="pane-title" style={{ fontSize: '1.25rem', margin: '4px 0 2px' }}>Client Information</h2>
              <p className="pane-desc" style={{ color: 'var(--ink-500)', fontSize: '0.875rem', margin: 0 }}>Identify the prospective client entity and organization type.</p>
            </div>

            <div className="field-group" style={{ marginBottom: '20px' }}>
              <label className="label label-required" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.8125rem' }}>Client or Organization Name</label>
              <input
                type="text"
                className={`input ${errors.client_name ? 'input-error' : ''}`}
                style={{ width: '100%' }}
                placeholder="e.g. Bluefin Kitchen, Marcus Vance, or Nexus Systems"
                value={formData.client_name}
                onChange={(e) => updateField('client_name', e.target.value)}
              />
              {errors.client_name && <div className="field-error">{errors.client_name}</div>}
            </div>

            <div className="field-group">
              <label className="label label-required" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.8125rem' }}>Client Classification</label>
              <div className="radio-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  {
                    type: 'PERSONAL' as ClientType,
                    title: 'Personal',
                    desc: 'Individuals, creators, consultants, executives needing personal branding.',
                  },
                  {
                    type: 'BUSINESS' as ClientType,
                    title: 'Business',
                    desc: 'Local, regional, and commercial service enterprises, clinics, dining, retail.',
                  },
                  {
                    type: 'SAAS' as ClientType,
                    title: 'SaaS / Tech',
                    desc: 'Software products, developer tools, B2B platforms requiring marketing funnels.',
                  },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => updateField('client_type', item.type)}
                    className={`radio-card ${formData.client_type === item.type ? 'selected' : ''}`}
                    style={{
                      textAlign: 'left',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: formData.client_type === item.type ? '2px solid var(--e34-accent)' : '1px solid var(--ink-200)',
                      backgroundColor: formData.client_type === item.type ? 'var(--ink-50)' : 'var(--surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 650, fontSize: '0.9375rem', marginBottom: '4px', color: 'var(--ink-900)' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)', lineHeight: 1.4 }}>{item.desc}</div>
                  </button>
                ))}
              </div>
              {errors.client_type && <div className="field-error">{errors.client_type}</div>}
            </div>
          </div>
        )}

        {/* Step 2: Business Category */}
        {currentStep === 2 && formData.client_type === 'BUSINESS' && (
          <div className="step-pane">
            <div className="pane-header" style={{ marginBottom: '20px' }}>
              <div className="step-badge">Step 2 of 8</div>
              <h2 className="pane-title" style={{ fontSize: '1.25rem', margin: '4px 0 2px' }}>Business Category</h2>
              <p className="pane-desc" style={{ color: 'var(--ink-500)', fontSize: '0.875rem', margin: 0 }}>Select the enterprise vertical matching this business.</p>
            </div>

            <div className="field-group" style={{ marginBottom: '16px' }}>
              <label className="label label-required" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.8125rem' }}>Select Business Category</label>
              <select
                className={`select ${errors.business_type ? 'input-error' : ''}`}
                style={{ width: '100%' }}
                value={formData.business_type}
                onChange={(e) => updateField('business_type', e.target.value)}
              >
                <option value="">-- Choose a category --</option>
                {BUSINESS_TYPES.map((bt) => (
                  <option key={bt.value} value={bt.value}>
                    {bt.label}
                  </option>
                ))}
              </select>
              {errors.business_type && <div className="field-error">{errors.business_type}</div>}
            </div>

            {formData.business_type === 'OTHER' && (
              <div className="field-group">
                <label className="label label-required" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.8125rem' }}>Specify Business Type</label>
                <input
                  type="text"
                  className={`input ${errors.business_type_other ? 'input-error' : ''}`}
                  style={{ width: '100%' }}
                  placeholder="e.g. Legal Consulting, Real Estate Brokerage"
                  value={formData.business_type_other}
                  onChange={(e) => updateField('business_type_other', e.target.value)}
                />
                {errors.business_type_other && <div className="field-error">{errors.business_type_other}</div>}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Website Classification */}
        {currentStep === 3 && (
          <div className="step-pane">
            <div className="pane-header" style={{ marginBottom: '20px' }}>
              <div className="step-badge">Step 3 of 8</div>
              <h2 className="pane-title" style={{ fontSize: '1.25rem', margin: '4px 0 2px' }}>Website Classification</h2>
              <p className="pane-desc" style={{ color: 'var(--ink-500)', fontSize: '0.875rem', margin: 0 }}>Select the functional structure of the website.</p>
            </div>

            <div className="field-group" style={{ marginBottom: '16px' }}>
              <label className="label label-required" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.8125rem' }}>Website Type</label>
              <select
                className={`select ${errors.website_type ? 'input-error' : ''}`}
                style={{ width: '100%' }}
                value={formData.website_type}
                onChange={(e) => updateField('website_type', e.target.value)}
              >
                <option value="">-- Choose a website type --</option>
                {getWebsiteTypeOptions().map((wt) => (
                  <option key={wt.value} value={wt.label}>
                    {wt.label}
                  </option>
                ))}
                <option value="OTHER">Other Custom Website</option>
              </select>
              {errors.website_type && <div className="field-error">{errors.website_type}</div>}
            </div>

            {formData.website_type === 'OTHER' && (
              <div className="field-group">
                <label className="label label-required" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.8125rem' }}>Specify Custom Website Type</label>
                <input
                  type="text"
                  className={`input ${errors.website_type_other ? 'input-error' : ''}`}
                  style={{ width: '100%' }}
                  placeholder="e.g. Directory Platform, Private Portal"
                  value={formData.website_type_other}
                  onChange={(e) => updateField('website_type_other', e.target.value)}
                />
                {errors.website_type_other && <div className="field-error">{errors.website_type_other}</div>}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Project Reason */}
        {currentStep === 4 && (
          <div className="step-pane">
            <div className="pane-header" style={{ marginBottom: '20px' }}>
              <div className="step-badge">Step 4 of 8</div>
              <h2 className="pane-title" style={{ fontSize: '1.25rem', margin: '4px 0 2px' }}>Project Reason</h2>
              <p className="pane-desc" style={{ color: 'var(--ink-500)', fontSize: '0.875rem', margin: 0 }}>Is this a brand-new website build or a redesign of an existing site?</p>
            </div>

            <div className="field-group" style={{ marginBottom: '20px' }}>
              <label className="label label-required" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.8125rem' }}>Project Scope</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => updateField('reason', 'NEW_WEBSITE')}
                  style={{
                    textAlign: 'left',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: formData.reason === 'NEW_WEBSITE' ? '2px solid var(--e34-accent)' : '1px solid var(--ink-200)',
                    backgroundColor: formData.reason === 'NEW_WEBSITE' ? 'var(--ink-50)' : 'var(--surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 650, fontSize: '0.9375rem', marginBottom: '4px', color: 'var(--ink-900)' }}>New Website Build</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)' }}>Client currently does not have an active website.</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('reason', 'REDO_WEBSITE')}
                  style={{
                    textAlign: 'left',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: formData.reason === 'REDO_WEBSITE' ? '2px solid var(--e34-accent)' : '1px solid var(--ink-200)',
                    backgroundColor: formData.reason === 'REDO_WEBSITE' ? 'var(--ink-50)' : 'var(--surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 650, fontSize: '0.9375rem', marginBottom: '4px', color: 'var(--ink-900)' }}>Redesign Existing Website</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)' }}>Replacing or upgrading an existing website URL.</div>
                </button>
              </div>
              {errors.reason && <div className="field-error">{errors.reason}</div>}
            </div>

            {formData.reason === 'REDO_WEBSITE' && (
              <div className="field-group">
                <label className="label label-required" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.8125rem' }}>Current Website URL</label>
                <input
                  type="url"
                  className={`input ${errors.previous_website_url ? 'input-error' : ''}`}
                  style={{ width: '100%' }}
                  placeholder="https://example.com"
                  value={formData.previous_website_url}
                  onChange={(e) => updateField('previous_website_url', e.target.value)}
                />
                {errors.previous_website_url && <div className="field-error">{errors.previous_website_url}</div>}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Target Audience */}
        {currentStep === 5 && (
          <div className="step-pane">
            <div className="pane-header" style={{ marginBottom: '20px' }}>
              <div className="step-badge">Step 5 of 8</div>
              <h2 className="pane-title" style={{ fontSize: '1.25rem', margin: '4px 0 2px' }}>Target Audience</h2>
              <p className="pane-desc" style={{ color: 'var(--ink-500)', fontSize: '0.875rem', margin: 0 }}>Detail who will visit, engage, and convert on this website.</p>
            </div>

            <div className="field-group">
              <label className="label label-required" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.8125rem' }}>Target Audience Profile</label>
              <textarea
                className={`input textarea ${errors.target_audience ? 'input-error' : ''}`}
                rows={4}
                style={{ width: '100%', resize: 'vertical' }}
                placeholder="Specify: Demographics, geographic location, primary problem, aesthetic expectations, purchasing triggers..."
                value={formData.target_audience}
                onChange={(e) => updateField('target_audience', e.target.value)}
              />
              <div className="field-hint" style={{ background: 'var(--ink-50)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginTop: 8, fontSize: '0.75rem', color: 'var(--ink-600)' }}>
                <strong>Quality Standard:</strong> Avoid generic entries like &quot;everyone&quot; or &quot;people on internet&quot;. High-quality entries specify user psychology and geography (e.g. &quot;Urban working professionals aged 26-45 in Austin seeking mobile lunch orders&quot;).
              </div>
              {errors.target_audience && <div className="field-error">{errors.target_audience}</div>}
            </div>
          </div>
        )}

        {/* Step 6: Design Aesthetics */}
        {currentStep === 6 && (
          <div className="step-pane">
            <div className="pane-header" style={{ marginBottom: '20px' }}>
              <div className="step-badge">Step 6 of 8</div>
              <h2 className="pane-title" style={{ fontSize: '1.25rem', margin: '4px 0 2px' }}>Design Aesthetic Tags</h2>
              <p className="pane-desc" style={{ color: 'var(--ink-500)', fontSize: '0.875rem', margin: 0 }}>Select all aesthetic directions that match the client&apos;s brand vision.</p>
            </div>

            <div className="field-group">
              <label className="label label-required" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.8125rem' }}>Aesthetic Styles (Select Multiple)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DESIGN_STYLES.map((style) => {
                  const isSelected = formData.design_style.includes(style)
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleDesignStyle(style)}
                      className={`badge ${isSelected ? 'badge-status-completed' : 'badge-outline'}`}
                      style={{ cursor: 'pointer', fontSize: '0.8125rem', padding: '6px 12px' }}
                    >
                      {isSelected && <Check style={{ width: '12px', height: '12px', marginRight: '4px' }} />}
                      {style}
                    </button>
                  )
                })}
              </div>
              {errors.design_style && <div className="field-error">{errors.design_style}</div>}
            </div>

            {formData.design_style.includes('Other') && (
              <div className="field-group" style={{ marginTop: 20 }}>
                <label className="label label-required" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.8125rem' }}>Specify Custom Design Style</label>
                <input
                  type="text"
                  className={`input ${errors.design_style_other ? 'input-error' : ''}`}
                  style={{ width: '100%' }}
                  placeholder="e.g. Brutalist, Swiss Typography, Warm Retro"
                  value={formData.design_style_other}
                  onChange={(e) => updateField('design_style_other', e.target.value)}
                />
                {errors.design_style_other && <div className="field-error">{errors.design_style_other}</div>}
              </div>
            )}
          </div>
        )}

        {/* Step 7: Commercials & Scope with PRICING GUIDE MODAL */}
        {currentStep === 7 && (
          <div className="step-pane">
            <div className="pane-header" style={{ marginBottom: '20px' }}>
              <div className="step-badge">Step 7 of 8</div>
              <h2 className="pane-title" style={{ fontSize: '1.25rem', margin: '4px 0 2px' }}>Commercials &amp; Technical Scope</h2>
              <p className="pane-desc" style={{ color: 'var(--ink-500)', fontSize: '0.875rem', margin: 0 }}>Quoted price, visual references, and special engineering features.</p>
            </div>

            <div className="field-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                <label className="label" style={{ fontWeight: 600, fontSize: '0.8125rem', margin: 0 }}>
                  Quoted Website Price ($ USD)
                </label>
                <button
                  type="button"
                  onClick={() => setIsPricingGuideOpen(true)}
                  className="btn btn-sm btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--e34-accent)' }}
                >
                  <Sparkles style={{ width: '12px', height: '12px' }} />
                  View Pricing Guide
                </button>
              </div>

              <div style={{ position: 'relative', maxWidth: '320px' }}>
                <span style={{ position: 'absolute', left: 12, top: 8, color: 'var(--ink-400)', fontWeight: 600 }}>$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`input ${errors.budget ? 'input-error' : ''}`}
                  style={{ paddingLeft: 26, width: '100%' }}
                  placeholder="e.g. 500"
                  value={formData.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                />
              </div>
              <span className="text-meta" style={{ display: 'block', fontSize: '0.75rem', marginTop: '4px' }}>
                Click &quot;View Pricing Guide&quot; above to inspect standard regional pricing tiers and benchmarks.
              </span>
              {errors.budget && <div className="field-error">{errors.budget}</div>}
            </div>

            <div className="field-group" style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="label" style={{ fontWeight: 600, fontSize: '0.8125rem', margin: 0 }}>Inspiration Reference Websites (Optional, Max 5)</label>
                {formData.inspiration_urls.length < 5 && (
                  <button type="button" onClick={addInspirationUrl} className="btn btn-sm btn-outline" style={{ fontSize: 12, padding: '2px 8px' }}>
                    + Add URL
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {formData.inspiration_urls.map((url, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="url"
                      className="input"
                      style={{ flex: 1 }}
                      placeholder="https://example-inspiration.com"
                      value={url}
                      onChange={(e) => updateInspirationUrl(idx, e.target.value)}
                    />
                    {formData.inspiration_urls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInspirationUrl(idx)}
                        className="btn btn-sm btn-outline"
                        style={{ color: 'var(--ink-400)', padding: '4px 8px' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.inspiration_urls && <div className="field-error">{errors.inspiration_urls}</div>}
            </div>

            <div className="field-group" style={{ marginTop: 20 }}>
              <label className="label" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.8125rem' }}>Special Technical Features &amp; Integrations</label>
              <textarea
                className="input textarea"
                rows={3}
                style={{ width: '100%', resize: 'vertical' }}
                placeholder="e.g. Stripe checkout, Calendly booking widget, Custom CRM webhook, Multi-language support, Algolia search..."
                value={formData.special_features}
                onChange={(e) => updateField('special_features', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 8: Review & Submission */}
        {currentStep === 8 && (
          <div className="step-pane">
            <div className="pane-header" style={{ marginBottom: '20px' }}>
              <div className="step-badge">Step 8 of 8</div>
              <h2 className="pane-title" style={{ fontSize: '1.25rem', margin: '4px 0 2px' }}>Review &amp; Submit Lead</h2>
              <p className="pane-desc" style={{ color: 'var(--ink-500)', fontSize: '0.875rem', margin: 0 }}>Review all captured details before registering this lead into the pipeline.</p>
            </div>

            {submitError && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius)',
                  color: '#991b1b',
                  fontSize: '0.875rem',
                  marginBottom: '16px',
                }}
              >
                {submitError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'var(--paper)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-200)', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-150)', paddingBottom: '8px' }}>
                <span className="text-meta">Client:</span>
                <span style={{ fontWeight: 600 }}>{formData.client_name} ({formData.client_type})</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-150)', paddingBottom: '8px' }}>
                <span className="text-meta">Website Type:</span>
                <span style={{ fontWeight: 500 }}>{formData.website_type === 'OTHER' ? formData.website_type_other : formData.website_type}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-150)', paddingBottom: '8px' }}>
                <span className="text-meta">Project Reason:</span>
                <span style={{ fontWeight: 500 }}>{formData.reason === 'NEW_WEBSITE' ? 'New Build' : `Redesign (${formData.previous_website_url})`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ink-150)', paddingBottom: '8px' }}>
                <span className="text-meta">Quoted Budget:</span>
                <span style={{ fontWeight: 650, color: 'var(--e34-accent)' }}>{formData.budget ? formatCurrency(parseFloat(formData.budget)) : 'Not quoted'}</span>
              </div>

              <div>
                <span className="text-meta" style={{ display: 'block', marginBottom: '4px' }}>Target Audience:</span>
                <p style={{ margin: 0, color: 'var(--ink-800)', whiteSpace: 'pre-wrap' }}>{formData.target_audience}</p>
              </div>

              <div>
                <span className="text-meta" style={{ display: 'block', marginBottom: '4px' }}>Aesthetic Tags:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {formData.design_style.map((tag) => (
                    <span key={tag} className="badge badge-outline">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="field-group" style={{ marginTop: '18px' }}>
              <label className="label" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.8125rem' }}>Additional Internal Notes (Optional)</label>
              <textarea
                className="input textarea"
                rows={2}
                style={{ width: '100%', resize: 'vertical' }}
                placeholder="Any special handling, stakeholder contacts, or internal comments..."
                value={formData.additional_information}
                onChange={(e) => updateField('additional_information', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid var(--ink-150)' }}>
          {currentStep > 1 ? (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handlePrev}
              disabled={isPending}
            >
              &larr; Back
            </button>
          ) : (
            <div />
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isPending}
            >
              {isSavingDraft ? 'Saving Draft...' : 'Save Draft'}
            </button>

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                className="btn btn-solid"
                onClick={handleNext}
                disabled={isPending}
              >
                Continue &rarr;
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-solid"
                onClick={handleSubmitLead}
                disabled={isPending}
              >
                {isPending ? 'Registering Lead...' : 'Submit Lead to Pipeline'}
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
        onSelectPrice={(price) => updateField('budget', String(price))}
      />
    </div>
  )
}
