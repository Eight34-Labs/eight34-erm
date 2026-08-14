'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ClientType, LeadFormData } from '@/types'
import { BUSINESS_TYPES, DESIGN_STYLES, WEBSITE_TYPES, formatCurrency, isValidUrl } from '@/lib/utils'
import { createLead } from '@/lib/leads/actions'

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

export default function NewLeadForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [formData, setFormData] = useState<LeadFormData>({
    client_name: '',
    client_type: '',
    business_type: '',
    business_type_other: '',
    website_type: '',
    website_type_other: '',
    reason: '',
    previous_website_url: '',
    target_audience: '',
    design_style: [],
    design_style_other: '',
    inspiration_urls: [''],
    budget: '',
    special_features: '',
    additional_information: '',
  })

  // Handle field change
  const updateField = (field: keyof LeadFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear specific field error
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
      } else if (formData.target_audience.trim().length < 25) {
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
      // Check inspiration urls
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
      // If client_type is not BUSINESS and we are at step 1, skip step 2
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
      const res = await createLead(formData)
      if (res.success && res.data) {
        router.push(`/leads`)
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
    <div className="lead-intake-wrapper">
      {/* Top Header */}
      <div className="lead-intake-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Link href="/leads" className="text-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Leads
          </Link>
          <span className="text-meta">/</span>
          <span className="text-meta" style={{ color: 'var(--ink-800)', fontWeight: 500 }}>New Lead Intake</span>
        </div>
        <h1 className="text-heading-lg" style={{ margin: 0 }}>Submit Qualified Lead</h1>
      </div>

      {/* Step Indicator */}
      <div className="steps-bar">
        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1
          // If step 2 is skipped for personal/saas
          const isSkipped = stepNum === 2 && formData.client_type && formData.client_type !== 'BUSINESS'
          if (isSkipped) return null

          const isDone = currentStep > stepNum
          const isActive = currentStep === stepNum

          return (
            <div key={stepNum} className={`step-node ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
              <div className="step-node-circle">
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
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
      <div className="form-card">
        {/* Step 1: Client Entity */}
        {currentStep === 1 && (
          <div className="step-pane">
            <div className="pane-header">
              <div className="step-badge">Step 1 of 8</div>
              <h2 className="pane-title">Client Information</h2>
              <p className="pane-desc">Identify the prospective client entity and organization type.</p>
            </div>

            <div className="field-group">
              <label className="label label-required">Client or Organization Name</label>
              <input
                type="text"
                className={`input ${errors.client_name ? 'input-error' : ''}`}
                placeholder="e.g. Bluefin Kitchen, Marcus Vance, or Nexus Systems"
                value={formData.client_name}
                onChange={(e) => updateField('client_name', e.target.value)}
              />
              {errors.client_name && <div className="field-error">{errors.client_name}</div>}
            </div>

            <div className="field-group">
              <label className="label label-required">Client Classification</label>
              <div className="radio-card-grid">
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
                  >
                    <div className="radio-dot">{formData.client_type === item.type && <span className="dot-inner" />}</div>
                    <div>
                      <div className="radio-title">{item.title}</div>
                      <div className="radio-desc">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.client_type && <div className="field-error">{errors.client_type}</div>}
            </div>
          </div>
        )}

        {/* Step 2: Business Category (Only for BUSINESS) */}
        {currentStep === 2 && formData.client_type === 'BUSINESS' && (
          <div className="step-pane">
            <div className="pane-header">
              <div className="step-badge">Step 2 of 8</div>
              <h2 className="pane-title">Business Category</h2>
              <p className="pane-desc">Select the primary commercial vertical for this enterprise.</p>
            </div>

            <div className="field-group">
              <label className="label label-required">Business Vertical</label>
              <select
                className={`input select ${errors.business_type ? 'input-error' : ''}`}
                value={formData.business_type}
                onChange={(e) => updateField('business_type', e.target.value)}
              >
                <option value="">Select vertical...</option>
                {BUSINESS_TYPES.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
              {errors.business_type && <div className="field-error">{errors.business_type}</div>}
            </div>

            {formData.business_type === 'OTHER' && (
              <div className="field-group">
                <label className="label label-required">Specify Business Category</label>
                <input
                  type="text"
                  className={`input ${errors.business_type_other ? 'input-error' : ''}`}
                  placeholder="e.g. Architecture Studio, Dental Surgery, Real Estate Syndicate"
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
            <div className="pane-header">
              <div className="step-badge">Step 3 of 8</div>
              <h2 className="pane-title">Website Classification</h2>
              <p className="pane-desc">Specify the structural format required for this build.</p>
            </div>

            <div className="field-group">
              <label className="label label-required">Website Type</label>
              <select
                className={`input select ${errors.website_type ? 'input-error' : ''}`}
                value={formData.website_type}
                onChange={(e) => updateField('website_type', e.target.value)}
              >
                <option value="">Select website type...</option>
                {getWebsiteTypeOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.website_type && <div className="field-error">{errors.website_type}</div>}
            </div>

            {formData.website_type === 'OTHER' && (
              <div className="field-group">
                <label className="label label-required">Specify Custom Website Type</label>
                <input
                  type="text"
                  className={`input ${errors.website_type_other ? 'input-error' : ''}`}
                  placeholder="e.g. Interactive Documentation, Multi-tier Membership Portal"
                  value={formData.website_type_other}
                  onChange={(e) => updateField('website_type_other', e.target.value)}
                />
                {errors.website_type_other && <div className="field-error">{errors.website_type_other}</div>}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Reason & Previous Website */}
        {currentStep === 4 && (
          <div className="step-pane">
            <div className="pane-header">
              <div className="step-badge">Step 4 of 8</div>
              <h2 className="pane-title">Project Context</h2>
              <p className="pane-desc">Is this a greenfield digital launch or a commercial redesign?</p>
            </div>

            <div className="field-group">
              <label className="label label-required">Project Reason</label>
              <div className="radio-card-grid">
                <button
                  type="button"
                  onClick={() => updateField('reason', 'NEW_WEBSITE')}
                  className={`radio-card ${formData.reason === 'NEW_WEBSITE' ? 'selected' : ''}`}
                >
                  <div className="radio-dot">{formData.reason === 'NEW_WEBSITE' && <span className="dot-inner" />}</div>
                  <div>
                    <div className="radio-title">New Website</div>
                    <div className="radio-desc">Initial brand launch, no existing web presence to migrate.</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('reason', 'REDO_WEBSITE')}
                  className={`radio-card ${formData.reason === 'REDO_WEBSITE' ? 'selected' : ''}`}
                >
                  <div className="radio-dot">{formData.reason === 'REDO_WEBSITE' && <span className="dot-inner" />}</div>
                  <div>
                    <div className="radio-title">Redo / Redesign Existing Website</div>
                    <div className="radio-desc">Replacing an outdated, slow, or low-converting digital presence.</div>
                  </div>
                </button>
              </div>
              {errors.reason && <div className="field-error">{errors.reason}</div>}
            </div>

            {formData.reason === 'REDO_WEBSITE' && (
              <div className="field-group" style={{ marginTop: 20 }}>
                <label className="label label-required">Previous / Existing Website URL</label>
                <input
                  type="url"
                  className={`input ${errors.previous_website_url ? 'input-error' : ''}`}
                  placeholder="https://example.com"
                  value={formData.previous_website_url}
                  onChange={(e) => updateField('previous_website_url', e.target.value)}
                />
                <div className="field-hint">
                  The design team will review this site to assess current bottlenecks, asset needs, and technical flaws.
                </div>
                {errors.previous_website_url && <div className="field-error">{errors.previous_website_url}</div>}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Target Audience */}
        {currentStep === 5 && (
          <div className="step-pane">
            <div className="pane-header">
              <div className="step-badge">Step 5 of 8</div>
              <h2 className="pane-title">Target Audience</h2>
              <p className="pane-desc">Detail who will visit and convert on this website.</p>
            </div>

            <div className="field-group">
              <label className="label label-required">Target Audience Profile</label>
              <textarea
                className={`input textarea ${errors.target_audience ? 'input-error' : ''}`}
                rows={4}
                placeholder="Specify: Demographics, geographic location, primary problem, aesthetic expectations, purchasing triggers..."
                value={formData.target_audience}
                onChange={(e) => updateField('target_audience', e.target.value)}
              />
              <div className="field-hint" style={{ background: 'var(--ink-50)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginTop: 8 }}>
                <strong>Quality Standard:</strong> Avoid generic entries like &quot;everyone&quot; or &quot;people on internet&quot;. High-quality entries specify user psychology and geographic scope (e.g. &quot;High-net-worth homeowners in Northern California seeking custom architectural remodeling&quot;).
              </div>
              {errors.target_audience && <div className="field-error">{errors.target_audience}</div>}
            </div>
          </div>
        )}

        {/* Step 6: Design Aesthetics */}
        {currentStep === 6 && (
          <div className="step-pane">
            <div className="pane-header">
              <div className="step-badge">Step 6 of 8</div>
              <h2 className="pane-title">Design Aesthetic Tags</h2>
              <p className="pane-desc">Select all aesthetic directions that match the client&apos;s brand vision.</p>
            </div>

            <div className="field-group">
              <label className="label label-required">Aesthetic Styles (Select Multiple)</label>
              <div className="style-chips-grid">
                {DESIGN_STYLES.map((style) => {
                  const isSelected = formData.design_style.includes(style)
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleDesignStyle(style)}
                      className={`style-chip ${isSelected ? 'selected' : ''}`}
                    >
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {style}
                    </button>
                  )
                })}
              </div>
              {errors.design_style && <div className="field-error">{errors.design_style}</div>}
            </div>

            {formData.design_style.includes('Other') && (
              <div className="field-group" style={{ marginTop: 20 }}>
                <label className="label label-required">Specify Custom Design Style</label>
                <input
                  type="text"
                  className={`input ${errors.design_style_other ? 'input-error' : ''}`}
                  placeholder="e.g. Brutalist, Swiss Typography, Warm Retro"
                  value={formData.design_style_other}
                  onChange={(e) => updateField('design_style_other', e.target.value)}
                />
                {errors.design_style_other && <div className="field-error">{errors.design_style_other}</div>}
              </div>
            )}
          </div>
        )}

        {/* Step 7: Commercials & Scope */}
        {currentStep === 7 && (
          <div className="step-pane">
            <div className="pane-header">
              <div className="step-badge">Step 7 of 8</div>
              <h2 className="pane-title">Commercials &amp; Technical Scope</h2>
              <p className="pane-desc">Quoted price, visual references, and special engineering features.</p>
            </div>

            <div className="field-group">
              <label className="label">Quoted Website Price ($ USD)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: 9, color: 'var(--ink-400)', fontWeight: 600 }}>$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`input ${errors.budget ? 'input-error' : ''}`}
                  style={{ paddingLeft: 26 }}
                  placeholder="e.g. 2500"
                  value={formData.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                />
              </div>
              <div className="field-hint">Enter clean numeric value. Standard ranges: Personal ($800–$2,500), Business ($1,500–$5,000), SaaS ($3,000–$10,000+).</div>
              {errors.budget && <div className="field-error">{errors.budget}</div>}
            </div>

            <div className="field-group" style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="label" style={{ margin: 0 }}>Inspiration Reference Websites (Optional, Max 5)</label>
                {formData.inspiration_urls.length < 5 && (
                  <button type="button" onClick={addInspirationUrl} className="btn btn-sm btn-ghost" style={{ fontSize: 12 }}>
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
                      placeholder="https://example-inspiration.com"
                      value={url}
                      onChange={(e) => updateInspirationUrl(idx, e.target.value)}
                    />
                    {formData.inspiration_urls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInspirationUrl(idx)}
                        className="btn btn-sm btn-ghost"
                        style={{ color: 'var(--ink-400)' }}
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
              <label className="label">Special Technical Features &amp; Integrations</label>
              <textarea
                className="input textarea"
                rows={3}
                placeholder="e.g. Stripe checkout, Calendly booking widget, Custom CRM webhook, Multi-language support, Algolia search..."
                value={formData.special_features}
                onChange={(e) => updateField('special_features', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 8: Additional Info & Review */}
        {currentStep === 8 && (
          <div className="step-pane">
            <div className="pane-header">
              <div className="step-badge">Step 8 of 8</div>
              <h2 className="pane-title">Review &amp; Submit Lead</h2>
              <p className="pane-desc">Confirm all qualification parameters before registering in the pipeline.</p>
            </div>

            <div className="field-group">
              <label className="label">Additional Notes &amp; Sales Context</label>
              <textarea
                className="input textarea"
                rows={2}
                placeholder="Any client quirks, expected kick-off dates, stakeholder names, or specific sales conversations..."
                value={formData.additional_information}
                onChange={(e) => updateField('additional_information', e.target.value)}
              />
            </div>

            {/* Review Summary Grid */}
            <div className="review-summary-box">
              <h3 className="summary-box-title">Lead Intake Summary</h3>
              <div className="summary-grid">
                <div className="summary-cell">
                  <span className="cell-label">Client Name</span>
                  <span className="cell-value">{formData.client_name || '—'}</span>
                </div>
                <div className="summary-cell">
                  <span className="cell-label">Client Type</span>
                  <span className="cell-value">{formData.client_type || '—'}</span>
                </div>
                {formData.client_type === 'BUSINESS' && (
                  <div className="summary-cell">
                    <span className="cell-label">Business Category</span>
                    <span className="cell-value">{formData.business_type === 'OTHER' ? formData.business_type_other : formData.business_type || '—'}</span>
                  </div>
                )}
                <div className="summary-cell">
                  <span className="cell-label">Website Type</span>
                  <span className="cell-value">{formData.website_type === 'OTHER' ? formData.website_type_other : formData.website_type || '—'}</span>
                </div>
                <div className="summary-cell">
                  <span className="cell-label">Reason</span>
                  <span className="cell-value">{formData.reason === 'NEW_WEBSITE' ? 'New Website' : 'Redo Website'}</span>
                </div>
                {formData.previous_website_url && (
                  <div className="summary-cell" style={{ gridColumn: 'span 2' }}>
                    <span className="cell-label">Existing Site</span>
                    <span className="cell-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{formData.previous_website_url}</span>
                  </div>
                )}
                <div className="summary-cell" style={{ gridColumn: 'span 2' }}>
                  <span className="cell-label">Target Audience</span>
                  <span className="cell-value" style={{ fontSize: 13, lineHeight: 1.4 }}>{formData.target_audience || '—'}</span>
                </div>
                <div className="summary-cell" style={{ gridColumn: 'span 2' }}>
                  <span className="cell-label">Design Aesthetics</span>
                  <span className="cell-value">
                    {formData.design_style.join(', ')} {formData.design_style_other ? `(${formData.design_style_other})` : ''}
                  </span>
                </div>
                <div className="summary-cell">
                  <span className="cell-label">Quoted Price</span>
                  <span className="cell-value tabular-nums" style={{ fontWeight: 700, color: 'var(--ink-900)' }}>
                    {formData.budget ? formatCurrency(parseFloat(formData.budget)) : 'Unquoted'}
                  </span>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="quiz-error-callout" style={{ marginTop: 20 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="form-footer">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || isPending}
            className="btn btn-outline btn-md"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            {currentStep < TOTAL_STEPS ? (
              <button type="button" onClick={handleNext} className="btn btn-solid btn-md">
                Continue
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitLead}
                disabled={isPending}
                className="btn btn-solid btn-md"
                style={{ background: '#166534' }}
              >
                {isPending ? 'Submitting to ERM...' : 'Submit Lead'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .lead-intake-wrapper {
          max-width: 780px;
          margin: 0 auto;
          padding: 32px 24px 80px;
        }

        .lead-intake-header {
          margin-bottom: 24px;
        }

        .steps-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 24px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .step-node {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--ink-400);
          white-space: nowrap;
        }

        .step-node.active {
          color: var(--ink-900);
          font-weight: 600;
        }

        .step-node.done {
          color: #166534;
        }

        .step-node-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--ink-100);
          color: var(--ink-500);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }

        .step-node.active .step-node-circle {
          background: var(--e34-accent);
          color: white;
        }

        .step-node.done .step-node-circle {
          background: var(--status-completed-bg);
          border: 1px solid var(--status-completed-border);
          color: var(--status-completed-text);
        }

        .step-node-text {
          font-size: 12px;
        }

        .form-card {
          background: var(--surface);
          border: 1px solid var(--ink-150);
          border-radius: var(--radius-md);
          padding: 24px;
          box-shadow: var(--shadow-xs);
        }

        .pane-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--ink-100);
        }

        .step-badge {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-400);
          margin-bottom: 6px;
        }

        .pane-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--ink-900);
          margin: 0 0 6px;
        }

        .pane-desc {
          font-size: 13.5px;
          color: var(--ink-500);
          margin: 0;
        }

        .field-group {
          margin-bottom: 20px;
        }

        .radio-card-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .radio-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 18px;
          background: var(--surface);
          border: 1px solid var(--ink-200);
          border-radius: var(--radius);
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: all var(--transition);
        }

        .radio-card:hover {
          background: var(--ink-50);
          border-color: var(--ink-300);
        }

        .radio-card.selected {
          background: #f4f6fb;
          border-color: var(--e34-accent);
          box-shadow: 0 0 0 2px rgb(26 39 68 / 0.12);
        }

        .radio-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid var(--ink-300);
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .radio-card.selected .radio-dot {
          border-color: var(--e34-accent);
        }

        .dot-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--e34-accent);
        }

        .radio-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--ink-900);
          margin-bottom: 2px;
        }

        .radio-desc {
          font-size: 12.5px;
          color: var(--ink-500);
          line-height: 1.4;
        }

        .style-chips-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .style-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 99px;
          border: 1px solid var(--ink-200);
          background: var(--surface);
          color: var(--ink-700);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition);
          font-family: inherit;
        }

        .style-chip:hover {
          background: var(--ink-50);
          border-color: var(--ink-300);
        }

        .style-chip.selected {
          background: var(--e34-accent);
          border-color: var(--e34-accent);
          color: white;
        }

        .review-summary-box {
          margin-top: 24px;
          padding: 20px 24px;
          background: var(--ink-50);
          border: 1px solid var(--ink-150);
          border-radius: var(--radius-md);
        }

        .summary-box-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--ink-600);
          margin: 0 0 16px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .summary-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .cell-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-400);
        }

        .cell-value {
          font-size: 13.5px;
          color: var(--ink-800);
          font-weight: 500;
        }

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid var(--ink-100);
          margin-top: 32px;
        }
      `}</style>
    </div>
  )
}
