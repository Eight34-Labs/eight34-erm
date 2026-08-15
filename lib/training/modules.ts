export interface TrainingModuleContent {
  overview: string;
  sections: Array<{
    heading: string;
    body: string;
    bullets?: string[];
    callout?: { type: 'info' | 'warning' | 'tip'; text: string };
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
    title: "What Makes a Good Lead?",
    description: "Fundamentals of lead quality, qualification criteria, what Eight34 looks for.",
    content: {
      overview: "A lead is more than just a name and an email address; it is a potential partnership. At Eight34, a good lead is a client who genuinely needs our web design and development expertise, values high-quality bespoke work, and has the budget to invest in their digital presence. Understanding the fundamentals of lead quality ensures we focus our time and resources on prospects that are most likely to convert and become successful projects.",
      sections: [
        {
          heading: "Defining Lead Quality",
          body: "Lead quality refers to how closely a prospect aligns with our ideal customer profile. It is a measure of their readiness, willingness, and ability to purchase our services. High-quality leads have a clear problem that a new website or redesign can solve, recognize the value of professional web development, and have decision-making authority.",
          bullets: [
            "Clear and articulated need for a website.",
            "Understanding of the value of professional design over cheap template builders.",
            "Direct authority to make purchasing and scope decisions."
          ]
        },
        {
          heading: "Qualification Criteria",
          body: "To qualify a lead effectively, we evaluate several key criteria before moving them forward in the sales pipeline. These include the client's budget, project timeline, industry, and the specific type of website they require. We must ascertain whether their expectations align with what Eight34 can realistically deliver within their constraints.",
          callout: {
            type: "tip",
            text: "Always ask open-ended questions about their business goals to better understand their true needs and purchasing timeline."
          }
        },
        {
          heading: "What Eight34 Looks For",
          body: "Eight34 specializes in crafting bespoke digital experiences. Therefore, we look for clients who are not just seeking a cheap, cookie-cutter template, but a strategic partner to elevate their brand. We prefer leads who are communicative, transparent about their budget, and open to expert recommendations. Red flags include clients who demand unreasonable turnarounds or micromanage the creative process.",
          bullets: [
            "Clients seeking strategic partnerships, not just vendors.",
            "Transparency regarding budget and realistic timelines.",
            "Willingness to collaborate and trust expert design and engineering advice."
          ],
          callout: {
            type: "warning",
            text: "Beware of leads who prioritize lowest price over everything else; they frequently experience severe scope mismatch."
          }
        }
      ],
      key_takeaways: [
        "A good lead aligns with Eight34's ideal customer profile and values professional web design.",
        "Qualify leads based on budget, timeline, industry, and project scope.",
        "Seek clients who want a strategic partner, not a cheap template."
      ]
    }
  },
  {
    module_number: 2,
    title: "Personal Clients",
    description: "How to identify, approach, and qualify personal clients (individuals needing portfolio, resume sites, event pages).",
    content: {
      overview: "Personal clients are individuals looking to establish a digital footprint for themselves rather than a traditional business. This segment includes professionals seeking resume or portfolio sites to boost their careers, couples needing wedding or event pages, and public figures desiring a personal landing page. Approaching these clients requires a personalized touch, as the website is a direct reflection of their individual identity.",
      sections: [
        {
          heading: "Identifying Personal Clients",
          body: "Finding personal clients involves looking for individuals at transition points in their lives or careers. Recent graduates, freelance creatives, independent consultants, and couples planning major events are prime candidates. LinkedIn is an excellent platform for spotting professionals looking for work or announcing freelance services, while social media can help identify those planning significant life events.",
          bullets: [
            "Recent graduates, executive job seekers, and career changers.",
            "Freelance creatives (artists, photographers, writers, architects).",
            "Couples and organizers planning weddings or major milestone events."
          ]
        },
        {
          heading: "Approaching Personal Clients",
          body: "When reaching out to individuals, the approach should be conversational and highly personalized. Emphasize how a professional website can elevate their personal brand, increase their employability, or make their event seamless. Avoid overly corporate jargon; instead, focus on the emotional and practical benefits of having a bespoke digital presence tailored specifically to them.",
          callout: {
            type: "tip",
            text: "Reference their specific field or portfolio work in your outreach to show you have done your research."
          }
        },
        {
          heading: "Qualifying Personal Clients",
          body: "Qualifying personal clients can be tricky, as their budgets are often tighter than corporate clients. It is critical to establish budget expectations early in the conversation. Determine if they understand the difference between a custom Eight34 site and a DIY builder like Wix or Squarespace. Ensure they have all necessary content (like photos and copy) ready, as personal clients often struggle to provide these promptly.",
          bullets: [
            "Confirm they have a budget suitable for custom work ($50-$150 standard tier).",
            "Educate them on the value of bespoke engineering vs. DIY template limits.",
            "Check their readiness to provide necessary assets (photos, bio, resume items)."
          ]
        }
      ],
      key_takeaways: [
        "Target individuals at career transition points or planning major events.",
        "Keep outreach conversational, personalized, and focused on personal branding.",
        "Establish budget expectations early, as personal budgets vary wildly."
      ]
    }
  },
  {
    module_number: 3,
    title: "Business Clients",
    description: "How to identify, qualify local/regional businesses (restaurants, barber shops, stores, nonprofits, education, IT firms).",
    content: {
      overview: "Local and regional businesses form the backbone of many agency portfolios. These clients range from brick-and-mortar stores like restaurants and barber shops to service providers like IT firms, educational institutions, and nonprofits. They need websites to drive foot traffic, generate local leads, or establish credibility in their community. Landing these clients requires demonstrating a clear return on investment.",
      sections: [
        {
          heading: "Identifying Business Clients",
          body: "Start by looking in your own community. Use local directories, Chamber of Commerce listings, and Google Maps to find businesses with outdated, slow, or non-mobile-responsive websites. Pay special attention to businesses that are expanding, opening new locations, or running active social media campaigns but linking back to a poor website. These are strong indicators of available budget and a need for an upgrade.",
          bullets: [
            "Local directories and Chamber of Commerce lists.",
            "Businesses with outdated, non-responsive, or broken mobile sites.",
            "Companies showing signs of growth, expansion, or strong review counts."
          ]
        },
        {
          heading: "Approaching Business Clients",
          body: "Business owners are busy and focused on their bottom line. Your approach should be direct and value-driven. Highlight specific issues with their current site and explain how a new Eight34 website can solve those problems—whether it's by increasing online bookings, improving local SEO to drive foot traffic, or modernizing their brand image to attract better talent.",
          callout: {
            type: "info",
            text: "Focus the conversation on ROI: how the website will make or save them money."
          }
        },
        {
          heading: "Qualifying Business Clients",
          body: "To qualify a business client, evaluate their revenue signals and growth indicators. Do they have multiple locations? Are they actively hiring? These suggest a healthy budget. During the initial call, ascertain who the final decision-maker is (often the owner or marketing director). A key qualification step is confirming they view a website as a vital marketing asset, rather than an unnecessary expense.",
          bullets: [
            "Assess revenue signals (multiple locations, hiring, premium offerings).",
            "Identify the actual decision-maker before negotiating.",
            "Ensure they view a website as an investment that yields paying clients."
          ],
          callout: {
            type: "warning",
            text: "If a business has no marketing budget and relies solely on word-of-mouth, they may be difficult to convert."
          }
        }
      ],
      key_takeaways: [
        "Look for local businesses with outdated sites but signs of growth.",
        "Focus outreach on ROI and solving specific business problems.",
        "Qualify based on revenue signals and their view of marketing as an investment."
      ]
    }
  },
  {
    module_number: 4,
    title: "SaaS Clients",
    description: "How to identify and qualify SaaS companies needing marketing/product websites.",
    content: {
      overview: "Software as a Service (SaaS) companies represent high-value leads. For a SaaS business, their website is often their primary sales engine, responsible for converting visitors into trial users or paying subscribers. They require high-performance, conversion-optimized marketing sites and sometimes complex product landing pages. Because the website is so critical to their revenue, they generally understand the value of premium web development.",
      sections: [
        {
          heading: "Identifying SaaS Prospects",
          body: "Identifying SaaS clients often involves monitoring tech news, funding announcements, and product launch platforms like Product Hunt. Look for startups that have recently secured seed or Series A funding; they have fresh capital and usually need to revamp their MVP website to attract enterprise clients. Additionally, search for established SaaS companies whose marketing sites look dated compared to their cutting-edge product.",
          bullets: [
            "Monitor funding announcements (Crunchbase, TechCrunch).",
            "Check product launch platforms like Product Hunt.",
            "Look for disconnects between a great product and a poor marketing site."
          ]
        },
        {
          heading: "Understanding SaaS Needs",
          body: "SaaS companies have specific needs: fast load times, clear value propositions, interactive product tours, and seamless integrations with CRMs (like HubSpot or Salesforce) and analytics tools. When approaching them, speak their language. Discuss conversion rate optimization (CRO), user acquisition costs, and how an Eight34 site can reduce friction in their signup funnel.",
          callout: {
            type: "tip",
            text: "Use SaaS terminology like 'churn', 'CAC', and 'conversion funnel' to build credibility."
          }
        },
        {
          heading: "Qualifying SaaS Leads",
          body: "Qualifying a SaaS lead involves understanding their growth stage and tech stack requirements. Startups with recent funding are highly qualified. Ask about their current conversion bottlenecks and marketing goals. Ensure their required tech stack (e.g., React, Next.js, headless CMS) aligns with Eight34's capabilities. Red flags include SaaS founders who want to build complex web apps rather than marketing sites, unless the agency specializes in that.",
          bullets: [
            "Verify recent funding or strong revenue growth.",
            "Confirm alignment on tech stack and CMS preferences.",
            "Distinguish between a need for a marketing site vs. the actual web app."
          ]
        }
      ],
      key_takeaways: [
        "Target SaaS companies with recent funding or poor marketing sites.",
        "Speak in terms of conversion rates, user acquisition, and reducing funnel friction.",
        "Ensure their tech stack needs align with Eight34's capabilities."
      ]
    }
  },
  {
    module_number: 5,
    title: "Website Types & Classifications",
    description: "Complete taxonomy: Personal, Business, and SaaS website types.",
    content: {
      overview: "Not all websites serve the same purpose. Understanding the taxonomy of website types allows you to accurately categorize a prospect's needs, quote the project appropriately using our dynamic pricing guides, and set the right expectations. Eight34 categorizes projects into three main buckets: Personal, Business, and SaaS. Each category has distinct sub-types with specific features, pages, and complexity levels.",
      sections: [
        {
          heading: "Personal Website Types",
          body: "Personal websites are generally smaller in scope and focus on individual branding. A 'Portfolio' site showcases an individual's work, essential for designers, artists, and developers. A 'Resume/CV' site is a digital, interactive version of a professional's work history. 'Event' pages are temporary sites for occasions like weddings or conferences. Finally, a 'Personal Landing' page acts as a digital business card, aggregating links and basic contact info.",
          bullets: [
            "Portfolio: Visual showcase of work.",
            "Resume/CV: Professional history and skills.",
            "Event: Details and RSVPs for specific occasions."
          ]
        },
        {
          heading: "Business Website Types",
          body: "Business websites drive commercial activity. A 'Business Landing' site is a multi-page brochure detailing services, about us, and contact info. 'Event' sites for businesses handle ticketing and schedules. 'Booking' sites are critical for salons, medical offices, or consultants, requiring integration with scheduling software and sometimes payment gateways, increasing the technical complexity.",
          bullets: [
            "Business Landing: Standard informational brochure site with contact capture.",
            "Business Event: Ticketing, schedules, and speaker info.",
            "Booking: Integrated scheduling and payment features (Stripe, Calendly)."
          ]
        },
        {
          heading: "SaaS Website Types",
          body: "SaaS websites are highly specialized for lead generation and user acquisition. A 'Landing' page is a single-page site focused entirely on a single call-to-action (like an email signup). 'Marketing' sites are comprehensive, multi-page hubs detailing features, pricing, use cases, and resources. 'Product' sites might include interactive demos. A 'Redesign' implies overhauling an existing architecture to improve conversion rates or rebrand.",
          callout: {
            type: "info",
            text: "SaaS Marketing sites often require complex CMS setups to allow marketing teams to easily create landing pages and blog posts."
          }
        }
      ],
      key_takeaways: [
        "Categorize leads into Personal, Business, or SaaS to determine scope.",
        "Business Booking sites are more complex due to scheduling integrations.",
        "SaaS Marketing sites focus heavily on user acquisition and CMS flexibility."
      ]
    }
  },
  {
    module_number: 6,
    title: "New Website vs. Redesign",
    description: "How to determine which is appropriate, red flags, and opportunity signals.",
    content: {
      overview: "When engaging a prospect, you must quickly determine whether they need a brand-new website built from scratch or a redesign of their existing digital presence. This distinction dramatically impacts the project scope, timeline, and strategy. A new website is a blank canvas, while a redesign requires dealing with legacy content, existing SEO rankings, and technical debt.",
      sections: [
        {
          heading: "When to Build a New Website",
          body: "A new website is appropriate for new businesses, product launches, or when a company is completely changing its business model or name. It is also the best path when their current website is built on an obsolete, proprietary platform that cannot be upgraded, or if the current codebase is so convoluted that starting over is more cost-effective than attempting to fix it.",
          bullets: [
            "New business or product launch.",
            "Current site is on an obsolete or proprietary platform.",
            "Current codebase is unsalvageable."
          ]
        },
        {
          heading: "When to Recommend a Redesign",
          body: "A redesign is ideal for established businesses that already have brand recognition and website traffic, but whose current site is failing to convert visitors, looks dated, or is difficult for internal teams to update. When recommending a redesign, you must plan for preserving their existing SEO rankings, migrating valuable content, and setting up proper 301 redirects.",
          callout: {
            type: "warning",
            text: "Always collect the client's current website URL during the intake process for a redesign."
          }
        }
      ],
      key_takeaways: [
        "New builds are for new entities or unsalvageable platforms.",
        "Redesigns require preserving existing SEO and content.",
        "Always record the existing website URL for redesigns in the ERM intake form."
      ]
    }
  },
  {
    module_number: 7,
    title: "Target Audience Definition",
    description: "Why target audience matters, what makes a specific description, examples.",
    content: {
      overview: "A website cannot be effective if it tries to speak to everyone. A critical part of qualifying an Eight34 lead is defining the target audience. The design, copy, typography, and user experience of the site must be tailored to the specific people the client is trying to reach.",
      sections: [
        {
          heading: "Why Target Audience Matters",
          body: "The target audience dictates every creative and technical decision. A website for a luxury fashion brand requires a radically different aesthetic and tone than a website for a B2B cybersecurity firm. Understanding the audience ensures our design team builds a site that resonates with the right people and drives conversions.",
          bullets: [
            "Informs typography, color palette, and layout decisions.",
            "Guides the tone of voice and copywriting strategy.",
            "Ensures the user experience matches audience expectations."
          ]
        },
        {
          heading: "Quality Criteria for Audience Descriptions",
          body: "In the Eight34 intake form, generic descriptions like 'everyone' or 'people who need plumbing' are unacceptable. High-quality audience descriptions include demographics (age, income), psychographics (values, pain points), and geographic context.",
          callout: {
            type: "tip",
            text: "A good audience profile answers: Who are they? Where are they located? What pain point brings them to this website?"
          }
        }
      ],
      key_takeaways: [
        "The target audience dictates design, copy, and UX choices.",
        "Avoid generic audience descriptions in your lead submissions.",
        "Include demographics, pain points, and geographic scope."
      ]
    }
  },
  {
    module_number: 8,
    title: "Design Styles & Aesthetics",
    description: "Overview of design aesthetics, matching styles to client types, multi-select guidance.",
    content: {
      overview: "Visual design is often what clients care about most initially. Helping a client articulate their aesthetic preferences bridges the gap between their vision and our design team's execution. Eight34 utilizes standard aesthetic tags to standardize design requirements.",
      sections: [
        {
          heading: "Common Aesthetic Styles",
          body: "Familiarize yourself with common design aesthetics: 'Minimal' (generous whitespace, clean layout), 'Bold' (high contrast, strong typography), 'Luxury' (refined palettes, serif typography), 'Playful' (colorful, organic shapes), and 'Corporate' (trustworthy, structured, professional).",
          bullets: [
            "Minimal & Clean: Focus on typography and content.",
            "Bold & Futuristic: High visual impact for tech and modern brands.",
            "Luxury & Editorial: Sophisticated styling for high-end services."
          ]
        },
        {
          heading: "Selecting Multiple Styles & Reference URLs",
          body: "Clients often want a blend of styles, such as 'Minimal' combined with 'Editorial'. In the intake form, select all relevant tags. Furthermore, always ask the client for 2-3 inspiration URLs that represent what they like.",
          callout: {
            type: "info",
            text: "Reference URLs are the best way to eliminate ambiguity in visual taste."
          }
        }
      ],
      key_takeaways: [
        "Use aesthetic tags to categorize client design preferences.",
        "Clients can combine multiple styles (e.g., Minimal + Corporate).",
        "Always collect 2-3 reference URLs to provide concrete visual benchmarks."
      ]
    }
  },
  {
    module_number: 9,
    title: "Inspiration URLs & References",
    description: "Collecting concrete references, what makes a good reference, how engineering uses them.",
    content: {
      overview: "Words like 'clean', 'modern', or 'sleek' mean different things to different people. Collecting specific inspiration URLs grounds abstract aesthetic conversations in reality and gives our design and engineering team a precise benchmark for layouts, animations, and typography.",
      sections: [
        {
          heading: "What Makes a Good Inspiration URL",
          body: "A good reference is a live, working website that features specific elements the client admires—such as an interactive pricing table, navigation style, or hero section animation. Ask the client specifically what they like about each link.",
          bullets: [
            "Live, polished web experiences.",
            "Specific features or layouts pointed out by the client.",
            "Competitor sites that set the industry standard."
          ]
        },
        {
          heading: "How Engineering Uses References",
          body: "Our developers inspect reference sites to evaluate interactive components, animation libraries, and responsiveness patterns. This helps determine technical feasibility and ensures accurate quoting.",
          callout: {
            type: "tip",
            text: "Document exactly what the client likes about each URL in the intake form notes."
          }
        }
      ],
      key_takeaways: [
        "Inspiration URLs eliminate ambiguity in aesthetic discussions.",
        "Ask clients what specific components they like about each URL.",
        "Developers use references to estimate technical complexity."
      ]
    }
  },
  {
    module_number: 10,
    title: "Budget & Pricing Conversations",
    description: "How to discuss budget, why clean numbers are required, anchoring and ranges.",
    content: {
      overview: "Discussing money can feel intimidating, but transparent budget conversations are essential for qualifying leads and protecting both your time and the client's. Anchoring discussions with our official regional pricing tiers establishes expectations early.",
      sections: [
        {
          heading: "Anchoring and Price Ranges",
          body: "Always anchor the conversation using Eight34's official pricing guide. If a client is vague about their budget, provide our standard range for their website type to gauge their reaction before diving deeper.",
          bullets: [
            "Anchor with the standard tier range for their project type.",
            "Assess whether their budget expectations align with custom engineering.",
            "Avoid negotiating against yourself before understanding the full scope."
          ]
        },
        {
          heading: "Why Clean Numbers Are Required in the ERM",
          body: "The ERM requires clean numeric values in the budget field. This enables accurate financial reporting, commission calculation, and automated analytics for the company.",
          callout: {
            type: "warning",
            text: "Never enter text like 'around 2k' in numeric fields; always enter a clean number like 2000."
          }
        }
      ],
      key_takeaways: [
        "Anchor budget conversations early using official pricing tiers.",
        "Determine budget readiness before committing engineering resources.",
        "Always input clean numeric amounts into the ERM budget field."
      ]
    }
  },
  {
    module_number: 11,
    title: "Technical Scope & Integrations",
    description: "Special features, third-party integrations (Stripe, Calendly, CRM), and complexity indicators.",
    content: {
      overview: "A website is frequently more than static pages; it integrates with third-party software to automate bookings, take payments, or sync leads. Identifying these requirements during intake prevents scope creep and ensures the project is priced correctly.",
      sections: [
        {
          heading: "Common Integrations",
          body: "Standard integrations include payment gateways (Stripe), appointment schedulers (Calendly, Acuity), contact forms synced to CRMs (HubSpot, Salesforce), and analytics tools (Google Analytics, Mixpanel).",
          bullets: [
            "Payment processors (Stripe, PayPal).",
            "Scheduling and calendar tools (Calendly).",
            "CRM and email marketing webhooks."
          ]
        },
        {
          heading: "Complexity & Pricing Impact",
          body: "Every custom integration adds development and testing time. Multi-step booking funnels or custom API connections place a project in higher pricing tiers.",
          callout: {
            type: "info",
            text: "Highlight all third-party tool requirements in the Special Features section of the lead form."
          }
        }
      ],
      key_takeaways: [
        "Identify all third-party integrations during the discovery phase.",
        "Integrations increase project complexity and affect pricing tiers.",
        "Document required widgets and webhooks in the intake form."
      ]
    }
  },
  {
    module_number: 12,
    title: "Finding Leads: Prospecting Channels",
    description: "Google Maps, LinkedIn, Twitter/X, cold outreach, personal networks, job boards.",
    content: {
      overview: "Consistent lead generation is the secret to a thriving sales pipeline. Top salespeople leverage multiple prospecting channels to identify businesses that need web design improvements.",
      sections: [
        {
          heading: "Google Maps & Local Search",
          body: "Search local commercial areas for established businesses with high review counts but outdated, slow, or non-mobile-friendly websites. These businesses have cash flow and an immediate reason to upgrade.",
          bullets: [
            "Target businesses with 50+ positive reviews but poor websites.",
            "Inspect mobile responsiveness and load speed.",
            "Prioritize industries where online booking or presentation drives sales."
          ]
        },
        {
          heading: "LinkedIn & Social Channels",
          body: "Monitor LinkedIn for founders announcing recent funding or launching new products. Look on Twitter/X for creators and consultants undergoing rebranding.",
          callout: {
            type: "tip",
            text: "Personalize every outreach message by referencing a specific, observable issue on their current site."
          }
        }
      ],
      key_takeaways: [
        "Use Google Maps to find established businesses with outdated sites.",
        "Leverage LinkedIn for funded startups and executive transitions.",
        "Always personalize outreach by citing specific website improvement opportunities."
      ]
    }
  },
  {
    module_number: 13,
    title: "Outreach & Discovery Calls",
    description: "Cold email best practices, script structures, handling objections, BANT qualification.",
    content: {
      overview: "Your outreach message gets the conversation started; the discovery call qualifies the opportunity. Approaching both with a structured methodology guarantees higher conversion rates.",
      sections: [
        {
          heading: "Cold Outreach Structure",
          body: "Keep cold emails concise (under 120 words). State who you are, identify a specific bottleneck on their current website, explain how Eight34 can fix it, and propose a brief 10-minute call.",
          bullets: [
            "Personalized observation of their current site.",
            "Clear value proposition focused on ROI.",
            "Low-friction call to action."
          ]
        },
        {
          heading: "Discovery Call & BANT",
          body: "Qualify prospects using BANT: Budget (Can they afford custom work?), Authority (Are they the decision-maker?), Need (Is there a real business problem?), Timeline (When do they want to launch?).",
          callout: {
            type: "tip",
            text: "Listen 70% of the time on discovery calls; let the client explain their business challenges."
          }
        }
      ],
      key_takeaways: [
        "Keep initial outreach brief and focused on observable website issues.",
        "Use discovery calls to listen and uncover business pain points.",
        "Apply BANT to confirm budget, authority, need, and timeline."
      ]
    }
  },
  {
    module_number: 14,
    title: "US / Europe Pricing Guidelines",
    description: "Standard pricing ranges for US and Western European clients, how to quote, and justifying investment.",
    content: {
      overview: "Eight34 uses standard market pricing for clients in the United States and Western Europe. Pricing reflects custom design, responsive engineering, integrations, performance, and measurable business value.",
      sections: [
        {
          heading: "Standard Pricing Tiers",
          body: "For US/Europe clients, standard ranges are: Personal Portfolio ($50-$150), Business Landing ($100-$400), Business Booking & Appointments ($500-$900), and SaaS Marketing & Product ($500-$1,500). Always refer to the live Pricing Guide modal in the ERM for real-time tier updates.",
          bullets: [
            "Personal Portfolio / CV: $50 - $150.",
            "Business Landing Page: $100 - $400.",
            "Business Booking & Appointments: $500 - $900.",
            "SaaS Marketing & Product: $500 - $1,500."
          ]
        },
        {
          heading: "Justifying Value",
          body: "When clients ask about price, emphasize that Eight34 delivers bespoke code and tailored design—not template-clones. Connect the investment to tangible business outcomes like increased conversion and customer trust.",
          callout: {
            type: "tip",
            text: "Use the live Pricing Guide modal inside the new lead intake form to check official benchmarks."
          }
        }
      ],
      key_takeaways: [
        "Standard US/EU ranges are benchmarked by website category.",
        "Check the Pricing Guide modal in the intake form for real-time rates.",
        "Justify pricing through custom craftsmanship and business ROI."
      ]
    }
  },
  {
    module_number: 15,
    title: "Outside US / Europe Pricing Guidelines",
    description: "Eight34's global pricing model adjusted for international purchasing power and qualification.",
    content: {
      overview: "Eight34 operates globally with pricing adjusted for international purchasing power. Global pricing maintains the same high engineering and design quality while accommodating international budgets.",
      sections: [
        {
          heading: "Global Pricing Tiers",
          body: "For clients outside the US and Europe, standard baseline ranges are: Personal Portfolio ($10-$100), Business Landing ($50-$150), Business Booking ($100-$300), and SaaS Marketing ($200-$700).",
          bullets: [
            "Global Personal Portfolio: $10 - $100.",
            "Global Business Landing: $50 - $150.",
            "Global Business Booking: $100 - $300.",
            "Global SaaS Marketing: $200 - $700."
          ]
        },
        {
          heading: "Managing Scope at Global Tiers",
          body: "Because global tiers operate at adjusted price points, salespeople must maintain disciplined scope boundaries and avoid promising excessive custom functionality without separate quotes.",
          callout: {
            type: "warning",
            text: "Do not promise extensive bespoke backends on baseline global landing page budgets."
          }
        }
      ],
      key_takeaways: [
        "Global pricing reflects adjusted purchasing power while preserving design standards.",
        "Refer to the Outside US/Europe tab in the Pricing Guide modal.",
        "Keep project scope tightly defined to match the quoted tier."
      ]
    }
  },
  {
    module_number: 16,
    title: "Submitting a High-Quality Lead",
    description: "Filling the intake form correctly, required fields, common mistakes, and handoff quality.",
    content: {
      overview: "Submitting a qualified lead into the ERM transitions the prospect to the project management and engineering team. Providing detailed, accurate data prevents scope confusion and ensures rapid delivery.",
      sections: [
        {
          heading: "Critical Intake Fields",
          body: "Ensure all core fields are populated: accurate client entity name, classification, verified website type, existing website URL for redesigns, specific target audience profile, aesthetic tags, and reference links.",
          bullets: [
            "Accurate client and entity name.",
            "Specific target audience description.",
            "Clean numeric budget and valid inspiration links."
          ]
        },
        {
          heading: "Avoiding Common Submission Errors",
          body: "Avoid vague notes like 'make it look nice'. Specify typography preferences, desired layout styles, and all discussed integrations to eliminate guesswork.",
          callout: {
            type: "tip",
            text: "Review the submission summary in Step 8 before finalizing your lead into the pipeline."
          }
        }
      ],
      key_takeaways: [
        "Complete intake forms with precision and actionable detail.",
        "Include reference URLs and specify all technical integrations.",
        "Check Step 8 review summary before final submission."
      ]
    }
  },
  {
    module_number: 17,
    title: "Navigating the Eight34 ERM Platform (CRM 101)",
    description: "What is an ERM/CRM, understanding your workbench, navigating tabs, and finding your way around.",
    content: {
      overview: "Welcome to the Eight34 ERM (Enterprise Relationship Management) system! If you have never used a CRM or ERM before, think of this platform as your digital command center. It tracks every client prospect, monitors deals as they progress from initial inquiry to final delivery, calculates your commission earnings, and houses your sales intelligence.",
      sections: [
        {
          heading: "What is an ERM / CRM?",
          body: "A CRM (Customer Relationship Management) or ERM system is a centralized database that replaces messy spreadsheets and lost notes. In Eight34 ERM, every prospective client has their own dedicated record containing their requirements, budget, status history, and financial payout tracking.",
          bullets: [
            "Single source of truth for all client information and project scope.",
            "Real-time pipeline tracking so nothing falls through the cracks.",
            "Automated calculations for sales commission and performance metrics."
          ]
        },
        {
          heading: "Sidebar Navigation & Core Tabs",
          body: "On the left sidebar, you will find your primary navigation items: Dashboard (your daily workbench with high-level KPIs), Leads (the master table of all registered opportunities), Lead Drafts (your partially filled intakes), Training (your curriculum and certification assessment), and Analytics (for admins and super admins).",
          bullets: [
            "Dashboard: Daily overview of active pipeline value and closed deals.",
            "Leads: Master searchable pipeline with status and client filters.",
            "Lead Drafts: In-progress intakes you can resume and submit anytime.",
            "Training: Modules and assessment required to unlock submission access."
          ]
        },
        {
          heading: "The Sales Workbench Workflow",
          body: "Your daily sales routine in the ERM is simple: Check your active leads on the Dashboard, prospect new clients, start an intake or resume a draft, and submit qualified opportunities. Once submitted, admins review and transition your leads through production.",
          callout: {
            type: "tip",
            text: "Bookmark your Dashboard and check it daily to stay updated on project status transitions."
          }
        }
      ],
      key_takeaways: [
        "The Eight34 ERM is your digital command center for deals, scope, and earnings.",
        "Use the sidebar to jump between Dashboard, Leads, Drafts, and Training.",
        "All client interactions and status updates are tracked in real-time."
      ]
    }
  },
  {
    module_number: 18,
    title: "Working with Lead Drafts & Resuming Intakes",
    description: "How to save partial forms, resume drafts from the Lead Drafts tab, and prevent lost client notes.",
    content: {
      overview: "During a discovery call or prospecting session, you might gather half of a client's information before needing to pause and wait for them to send inspiration links or verify their budget. The Eight34 ERM includes a dedicated Lead Drafts feature that lets you save your progress at any step and resume later without losing a single word.",
      sections: [
        {
          heading: "Saving a Draft at Any Step",
          body: "While filling out the New Lead form, you will see a 'Save Draft' button in both the header and footer of every single step. Clicking this saves whatever data you have entered so far into our secure database. You do not need to fill out all required fields to save a draft!",
          bullets: [
            "Save partial progress anytime during client calls.",
            "No validation errors blocking you from saving rough notes.",
            "Instant confirmation toast confirms your draft is safely stored."
          ]
        },
        {
          heading: "Accessing the Lead Drafts Tab",
          body: "To view your saved drafts, click 'Lead Drafts' in the sidebar or from the top of the Leads page. Each draft card shows the client name, classification, estimated quote, and the last time you worked on it.",
          callout: {
            type: "info",
            text: "Clicking 'Continue Intake' opens the form with all your previously saved answers pre-filled and ready to edit."
          }
        },
        {
          heading: "Finalizing & Submitting from a Draft",
          body: "When you have gathered all remaining details from the client, simply step through to Step 8 (Review) and click 'Submit Lead to Pipeline'. The draft will automatically convert into an active lead with an official #E34 lead number and enter the production pipeline.",
          bullets: [
            "Resume editing from where you left off.",
            "Complete the remaining steps and validation checks.",
            "Submitting converts the draft into a live pipeline lead automatically."
          ]
        }
      ],
      key_takeaways: [
        "Click 'Save Draft' at any step to save partial client details.",
        "Access and resume all your in-progress work in the 'Lead Drafts' tab.",
        "Submitting a completed draft promotes it to a live #E34 pipeline lead."
      ]
    }
  },
  {
    module_number: 19,
    title: "Understanding Lead Statuses, History, & Collapsible Menus",
    description: "The 6 pipeline stages, status transition logs, the trash bin, and reading collapsible timeline menus.",
    content: {
      overview: "Once a lead is registered, it progresses through 6 standardized pipeline stages. Understanding what each status means allows you to communicate accurately with clients and know exactly where their website stands in production.",
      sections: [
        {
          heading: "The 6 Pipeline Statuses",
          body: "Every lead progresses through these stages: 1. NEW (unreviewed lead submitted), 2. STILL_INQUIRING (in sales discovery/negotiation), 3. WEBSITE_IN_PROGRESS (design & development underway), 4. DELIVERY_IN_PROGRESS (review, staging, client revisions), 5. REJECTED (disqualified or lost deal), 6. COMPLETED (website launched and delivered).",
          bullets: [
            "NEW & STILL INQUIRING: Initial intake and discovery.",
            "WEBSITE IN PROGRESS: Active design, UI, and coding by engineering.",
            "DELIVERY IN PROGRESS: Staging review and final domain handover.",
            "COMPLETED: Delivered project with commission payout calculations."
          ]
        },
        {
          heading: "Status History & Collapsible Menus",
          body: "Every time an admin updates a lead's status, the ERM automatically records who made the change, when it occurred, and any accompanying notes in the Status History timeline. For long histories or detailed project descriptions, the ERM uses 'Show more / Show less' collapsible menus to keep pages clean and organized.",
          callout: {
            type: "tip",
            text: "Click 'Show all status logs' on any lead page to inspect the complete timestamped audit trail of the project."
          }
        },
        {
          heading: "The Trash Bin & Archiving",
          body: "If a lead is duplicate, spam, or cancelled, admins can move it to 'Trash'. Trashed leads are hidden from the active pipeline but preserved in a collapsible 'Trash' menu at the bottom of the Leads table, where they can be inspected or restored at any time.",
          bullets: [
            "Trash keeps the active pipeline focused on genuine revenue opportunities.",
            "Admins can restore accidentally trashed leads with a single click."
          ]
        }
      ],
      key_takeaways: [
        "The 6 statuses track a website from intake to final completed delivery.",
        "Status History provides a timestamped audit trail of project progression.",
        "Collapsible menus keep long text and historical logs easily readable."
      ]
    }
  },
  {
    module_number: 20,
    title: "The Pricing Calculator, Commission Structure, & Payouts",
    description: "How commission rates work, the completed lead pricing breakdown, production costs, and paid indicators.",
    content: {
      overview: "At Eight34, salespeople are compensated based on their commission rate (defaulted to 50% for all sales representatives and customizable per salesperson). When a project is delivered and marked 'Completed', the ERM unlocks a dedicated Pricing Calculator box breaking down the financial math.",
      sections: [
        {
          heading: "Your Commission Rate (Default 50%)",
          body: "Every salesperson has an assigned commission rate in the ERM. By default, this is set to 50.00%. Admins and Super Admins can adjust individual commission rates based on senior sales performance or special agreements.",
          bullets: [
            "Default commission rate is 50% of net project revenue.",
            "Visible on your profile and on every completed deal you submit.",
            "Configurable per salesperson in Team Management."
          ]
        },
        {
          heading: "The Completed Pricing Calculator Breakdown",
          body: "When a lead is marked 'Completed', admins enter the direct production costs (hosting, domains, specialized assets). The ERM Pricing Calculator then automatically calculates: 1. Total Website Price (Budget), 2. Production Costs, 3. Net Gross Profit (Price minus Costs), 4. Salesperson Profit (Net Profit × Commission Rate), and 5. Company Retained Share.",
          callout: {
            type: "info",
            text: "Example: $1,000 project with $200 production costs leaves $800 net profit. At a 50% rate, the salesperson earns $400 and Eight34 retains $400."
          }
        },
        {
          heading: "Paid Checkboxes & The Costs Map",
          body: "At the top of every completed lead page, each financial bucket (Production Costs, Company Portion, and Salesperson Profit) has a 'Mark Paid' checkbox. Once your commission is transferred, checking 'Paid' greys out the category in the costs map, providing an instant visual record of settled transactions.",
          bullets: [
            "Instant visual indicator of paid vs. pending commissions.",
            "Prevents duplicate payouts and keeps accounting transparent.",
            "Greyed-out categories indicate settled financial transfers."
          ]
        }
      ],
      key_takeaways: [
        "Salespeople earn their commission rate (default 50%) on net project profit.",
        "Production costs are accounted for when the lead is marked Completed.",
        "The Pricing Calculator and Costs Map display real-time paid/unpaid status."
      ]
    }
  },
  {
    module_number: 21,
    title: "Interpreting Website & Salesman Analytics",
    description: "How to read analytics charts, track category demand, analyze weekly volume, and measure revenue impact.",
    content: {
      overview: "Data-driven selling leads to higher earnings. The Eight34 ERM includes an Analytics tab providing deep operational intelligence across two primary dimensions: Website Analytics and Salesman Analytics.",
      sections: [
        {
          heading: "Website Analytics Overview",
          body: "Website Analytics shows high-level market demand: which website categories are most frequently ordered, pipeline status distributions, average and maximum pricing across classifications, most requested aesthetic style tags, and month-over-month revenue trends.",
          bullets: [
            "Category breakdown: See whether SaaS, Business, or Personal sites dominate.",
            "Pricing benchmarks: View average realized prices per category.",
            "Style trends: Discover which design aesthetics clients request most."
          ]
        },
        {
          heading: "Salesman Analytics & Performance Tracking",
          body: "Salesman Analytics breaks down performance across the entire sales team and allows drilling down into individual salespeople. You can inspect total clients brought in, cumulative revenue generated for Eight34, total commission earnings, category mix, and weekly activity output.",
          callout: {
            type: "tip",
            text: "Use Salesman Analytics to identify your strongest website categories and track your weekly deal consistency."
          }
        }
      ],
      key_takeaways: [
        "Website Analytics highlights market demand, style trends, and price averages.",
        "Salesman Analytics tracks deals closed, total revenue brought, and earnings.",
        "Drill down into individual sales profiles to monitor weekly performance."
      ]
    }
  }
];
