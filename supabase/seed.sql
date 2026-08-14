-- ============================================================
-- Eight34 ERM — Complete Database Seed Script
-- ============================================================

-- Clean existing data (optional / idempotent)
TRUNCATE TABLE pricing_config CASCADE;
TRUNCATE TABLE quiz_questions CASCADE;
TRUNCATE TABLE training_modules CASCADE;

-- ============================================================
-- SEED PRICING CONFIG
-- ============================================================

INSERT INTO pricing_config (region, website_type, label, min_price, max_price, notes, is_active)
VALUES
  ('US_EUROPE', 'PERSONAL_PORTFOLIO', 'Personal Portfolio / CV Website', 50, 150, 'Single-page or multi-section personal brand showcase with bespoke typography, bio, works, and contact form.', true),
  ('US_EUROPE', 'BUSINESS_LANDING', 'Business Landing Page', 100, 400, 'Commercial service showcase, client reviews, location maps, lead capture forms, and analytics integration.', true),
  ('US_EUROPE', 'BUSINESS_BOOKING', 'Business Booking & Appointments Page', 500, 900, 'Real-time calendar scheduling, staff allocation, deposit payments (Stripe), and automated confirmation webhooks.', true),
  ('US_EUROPE', 'SAAS_MARKETING', 'SaaS Marketing & Product Website', 500, 1500, 'Multi-page feature breakdowns, interactive pricing tables, product demo flows, waitlist forms, and SEO architecture.', true),
  ('GLOBAL', 'PERSONAL_PORTFOLIO', 'Personal Portfolio / CV Website (Global)', 10, 100, 'Adjusted for international purchasing power (30-50% baseline adjustment).', true),
  ('GLOBAL', 'BUSINESS_LANDING', 'Business Landing Page (Global)', 50, 150, 'Full commercial landing page for global clients.', true),
  ('GLOBAL', 'BUSINESS_BOOKING', 'Business Booking & Appointments (Global)', 100, 300, 'Automated booking and scheduling for international businesses.', true),
  ('GLOBAL', 'SAAS_MARKETING', 'SaaS Marketing & Product (Global)', 200, 700, 'Global SaaS marketing website with conversion optimization.', true);

-- ============================================================
-- SEED QUIZ QUESTIONS (25 Scenario-Based Questions)
-- ============================================================

