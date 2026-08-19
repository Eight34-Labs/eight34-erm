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
    title: "Mastering the Dashboard & Live Pipeline (/dashboard)",
    description: "How to use your daily dashboard, read key sales metrics, track active deals, and monitor your commission earnings.",
    content: {
      overview: "The Dashboard (/dashboard) is your daily sales command center. Whenever you log in, this page gives you an instant snapshot of your active pipeline, deal statuses, revenue volume, and your earned commission. Here is how to use every element on this screen.",
      sections: [
        {
          heading: "1. The Top Metric Summary Cards",
          body: "At the top of your dashboard, you will see four real-time KPI cards that summarize your performance:",
          bullets: [
            "Total Pipeline Volume ($): The total gross value of all active website projects you have brought in.",
            "Deals in Progress: Number of client projects currently being designed, coded, or staged by our engineering team.",
            "Closed & Completed Deals: Total successful website launches you have closed.",
            "Your Commission Payout ($): Your calculated earnings based on your assigned commission rate (e.g., 50%)."
          ],
          callout: {
            type: "tip",
            text: "Use these numbers during your weekly sales review to monitor which deals are moving toward completion and payout."
          }
        },
        {
          heading: "2. The Recent Deals Table & Status Indicators",
          body: "Directly below the metrics is your Recent Deals Table. Each deal displays the client name, website type, budget, and live status badge. The 5 key statuses you will see are:",
          bullets: [
            "NEW / INQUIRING: You or a teammate submitted the lead; project managers are conducting initial intake review.",
            "IN PROGRESS (Design & Code): Our engineering team is actively building wireframes, custom styling, and features.",
            "DELIVERY & REVISIONS: The site is on a live preview URL for client sign-off and final touch-ups.",
            "COMPLETED: Website is live on the client's custom domain and paid in full. Your commission is finalized!",
            "REJECTED: Deal was marked disqualified or cancelled."
          ]
        },
        {
          heading: "3. Top Action Buttons: Quick Navigation",
          body: "In the top right corner of the dashboard header, you have two primary buttons you will use constantly:",
          bullets: [
            "'+ New Lead' (Dark Button): Jumps straight to the 8-step lead intake wizard (/leads/new).",
            "'View Drafts' (Outline Button): Takes you to your saved incomplete leads so you can resume work anytime."
          ]
        }
      ],
      key_takeaways: [
        "Check your Dashboard daily to see live progress on your client websites.",
        "Commission is automatically computed and displayed as soon as projects complete.",
        "Use '+ New Lead' to start submitting a prospect or 'View Drafts' to resume paused client intakes."
      ]
    }
  },
  {
    module_number: 2,
    title: "The Leads Hub & Lead Detail View (/leads & /leads/[id])",
    description: "How to search and filter opportunities, inspect client project briefs, view team notes, and track real-time activity timelines.",
    content: {
      overview: "The Leads Hub (/leads) is where all your company's sales opportunities live. Whether you want to check an existing client's details, search for a past deal, or see technical notes from the developers, this page has all the tools you need.",
      sections: [
        {
          heading: "1. Search Bar & Status Filters",
          body: "At the top of the Leads page, you have powerful filtering tools:",
          bullets: [
            "Instant Search Input: Type any client name, business name, or lead number (e.g. #E34-1042) to find a record instantly.",
            "Status Filter Tabs: Filter the list with one click to see only 'All', 'Inquiring', 'In Progress', or 'Completed' leads.",
            "Sorting: Sort leads chronologically to see the newest prospects at the top."
          ]
        },
        {
          heading: "2. Opening the Lead Detail Screen (/leads/[id])",
          body: "Clicking on any lead row opens its full detail view. This screen contains everything about the deal:",
          bullets: [
            "Lead Number & Header: Displays the permanent tracking identifier (e.g. #E34-0012) and current status badge.",
            "Client Brief Card: Displays the Client Entity, Business Category, Functional Website Type, and Redesign status.",
            "Scope & Target Audience: Contains the customer persona and requirements you entered during intake.",
            "Aesthetic Styles & Inspiration Links: Shows the design vibe tags and clickable preview links for the designers.",
            "Commercial Details: Displays the estimated budget, quoted price, and assigned salesperson."
          ]
        },
        {
          heading: "3. The Activity & Status History Timeline",
          body: "On the right side of the Lead Detail screen is the Activity Timeline. Every time a status changes, a note is logged, or a milestone is reached, a timestamped record is added. Use this to give your clients accurate status updates without having to message developers manually."
        }
      ],
      key_takeaways: [
        "Search by client name or lead ID (#E34-XXXX) to find any past or active lead.",
        "The Lead Detail page shows the full client brief and development history.",
        "Review the Activity Timeline to keep clients updated on project milestones."
      ]
    }
  },
  {
    module_number: 3,
    title: "Step-by-Step Lead Intake Masterclass (/leads/new)",
    description: "A complete walkthrough of the 8-step intake wizard: client entities, categories, redesign URL rules, target audience, aesthetics, and pricing.",
    content: {
      overview: "Registering a new lead (/leads/new) is the most important workflow for a salesperson. An accurate intake ensures developers build exactly what the client wants with zero misunderstandings. Here is how to complete each of the 8 steps like an expert.",
      sections: [
        {
          heading: "Step 1: Client Entity (Personal, Business, SaaS)",
          body: "Choose who the client is. Personal is for portfolios, resumes, and individual creators. Business is for local commercial firms, restaurants, shops, and services. SaaS is for software companies and app landing hubs.",
          callout: {
            type: "info",
            text: "Selecting 'Business' will smoothly unlock Step 2 (Business Categories) in the wizard."
          }
        },
        {
          heading: "Step 2 & 3: Industry Category & Functional Model",
          body: "Select the vertical (e.g. Restaurant, Barbershop, Education) or select 'Other' to type in a custom business category. Next, choose the functional website model: simple Landing Page, complex Booking & Appointments system, or SaaS Marketing site."
        },
        {
          heading: "Step 4: Project Scope & The Strict Redesign Rule",
          body: "Choose whether this is a Brand New Website or a Redo / Redesign of an existing site.",
          callout: {
            type: "warning",
            text: "STRICT RULE: If you choose 'Redo Website', the existing website URL is 100% mandatory. Our engineers must inspect the existing site to audit content and preserve SEO."
          }
        },
        {
          heading: "Step 5: Target Audience Profile (Minimum 20 Characters)",
          body: "Write a clear description of the client's end customer (age, location, needs, pain points). Generic inputs like 'everyone' or 'anyone' are rejected.",
          exampleBox: {
            title: "Audience Description Standards",
            good: "Urban professionals aged 25-45 in Seattle seeking high-end boutique fitness classes and flexible online booking.",
            bad: "People looking for fitness.",
            notes: "Must be at least 20 characters long with descriptive demographic context."
          }
        },
        {
          heading: "Step 6: Aesthetic Style Tags & The 'Other' Field",
          body: "Pick one or more aesthetic style tags (Minimal, Modern, Bold, Luxury, Dark, Clean). If the client has a specialized visual request not covered by standard tags, select 'Other' — this opens a custom text field where you can describe their bespoke visual direction."
        },
        {
          heading: "Step 7 & 8: Budget, Live Inspiration Links & Review",
          body: "Enter the budget amount (plain numbers only, e.g. 750). Provide 1-3 valid inspiration URLs starting with https:// for design benchmarks. Finally, review all 8 sections and click 'Submit Lead'!"
        }
      ],
      key_takeaways: [
        "Redesign projects strictly require the existing website URL.",
        "Target audience descriptions must have at least 20 characters of detail.",
        "Selecting 'Other' for aesthetic tags unlocks an inline custom specification field.",
        "Always provide valid http:// or https:// inspiration links."
      ]
    }
  },
  {
    module_number: 4,
    title: "Drafts System & Real-Time Auto-Save (/leads/drafts)",
    description: "How auto-save protects your notes on live calls, how draft IDs work, and how drafts automatically promote into official live leads.",
    content: {
      overview: "When you are on a discovery call with a prospect, you often need to pause, look up details, or step away. The Eight34 ERM features an automatic Drafts System so you never lose a single keystroke.",
      sections: [
        {
          heading: "1. Real-Time Auto-Save in Action",
          body: "As soon as you enter a client name or select options in the lead wizard, the platform automatically saves your progress to the cloud:",
          bullets: [
            "Watch the Top Right Header: You will see a cloud indicator change to 'Saving...' and then 'Auto-saved' in green.",
            "Zero Progress Loss: You can close your browser tab or navigate away anytime, and your draft will be waiting for you.",
            "Fast & Responsive: Auto-save runs smoothly in the background without freezing your inputs."
          ]
        },
        {
          heading: "2. Unique Draft IDs (#DRAFT-XXXXXXXX)",
          body: "Every saved draft receives a unique tracking identifier (e.g. #DRAFT-3A7F9B12). You can see this badge at the top of the intake wizard and on the Drafts page."
        },
        {
          heading: "3. The Drafts Hub (/leads/drafts)",
          body: "Navigate to '/leads/drafts' from the sidebar to view all your in-progress drafts. Each card displays the Draft ID, client name, website type, and last updated time. Click 'Resume Intake' to pick up right where you left off."
        },
        {
          heading: "4. Instant Promotion to Live Lead",
          body: "When you finish your draft and click 'Submit Lead' on Step 8, the platform instantly converts the draft into an official live lead (assigning a permanent #E34 lead number) and routes it directly to the engineering team. The draft is removed from your drafts list automatically."
        }
      ],
      key_takeaways: [
        "Intake auto-saves in real-time — look for the green 'Auto-saved' indicator.",
        "Resume any paused intake from '/leads/drafts' using its #DRAFT-XXXXXXXX ID.",
        "Submitting a draft immediately turns it into a live #E34 lead."
      ]
    }
  },
  {
    module_number: 5,
    title: "Sales Best Practices & The Verification Task (/training/verify)",
    description: "Turnaround standards, pricing benchmarks, commission payouts, and how to complete your interactive test lead verification task.",
    content: {
      overview: "Congratulations on completing the core walkthrough! This final module covers pricing expectations, client communication standards, and prepares you to complete your hands-on Verification Task.",
      sections: [
        {
          heading: "1. Project Turnaround & Client Expectations",
          body: "When speaking with prospects, set realistic timelines based on project classification:",
          bullets: [
            "Single Page / Landing Pages: Typically delivered within 7 to 10 business days.",
            "Booking & Commercial Websites: Typically delivered within 2 to 3 weeks.",
            "Full SaaS Marketing Hubs: Typically delivered within 3 to 4 weeks.",
            "Revisions: Standard package includes 2 rounds of design revisions upon delivery of the staging link."
          ]
        },
        {
          heading: "2. Pricing Benchmarks & Commission Payouts",
          body: "Our platform offers standardized pricing tiers based on client type and scope (e.g., $500–$1,200 for standard business sites). When the client pays the final invoice and the deal moves to 'COMPLETED', your commission (e.g., 50%) is locked for payout."
        },
        {
          heading: "3. What is the Verification Task?",
          body: "To ensure every salesperson is fully confident using the intake wizard, the final step to unlock your account is the interactive Verification Task at '/training/verify':",
          bullets: [
            "Safe Simulation Sandbox: You will create a guided test lead with interactive tips and validators on your screen.",
            "Purely Client-Side: This test lead will NOT be saved to the live database or sent to developers.",
            "Instant Verification: Completing all 8 guided steps instantly verifies your account and unlocks real lead submission across the ERM!"
          ],
          callout: {
            type: "tip",
            text: "Click 'Start Verification Task' below or visit /training/verify to launch your test lead simulation."
          }
        }
      ],
      key_takeaways: [
        "Set clear delivery expectations (1 to 3 weeks depending on complexity).",
        "Your commission is locked and credited as soon as deals are marked Completed.",
        "Complete the interactive Verification Task at '/training/verify' to unlock lead creation!"
      ]
    }
  }
];

