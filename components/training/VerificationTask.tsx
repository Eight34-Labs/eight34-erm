'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  User as UserIcon,
  Laptop,
  Compass,
  Layers,
  Palette,
  DollarSign,
  ClipboardCheck,
  Globe,
  Info,
  ShieldCheck,
  Flame,
  Check
} from 'lucide-react'
import { completeVerificationTask } from '@/lib/training/actions'
import { BUSINESS_TYPES, DESIGN_STYLES, WEBSITE_TYPES, formatCurrency, isValidUrl } from '@/lib/utils'

interface VerificationTaskProps {
  isVerified: boolean
}

const TOTAL_STEPS = 8

const STEP_GUIDES = [
  {
    step: 1,
    title: 'Client Identification',
    tip: 'Identify who the client is and what type of entity they represent (Personal, Business, or SaaS).',
    example: 'Example: "Apex Fitness Collective" (Business) or "Elena Vance Photography" (Personal).'
  },
  {
    step: 2,
    title: 'Business Category',
    tip: 'Select the primary industry vertical. This allows our project managers to assign the right designer.',
    example: 'Example: Restaurant, Barbershop, Fitness, or choose "Other" to enter a custom category.'
  },
  {
    step: 3,
    title: 'Website Classification',
    tip: 'Choose the functional architecture: simple Landing Page vs. complex Booking & Appointments system.',
    example: 'Example: "Business Booking & Appointments Page" for salons and services with scheduling.'
  },
  {
    step: 4,
    title: 'Project Scope & Legacy Audit',
    tip: 'Crucial: If selecting Redesign, the existing website URL is strictly required so developers can inspect legacy code and preserve SEO.',
    example: 'Example: https://apexfitness-old.com'
  },
  {
    step: 5,
    title: 'Target Audience Profile',
    tip: 'Generic descriptions like "everyone" are rejected. Write at least 20 characters describing age, location, and pain points.',
    example: 'Example: "Health-conscious urban professionals aged 25-45 in Seattle seeking high-intensity group classes."'
  },
  {
    step: 6,
    title: 'Aesthetics & The "Other" Tag',
    tip: 'Select aesthetic tags. Note: Choosing "Other" unlocks an inline custom text box for specific visual direction!',
    example: 'Example: "Minimal", "Bold", and "Other" with text "High-contrast dark mode with neon accents".'
  },
  {
    step: 7,
    title: 'Budget & Live Inspiration URLs',
    tip: 'Enter a clean numeric budget and 1-3 live URLs with http:// or https:// for design benchmarks.',
    example: 'Example: Budget: 750 | Inspiration: https://stripe.com, https://equinox.com'
  },
  {
    step: 8,
    title: 'Review & Verification Submission',
    tip: 'Verify all simulated details. Submitting this test lead will instantly grant your verified sales status!',
    example: 'Ready to submit your verified training test lead.'
  }
]

