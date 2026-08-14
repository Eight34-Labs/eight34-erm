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
      overview: "A lead is more than just a name and an email address; it is a potential partnership. At Eight34, a good lead is a client who genuinely needs our web design and development expertise, values high-quality work, and has the budget to invest in their digital presence. Understanding the fundamentals of lead quality ensures we focus our time and resources on prospects that are most likely to convert and become successful projects.",
      sections: [
        {
          heading: "Defining Lead Quality",
          body: "Lead quality refers to how closely a prospect aligns with our ideal customer profile. It is a measure of their readiness, willingness, and ability to purchase our services. High-quality leads have a clear problem that a new website or redesign can solve, recognize the value of professional web development, and have decision-making authority.",
          bullets: [
            "Clear and articulated need for a website.",
            "Understanding of the value of professional design.",
            "Authority to make purchasing decisions."
          ]
        },
        {
          heading: "Qualification Criteria",
          body: "To qualify a lead effectively, we evaluate several key criteria before moving them forward in the sales pipeline. These include the client's budget, project timeline, industry, and the specific type of website they require. We must ascertain whether their expectations align with what Eight34 can realistically deliver within their constraints.",
          callout: {
            type: "tip",
            text: "Always ask open-ended questions about their business goals to better understand their true needs."
          }
        },
        {
          heading: "What Eight34 Looks For",
          body: "Eight34 specializes in crafting bespoke digital experiences. Therefore, we look for clients who are not just seeking a cheap, cookie-cutter template, but a strategic partner to elevate their brand. We prefer leads who are communicative, transparent about their budget, and open to expert recommendations. Red flags include clients who demand unreasonable turnarounds or micromanage the creative process.",
          bullets: [
            "Clients seeking strategic partnerships, not just vendors.",
            "Transparency regarding budget and timelines.",
            "Willingness to collaborate and trust expert advice."
          ],
          callout: {
            type: "warning",
            text: "Beware of leads who prioritize price over everything else; they often lead to difficult projects."
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
            "Recent graduates and job seekers.",
            "Freelance creatives (artists, photographers, writers).",
            "Couples planning weddings or other major events."
          ]
        },
        {
          heading: "Approaching Personal Clients",
          body: "When reaching out to individuals, the approach should be conversational and highly personalized. Emphasize how a professional website can elevate their personal brand, increase their employability, or make their event seamless. Avoid overly corporate jargon; instead, focus on the emotional and practical benefits of having a bespoke digital presence tailored specifically to them.",
          callout: {
            type: "tip",
            text: "Reference their specific field or event in your outreach to show you have done your research."
          }
        },
        {
          heading: "Qualifying Personal Clients",
          body: "Qualifying personal clients can be tricky, as their budgets are often tighter than corporate clients. It is critical to establish budget expectations early in the conversation. Determine if they understand the difference between a custom Eight34 site and a DIY builder like Wix or Squarespace. Ensure they have all necessary content (like photos and copy) ready, as personal clients often struggle to provide these promptly.",
          bullets: [
            "Confirm they have a budget suitable for custom work.",
            "Educate them on the value of custom vs. DIY.",
            "Check their readiness to provide necessary content."
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
            "Businesses with outdated or non-responsive sites.",
            "Companies showing signs of growth or expansion."
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
            "Assess revenue signals (multiple locations, hiring).",
            "Identify the actual decision-maker.",
            "Ensure they view a website as an investment, not a cost."
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
    title: "Website Types",
    description: "Complete taxonomy: Personal, Business, and SaaS website types.",
    content: {
      overview: "Not all websites serve the same purpose. Understanding the taxonomy of website types allows you to accurately categorize a prospect's needs, quote the project appropriately, and set the right expectations. Eight34 categorizes projects into three main buckets: Personal, Business, and SaaS. Each category has distinct sub-types with specific features, pages, and complexity levels.",
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
            "Business Landing: Standard informational brochure site.",
            "Business Event: Ticketing, schedules, and speaker info.",
            "Booking: Integrated scheduling and payment features."
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
          body: "A redesign is suitable when an established business has a site that looks dated, suffers from poor user experience, or fails to convert visitors, but the core content and domain authority are valuable. The goal here is usually modernization, improving mobile responsiveness, rebranding, or migrating to a more robust CMS while carefully preserving their existing SEO equity.",
          callout: {
            type: "warning",
            text: "Always ask about their current SEO traffic; a botched redesign can destroy a company's search rankings."
          }
        },
        {
          heading: "Opportunity Signals and Red Flags",
          body: "A major opportunity signal for a redesign is a company undergoing a rebrand or leadership change, as new executives often want a fresh digital look. A red flag is a client who wants a redesign but insists on keeping their clunky, outdated backend systems integrated. Another red flag is a prospect who constantly redesigns their site every few months; they are likely indecisive and difficult to please.",
          bullets: [
            "Opportunity: Leadership change or company rebrand.",
            "Red Flag: Insistence on keeping outdated, incompatible backend tech.",
            "Red Flag: History of chronic, frequent redesigns."
          ]
        }
      ],
      key_takeaways: [
        "New websites are for blank slates or when legacy tech is unsalvageable.",
        "Redesigns focus on modernization, UX improvement, and preserving SEO.",
        "Beware of clients who want modern designs but refuse to update backend systems."
      ]
    }
  },
  {
    module_number: 7,
    title: "Target Audience",
    description: "How to gather useful target audience information; what makes a good vs. vague answer.",
    content: {
      overview: "A beautiful website is useless if it doesn't resonate with the intended users. Understanding a client's target audience is fundamental to the design and development process. As a salesperson, your job is to extract detailed, actionable audience data from the prospect. This information directly influences the site's layout, messaging, color palette, and user experience.",
      sections: [
        {
          heading: "Gathering Audience Information",
          body: "To gather useful information, avoid asking 'Who is your audience?' Instead, ask behavioral and demographic questions. 'Who are your most profitable customers?' 'What are the main pain points your product solves for them?' 'Where do they typically consume information online?' Encourage the client to describe specific buyer personas rather than broad demographic categories.",
          bullets: [
            "Ask about their most profitable or ideal customers.",
            "Identify the specific pain points the audience faces.",
            "Inquire about the audience's digital habits and tech-savviness."
          ]
        },
        {
          heading: "Vague vs. Good Answers",
          body: "A vague answer is 'Everyone' or 'Small businesses.' These provide no direction for a design team. A good answer is specific: 'Marketing managers at B2B tech companies with 50-200 employees who are frustrated with slow reporting tools.' The more specific the audience, the more tailored and effective the website design can be. If a client gives a vague answer, politely push them for specifics.",
          callout: {
            type: "tip",
            text: "If a client says 'everyone is our customer,' remind them that designing for everyone usually means appealing to no one."
          }
        },
        {
          heading: "Using Audience Data in Sales",
          body: "Once you have a clear picture of the target audience, use it to frame your pitch. Explain to the prospect how Eight34 will design specifically for that persona. For example, if the audience is elderly, emphasize that Eight34 focuses on accessibility, high contrast, and clear navigation. Showing that you understand their audience builds immense trust.",
          bullets: [
            "Frame your pitch around solving the audience's problems.",
            "Explain how design choices will cater to specific demographic needs.",
            "Use audience understanding to build trust and authority."
          ]
        }
      ],
      key_takeaways: [
        "Ask behavioral and specific demographic questions to define the audience.",
        "Push back on vague answers like 'everyone'; demand specific buyer personas.",
        "Use the audience data to tailor your sales pitch and demonstrate understanding."
      ]
    }
  },
  {
    module_number: 8,
    title: "Design Styles",
    description: "Explaining all style options and how to help clients articulate what they want.",
    content: {
      overview: "Clients often struggle to articulate their visual preferences, using vague terms like 'make it pop.' As a salesperson, you must guide them through specific design styles to establish a clear visual direction before the project begins. Understanding Eight34's design vocabulary allows you to translate a client's business goals into actionable aesthetic guidelines for the design team.",
      sections: [
        {
          heading: "Core Professional Styles",
          body: "These styles are standard for most businesses. 'Minimal' focuses on whitespace, simple typography, and only essential elements. 'Modern' incorporates contemporary UI trends, subtle animations, and sleek layouts. 'Corporate' is trustworthy, structured, and conservative, often used for finance or legal firms. 'Clean' is similar to minimal but slightly more flexible, focusing on legibility and straightforward navigation.",
          bullets: [
            "Minimal: High whitespace, focus on essentials.",
            "Modern: Contemporary trends, sleek UI.",
            "Corporate: Trustworthy, structured, conservative."
          ]
        },
        {
          heading: "Expressive and Niche Styles",
          body: "For brands wanting to stand out, explore more expressive styles. 'Bold' uses high contrast, large typography, and striking imagery. 'Playful' incorporates organic shapes, illustrations, and interactive elements, great for creative agencies or consumer apps. 'Luxury' utilizes elegant typography, muted or dark palettes, and high-end imagery. 'Editorial' mimics print magazines with complex, grid-breaking layouts.",
          bullets: [
            "Bold: High contrast, large typography.",
            "Playful: Illustrations, organic shapes, interactive.",
            "Luxury: Elegant, high-end imagery, dark or muted tones."
          ]
        },
        {
          heading: "Helping Clients Articulate Preferences",
          body: "Do not rely on adjectives alone. The best way to help a client articulate their desired style is through visual examples. Ask them to provide 3-5 links to websites they admire and, crucially, ask them *what* they like about them. Is it the color scheme? The ease of use? The photography? This prevents misinterpretations and sets clear expectations.",
          callout: {
            type: "tip",
            text: "Create a mood board or share a portfolio of different styles during the sales call to gauge their immediate reactions."
          }
        }
      ],
      key_takeaways: [
        "Understand the difference between Core Professional and Expressive styles.",
        "Use specific design vocabulary (Minimal, Bold, Luxury) to categorize their needs.",
        "Always use visual examples and ask clients exactly what they like about reference sites."
      ]
    }
  },
  {
    module_number: 9,
    title: "Finding Businesses",
    description: "Research strategies: Google Maps, social media, LinkedIn, local directories, cold scouting.",
    content: {
      overview: "A consistent pipeline of leads requires proactive prospecting. You cannot rely solely on inbound inquiries. Knowing where and how to find businesses that need web design services is a critical skill. By utilizing a mix of digital tools and strategic research, you can uncover hidden opportunities and identify companies that are primed for a digital upgrade.",
      sections: [
        {
          heading: "Leveraging Google Maps and Local SEO",
          body: "Google Maps is a goldmine for local business prospecting. Search for specific niches (e.g., 'plumbers near me', 'boutique hotels') and look past the top three results. Businesses ranking on the second or third page often have poor websites or lack basic SEO optimization. If a business has great reviews but a terrible website, they are an ideal prospect for Eight34's services.",
          bullets: [
            "Search local niches on Google Maps.",
            "Target businesses ranking outside the top 3 spots.",
            "Look for a mismatch between great reviews and a poor website."
          ]
        },
        {
          heading: "Social Media and LinkedIn Strategies",
          body: "LinkedIn is essential for finding B2B and SaaS clients. Look for companies posting about recent funding, expansions, or hiring new marketing personnel—these events often trigger a website redesign. On platforms like Instagram, find businesses running paid ads. If they are spending money on ads but directing traffic to a slow or unoptimized landing page, they need our help immediately.",
          callout: {
            type: "info",
            text: "Use LinkedIn Sales Navigator to track companies experiencing rapid headcount growth."
          }
        },
        {
          heading: "Directories and Cold Scouting",
          body: "Industry-specific directories (like Yelp, TripAdvisor, or specialized B2B portals) are excellent lists of potential clients. Cold scouting involves looking at your everyday surroundings. Notice a new restaurant opening? Check their website. Attend local networking events, Chamber of Commerce meetings, or industry conferences to build relationships and identify businesses struggling with their digital presence.",
          bullets: [
            "Mine industry-specific directories.",
            "Scout new businesses opening in your local area.",
            "Attend networking events to find prospects in person."
          ]
        }
      ],
      key_takeaways: [
        "Use Google Maps to find poorly ranking local businesses with bad websites.",
        "Monitor LinkedIn for funding, growth, or new marketing hires.",
        "Target businesses running social media ads that point to poor landing pages."
      ]
    }
  },
  {
    module_number: 10,
    title: "Evaluating Businesses",
    description: "How to assess if a business is a good prospect: online presence quality, revenue signals, growth indicators, red flags.",
    content: {
      overview: "Once you have found a potential business, you must evaluate them before initiating outreach. Not every business with a bad website is a good prospect. You need to determine if they have the budget and mindset to invest in professional services. Evaluating a business pre-outreach saves time and ensures you focus on high-probability targets.",
      sections: [
        {
          heading: "Assessing Online Presence",
          body: "Start by analyzing their current website. Is it not mobile-friendly? Does it load slowly? Are there broken links or outdated copyright dates? These are obvious pain points you can mention in your outreach. Also, check their social media. If they post regularly and have high engagement, it shows they value digital marketing, making them more likely to invest in a better website.",
          bullets: [
            "Check for mobile responsiveness and load speeds.",
            "Look for broken links and outdated content.",
            "Assess their social media activity and engagement."
          ]
        },
        {
          heading: "Identifying Revenue and Growth Signals",
          body: "A business needs money to pay Eight34. Look for signals of financial health. Are they actively hiring on Indeed or LinkedIn? Have they recently opened a second location? Do they run premium Google Ads? These are strong indicators of a healthy cash flow. For SaaS companies, recent rounds of venture capital funding are the ultimate growth signal.",
          callout: {
            type: "tip",
            text: "A business paying for Google Ads but sending traffic to a bad website is losing money—point this out to them."
          }
        },
        {
          heading: "Spotting Red Flags",
          body: "Be vigilant for red flags that indicate a nightmare client. If their current website looks like it was built cheaply on Fiverr yesterday, they likely have zero budget. If they have terrible reviews online complaining about their business practices, they will probably treat you poorly as well. Avoid businesses that look stagnant, have no social presence, and show no signs of modernizing.",
          bullets: [
            "Very recent, extremely cheap-looking websites.",
            "Consistently terrible customer reviews online.",
            "Complete lack of any digital footprint or marketing effort."
          ]
        }
      ],
      key_takeaways: [
        "Evaluate their website for obvious, fixable pain points (speed, mobile).",
        "Look for hiring, expansion, or ad spending as budget indicators.",
        "Avoid businesses with terrible customer reviews or zero marketing effort."
      ]
    }
  },
  {
    module_number: 11,
    title: "Scouting Qualified Prospects",
    description: "Step-by-step prospecting workflow: criteria checklist, initial research, pre-qualification.",
    content: {
      overview: "Scouting is the systematic process of turning a raw list of businesses into a refined list of highly qualified prospects. A disciplined workflow prevents you from wasting time on dead ends. By applying a strict criteria checklist and conducting thorough initial research, you ensure that every outreach attempt is highly targeted and relevant.",
      sections: [
        {
          heading: "The Criteria Checklist",
          body: "Before spending time researching a prospect, they must pass a basic criteria checklist. 1. Do they fit into our target categories (Personal, Business, SaaS)? 2. Do they have a clear need for a new site or redesign? 3. Do they show signs of having a budget? If the answer to any of these is no, discard the prospect and move on. Agility is key in scouting.",
          bullets: [
            "Fits target category.",
            "Clear, identifiable digital need.",
            "Visible signs of budget/growth."
          ]
        },
        {
          heading: "Conducting Initial Research",
          body: "Once a prospect passes the checklist, conduct deep research. Find out who the decision-maker is—look for the Owner, Founder, or Marketing Director on LinkedIn. Understand their business model: how do they make money? Identify their main competitors and see how their website compares. This research provides the ammunition you need to craft a compelling, personalized outreach message.",
          callout: {
            type: "info",
            text: "Never send an outreach message to 'info@' or 'contact@' if you can find the actual decision-maker's email."
          }
        },
        {
          heading: "Pre-Qualification",
          body: "Pre-qualification happens before you even speak to the prospect. Based on your research, estimate what tier of service they might need. A local bakery might need a standard $3,000 Business site, while a funded SaaS startup will need a $10,000+ custom solution. Document these assumptions in your CRM so you are prepared to guide the pricing conversation when they respond.",
          bullets: [
            "Identify the specific decision-maker.",
            "Understand their business model and competitors.",
            "Estimate their potential project tier before outreach."
          ]
        }
      ],
      key_takeaways: [
        "Use a strict criteria checklist to quickly filter out bad prospects.",
        "Research the decision-maker and their competitors to personalize outreach.",
        "Pre-qualify their potential project scope and budget internally."
      ]
    }
  },
  {
    module_number: 12,
    title: "Reaching Out",
    description: "Outreach best practices: cold email, LinkedIn messages, in-person, what to say, what NOT to say.",
    content: {
      overview: "Outreach is where your research is put to the test. The goal of initial outreach is not to sell a website immediately, but to start a conversation and secure a meeting. Whether through cold email, LinkedIn, or in-person networking, your communication must be professional, highly personalized, and focused entirely on the value Eight34 can provide to their business.",
      sections: [
        {
          heading: "Cold Email and LinkedIn Best Practices",
          body: "Keep written outreach concise. Business owners skim emails. Start with a personalized hook that proves you researched them (e.g., 'Loved your recent post about...'). Immediately state the value proposition: point out a specific issue with their current site and how fixing it will benefit them (e.g., 'I noticed your site isn't mobile optimized, which might be costing you mobile bookings'). End with a low-friction call to action, asking for a brief chat, not a sale.",
          bullets: [
            "Personalize the opening line to prove research.",
            "Focus on one specific pain point and its business impact.",
            "Use a low-friction call to action (e.g., 'Open to a brief chat?')."
          ]
        },
        {
          heading: "In-Person Outreach",
          body: "When meeting prospects at events or walking into a local business, focus on building rapport first. Don't immediately criticize their website. Ask about their business challenges. If it naturally transitions to marketing, mention that you work for Eight34 and help businesses like theirs improve their digital presence. Leave a card and ask if you can email them some ideas.",
          callout: {
            type: "tip",
            text: "In-person, always focus on the relationship first. People buy from people they like."
          }
        },
        {
          heading: "What NOT to Say",
          body: "Avoid generic, templated messages—they are instantly recognizable as spam. Do not use overly technical jargon (e.g., 'Your DOM load time is slow'). Never be insulting or overly aggressive about how bad their current website is; they might have built it themselves. Finally, do not mention pricing in the initial outreach; pricing should only be discussed after value has been established.",
          bullets: [
            "No generic, copy-paste templates.",
            "Avoid overly technical jargon.",
            "Never insult their current website or mention pricing too early."
          ]
        }
      ],
      key_takeaways: [
        "Keep written outreach short, personalized, and focused on business value.",
        "In-person, prioritize building rapport over pitching.",
        "Avoid jargon, insults to their current work, and early pricing discussions."
      ]
    }
  },
  {
    module_number: 13,
    title: "Handling Responses",
    description: "Managing interest, objections, setting expectations, qualifying during conversation.",
    content: {
      overview: "Getting a response is a win, but it's just the beginning. How you handle a prospect's reply determines whether they move to a closed deal or go cold. You must be prepared to manage their interest efficiently, counter their objections gracefully, set realistic expectations about the process, and continue qualifying them during the live conversation.",
      sections: [
        {
          heading: "Managing Interest and Setting Expectations",
          body: "If a prospect expresses interest, respond promptly (within hours, not days). Suggest a brief 15-minute discovery call to learn more. On this call, set the agenda and explain Eight34's process. Let them know that the goal is to understand their needs to see if we are a good fit. Setting professional expectations early demonstrates competence and control.",
          bullets: [
            "Respond to positive replies rapidly.",
            "Push for a brief, structured discovery call.",
            "Explain the Eight34 process to set professional expectations."
          ]
        },
        {
          heading: "Handling Common Objections",
          body: "Expect objections. 'We don't have the budget' often means 'I don't see the value yet.' Counter by asking about the cost of their current inefficient site. 'We are too busy right now' can be met with 'Our process is designed to require minimal time from your end.' 'My nephew can do it for free' should be countered by emphasizing the difference between a hobbyist and a strategic business asset that generates ROI.",
          callout: {
            type: "warning",
            text: "Never argue with an objection. Acknowledge their concern, then reframe it around value and ROI."
          }
        },
        {
          heading: "Qualifying During the Conversation",
          body: "The discovery call is your chance to actively qualify. Ask the BANT questions: Budget, Authority, Need, and Timeline. Directly ask, 'Do you have a budget set aside for this project?' Ensure you are speaking to the person who can sign the contract. Confirm their timeline is realistic (e.g., they don't need a massive SaaS site in two weeks). If they fail these checks, politely disqualify them.",
          bullets: [
            "Verify Budget directly and early.",
            "Confirm you are speaking with the Authority (decision-maker).",
            "Ensure their Timeline is realistic for Eight34's team."
          ]
        }
      ],
      key_takeaways: [
        "Respond quickly to interest and move the conversation to a discovery call.",
        "Reframe objections around ROI rather than arguing.",
        "Actively qualify using Budget, Authority, Need, and Timeline (BANT)."
      ]
    }
  },
  {
    module_number: 14,
    title: "US / Europe Pricing",
    description: "Eight34's pricing model for US/European clients: pricing ranges by website type, how to quote, justifying the price.",
    content: {
      overview: "Pricing for clients in the US and Europe reflects the high standard of living, premium market rates, and the bespoke quality of Eight34's work. These clients expect a premium service and are willing to pay for it, provided you can justify the ROI. Understanding these tiers ensures we remain profitable while delivering exceptional value to Western markets.",
      sections: [
        {
          heading: "Pricing Ranges by Type",
          body: "For US and European clients, our pricing is structured to reflect the complexity of the build. Personal sites (portfolios, simple event pages) typically range from $800 to $2,500. Standard Business sites (informational, local services) range from $1,500 to $5,000, depending on the number of pages and custom features. High-end SaaS or complex business sites (custom integrations, advanced CMS) start at $3,000 and can exceed $10,000+.",
          bullets: [
            "Personal sites: $800 - $2,500.",
            "Business sites: $1,500 - $5,000.",
            "SaaS / Complex sites: $3,000 - $10,000+."
          ]
        },
        {
          heading: "How to Quote",
          body: "Never provide a final quote on the first call. Use the initial conversation to gather scope, then present a proposed range. Quote based on value, not just hours. Consider the client's size; a massive law firm expects to pay more than a local plumber for a similar site. Present pricing in a formal proposal, breaking down the costs into phases (Design, Development, QA) to show exactly what they are paying for.",
          callout: {
            type: "tip",
            text: "Always present a 'Good, Better, Best' tiered pricing model in proposals to give the client psychological control."
          }
        },
        {
          heading: "Justifying the Price",
          body: "When clients push back on price, do not immediately discount. Justify the cost by highlighting Eight34's expertise, custom design (no templates), SEO foundations, and post-launch support. Shift the conversation to ROI. If a $5,000 website brings in just two new $3,000 clients for them, the site has paid for itself. You are selling a business asset, not just code.",
          bullets: [
            "Highlight custom design and lack of templates.",
            "Emphasize built-in SEO and performance optimization.",
            "Shift focus from the upfront cost to the long-term ROI."
          ]
        }
      ],
      key_takeaways: [
        "Memorize the standard pricing ranges for Personal, Business, and SaaS.",
        "Quote based on value and present options, never a final number on the first call.",
        "Justify high prices by emphasizing ROI and the quality of the asset being built."
      ]
    }
  },
  {
    module_number: 15,
    title: "Outside US / Europe Pricing",
    description: "Eight34's pricing model for global clients, adjusted pricing tiers, considerations.",
    content: {
      overview: "Selling to clients outside the US and Europe (e.g., Latin America, parts of Asia, Africa) requires a different pricing strategy. Purchasing power parity means that US rates are often unfeasible for these markets. Eight34 adjusts pricing for global clients to remain competitive internationally while still ensuring the projects are profitable and worthwhile for the agency.",
      sections: [
        {
          heading: "Adjusted Pricing Tiers",
          body: "As a general rule, pricing for global clients outside the US and EU is adjusted 30-50% lower than standard rates. Personal sites may range from $400 to $1,500. Standard Business sites typically fall between $1,000 and $3,000. Complex SaaS or enterprise projects start around $2,000 to $6,000. These adjusted rates allow us to win international business while maintaining fair compensation.",
          bullets: [
            "Rates are generally 30-50% lower than US/EU.",
            "Personal: $400 - $1,500 | Business: $1,000 - $3,000.",
            "SaaS / Complex: $2,000 - $6,000."
          ]
        },
        {
          heading: "Market Considerations",
          body: "When quoting globally, you must consider currency fluctuations and payment methods. Always quote and contract in USD to protect Eight34 from exchange rate volatility. Be aware that international clients may require different payment gateways (like Wise or Payoneer) instead of standard US processors. Ensure these logistical details are ironed out before finalizing the contract.",
          callout: {
            type: "warning",
            text: "Always quote and require payment in USD to avoid losing revenue to sudden currency devaluation."
          }
        },
        {
          heading: "Maintaining Quality and Scope",
          body: "Even with adjusted pricing, Eight34 does not compromise on the quality of work. However, to maintain profitability at lower price points, you must be extremely strict with project scope. Limit the number of revisions, constrain custom feature requests, and rely more on efficient internal frameworks. Ensure the client understands that the adjusted price comes with a tightly managed scope.",
          bullets: [
            "Never compromise on final quality or code standards.",
            "Strictly control project scope and limit revision rounds.",
            "Quote and invoice exclusively in USD."
          ]
        }
      ],
      key_takeaways: [
        "Global pricing is typically 30-50% lower than US/EU rates.",
        "Always quote and collect payments in USD.",
        "Maintain profitability by strictly managing the project scope and revisions."
      ]
    }
  },
  {
    module_number: 16,
    title: "Submitting a High-Quality Lead",
    description: "How to fill the lead form correctly, what information is critical, common mistakes, review checklist.",
    content: {
      overview: "Your job as a salesperson isn't done when the client says 'yes.' The final, crucial step is handing the qualified lead over to the project management and development team. Submitting a high-quality lead ensures a smooth transition, prevents scope creep, and sets the production team up for success. Poorly submitted leads cause internal friction and result in unhappy clients.",
      sections: [
        {
          heading: "Critical Information Required",
          body: "When submitting a lead into the Eight34 CRM or project management tool, certain information is non-negotiable. You must include the client's full contact details, the finalized budget, the agreed-upon timeline, and a detailed summary of the project scope (number of pages, specific features, integrations). You must also include notes on the client's target audience and preferred design styles discussed.",
          bullets: [
            "Complete contact info and decision-maker details.",
            "Finalized budget and agreed-upon timeline.",
            "Detailed scope, target audience, and style preferences."
          ]
        },
        {
          heading: "Common Submission Mistakes",
          body: "The most common mistake is vagueness. Writing 'Client wants a modern business site' is useless to a designer. Another frequent error is omitting technical requirements discussed on the call, such as a necessary CRM integration. Finally, failing to document client quirks or communication preferences (e.g., 'Client prefers phone calls over email') can lead to immediate friction during the kickoff phase.",
          callout: {
            type: "warning",
            text: "Never promise a feature to a client and fail to put it in the lead submission notes."
          }
        },
        {
          heading: "The Review Checklist",
          body: "Before hitting submit, review your notes against this checklist: Is the budget explicitly stated? Is the website type clearly categorized? Have you listed 3-5 reference websites the client likes? Are all promised integrations documented? Only when you can answer 'yes' to all these questions is the lead ready to be handed off to the Eight34 production team.",
          bullets: [
            "Budget and timeline explicitly documented.",
            "Website type categorized and scope defined.",
            "Reference sites and technical requirements included."
          ]
        }
      ],
      key_takeaways: [
        "A high-quality lead submission is detailed, comprehensive, and clear.",
        "Avoid vague descriptions; provide specific scope, style, and tech requirements.",
        "Use a final checklist to ensure no critical details from the sales call are omitted."
      ]
    }
  }
];