INSERT INTO quiz_questions (question, question_type, options, correct_answer, explanation, difficulty, version, is_active)
VALUES
  (
    'A prospect contacts Eight34 saying: ''I want an Amazon clone built for $500 in 3 days.'' How should a qualified salesperson evaluate this lead?',
    'multiple_choice',
    '["Submit the lead immediately since it is an active inquiry with an explicit budget.", "Reject or disqualify the lead: the scope, timeline, and budget are fundamentally incompatible with Eight34''s agency model.", "Accept the inquiry and ask the engineering team to build a minimal version.", "Submit as a Business Booking Page lead to keep the pipeline value high."]'::jsonb,
    'Reject or disqualify the lead: the scope, timeline, and budget are fundamentally incompatible with Eight34''s agency model.',
    'High-quality leads must have realistic expectations, compatible budgets ($800+ for personal, $1,500+ for business), and genuine alignment with Eight34''s website design and development scope.',
    'easy', 1, true
  ),
  (
    'An executive coach wants a personal website highlighting testimonials, speaking engagements, a downloadable CV, and a Calendly scheduling link. What is the correct client and website type classification?',
    'multiple_choice',
    '["SaaS / SaaS Landing Page", "Personal / Portfolio or Personal Landing Page", "Business / IT", "Personal / Resume / CV Website"]'::jsonb,
    'Personal / Portfolio or Personal Landing Page',
    'For an individual professional showcasing thought leadership, speaking, and services, ''Personal'' client type with ''Portfolio'' or ''Personal Landing Page'' website type is the most precise classification.',
    'medium', 1, true
  ),
  (
    'A high-end barber shop with 4 locations wants clients to select a barber, choose a service, pick a time slot, and pre-pay online. What website type best fits this requirement?',
    'multiple_choice',
    '["Business Landing Page", "Business Booking Page", "SaaS Product Website", "Personal Event Website"]'::jsonb,
    'Business Booking Page',
    'A service business requiring appointment scheduling, staff selection, and reservation payments is categorized as a Business Booking Page.',
    'easy', 1, true
  ),
  (
    'An early-stage B2B AI analytics startup needs a modern website with feature breakdowns, an interactive interactive calculator, pricing tiers, and waitlist collection. What category does this lead fall into?',
    'multiple_choice',
    '["Business / Store", "Personal / Personal Landing Page", "SaaS / SaaS Marketing Website", "Business / Education"]'::jsonb,
    'SaaS / SaaS Marketing Website',
    'A software product requiring feature showcases, tiered pricing grids, and conversion funnels is a SaaS Marketing Website.',
    'easy', 1, true
  ),
  (
    'A local restaurant has an existing Wix site created in 2017 that is slow, non-responsive on mobile, and contains PDF menus. What reason should be selected in the intake form?',
    'multiple_choice',
    '["NEW_WEBSITE", "REDO_WEBSITE (and the previous Wix URL must be provided)", "REJECTED", "STILL_INQUIRING"]'::jsonb,
    'REDO_WEBSITE (and the previous Wix URL must be provided)',
    'When a business has an active or previous domain that is being redesigned or replaced, select ''REDO_WEBSITE'' and include the existing URL for design review.',
    'easy', 1, true
  ),
  (
    'Which of the following target audience descriptions is considered high-quality for an Eight34 lead submission?',
    'multiple_choice',
    '["Everyone who likes food and wants to eat lunch.", "Urban working professionals aged 26-45 in downtown Austin seeking fast, healthy, chef-prepared lunch bowls under $18 via mobile order.", "People on the internet with smartphones.", "Men and women in the United States."]'::jsonb,
    'Urban working professionals aged 26-45 in downtown Austin seeking fast, healthy, chef-prepared lunch bowls under $18 via mobile order.',
    'A good target audience description specifies demographics, psychographics, geographic location, primary problem/need, and purchasing behavior.',
    'medium', 1, true
  ),
  (
    'A boutique law firm specializing in venture capital financing requests a website that looks trustworthy, sharp, restrained, with crisp typography and deep navy/charcoal tones. Which design styles should be selected?',
    'multiple_choice',
    '["Playful and Colorful", "Corporate, Clean, and Editorial", "Futuristic and Neon", "Other only"]'::jsonb,
    'Corporate, Clean, and Editorial',
    'Venture capital law firms need a restrained, authoritative, and sophisticated aesthetic best represented by Corporate, Clean, and Editorial styles.',
    'medium', 1, true
  ),
  (
    'What is the standard Eight34 pricing range for a custom Business Landing Page or Booking Page for a client in the United States or Western Europe?',
    'multiple_choice',
    '["$100 - $300", "$1,500 - $5,000+", "$50,000 - $100,000", "Free with monthly hosting fee"]'::jsonb,
    '$1,500 - $5,000+',
    'For US/European business clients, bespoke agency-grade landing and booking websites are quoted between $1,500 and $5,000+ depending on custom booking integrations, copy, and asset creation.',
    'easy', 1, true
  ),
  (
    'When quoting a client operating in Latin America, Southeast Asia, or Eastern Europe, how does Eight34''s pricing structure adapt?',
    'multiple_choice',
    '["We do not accept clients outside the US or Western Europe.", "We quote identical US rates with no flexibility.", "We apply adjusted global regional pricing (typically 30-50% lower baseline) to match local purchasing power while maintaining quality standards.", "We charge hourly rates starting at $15/hr."]'::jsonb,
    'We apply adjusted global regional pricing (typically 30-50% lower baseline) to match local purchasing power while maintaining quality standards.',
    'Eight34 supports global pricing adjustments calibrated to local market dynamics without compromising development and design excellence.',
    'medium', 1, true
  ),
  (
    'While scouting on Google Maps, you discover a dental clinic with 280 5-star reviews, an outdated HTTP website from 2012, no online booking, and active Instagram posts. Is this a qualified prospect?',
    'multiple_choice',
    '["No, because they already have 280 reviews and do not need any more customers.", "No, having an old website means they will never invest in digital technology.", "Yes, high revenue indicators (review volume, active business) paired with a deficient web presence and missing booking make them a prime redesign prospect.", "Only if they have a dedicated in-house web designer."]'::jsonb,
    'Yes, high revenue indicators (review volume, active business) paired with a deficient web presence and missing booking make them a prime redesign prospect.',
    'Thriving businesses with active operations but outdated digital touchpoints represent the highest-converting web agency redesign prospects.',
    'medium', 1, true
  ),
  (
    'Which cold outreach email opener follows Eight34''s editorial, high-trust sales philosophy?',
    'multiple_choice',
    '["HEY DEAR SIR!! We can make your website #1 on Google for $50 guaranteed click here now!", "I was reviewing your restaurant''s mobile experience and noticed the lunch menu requires downloading a 12MB PDF. We recently designed a streamlined mobile order experience for [Similar Brand] that increased reservations by 34%.", "Do you want a website? We make websites fast.", "Hello, I am an automated bot reaching out about web design."]'::jsonb,
    'I was reviewing your restaurant''s mobile experience and noticed the lunch menu requires downloading a 12MB PDF. We recently designed a streamlined mobile order experience for [Similar Brand] that increased reservations by 34%.',
    'Effective outreach identifies a specific, verifiable point of friction in the prospect''s current experience and demonstrates relevant expertise concisely.',
    'medium', 1, true
  ),
  (
    'A business owner replies: ''We would love a new site, but $3,500 is more than we paid our nephew 5 years ago.'' How should the salesperson handle this objection?',
    'multiple_choice',
    '["Immediately discount the project to $400.", "Argue with the owner and insult their current website.", "Reframe the website from an expense to an revenue-generating asset, highlighting customer conversion, automated bookings, and brand credibility, while reviewing scope options if needed.", "Close the lead as REJECTED immediately."]'::jsonb,
    'Reframe the website from an expense to an revenue-generating asset, highlighting customer conversion, automated bookings, and brand credibility, while reviewing scope options if needed.',
    'Price objections are resolved by clarifying business ROI, quantifying lost revenue from poor UX, and demonstrating the measurable difference between amateur and commercial-grade engineering.',
    'hard', 1, true
  ),
  (
    'An independent film festival needs a dedicated site to display screening schedules, trailer embeds, ticket tier links, and venue directions for a 3-day event. Which website type is appropriate?',
    'multiple_choice',
    '["SaaS Product Website", "Personal / Event Website or Business / Business Event Website", "Resume / CV Website", "IT"]'::jsonb,
    'Personal / Event Website or Business / Business Event Website',
    'Event websites are specifically tailored for time-bounded gatherings, conferences, festivals, and exhibitions with schedules and ticketing integrations.',
    'easy', 1, true
  ),
  (
    'When prospecting B2B SaaS companies on LinkedIn and Product Hunt, which indicator signals the strongest need for an Eight34 redesign?',
    'multiple_choice',
    '["The company raised a Seed/Series A funding round but still has their initial developer-built template landing page.", "The company has 5,000 employees and an in-house design team of 50 people.", "The company went out of business 6 months ago.", "The founders explicitly state they do not want any marketing."]'::jsonb,
    'The company raised a Seed/Series A funding round but still has their initial developer-built template landing page.',
    'Recently funded startups with fresh capital and growth targets need professional positioning to attract enterprise customers and talent.',
    'medium', 1, true
  ),
  (
    'Why is submitting accurate ''Inspiration URLs'' in the lead submission form critical for the Eight34 design and engineering team?',
    'multiple_choice',
    '["So our team can copy their source code directly.", "They establish visual and structural benchmarks, clarify client aesthetic taste, and minimize revision cycles during wireframing.", "They are required by Stripe for payment processing.", "They are not important and should always be left blank."]'::jsonb,
    'They establish visual and structural benchmarks, clarify client aesthetic taste, and minimize revision cycles during wireframing.',
    'Inspiration references anchor the client''s subjective vocabulary (''modern'', ''clean'') to concrete design examples and UI mechanics.',
    'easy', 1, true
  ),
  (
    'What happens if a salesperson enters a quoted website price as ''around 2k to 3k maybe'' in the budget field?',
    'multiple_choice',
    '["The database automatically parses the text into an average number.", "The form will fail validation because the budget field requires a clean, numeric dollar value for accurate financial accounting and pipeline reporting.", "The system converts it to Bitcoin.", "The lead is sent directly to the client."]'::jsonb,
    'The form will fail validation because the budget field requires a clean, numeric dollar value for accurate financial accounting and pipeline reporting.',
    'Eight34 ERM enforces strict financial data integrity: budget inputs must be valid numeric quantities to compute pipeline metrics accurately.',
    'easy', 1, true
  ),
  (
    'When using Google Maps for local commercial prospecting, what is the best search workflow to find high-probability leads?',
    'multiple_choice',
    '["Search for Fortune 500 headquarters in New York.", "Filter for service categories (e.g. boutique medical, specialty dining, architecture, law) in dense metropolitan areas, sort by review rating, and check each site''s mobile responsiveness.", "Message random personal Facebook profiles.", "Search for domains that are expired only."]'::jsonb,
    'Filter for service categories (e.g. boutique medical, specialty dining, architecture, law) in dense metropolitan areas, sort by review rating, and check each site''s mobile responsiveness.',
    'Systematic local prospecting focuses on thriving service verticals where digital customer acquisition and booking directly impact bottom-line revenues.',
    'medium', 1, true
  ),
  (
    'Which of the following is an immediate red flag that suggests a prospective client should NOT be submitted into Eight34 ERM?',
    'multiple_choice',
    '["The client asks detailed questions about our delivery timeline.", "The client insists on paying $150 for a full custom e-commerce system with 1,000 products and demands daily in-person meetings.", "The client wants custom animations on their landing page.", "The client currently uses an old WordPress website."]'::jsonb,
    'The client insists on paying $150 for a full custom e-commerce system with 1,000 products and demands daily in-person meetings.',
    'Clients with extreme scope-to-budget asymmetry and toxic micromanagement demands consume agency resources and result in unprofitable churn.',
    'hard', 1, true
  ),
  (
    'A client states: ''We want something like Apple or Teenage Engineering — very minimal typography, huge product photography, monochromatic grays, and precise layout.'' Which style tags should be selected?',
    'multiple_choice',
    '["Playful and Colorful", "Minimal, Modern, and Editorial", "Corporate and Traditional", "Other"]'::jsonb,
    'Minimal, Modern, and Editorial',
    'Monochromatic palettes, generous whitespace, and restrained typography align with Minimal, Modern, and Editorial design styles.',
    'medium', 1, true
  ),
  (
    'What is the standard quoted baseline for a custom Eight34 SaaS Marketing Website with multiple product pages and pricing tables for a US client?',
    'multiple_choice',
    '["$500", "$1,000", "$3,000 - $8,000+", "$250,000"]'::jsonb,
    '$3,000 - $8,000+',
    'Multi-page SaaS marketing and product websites with custom illustrations, responsive layouts, and conversion optimization are quoted between $3,000 and $8,000+.',
    'medium', 1, true
  ),
  (
    'A prospect''s existing website has broken SSL certificates, 8-second load times, unreadable mobile navigation, and outdated 2019 staff listings. What is the sales angle?',
    'multiple_choice',
    '["Suggest they keep their website as is to avoid disruption.", "Quantify lost customer conversions, demonstrate how modern SEO & speed improve Google rank, and propose a complete redesign focused on mobile engagement.", "Offer to fix only one typo in their HTML for free.", "Report their site to Google."]'::jsonb,
    'Quantify lost customer conversions, demonstrate how modern SEO & speed improve Google rank, and propose a complete redesign focused on mobile engagement.',
    'Highlighting tangible friction (slow speed, broken mobile UX) allows salespeople to pitch a comprehensive redesign as a high-ROI business investment.',
    'medium', 1, true
  ),
  (
    'Before submitting a lead into Eight34 ERM, what pre-submission verification must the salesperson always perform?',
    'multiple_choice',
    '["Ensure the client has signed a 10-year exclusivity agreement.", "Confirm the decision maker''s identity, verify the budget aligns with Eight34 pricing guidelines, validate existing/inspiration URLs, and check that target audience notes are actionable.", "Transfer money to the client''s bank account.", "Send the final source code to the prospect."]'::jsonb,
    'Confirm the decision maker''s identity, verify the budget aligns with Eight34 pricing guidelines, validate existing/inspiration URLs, and check that target audience notes are actionable.',
    'Thorough pre-submission qualification prevents unqualified inquiries from cluttering the production pipeline and accelerates deal closing.',
    'medium', 1, true
  ),
  (
    'What is the consequence of failing the 20-question certification assessment with a score below 16/20 (80%)?',
    'multiple_choice',
    '["The salesperson can instantly retake the quiz with the same questions.", "Training progress is reset server-side, lead submission remains locked, and the salesperson must review the curriculum before re-attempting.", "The salesperson''s account is permanently deleted.", "A penalty fee is charged to the salesperson."]'::jsonb,
    'Training progress is reset server-side, lead submission remains locked, and the salesperson must review the curriculum before re-attempting.',
    'Eight34 ERM enforces rigorous sales quality standards: failing the quiz resets progress to ensure reps master lead qualification principles.',
    'easy', 1, true
  ),
  (
    'Why is a target audience description like ''Men and Women aged 18 to 80'' unacceptable in an Eight34 lead submission?',
    'multiple_choice',
    '["Eight34 only designs websites for teenagers.", "It provides zero actionable insight into user motivations, aesthetic taste, pricing sensitivity, or key conversion triggers necessary for designing the user experience.", "It contains too many numbers.", "The form automatically rejects words starting with ''M''."]'::jsonb,
    'It provides zero actionable insight into user motivations, aesthetic taste, pricing sensitivity, or key conversion triggers necessary for designing the user experience.',
    'Vague audience definitions prevent designers and copywriters from tailoring typography, visual language, and calls-to-action to the target demographic.',
    'easy', 1, true
  ),
  (
    'A qualified prospect asks: ''Can Eight34 integrate a Stripe checkout and automated email confirmations upon order placement?'' What is the accurate response?',
    'multiple_choice',
    '["No, Eight34 only builds static text pages with no functionality.", "Yes, custom payments, automated email webhooks, database collections, and booking flows are standard capabilities within Eight34''s engineering scope.", "Yes, but the client must code the Stripe API themselves.", "No, Stripe is illegal for websites."]'::jsonb,
    'Yes, custom payments, automated email webhooks, database collections, and booking flows are standard capabilities within Eight34''s engineering scope.',
    'Eight34 specializes in full-stack web solutions including checkout flows, database architectures, authentication, and custom third-party integrations.',
    'easy', 1, true
  );