export default function VerificationTask({ isVerified }: VerificationTaskProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [completedVerification, setCompletedVerification] = useState(isVerified)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Simulated Test Lead State (Purely Client-Side)
  const [testLead, setTestLead] = useState({
    client_name: '',
    client_type: 'BUSINESS' as 'PERSONAL' | 'BUSINESS' | 'SAAS',
    business_type: 'Fitness & Wellness',
    business_type_other: '',
    website_type: 'Business Booking & Appointments Page',
    website_type_other: '',
    reason: 'REDO_WEBSITE' as 'NEW_WEBSITE' | 'REDO_WEBSITE',
    previous_website_url: 'https://example-fitness.com',
    target_audience: 'Urban fitness enthusiasts and professionals aged 22-40 in Seattle seeking boutique group workouts.',
    design_style: ['Minimal', 'Bold', 'Other'],
    design_style_other: 'Dark theme with vibrant orange accents and sleek typography',
    inspiration_urls: ['https://stripe.com', 'https://linear.app'],
    budget: '750',
    special_features: 'Stripe payments for class packs and automated booking calendar',
    additional_information: 'Client wants quick launch within 3 weeks',
  })

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {}

    if (step === 1) {
      if (!testLead.client_name.trim()) errs.client_name = 'Please enter a test client name.'
      if (!testLead.client_type) errs.client_type = 'Please select a client vertical.'
    } else if (step === 2) {
      if (testLead.client_type === 'BUSINESS') {
        if (!testLead.business_type) errs.business_type = 'Please select a business category.'
        if (testLead.business_type === 'OTHER' && !testLead.business_type_other.trim()) {
          errs.business_type_other = 'Please specify the custom business type.'
        }
      }
    } else if (step === 3) {
      if (!testLead.website_type) errs.website_type = 'Please select a website classification.'
      if (testLead.website_type === 'OTHER' && !testLead.website_type_other.trim()) {
        errs.website_type_other = 'Please specify the custom classification.'
      }
    } else if (step === 4) {
      if (!testLead.reason) errs.reason = 'Please choose New Build or Redesign.'
      if (testLead.reason === 'REDO_WEBSITE') {
        if (!testLead.previous_website_url.trim()) {
          errs.previous_website_url = 'Existing website URL is strictly required for a redesign.'
        } else if (!isValidUrl(testLead.previous_website_url)) {
          errs.previous_website_url = 'Must be a valid web address starting with http:// or https://'
        }
      }
    } else if (step === 5) {
      if (!testLead.target_audience.trim()) {
        errs.target_audience = 'Target audience is required.'
      } else if (testLead.target_audience.trim().length < 20) {
        errs.target_audience = 'Audience description must be at least 20 characters to provide sufficient detail.'
      }
    } else if (step === 6) {
      if (testLead.design_style.length === 0) {
        errs.design_style = 'Please select at least one design style tag.'
      }
      if (testLead.design_style.includes('Other') && !testLead.design_style_other.trim()) {
        errs.design_style_other = 'Please enter your custom styling notes since "Other" is selected.'
      }
    } else if (step === 7) {
      if (testLead.budget.trim()) {
        const num = parseFloat(testLead.budget)
        if (isNaN(num) || num < 0) {
          errs.budget = 'Please enter a valid numeric budget amount.'
        }
      }
      for (const u of testLead.inspiration_urls) {
        if (u.trim() && !isValidUrl(u)) {
          errs.inspiration_urls = `Invalid URL: "${u}". Must start with http:// or https://`
          break
        }
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return
    if (currentStep === 1 && testLead.client_type !== 'BUSINESS') {
      setCurrentStep(3)
    } else {
      setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1))
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrev = () => {
    if (currentStep === 3 && testLead.client_type !== 'BUSINESS') {
      setCurrentStep(1)
    } else {
      setCurrentStep((prev) => Math.max(1, prev - 1))
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleStyleTag = (tag: string) => {
    const exists = testLead.design_style.includes(tag)
    const nextStyles = exists
      ? testLead.design_style.filter((s) => s !== tag)
      : [...testLead.design_style, tag]
    setTestLead({ ...testLead, design_style: nextStyles })
    if (errors.design_style) {
      setErrors((prev) => {
        const n = { ...prev }
        delete n.design_style
        return n
      })
    }
  }

  const handleCompleteVerification = () => {
    startTransition(async () => {
      const res = await completeVerificationTask()
      if (res.success) {
        setCompletedVerification(true)
        router.refresh()
      }
    })
  }

  const currentGuide = STEP_GUIDES.find((g) => g.step === currentStep)

  if (completedVerification) {
    return (
      <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 20px' }}>
        <div
          className="card"
          style={{
            padding: '48px 36px',
            textAlign: 'center',
            background: 'var(--surface)',
            border: '1px solid #bbf7d0',
            boxShadow: '0 10px 25px -5px rgba(22, 101, 52, 0.1)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#f0fdf4',
              border: '2px solid #86efac',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <ShieldCheck style={{ width: 36, height: 36 }} />
          </div>

          <div className="badge badge-status-completed" style={{ margin: '0 auto 12px', fontSize: 13, padding: '4px 12px' }}>
            Verification Complete &amp; Approved
          </div>

          <h1 className="text-heading-xl" style={{ margin: '0 0 10px', color: 'var(--ink-900)' }}>
            Congratulations, You Are Verified!
          </h1>
          <p className="text-body" style={{ color: 'var(--ink-600)', maxWidth: 520, margin: '0 auto 28px', fontSize: 15, lineHeight: 1.6 }}>
            You have successfully completed the Eight34 sales training curriculum and passed the interactive Verification Task. Lead submission access is now completely unlocked across your account.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/leads/new" className="btn btn-solid btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Sparkles style={{ width: 16, height: 16 }} />
              Submit Your First Live Lead
            </Link>
            <Link href="/dashboard" className="btn btn-outline btn-lg">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 840, margin: '20px auto 60px', padding: '0 20px' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1e24 0%, #2b2d42 100%)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Verification Task
          </span>
          <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
            &bull; Guided Test Lead Simulation
          </span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Create Your Very Own Test Lead
        </h1>
        <p style={{ margin: 0, fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5, maxWidth: '680px' }}>
          Follow the guided walkthrough below to simulate entering a prospect. This test lead runs entirely on your device and will not be saved into the live pipeline. Completing all 8 steps unlocks your real lead creation permissions.
        </p>
      </div>

      {/* Step Progress Header */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 650, color: 'var(--ink-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Step {currentStep} of {TOTAL_STEPS}: {currentGuide?.title}
          </span>
          <span className="text-meta" style={{ fontSize: '12px', fontWeight: 600 }}>
            {Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete
          </span>
        </div>
        <div className="progress-bar" style={{ height: '6px' }}>
          <div className="progress-bar-fill" style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>

      {/* Guide Callout Box */}
      {currentGuide && (
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 'var(--radius)',
            padding: '16px 18px',
            marginBottom: '20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}
        >
          <Info style={{ width: '18px', height: '18px', color: 'var(--e34-accent)', marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: 'var(--ink-900)', marginBottom: '2px' }}>
              Guidance: {currentGuide.tip}
            </div>
            <div style={{ color: 'var(--ink-600)' }}>{currentGuide.example}</div>
          </div>
        </div>
      )}

      {/* Step Form Body */}
      <div className="card" style={{ padding: '28px' }}>
        {/* Step 1: Client Entity */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '6px' }}>
                Simulated Client / Business Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                className="input"
                style={{ width: '100%' }}
                placeholder="e.g. Apex Health &amp; Fitness, Studio Lumina, etc."
                value={testLead.client_name}
                onChange={(e) => {
                  setTestLead({ ...testLead, client_name: e.target.value })
                  if (errors.client_name) setErrors((prev) => ({ ...prev, client_name: '' }))
                }}
              />
              {errors.client_name && (
                <span className="text-danger" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.client_name}
                </span>
              )}
            </div>

            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '10px' }}>
                Client Classification <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  { type: 'PERSONAL', label: 'Personal Client', desc: 'Portfolios, resumes, events, creators' },
                  { type: 'BUSINESS', label: 'Business Client', desc: 'Local/regional commercial firms, booking, stores' },
                  { type: 'SAAS', label: 'SaaS / Startup', desc: 'Software companies, marketing hubs, apps' },
                ].map((item) => (
                  <div
                    key={item.type}
                    onClick={() => setTestLead({ ...testLead, client_type: item.type as any })}
                    style={{
                      border: `2px solid ${testLead.client_type === item.type ? 'var(--e34-accent)' : 'var(--ink-200)'}`,
                      borderRadius: 'var(--radius)',
                      padding: '14px',
                      cursor: 'pointer',
                      background: testLead.client_type === item.type ? 'var(--ink-50)' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontWeight: 650, fontSize: '14px', color: 'var(--ink-900)', marginBottom: '4px' }}>
                      {item.label}
                    </div>
                    <div className="text-meta" style={{ fontSize: '12px' }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Category / Business Type */}
        {currentStep === 2 && testLead.client_type === 'BUSINESS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label className="text-label" style={{ display: 'block', marginBottom: '6px' }}>
              Select Industry Vertical <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              className="select"
              style={{ width: '100%' }}
              value={testLead.business_type}
              onChange={(e) => setTestLead({ ...testLead, business_type: e.target.value })}
            >
              {BUSINESS_TYPES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>

            {testLead.business_type === 'OTHER' && (
              <div>
                <label className="text-label" style={{ display: 'block', marginBottom: '6px' }}>
                  Specify Custom Category
                </label>
                <input
                  type="text"
                  className="input"
                  style={{ width: '100%' }}
                  placeholder="e.g. Artisanal Candle Maker"
                  value={testLead.business_type_other}
                  onChange={(e) => setTestLead({ ...testLead, business_type_other: e.target.value })}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Classification */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label className="text-label" style={{ display: 'block', marginBottom: '6px' }}>
              Website Functional Classification <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              className="select"
              style={{ width: '100%' }}
              value={testLead.website_type}
              onChange={(e) => setTestLead({ ...testLead, website_type: e.target.value })}
            >
              <option value="Business Landing Page">Business Landing Page</option>
              <option value="Business Booking & Appointments Page">Business Booking &amp; Appointments Page</option>
              <option value="Personal Portfolio / CV Website">Personal Portfolio / CV Website</option>
              <option value="SaaS Marketing & Product Website">SaaS Marketing &amp; Product Website</option>
              <option value="OTHER">Other (Custom Model)</option>
            </select>

            {testLead.website_type === 'OTHER' && (
              <div>
                <label className="text-label" style={{ display: 'block', marginBottom: '6px' }}>
                  Specify Custom Website Model
                </label>
                <input
                  type="text"
                  className="input"
                  style={{ width: '100%' }}
                  placeholder="e.g. Interactive Real Estate Portal"
                  value={testLead.website_type_other}
                  onChange={(e) => setTestLead({ ...testLead, website_type_other: e.target.value })}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Scope */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '10px' }}>
                Build Scope <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div
                  onClick={() => setTestLead({ ...testLead, reason: 'NEW_WEBSITE' })}
                  style={{
                    border: `2px solid ${testLead.reason === 'NEW_WEBSITE' ? 'var(--e34-accent)' : 'var(--ink-200)'}`,
                    borderRadius: 'var(--radius)',
                    padding: '14px',
                    cursor: 'pointer',
                    background: testLead.reason === 'NEW_WEBSITE' ? 'var(--ink-50)' : 'transparent',
                  }}
                >
                  <div style={{ fontWeight: 650, color: 'var(--ink-900)' }}>Brand New Website</div>
                  <div className="text-meta" style={{ fontSize: '12px' }}>Building from scratch</div>
                </div>

                <div
                  onClick={() => setTestLead({ ...testLead, reason: 'REDO_WEBSITE' })}
                  style={{
                    border: `2px solid ${testLead.reason === 'REDO_WEBSITE' ? 'var(--e34-accent)' : 'var(--ink-200)'}`,
                    borderRadius: 'var(--radius)',
                    padding: '14px',
                    cursor: 'pointer',
                    background: testLead.reason === 'REDO_WEBSITE' ? 'var(--ink-50)' : 'transparent',
                  }}
                >
                  <div style={{ fontWeight: 650, color: 'var(--ink-900)' }}>Redo / Redesign Website</div>
                  <div className="text-meta" style={{ fontSize: '12px' }}>Overhauling existing site (URL required)</div>
                </div>
              </div>
            </div>

            {testLead.reason === 'REDO_WEBSITE' && (
              <div>
                <label className="text-label" style={{ display: 'block', marginBottom: '6px' }}>
                  Existing Website URL <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  style={{ width: '100%' }}
                  placeholder="https://example.com"
                  value={testLead.previous_website_url}
                  onChange={(e) => setTestLead({ ...testLead, previous_website_url: e.target.value })}
                />
                {errors.previous_website_url && (
                  <span className="text-danger" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    {errors.previous_website_url}
                  </span>
                )}
                <span className="text-meta" style={{ fontSize: '11px', marginTop: '4px', display: 'block' }}>
                  Remember: Redesign projects strictly require the current website address for engineering audits.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Target Audience */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="text-label" style={{ display: 'block', marginBottom: '2px' }}>
              Target Audience Profile (Minimum 20 characters) <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              className="input"
              rows={4}
              style={{ width: '100%', resize: 'vertical' }}
              placeholder="Describe demographics, geography, and specific customer pain points..."
              value={testLead.target_audience}
              onChange={(e) => setTestLead({ ...testLead, target_audience: e.target.value })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '12px',
                  color: testLead.target_audience.length >= 20 ? '#166534' : '#991b1b',
                  fontWeight: 600,
                }}
              >
                {testLead.target_audience.length} / 20 characters minimum
              </span>
            </div>
            {errors.target_audience && (
              <span className="text-danger" style={{ fontSize: '12px' }}>
                {errors.target_audience}
              </span>
            )}
          </div>
        )}

        {/* Step 6: Aesthetics */}
        {currentStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label className="text-label" style={{ display: 'block', marginBottom: '2px' }}>
              Select Aesthetic Style Tags <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <p className="text-meta" style={{ fontSize: '12px', margin: 0 }}>
              Select all that apply. Notice how selecting &ldquo;Other&rdquo; enables custom input!
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {DESIGN_STYLES.map((style) => {
                const selected = testLead.design_style.includes(style)
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyleTag(style)}
                    className={`badge ${selected ? 'badge-role-admin' : 'badge-outline'}`}
                    style={{
                      cursor: 'pointer',
                      padding: '6px 12px',
                      fontSize: '13px',
                      border: selected ? '1px solid var(--e34-accent)' : '1px solid var(--ink-200)',
                    }}
                  >
                    {style} {style === 'Other' && '(Custom Input)'}
                  </button>
                )
              })}
            </div>

            {testLead.design_style.includes('Other') && (
              <div style={{ marginTop: '8px' }}>
                <label className="text-label" style={{ display: 'block', marginBottom: '6px' }}>
                  Custom Aesthetic Notes (from &ldquo;Other&rdquo; tag) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  style={{ width: '100%' }}
                  placeholder="e.g. Brutalist minimalism with high contrast typography"
                  value={testLead.design_style_other}
                  onChange={(e) => setTestLead({ ...testLead, design_style_other: e.target.value })}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 7: Commercials */}
        {currentStep === 7 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '6px' }}>
                Estimated Budget ($ USD)
              </label>
              <input
                type="number"
                step="50"
                className="input"
                style={{ width: '100%', maxWidth: '240px' }}
                placeholder="750"
                value={testLead.budget}
                onChange={(e) => setTestLead({ ...testLead, budget: e.target.value })}
              />
              <span className="text-meta" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                Always input clean numbers without symbols or text.
              </span>
            </div>

            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '6px' }}>
                Inspiration &amp; Reference URLs
              </label>
              {testLead.inspiration_urls.map((url, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }}>
                  <input
                    type="text"
                    className="input"
                    style={{ width: '100%' }}
                    placeholder="https://stripe.com"
                    value={url}
                    onChange={(e) => {
                      const urls = [...testLead.inspiration_urls]
                      urls[idx] = e.target.value
                      setTestLead({ ...testLead, inspiration_urls: urls })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Review */}
        {currentStep === 8 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius)', padding: '14px 16px', color: '#166534' }}>
              <div style={{ fontWeight: 650, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 style={{ width: 16, height: 16 }} />
                Test Lead Intake Completed
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
                You have stepped through all 8 intake qualification sections. Review your test inputs below and click complete to finalize verification.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div style={{ background: 'var(--ink-50)', padding: '12px', borderRadius: 'var(--radius)' }}>
                <strong>Client:</strong> {testLead.client_name || 'Apex Health'} ({testLead.client_type})
              </div>
              <div style={{ background: 'var(--ink-50)', padding: '12px', borderRadius: 'var(--radius)' }}>
                <strong>Website Type:</strong> {testLead.website_type}
              </div>
              <div style={{ background: 'var(--ink-50)', padding: '12px', borderRadius: 'var(--radius)' }}>
                <strong>Scope:</strong> {testLead.reason === 'REDO_WEBSITE' ? 'Redesign' : 'New Website'}
              </div>
              <div style={{ background: 'var(--ink-50)', padding: '12px', borderRadius: 'var(--radius)' }}>
                <strong>Est. Budget:</strong> ${testLead.budget || '750'}
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--ink-150)',
          }}
        >
          {currentStep > 1 ? (
            <button type="button" onClick={handlePrev} className="btn btn-outline btn-md" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft style={{ width: '14px', height: '14px' }} /> Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < TOTAL_STEPS ? (
            <button type="button" onClick={handleNext} className="btn btn-solid btn-md" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Next Step <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteVerification}
              disabled={isPending}
              className="btn btn-solid btn-md"
              style={{ background: '#166534', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ShieldCheck style={{ width: '16px', height: '16px' }} />
              {isPending ? 'Verifying...' : 'Complete Verification & Unlock Lead Creation'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
