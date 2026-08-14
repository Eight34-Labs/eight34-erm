export interface QuizQuestionData {
  id: string
  question: string
  options: string[]
  correct_answer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  module_number: number
}

export const QUIZ_QUESTION_BANK: QuizQuestionData[] = [
  {
    id: "q-01",
    module_number: 1,
    question: "A prospect contacts Eight34 saying: 'I want an Amazon clone built for $500 in 3 days.' How should a qualified salesperson evaluate this lead?",
    options: [
      "Submit the lead immediately since it is an active inquiry with an explicit budget.",
      "Reject or disqualify the lead: the scope, timeline, and budget are fundamentally incompatible with Eight34's agency model.",
      "Accept the inquiry and ask the engineering team to build a minimal version.",
      "Submit as a Business Booking Page lead to keep the pipeline value high."
    ],
    correct_answer: "Reject or disqualify the lead: the scope, timeline, and budget are fundamentally incompatible with Eight34's agency model.",
    explanation: "High-quality leads must have realistic expectations, compatible budgets ($800+ for personal, $1,500+ for business), and genuine alignment with Eight34's website design and development scope.",
    difficulty: "easy"
  },
  {
    id: "q-02",
    module_number: 2,
    question: "An executive coach wants a personal website highlighting testimonials, speaking engagements, a downloadable CV, and a Calendly scheduling link. What is the correct client and website type classification?",
    options: [
      "SaaS / SaaS Landing Page",
      "Personal / Portfolio or Personal Landing Page",
      "Business / IT",
      "Personal / Resume / CV Website"
    ],
    correct_answer: "Personal / Portfolio or Personal Landing Page",
    explanation: "For an individual professional showcasing thought leadership, speaking, and services, 'Personal' client type with 'Portfolio' or 'Personal Landing Page' website type is the most precise classification.",
    difficulty: "medium"
  },
  {
    id: "q-03",
    module_number: 3,
    question: "A high-end barber shop with 4 locations wants clients to select a barber, choose a service, pick a time slot, and pre-pay online. What website type best fits this requirement?",
    options: [
      "Business Landing Page",
      "Business Booking Page",
      "SaaS Product Website",
      "Personal Event Website"
    ],
    correct_answer: "Business Booking Page",
    explanation: "A service business requiring appointment scheduling, staff selection, and reservation payments is categorized as a Business Booking Page.",
    difficulty: "easy"
  },
  {
    id: "q-04",
    module_number: 4,
    question: "An early-stage B2B AI analytics startup needs a modern website with feature breakdowns, an interactive interactive calculator, pricing tiers, and waitlist collection. What category does this lead fall into?",
    options: [
      "Business / Store",
      "Personal / Personal Landing Page",
      "SaaS / SaaS Marketing Website",
      "Business / Education"
    ],
    correct_answer: "SaaS / SaaS Marketing Website",
    explanation: "A software product requiring feature showcases, tiered pricing grids, and conversion funnels is a SaaS Marketing Website.",
    difficulty: "easy"
  },
  {
    id: "q-05",
    module_number: 6,
    question: "A local restaurant has an existing Wix site created in 2017 that is slow, non-responsive on mobile, and contains PDF menus. What reason should be selected in the intake form?",
    options: [
      "NEW_WEBSITE",
      "REDO_WEBSITE (and the previous Wix URL must be provided)",
      "REJECTED",
      "STILL_INQUIRING"
    ],
    correct_answer: "REDO_WEBSITE (and the previous Wix URL must be provided)",
    explanation: "When a business has an active or previous domain that is being redesigned or replaced, select 'REDO_WEBSITE' and include the existing URL for design review.",
    difficulty: "easy"
  },
  {
    id: "q-06",
    module_number: 7,
    question: "Which of the following target audience descriptions is considered high-quality for an Eight34 lead submission?",
    options: [
      "Everyone who likes food and wants to eat lunch.",
      "Urban working professionals aged 26-45 in downtown Austin seeking fast, healthy, chef-prepared lunch bowls under $18 via mobile order.",
      "People on the internet with smartphones.",
      "Men and women in the United States."
    ],
    correct_answer: "Urban working professionals aged 26-45 in downtown Austin seeking fast, healthy, chef-prepared lunch bowls under $18 via mobile order.",
    explanation: "A good target audience description specifies demographics, psychographics, geographic location, primary problem/need, and purchasing behavior.",
    difficulty: "medium"
  },
  {
    id: "q-07",
    module_number: 8,
    question: "A boutique law firm specializing in venture capital financing requests a website that looks trustworthy, sharp, restrained, with crisp typography and deep navy/charcoal tones. Which design styles should be selected?",
    options: [
      "Playful and Colorful",
      "Corporate, Clean, and Editorial",
      "Futuristic and Neon",
      "Other only"
    ],
    correct_answer: "Corporate, Clean, and Editorial",
    explanation: "Venture capital law firms need a restrained, authoritative, and sophisticated aesthetic best represented by Corporate, Clean, and Editorial styles.",
    difficulty: "medium"
  },
  {
    id: "q-08",
    module_number: 14,
    question: "What is the standard Eight34 pricing range for a custom Business Landing Page or Booking Page for a client in the United States or Western Europe?",
    options: [
      "$100 - $300",
      "$1,500 - $5,000+",
      "$50,000 - $100,000",
      "Free with monthly hosting fee"
    ],
    correct_answer: "$1,500 - $5,000+",
    explanation: "For US/European business clients, bespoke agency-grade landing and booking websites are quoted between $1,500 and $5,000+ depending on custom booking integrations, copy, and asset creation.",
    difficulty: "easy"
  },
  {
    id: "q-09",
    module_number: 15,
    question: "When quoting a client operating in Latin America, Southeast Asia, or Eastern Europe, how does Eight34's pricing structure adapt?",
    options: [
      "We do not accept clients outside the US or Western Europe.",
      "We quote identical US rates with no flexibility.",
      "We apply adjusted global regional pricing (typically 30-50% lower baseline) to match local purchasing power while maintaining quality standards.",
      "We charge hourly rates starting at $15/hr."
    ],
    correct_answer: "We apply adjusted global regional pricing (typically 30-50% lower baseline) to match local purchasing power while maintaining quality standards.",
    explanation: "Eight34 supports global pricing adjustments calibrated to local market dynamics without compromising development and design excellence.",
    difficulty: "medium"
  },
  {
    id: "q-10",
    module_number: 10,
    question: "While scouting on Google Maps, you discover a dental clinic with 280 5-star reviews, an outdated HTTP website from 2012, no online booking, and active Instagram posts. Is this a qualified prospect?",
    options: [
      "No, because they already have 280 reviews and do not need any more customers.",
      "No, having an old website means they will never invest in digital technology.",
      "Yes, high revenue indicators (review volume, active business) paired with a deficient web presence and missing booking make them a prime redesign prospect.",
      "Only if they have a dedicated in-house web designer."
    ],
    correct_answer: "Yes, high revenue indicators (review volume, active business) paired with a deficient web presence and missing booking make them a prime redesign prospect.",
    explanation: "Thriving businesses with active operations but outdated digital touchpoints represent the highest-converting web agency redesign prospects.",
    difficulty: "medium"
  },
  {
    id: "q-11",
    module_number: 12,
    question: "Which cold outreach email opener follows Eight34's editorial, high-trust sales philosophy?",
    options: [
      "HEY DEAR SIR!! We can make your website #1 on Google for $50 guaranteed click here now!",
      "I was reviewing your restaurant's mobile experience and noticed the lunch menu requires downloading a 12MB PDF. We recently designed a streamlined mobile order experience for [Similar Brand] that increased reservations by 34%.",
      "Do you want a website? We make websites fast.",
      "Hello, I am an automated bot reaching out about web design."
    ],
    correct_answer: "I was reviewing your restaurant's mobile experience and noticed the lunch menu requires downloading a 12MB PDF. We recently designed a streamlined mobile order experience for [Similar Brand] that increased reservations by 34%.",
    explanation: "Effective outreach identifies a specific, verifiable point of friction in the prospect's current experience and demonstrates relevant expertise concisely.",
    difficulty: "medium"
  },
  {
    id: "q-12",
    module_number: 13,
    question: "A business owner replies: 'We would love a new site, but $3,500 is more than we paid our nephew 5 years ago.' How should the salesperson handle this objection?",
    options: [
      "Immediately discount the project to $400.",
      "Argue with the owner and insult their current website.",
      "Reframe the website from an expense to an revenue-generating asset, highlighting customer conversion, automated bookings, and brand credibility, while reviewing scope options if needed.",
      "Close the lead as REJECTED immediately."
    ],
    correct_answer: "Reframe the website from an expense to an revenue-generating asset, highlighting customer conversion, automated bookings, and brand credibility, while reviewing scope options if needed.",
    explanation: "Price objections are resolved by clarifying business ROI, quantifying lost revenue from poor UX, and demonstrating the measurable difference between amateur and commercial-grade engineering.",
    difficulty: "hard"
  },
  {
    id: "q-13",
    module_number: 5,
    question: "An independent film festival needs a dedicated site to display screening schedules, trailer embeds, ticket tier links, and venue directions for a 3-day event. Which website type is appropriate?",
    options: [
      "SaaS Product Website",
      "Personal / Event Website or Business / Business Event Website",
      "Resume / CV Website",
      "IT"
    ],
    correct_answer: "Personal / Event Website or Business / Business Event Website",
    explanation: "Event websites are specifically tailored for time-bounded gatherings, conferences, festivals, and exhibitions with schedules and ticketing integrations.",
    difficulty: "easy"
  },
  {
    id: "q-14",
    module_number: 11,
    question: "When prospecting B2B SaaS companies on LinkedIn and Product Hunt, which indicator signals the strongest need for an Eight34 redesign?",
    options: [
      "The company raised a Seed/Series A funding round but still has their initial developer-built template landing page.",
      "The company has 5,000 employees and an in-house design team of 50 people.",
      "The company went out of business 6 months ago.",
      "The founders explicitly state they do not want any marketing."
    ],
    correct_answer: "The company raised a Seed/Series A funding round but still has their initial developer-built template landing page.",
    explanation: "Recently funded startups with fresh capital and growth targets need professional positioning to attract enterprise customers and talent.",
    difficulty: "medium"
  },
  {
    id: "q-15",
    module_number: 16,
    question: "Why is submitting accurate 'Inspiration URLs' in the lead submission form critical for the Eight34 design and engineering team?",
    options: [
      "So our team can copy their source code directly.",
      "They establish visual and structural benchmarks, clarify client aesthetic taste, and minimize revision cycles during wireframing.",
      "They are required by Stripe for payment processing.",
      "They are not important and should always be left blank."
    ],
    correct_answer: "They establish visual and structural benchmarks, clarify client aesthetic taste, and minimize revision cycles during wireframing.",
    explanation: "Inspiration references anchor the client's subjective vocabulary ('modern', 'clean') to concrete design examples and UI mechanics.",
    difficulty: "easy"
  },
  {
    id: "q-16",
    module_number: 16,
    question: "What happens if a salesperson enters a quoted website price as 'around 2k to 3k maybe' in the budget field?",
    options: [
      "The database automatically parses the text into an average number.",
      "The form will fail validation because the budget field requires a clean, numeric dollar value for accurate financial accounting and pipeline reporting.",
      "The system converts it to Bitcoin.",
      "The lead is sent directly to the client."
    ],
    correct_answer: "The form will fail validation because the budget field requires a clean, numeric dollar value for accurate financial accounting and pipeline reporting.",
    explanation: "Eight34 ERM enforces strict financial data integrity: budget inputs must be valid numeric quantities to compute pipeline metrics accurately.",
    difficulty: "easy"
  },
  {
    id: "q-17",
    module_number: 9,
    question: "When using Google Maps for local commercial prospecting, what is the best search workflow to find high-probability leads?",
    options: [
      "Search for Fortune 500 headquarters in New York.",
      "Filter for service categories (e.g. boutique medical, specialty dining, architecture, law) in dense metropolitan areas, sort by review rating, and check each site's mobile responsiveness.",
      "Message random personal Facebook profiles.",
      "Search for domains that are expired only."
    ],
    correct_answer: "Filter for service categories (e.g. boutique medical, specialty dining, architecture, law) in dense metropolitan areas, sort by review rating, and check each site's mobile responsiveness.",
    explanation: "Systematic local prospecting focuses on thriving service verticals where digital customer acquisition and booking directly impact bottom-line revenues.",
    difficulty: "medium"
  },
  {
    id: "q-18",
    module_number: 10,
    question: "Which of the following is an immediate red flag that suggests a prospective client should NOT be submitted into Eight34 ERM?",
    options: [
      "The client asks detailed questions about our delivery timeline.",
      "The client insists on paying $150 for a full custom e-commerce system with 1,000 products and demands daily in-person meetings.",
      "The client wants custom animations on their landing page.",
      "The client currently uses an old WordPress website."
    ],
    correct_answer: "The client insists on paying $150 for a full custom e-commerce system with 1,000 products and demands daily in-person meetings.",
    explanation: "Clients with extreme scope-to-budget asymmetry and toxic micromanagement demands consume agency resources and result in unprofitable churn.",
    difficulty: "hard"
  },
  {
    id: "q-19",
    module_number: 8,
    question: "A client states: 'We want something like Apple or Teenage Engineering — very minimal typography, huge product photography, monochromatic grays, and precise layout.' Which style tags should be selected?",
    options: [
      "Playful and Colorful",
      "Minimal, Modern, and Editorial",
      "Corporate and Traditional",
      "Other"
    ],
    correct_answer: "Minimal, Modern, and Editorial",
    explanation: "Monochromatic palettes, generous whitespace, and restrained typography align with Minimal, Modern, and Editorial design styles.",
    difficulty: "medium"
  },
  {
    id: "q-20",
    module_number: 14,
    question: "What is the standard quoted baseline for a custom Eight34 SaaS Marketing Website with multiple product pages and pricing tables for a US client?",
    options: [
      "$500",
      "$1,000",
      "$3,000 - $8,000+",
      "$250,000"
    ],
    correct_answer: "$3,000 - $8,000+",
    explanation: "Multi-page SaaS marketing and product websites with custom illustrations, responsive layouts, and conversion optimization are quoted between $3,000 and $8,000+.",
    difficulty: "medium"
  },
  {
    id: "q-21",
    module_number: 6,
    question: "A prospect's existing website has broken SSL certificates, 8-second load times, unreadable mobile navigation, and outdated 2019 staff listings. What is the sales angle?",
    options: [
      "Suggest they keep their website as is to avoid disruption.",
      "Quantify lost customer conversions, demonstrate how modern SEO & speed improve Google rank, and propose a complete redesign focused on mobile engagement.",
      "Offer to fix only one typo in their HTML for free.",
      "Report their site to Google."
    ],
    correct_answer: "Quantify lost customer conversions, demonstrate how modern SEO & speed improve Google rank, and propose a complete redesign focused on mobile engagement.",
    explanation: "Highlighting tangible friction (slow speed, broken mobile UX) allows salespeople to pitch a comprehensive redesign as a high-ROI business investment.",
    difficulty: "medium"
  },
  {
    id: "q-22",
    module_number: 11,
    question: "Before submitting a lead into Eight34 ERM, what pre-submission verification must the salesperson always perform?",
    options: [
      "Ensure the client has signed a 10-year exclusivity agreement.",
      "Confirm the decision maker's identity, verify the budget aligns with Eight34 pricing guidelines, validate existing/inspiration URLs, and check that target audience notes are actionable.",
      "Transfer money to the client's bank account.",
      "Send the final source code to the prospect."
    ],
    correct_answer: "Confirm the decision maker's identity, verify the budget aligns with Eight34 pricing guidelines, validate existing/inspiration URLs, and check that target audience notes are actionable.",
    explanation: "Thorough pre-submission qualification prevents unqualified inquiries from cluttering the production pipeline and accelerates deal closing.",
    difficulty: "medium"
  },
  {
    id: "q-23",
    module_number: 16,
    question: "What is the consequence of failing the 20-question certification assessment with a score below 16/20 (80%)?",
    options: [
      "The salesperson can instantly retake the quiz with the same questions.",
      "Training progress is reset server-side, lead submission remains locked, and the salesperson must review the curriculum before re-attempting.",
      "The salesperson's account is permanently deleted.",
      "A penalty fee is charged to the salesperson."
    ],
    correct_answer: "Training progress is reset server-side, lead submission remains locked, and the salesperson must review the curriculum before re-attempting.",
    explanation: "Eight34 ERM enforces rigorous sales quality standards: failing the quiz resets progress to ensure reps master lead qualification principles.",
    difficulty: "easy"
  },
  {
    id: "q-24",
    module_number: 7,
    question: "Why is a target audience description like 'Men and Women aged 18 to 80' unacceptable in an Eight34 lead submission?",
    options: [
      "Eight34 only designs websites for teenagers.",
      "It provides zero actionable insight into user motivations, aesthetic taste, pricing sensitivity, or key conversion triggers necessary for designing the user experience.",
      "It contains too many numbers.",
      "The form automatically rejects words starting with 'M'."
    ],
    correct_answer: "It provides zero actionable insight into user motivations, aesthetic taste, pricing sensitivity, or key conversion triggers necessary for designing the user experience.",
    explanation: "Vague audience definitions prevent designers and copywriters from tailoring typography, visual language, and calls-to-action to the target demographic.",
    difficulty: "easy"
  },
  {
    id: "q-25",
    module_number: 13,
    question: "A qualified prospect asks: 'Can Eight34 integrate a Stripe checkout and automated email confirmations upon order placement?' What is the accurate response?",
    options: [
      "No, Eight34 only builds static text pages with no functionality.",
      "Yes, custom payments, automated email webhooks, database collections, and booking flows are standard capabilities within Eight34's engineering scope.",
      "Yes, but the client must code the Stripe API themselves.",
      "No, Stripe is illegal for websites."
    ],
    correct_answer: "Yes, custom payments, automated email webhooks, database collections, and booking flows are standard capabilities within Eight34's engineering scope.",
    explanation: "Eight34 specializes in full-stack web solutions including checkout flows, database architectures, authentication, and custom third-party integrations.",
    difficulty: "easy"
  }
]
