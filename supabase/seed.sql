-- ============================================================
-- Eight34 ERM — Complete Database Seed Script
-- ============================================================

-- Clean existing data (optional / idempotent)
TRUNCATE TABLE pricing_config CASCADE;
TRUNCATE TABLE quiz_questions CASCADE;
TRUNCATE TABLE training_modules CASCADE;
TRUNCATE TABLE erm_settings CASCADE;

-- ============================================================
-- SEED ERM SETTINGS
-- ============================================================

INSERT INTO erm_settings (default_commission_rate, auto_approve_salespeople, slack_workspace_id)
VALUES (50.00, false, 'T_EIGHT34_MAIN');

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
    '["Submit the lead because the prospect has provided a specific budget.", "Reject or disqualify the lead because the requested scope, timeline, and budget are fundamentally incompatible with Eight34''s service model.", "Submit it as a SaaS Marketing Website and let engineering determine the scope.", "Accept the project and reduce the functionality until it fits the budget."]'::jsonb,
    'Reject or disqualify the lead because the requested scope, timeline, and budget are fundamentally incompatible with Eight34''s service model.',
    'A qualified lead needs realistic expectations and a project scope that fits Eight34''s pricing structure. A large marketplace clone is far outside the scope of the $500-$1,500+ website tiers.',
    'easy', 2, true
  ),
  (
    'An executive coach wants a personal website highlighting testimonials, speaking engagements, a downloadable CV, and a Calendly scheduling link. What is the most appropriate website classification?',
    'multiple_choice',
    '["Personal Portfolio / CV Website", "Business Landing Page", "Business Booking & Appointments Page", "SaaS Marketing & Product Website"]'::jsonb,
    'Personal Portfolio / CV Website',
    'The primary purpose is to present an individual professional''s identity, experience, work, and credibility. A scheduling link does not by itself make the project a full booking website.',
    'medium', 2, true
  ),
  (
    'A high-end barber shop with 4 locations wants customers to choose a barber, select a service, pick an available time, and pre-pay online. Which Eight34 website category best matches the project?',
    'multiple_choice',
    '["Business Landing Page", "Business Booking & Appointments Page", "SaaS Marketing & Product Website", "Personal Portfolio / CV Website"]'::jsonb,
    'Business Booking & Appointments Page',
    'Customer scheduling, staff allocation, availability, and payment turn this from a primarily informational business site into a booking and appointments project.',
    'easy', 2, true
  ),
  (
    'An early-stage B2B AI startup needs pages explaining its product, feature comparisons, pricing tiers, an interactive demo, and a waitlist. Which category should the salesperson select?',
    'multiple_choice',
    '["Personal Portfolio / CV Website", "Business Landing Page", "Business Booking & Appointments Page", "SaaS Marketing & Product Website"]'::jsonb,
    'SaaS Marketing & Product Website',
    'The website is primarily marketing a software product and requires product-focused content, pricing, interactive elements, and conversion flows.',
    'easy', 2, true
  ),
  (
    'A local restaurant has an existing Wix site created in 2017 that is slow, non-responsive on mobile, and contains PDF menus. What reason should be selected in the intake form?',
    'multiple_choice',
    '["NEW_WEBSITE", "REDO_WEBSITE (and the previous Wix URL must be provided)", "REJECTED", "STILL_INQUIRING"]'::jsonb,
    'REDO_WEBSITE (and the previous Wix URL must be provided)',
    'An existing website that needs to be substantially redesigned or replaced should be treated as a redesign. The current URL is useful for evaluating the existing experience and scope.',
    'easy', 2, true
  ),
  (
    'Which target-audience description gives the Eight34 team the most actionable information?',
    'multiple_choice',
    '["Local customers who want good food.", "Urban working professionals aged 26-45 in downtown Austin seeking fast, healthy, chef-prepared lunch bowls under $18 via mobile order.", "Adults who use smartphones and visit restaurants.", "People in the United States who might be interested in the business."]'::jsonb,
    'Urban working professionals aged 26-45 in downtown Austin seeking fast, healthy, chef-prepared lunch bowls under $18 via mobile order.',
    'A useful audience description identifies who the users are, where they are, what they need, and how they are likely to interact with or purchase from the business.',
    'medium', 2, true
  ),
  (
    'A boutique law firm specializing in venture capital financing wants a website that feels trustworthy, restrained, sophisticated, and typography-driven. Which style combination is the strongest fit?',
    'multiple_choice',
    '["Playful and Colorful", "Corporate, Clean, and Editorial", "Futuristic and Neon", "Hand-drawn and Whimsical"]'::jsonb,
    'Corporate, Clean, and Editorial',
    'The requested visual language emphasizes authority, restraint, typography, and sophistication, which aligns with Corporate, Clean, and Editorial styles.',
    'medium', 2, true
  ),
  (
    'A US-based solo consultant wants a polished one-page site containing a bio, selected work, testimonials, and contact information. Which pricing range should the salesperson use as the starting range?',
    'multiple_choice',
    '["$10 - $100", "$50 - $150", "$100 - $400", "$500 - $1,500"]'::jsonb,
    '$50 - $150',
    'A Personal Portfolio / CV Website for US and European clients is priced at $50-$150. The project remains within this tier because its primary purpose is personal brand presentation rather than complex business functionality.',
    'easy', 2, true
  ),
  (
    'A US-based dental practice needs a polished website with service pages, testimonials, a location map, lead forms, and analytics, but patients will continue booking through a separate system. Which range best matches the project?',
    'multiple_choice',
    '["$50 - $150", "$100 - $400", "$500 - $900", "$500 - $1,500"]'::jsonb,
    '$100 - $400',
    'This is a Business Landing Page: the site supports a commercial service business with lead capture, reviews, location information, and analytics without requiring a custom appointment system.',
    'medium', 2, true
  ),
  (
    'A US-based salon wants customers to select a stylist, choose a service, see live availability, reserve an appointment, and pay a deposit through Stripe. Which pricing range should be considered?',
    'multiple_choice',
    '["$100 - $400", "$500 - $900", "$500 - $1,500", "$50 - $150"]'::jsonb,
    '$500 - $900',
    'Real-time scheduling, staff allocation, and deposit payments place the project in the Business Booking & Appointments tier, priced at $500-$900 for US and European clients.',
    'medium', 2, true
  ),
  (
    'A US-based startup wants a multi-page website explaining its software, comparing feature tiers, displaying interactive pricing, demonstrating the product, collecting a waitlist, and establishing a strong SEO structure. Which range is appropriate?',
    'multiple_choice',
    '["$100 - $400", "$500 - $900", "$500 - $1,500", "$50 - $150"]'::jsonb,
    '$500 - $1,500',
    'The combination of product marketing, multiple pages, interactive pricing, demo flows, waitlist collection, and SEO architecture fits the SaaS Marketing & Product Website tier.',
    'medium', 2, true
  ),
  (
    'A client in Southeast Asia needs a personal portfolio with a bio, selected projects, testimonials, and a contact form. Which pricing range applies under Eight34''s global structure?',
    'multiple_choice',
    '["$10 - $100", "$50 - $150", "$100 - $300", "$200 - $700"]'::jsonb,
    '$10 - $100',
    'The project is a Personal Portfolio / CV Website for a global client, which has a $10-$100 pricing range under the global structure.',
    'easy', 2, true
  ),
  (
    'A small business in Eastern Europe needs a commercial website with service information, testimonials, a map, lead capture, and analytics. Which range should be used?',
    'multiple_choice',
    '["$10 - $100", "$50 - $150", "$100 - $300", "$200 - $700"]'::jsonb,
    '$50 - $150',
    'The project is a Global Business Landing Page, whose current pricing range is $50-$150.',
    'medium', 2, true
  ),
  (
    'A business in Latin America needs live appointment scheduling, staff availability, automated confirmations, and online deposits. Which global pricing tier fits the project?',
    'multiple_choice',
    '["$50 - $150", "$100 - $300", "$200 - $700", "$500 - $900"]'::jsonb,
    '$100 - $300',
    'The required functionality makes this a Global Business Booking & Appointments project, priced at $100-$300.',
    'medium', 2, true
  ),
  (
    'A software startup outside the US and Europe wants a product website with feature pages, pricing, conversion-focused sections, and interactive product demonstrations. Which range applies?',
    'multiple_choice',
    '["$50 - $150", "$100 - $300", "$200 - $700", "$500 - $1,500"]'::jsonb,
    '$200 - $700',
    'A Global SaaS Marketing & Product Website is priced at $200-$700. The global tier adjusts the baseline while retaining the same project category.',
    'medium', 2, true
  ),
  (
    'While scouting on Google Maps, you discover a dental clinic with 280 5-star reviews, an outdated website, poor mobile usability, and no online booking. How should this prospect be evaluated?',
    'multiple_choice',
    '["Disqualify it because the business already has strong reviews.", "Disqualify it because an outdated website indicates low digital interest.", "Treat it as a strong prospect because the business appears established while its website has clear opportunities for improvement.", "Submit it only if the clinic already employs a web designer."]'::jsonb,
    'Treat it as a strong prospect because the business appears established while its website has clear opportunities for improvement.',
    'Strong customer activity combined with an outdated or ineffective web presence can indicate a business with both demand and a clear reason to invest in a better website.',
    'medium', 2, true
  ),
  (
    'Which cold outreach opener best demonstrates that the salesperson actually researched the prospect?',
    'multiple_choice',
    '["We build premium websites for businesses like yours. Are you interested?", "I was reviewing your restaurant''s mobile experience and noticed the lunch menu requires downloading a large PDF. That adds friction for customers who are trying to decide where to eat.", "Your website needs work. We can redesign it quickly.", "Hi, we are Eight34 and would love to work with you on a website."]'::jsonb,
    'I was reviewing your restaurant''s mobile experience and noticed the lunch menu requires downloading a large PDF. That adds friction for customers who are trying to decide where to eat.',
    'Strong outreach identifies a specific, observable problem rather than relying on generic claims. The prospect should immediately understand why they were contacted.',
    'medium', 2, true
  ),
  (
    'A business owner says: ''We would love a new site, but $3,500 is more than we paid our nephew five years ago.'' What is the strongest response strategy?',
    'multiple_choice',
    '["Immediately reduce the quote to $400 regardless of scope.", "Explain the difference in scope and value, then determine whether a smaller project can solve the most important business problems.", "Tell the owner that inexpensive websites are always bad.", "End the conversation immediately because any price objection means the lead is unqualified."]'::jsonb,
    'Explain the difference in scope and value, then determine whether a smaller project can solve the most important business problems.',
    'A price objection should lead to qualification and scope discussion rather than an automatic discount or confrontation. If appropriate, the salesperson can identify a smaller tier that better matches the client''s needs.',
    'hard', 2, true
  ),
  (
    'An independent film festival needs a dedicated site displaying screening schedules, trailer embeds, ticket links, and venue directions for a three-day event. Which classification is most appropriate?',
    'multiple_choice',
    '["Personal Portfolio / CV Website", "Business Landing Page", "Business Booking & Appointments Page", "SaaS Marketing & Product Website"]'::jsonb,
    'Business Landing Page',
    'The listed requirements describe an informational promotional website rather than a personal portfolio, appointment system, or SaaS product. If the festival organization is treated as the client, the closest available commercial category is Business Landing Page.',
    'medium', 2, true
  ),
  (
    'When prospecting B2B SaaS companies, which situation most strongly suggests that the company may need a new marketing website?',
    'multiple_choice',
    '["The company recently raised funding but still presents its product through a generic template that does not clearly communicate its value proposition.", "The company has a large internal design team that already owns the website.", "The company has permanently stopped operating.", "The founders have explicitly said they do not want marketing or customer acquisition."]'::jsonb,
    'The company recently raised funding but still presents its product through a generic template that does not clearly communicate its value proposition.',
    'Recent growth or funding can create a stronger need for professional positioning. A weak marketing site can become a bottleneck when the company is trying to attract customers, partners, or talent.',
    'medium', 2, true
  ),
  (
    'Why should a salesperson collect accurate Inspiration URLs when submitting a website lead?',
    'multiple_choice',
    '["They allow the engineering team to copy the referenced website directly.", "They give the design team concrete references for the client''s visual preferences and reduce ambiguity during the design process.", "They determine which payment processor the project must use.", "They are optional because visual preferences cannot be communicated through examples."]'::jsonb,
    'They give the design team concrete references for the client''s visual preferences and reduce ambiguity during the design process.',
    'References turn subjective descriptions such as ''clean'' or ''premium'' into concrete visual benchmarks for typography, layout, interaction, spacing, and overall aesthetic direction.',
    'easy', 2, true
  ),
  (
    'What should happen if a salesperson enters ''around 2k to 3k maybe'' into a budget field that expects a numeric value?',
    'multiple_choice',
    '["The system averages the numbers automatically.", "The form should reject the value because the budget field requires a clean numeric amount.", "The system converts the amount to Bitcoin.", "The lead is automatically approved using the highest number."]'::jsonb,
    'The form should reject the value because the budget field requires a clean numeric amount.',
    'Numeric budget fields need standardized values so that financial reporting, filtering, qualification, and pipeline calculations remain reliable.',
    'easy', 2, true
  ),
  (
    'When using Google Maps to find local commercial prospects, which workflow is most useful for Eight34?',
    'multiple_choice',
    '["Search every business in a city without checking its website.", "Focus on established service businesses, inspect their web presence for meaningful problems, and prioritize prospects where the website could directly improve customer acquisition or conversion.", "Only contact businesses with perfect websites.", "Search exclusively for businesses with expired domains."]'::jsonb,
    'Focus on established service businesses, inspect their web presence for meaningful problems, and prioritize prospects where the website could directly improve customer acquisition or conversion.',
    'Effective prospecting combines business health with identifiable digital problems. The strongest prospects have a reason to invest and a website problem Eight34 can realistically solve.',
    'medium', 2, true
  ),
  (
    'Which situation should immediately make a salesperson question whether a project is a viable Eight34 lead?',
    'multiple_choice',
    '["The prospect asks for a specific delivery timeline.", "The prospect wants a custom e-commerce system with 1,000 products but has a $150 budget and expects extensive ongoing involvement.", "The prospect asks for custom animations on a landing page.", "The prospect has an older WordPress website and wants to replace it."]'::jsonb,
    'The prospect wants a custom e-commerce system with 1,000 products but has a $150 budget and expects extensive ongoing involvement.',
    'The problem is the severe mismatch between scope, budget, and expectations. The current Eight34 pricing structure does not support a project of that scale at $150.',
    'hard', 2, true
  ),
  (
    'A client says: ''We want something like Apple or Teenage Engineering — minimal typography, large product imagery, monochromatic colors, and precise spacing.'' Which style tags best match the brief?',
    'multiple_choice',
    '["Playful and Colorful", "Minimal, Modern, and Editorial", "Corporate and Traditional", "Hand-drawn and Whimsical"]'::jsonb,
    'Minimal, Modern, and Editorial',
    'Minimal layouts, restrained color palettes, strong typography, generous spacing, and highly controlled composition align with Minimal, Modern, and Editorial styles.',
    'medium', 2, true
  ),
  (
    'A US client needs a SaaS marketing website with several product pages, interactive pricing, a product demo flow, a waitlist, and a strong SEO structure. What is the correct standard pricing range?',
    'multiple_choice',
    '["$100 - $400", "$500 - $900", "$500 - $1,500", "$50 - $150"]'::jsonb,
    '$500 - $1,500',
    'This scope falls directly into the US/EU SaaS Marketing & Product Website tier, which is priced at $500-$1,500.',
    'medium', 2, true
  ),
  (
    'A prospect''s existing website has broken SSL, very slow load times, poor mobile navigation, and outdated staff information. What should the salesperson focus on during the conversation?',
    'multiple_choice',
    '["Tell them the issues are cosmetic and can be ignored.", "Connect the specific problems to customer trust, usability, and conversion, then determine whether a redesign is justified by the business impact.", "Offer to fix only the staff names for free.", "Recommend that they remove the website entirely."]'::jsonb,
    'Connect the specific problems to customer trust, usability, and conversion, then determine whether a redesign is justified by the business impact.',
    'Sales conversations should connect observable website problems to business outcomes. The goal is to establish whether a redesign can create meaningful value rather than simply listing technical defects.',
    'medium', 2, true
  ),
  (
    'Before submitting a lead into Eight34 ERM, which verification should the salesperson complete?',
    'multiple_choice',
    '["Confirm the decision maker, verify that the requested scope fits an Eight34 pricing tier, validate relevant URLs, and make sure the audience and project requirements are specific enough to act on.", "Require the client to sign a long-term exclusivity agreement.", "Send the prospect production source code before submission.", "Collect payment before the lead can enter the pipeline."]'::jsonb,
    'Confirm the decision maker, verify that the requested scope fits an Eight34 pricing tier, validate relevant URLs, and make sure the audience and project requirements are specific enough to act on.',
    'Pre-submission qualification protects the pipeline from incomplete or commercially unrealistic opportunities and gives the production team enough context to evaluate the project.',
    'medium', 2, true
  ),
  (
    'What is the consequence of failing the 20-question certification assessment with a score below 16/20 (80%)?',
    'multiple_choice',
    '["The salesperson can immediately retake it with no review.", "Training progress is reset server-side, lead submission remains locked, and the salesperson must review the curriculum before attempting the assessment again.", "The salesperson''s account is permanently deleted.", "The salesperson is charged a penalty fee."]'::jsonb,
    'Training progress is reset server-side, lead submission remains locked, and the salesperson must review the curriculum before attempting the assessment again.',
    'The certification gate ensures salespeople understand Eight34''s qualification standards before they can submit leads into the production pipeline.',
    'easy', 2, true
  ),
  (
    'Why is a target audience description such as ''Men and Women aged 18 to 80'' insufficient for an Eight34 lead submission?',
    'multiple_choice',
    '["Eight34 only works with younger audiences.", "It identifies a broad demographic but gives little actionable information about users'' needs, motivations, behavior, or reasons for choosing the business.", "The age range contains too many numbers.", "The ERM cannot store demographic information."]'::jsonb,
    'It identifies a broad demographic but gives little actionable information about users'' needs, motivations, behavior, or reasons for choosing the business.',
    'A useful audience description should help the design and copy teams understand who the site is trying to persuade and what matters to those users.',
    'easy', 2, true
  ),
  (
    'A qualified prospect asks: ''Can Eight34 integrate Stripe checkout and automated email confirmations after an order?'' What is the most accurate response?',
    'multiple_choice',
    '["No. Eight34 only builds static informational websites.", "Yes. These integrations can be included when the project scope and selected website tier support the required functionality.", "Yes, but the client must implement the Stripe integration themselves.", "No. Payment integrations are not compatible with custom websites."]'::jsonb,
    'Yes. These integrations can be included when the project scope and selected website tier support the required functionality.',
    'Eight34 can support custom functionality and third-party integrations, but the salesperson should qualify the exact requirements and ensure the project is priced in an appropriate tier rather than treating every integration as automatically included.',
    'medium', 2, true
  );