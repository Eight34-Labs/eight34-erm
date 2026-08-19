export interface TrainingModuleContent {
  overview: string;
  sections: Array<{
    heading: string;
    body: string;
    bullets?: string[];
    callout?: { type: 'info' | 'warning' | 'tip'; text: string };
    exampleBox?: {
      title: string;
      good?: string;
      bad?: string;
      notes?: string;
    };
  }>;
  key_takeaways: string[];
}

export interface TrainingModuleData {
  module_number: number;
  title: string;
  description: string;
  content: TrainingModuleContent;
}

export const TRAINING_MODULES: TrainingModuleData[] = [
  {
    module_number: 1,
    title: "ERM Platform Overview & Sales Workbench",
    description: "How to navigate the ERM, use the sales workbench, understand lead statuses, and monitor your daily pipeline.",
    content: {
      overview: "Welcome to the Eight34 ERM (Enterprise Relationship Management) system! This platform is your central sales hub. It manages client discovery, records project scope and aesthetic requirements, tracks deals across 6 standardized production statuses, and calculates your 50% sales commission.",
      sections: [
        {
          heading: "1. Navigation & The Sales Workbench",
          body: "Your sidebar is organized into clean functional areas: Dashboard (your daily KPIs, recent leads, and pipeline value), Leads (the searchable master pipeline), Lead Drafts (your in-progress client intakes), and Training (this curriculum and verification sandbox).",
          bullets: [
            "Dashboard: Inspect daily pipeline value, active deals, and completed revenue.",
            "Leads: Search, filter by category or status, and view status history logs.",
            "Lead Drafts: Save partial notes on calls and resume anytime.",
            "Training: Complete the 5 modules and the interactive Verification Task to get certified."
          ],
          callout: {
            type: "tip",
            text: "Salespeople can submit new leads as soon as they complete the 5 modules and pass the guided Verification Task."
          }
        },
        {
          heading: "2. The 6 Pipeline Statuses Explained",
          body: "Every lead submitted moves through six standardized pipeline stages as our design and engineering teams build the project:",
          bullets: [
            "NEW: Unreviewed lead freshly submitted into the pipeline.",
            "STILL INQUIRING: Discovery calls and scope refinement underway with the prospect.",
            "WEBSITE IN PROGRESS: Active UI design, bespoke styling, and Next.js engineering in production.",
            "DELIVERY IN PROGRESS: Staging review, client feedback revisions, and DNS setup.",
            "COMPLETED: Website launched! Production costs recorded and commission payouts unlocked.",
            "REJECTED: Disqualified deal (e.g., budget mismatch or cancelled inquiry)."
          ]
        },
        {
          heading: "3. Status History & Collapsible Menus",
          body: "Every status transition is permanently recorded in the lead's Status History audit trail, including timestamps and admin notes. Use the collapsible menus ('Show more / Show less') throughout the interface to inspect full notes without cluttering your screen.",
          callout: {
            type: "info",
            text: "Admins can also trash invalid leads into a collapsible Trash bin at the bottom of the Leads table, which can be restored at any time."
          }
        }
      ],
      key_takeaways: [
        "Use the sidebar to navigate between Dashboard, Leads, Lead Drafts, and Training.",
        "Leads progress through 6 statuses from NEW to COMPLETED.",
        "Status changes are tracked in a transparent, timestamped history log."
      ]
    }
  },
  {
    module_number: 2,
    title: "Client Types, Scopes & Redesign Requirements",
    description: "Categorizing clients into Personal, Business, or SaaS, and mastering the difference between New Builds and Redesigns.",
    content: {
      overview: "Every project begins by identifying the client vertical and project scope. Choosing the right client classification in Step 1 and Step 2 dynamically configures the required fields and website options throughout the intake form.",
      sections: [
        {
          heading: "1. The Three Client Categories",
          body: "Eight34 classifies all projects into three core verticals:",
          bullets: [
            "PERSONAL: Portfolios, digital resumes/CVs, and event landing pages for individuals (e.g. photographers, consultants, executives).",
            "BUSINESS: Local & regional commercial businesses (e.g. restaurants, barber shops, dental clinics, agencies) requiring lead capture or appointment booking.",
            "SAAS: Software-as-a-Service and tech startups needing high-converting marketing sites, interactive pricing tables, or product tour landing pages."
          ]
        },
        {
          heading: "2. New Website vs. Redesign (Crucial Rule)",
          body: "In Step 4, you must specify whether the client needs a brand new website or a redesign of an existing one. If selecting 'Redo / Redesign Existing Website', the platform strictly requires the client's current website URL so engineering can audit legacy assets.",
          callout: {
            type: "warning",
            text: "Rule: When 'Redesign' is selected, you MUST provide the current website URL with http:// or https:// (e.g. https://acmecompany.com)."
          },
          exampleBox: {
            title: "Redesign Qualification Example",
            good: "Reason: Redo Website | URL: https://acme-barbershop.com | Audience: Local men aged 20-50 looking for luxury grooming in Austin, TX.",
            bad: "Reason: Redo Website | URL: [Empty] | Audience: People wanting haircuts.",
            notes: "Engineering needs the existing URL to analyze current SEO rankings, mobile flaws, and copy before writing the custom code."
          }
        }
      ],
      key_takeaways: [
        "Personal = Portfolios/CVs; Business = Commercial & Booking; SaaS = Tech marketing hubs.",
        "Redesign projects require the current live URL without exception.",
        "Proper classification ensures accurate baseline pricing."
      ]
    }
  },
  {
    module_number: 3,
    title: "Intake Form Mastery & High-Quality Submissions",
    description: "Detailed walkthrough of all 8 intake steps: target audiences, aesthetic tags, the 'Other' fill-in field, and reference URLs.",
    content: {
      overview: "Submitting a high-quality lead ensures our engineering team can immediately start building without delays. The Eight34 intake wizard guides you through 8 logical steps.",
      sections: [
        {
          heading: "1. Step-by-Step Form Breakdown",
          body: "Here is what each step in the New Lead form requires:",
          bullets: [
            "Step 1 (Client Entity): Full client name and category (Personal / Business / SaaS).",
            "Step 2 (Category / Business Type): For Business clients, pick the specific industry (Restaurant, Salon, etc.) or 'Other' with a custom name.",
            "Step 3 (Classification): Choose the functional website model (Landing Page, Booking System, etc.).",
            "Step 4 (Scope): New Build vs. Redesign (with URL if Redesign).",
            "Step 5 (Audience): Detailed target demographic profile (minimum 20 characters).",
            "Step 6 (Aesthetics): Select design tags (Minimal, Modern, Bold, Luxury...) and use 'Other' if a custom style is needed.",
            "Step 7 (Commercials): Clean numeric budget and up to 5 inspiration URLs.",
            "Step 8 (Review): Complete summary review before pushing to the live pipeline."
          ]
        },
        {
          heading: "2. The 'Other' Tag is a Special Fill-In Field",
          body: "In Step 6 (Aesthetics), the 'Other' tag is a special system field. When you check 'Other', an inline text box appears allowing you to type custom aesthetic notes (e.g. 'Cyberpunk with neon purple accents'). Admins cannot remove this tag in ERM settings because it enables bespoke styling notes.",
          callout: {
            type: "info",
            text: "Always provide specific visual details in the 'Other' text field whenever selected."
          }
        },
        {
          heading: "3. Target Audience & Inspiration URLs Quality Standard",
          body: "Generic descriptions like 'everyone' or 'clients' will be rejected. Include who the audience is, their location, and what brings them to the site. Additionally, provide 1 to 3 live inspiration URLs that showcase designs the client likes.",
          exampleBox: {
            title: "Audience & Inspiration Benchmark",
            good: "Target Audience: B2B operations managers and founders in North America seeking automated inventory software. Inspiration: https://stripe.com, https://linear.app",
            bad: "Target Audience: Anyone who likes apps. Inspiration: [None]",
            notes: "Specific audiences allow our copywriters and UI designers to tailor typography, color palettes, and conversion funnels."
          }
        }
      ],
      key_takeaways: [
        "Step through all 8 steps with complete, accurate information.",
        "Selecting 'Other' for aesthetics unlocks a custom fill-in field.",
        "Always provide 1-3 live inspiration links for design benchmarks."
      ]
    }
  },
  {
    module_number: 4,
    title: "Dynamic Pricing Guides, Commission & Financials",
    description: "Regional pricing benchmarks, your 50% commission rate, the Completed Lead Pricing Calculator, and payment checkboxes.",
    content: {
      overview: "Eight34 provides clear, transparent pricing tiers for salespeople. Understanding how to quote projects and how your 50% commission is calculated ensures transparent conversations with clients and prompt payouts.",
      sections: [
        {
          heading: "1. US/Europe vs. Global Pricing Benchmarks",
          body: "Inside the New Lead form, you can click 'View Pricing Guide' anytime to inspect official live pricing tiers:",
          bullets: [
            "Personal Portfolio: US/Europe ($50 - $150) | Global ($10 - $100)",
            "Business Landing: US/Europe ($100 - $400) | Global ($50 - $150)",
            "Business Booking & Schedulers: US/Europe ($500 - $900) | Global ($100 - $300)",
            "SaaS Marketing & Product: US/Europe ($500 - $1,500) | Global ($200 - $700)"
          ]
        },
        {
          heading: "2. Your 50% Commission Structure",
          body: "Salespeople earn a default 50.00% commission on net project profit. When a website is completed, admins input any third-party production costs (e.g. specialized domain/hosting fees). The ERM automatically calculates:",
          bullets: [
            "1. Total Website Budget (e.g. $1,000)",
            "2. Production Costs (e.g. $100)",
            "3. Net Project Profit ($1,000 - $100 = $900)",
            "4. Salesperson Share (50% of $900 = $450)",
            "5. Eight34 Retained Share ($450)"
          ],
          callout: {
            type: "tip",
            text: "Check the Costs Map on completed leads: checking 'Mark Paid' provides an instant audit record of settled bank transfers."
          }
        }
      ],
      key_takeaways: [
        "Reference the Pricing Guide modal inside the intake form for real-time tier ranges.",
        "Salespeople receive 50% of net project profit after production costs.",
        "The Completed Pricing Calculator automates all financial math."
      ]
    }
  },
  {
    module_number: 5,
    title: "Lead Drafts, Promotion Lifecycle & Verification",
    description: "How auto-saving drafts works, promoting drafts into live #E34 leads, and launching your Verification Task.",
    content: {
      overview: "You don't need to finish a client intake all in one sitting. The Eight34 ERM includes auto-saving drafts with unique draft IDs so you never lose discovery notes during client calls.",
      sections: [
        {
          heading: "1. Working with Lead Drafts",
          body: "As you type in the New Lead form, the platform auto-saves your progress as a draft with its own unique identifier. You can also click 'Save Draft' at any step. All saved drafts are neatly listed under the 'Lead Drafts' tab in the sidebar.",
          bullets: [
            "Drafts are private to you while in progress.",
            "Each draft displays client name, classification, and last updated time.",
            "Click 'Continue Intake' to resume editing right where you left off."
          ]
        },
        {
          heading: "2. Automatic Promotion to Live Lead",
          body: "When you finish your intake and click 'Submit Lead to Pipeline' in Step 8, the draft is automatically promoted to an active pipeline lead with an official #E34 identifier (e.g. #E34-00105). It is immediately removed from Drafts and appears on the master Leads table for admin review.",
          callout: {
            type: "info",
            text: "Published leads are never drafts. Submitting immediately promotes them into the live production pipeline."
          }
        },
        {
          heading: "3. Your Final Step: The Verification Task",
          body: "Now that you understand the platform, your final qualification step is the **Verification Task**. In this interactive sandbox, you will build your very own test lead with guided walkthrough prompts. It is purely client-side (no database clutter), and once submitted, you are officially verified to create real client leads!",
          callout: {
            type: "tip",
            text: "Click 'Start Verification Task' below once you finish reading to complete your certification!"
          }
        }
      ],
      key_takeaways: [
        "Drafts auto-save with unique IDs and can be resumed from the Lead Drafts tab.",
        "Submitting a draft immediately promotes it into an active #E34 pipeline lead.",
        "Complete the interactive Verification Task to get certified for real lead submission."
      ]
    }
  }
];
