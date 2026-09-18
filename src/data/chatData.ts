import { ChatData, ResponseTemplate } from '@/types/chat';

export const chatData: ChatData[] = [
  {
    id: "general-1",
    question: "What is DX Living?",
    keywords: ["DX Living", "definition", "do", "meaning", "explained", "overview"],
    responseTemplates: [
      {
        template: "**DX Living** is a collaborative project intelligence platform that replaces uncertainty with a single source of truth. We transform complex project data into clear, interactive visualisations and models, providing clarity and alignment for every stakeholder from concept to completion.",
        tone: "professional"
      },
    ],
    pageLink: "/about",
    category: "general",
    suggestions: ["What makes DX Living different from other platform?", "How can Developers benefit from DX Living?"]
  },
  {
    id: "general-2",
    question: "What makes DX Living different from other platform?",
    keywords: ["dx living", "other platforms", "vs", "unique", "why choose", "advantages", "features", "strength", "different", "why"],
    responseTemplates: [
      {
        template: "We go beyond creating pretty pictures. While our visualisations are stunning, our core strength is building certainty. DX Living integrates design, data, and supply chain into one collaborative platform, aligning every team, preventing miscommunication, and turning complex projects into predictable successes.",
        tone: "professional"
      },
    ],
    pageLink: "/about",
    category: "general",
    suggestions: ["What advantages does DX Living offer to Custom Builders?", "How can Developers benefit from DX Living?"]
  },
  {
    id: "general-3",
    question: "How can Developers benefit from DX Living?",
    keywords: ["dx living", "benefits", "developers", "use", "software developers", "developers choose", "choose", "why"],
    responseTemplates: [
      {
        template: "Accelerate your sales cycle and secure investor funding faster. DX Living de-risks your project with data-rich, compelling visualisations that build trust and confidence, helping you pre-sell units and demonstrate clear project viability.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "general",
    suggestions: ["What is DX Living?", "How does DX Living help Architects and Designers?"]
  },
  {
    id: "general-4",
    question: "How does DX Living help Architects and Designers?",
    keywords: ["dx living", "architects and designers", "architects", "designers", "benefits", "help", "how"],
    responseTemplates: [
      {
        template: "DX Living ensure your creative intent is understood and executed perfectly by clients, engineers, and builders, eliminating costly misinterpretations and changing orders.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "general",
    suggestions: ["What makes DX Living different from other platform?", "How can Developers benefit from DX Living?"]
  },
  {
    id: "general-5",
    question: "What advantages does DX Living offer to Custom Builders?",
    keywords: ["builders", "custom builders", "benefits for builders", "solutions", "construction professionals"],
    responseTemplates: [
      {
        template: "Streamline your entire construction process. By integrating seamlessly with your suppliers and providing a clear visual plan, we help you reduce errors, avoid delays, and keep projects on schedule and on budget.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "general",
    suggestions: ["How can Developers benefit from DX Living?", "How does DX Living protect my investment as a Project Investor?"]
  },
  {
    id: "general-6",
    question: "Why should a Homeowner use DX Living?",
    keywords: ["dx living", "homeowners", "homeowners choose", "solutions", "benefits", "why"],
    responseTemplates: [
      {
        template: "Be certain about every choice, from floorboards to fixtures, before construction starts. Experience and explore your future home in immersive detail, allowing you to make informed decisions, visualise finishes, and eliminate the anxiety of the unknown.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "general",
    suggestions: ["What makes DX Living different from other platform?", "How can Developers benefit from DX Living?"]
  },
  {
    id: "general-7",
    question: "How does DX Living protect my investment as a Project Investor?",
    keywords: ["project investors", "investors", "investments", "advantages", "solutions", "how"],
    responseTemplates: [
      {
        template: "Mitigate risk and maximize returns. Our data-driven models provide a clear, objective view of the project's potential and progress, enabling you to make smarter, more confident investment decisions based on certainty, not just blueprints.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "general",
    suggestions: ["What makes DX Living different from other platform?", "How can Developers benefit from DX Living?"]
  },
  {
    id: "studio-1",
    question: "What is DX Studio?",
    keywords: ["studio", "dx studio", "construction expertise", "high-end residential", "residential", "what"],
    responseTemplates: [
      {
        template: "DX Studio combines decades of construction expertise with advanced visualisation and planning technology. We help you foresee challenges, enhance efficiency, and deliver flawless execution on high-end residential projects.",
        tone: "professional"
      },
    ],
    pageLink: "/studio",
    category: "studio",
    suggestions: ["Who is DX Studio for?", "What makes DX Studio different?"]
  },
  {
    id: "studio-2",
    question: "Who is DX Studio for?",
    keywords: ["studio", "dx studio", "supporting builders", "architects", "developers", "homeowners", "who"],
    responseTemplates: [
      {
        template: "DX Studio combines decades of construction expertise with advanced visualisation and planning technology. We help you foresee challenges, enhance efficiency, and deliver flawless execution on high-end residential projects.",
        tone: "professional"
      },
    ],
    pageLink: "/studio",
    category: "studio",
    suggestions: ["What makes DX Studio different from other platform?", "How can Developers benefit from DX Studio?"]
  },
  {
    id: "studio-3",
    question: "What makes DX Studio different?",
    keywords: ["studio", "dx studio", "different", "master craftsmanship insight", "foresight for flawless execution", "uncompromising visual communication", "Agile Collaboration ", "what"],
    responseTemplates: [
      {
        template: "With Master Craftsmanship Insight, DX Living brings deep knowledge of high-end building practices to your project. Through Foresight for Flawless Execution, we help you anticipate risks before they ever become problems. Our commitment to Uncompromising Visual Communication means you'll see benchmark-quality renders and immersive experiences that leave no room for misinterpretation. And with Agile Collaboration, we ensure rapid, iterative analyses and revisions that always stay true to your design intent.",
        tone: "professional"
      },
    ],
    pageLink: "/studio",
    category: "studio",
    suggestions: ["", ""]
  },
  {
    id: "studio-4",
    question: "What services do you offer?",
    keywords: ["studio", "dx studio services", "services", "pre-tender to construction", "studio offer", "what"],
    responseTemplates: [
      {
        template: "Our services span pre-tender to construction, including: Master plan programs & scenario analysis, Photorealistic interior/exterior renders, 3D models & 4D interactive tours, Site management plans & methodologies, Cash flow & resource analysis, Program validation & critical path reviews, Plan vs. actual progress videos, Interactive live models",
        tone: "professional"
      },
    ],
    pageLink: "/studio",
    category: "studio",
    suggestions: ["", ""]
  },
  {
    id: "studio-5",
    question: "How does DX Studio improve my project?",
    keywords: ["studio", "dx studio for project improvement", "project", "improvement", "solutions", "how"],
    responseTemplates: [
      {
        template: "We reduce risks, save time and money, and improve communication by providing clarity at every stage. This ensures confident decision-making, efficient workflows, and alignment among all stakeholders.",
        tone: "professional"
      },
    ],
    pageLink: "/studio",
    category: "studio",
    suggestions: ["", ""]
  },
  {
    id: "studio-6",
    question: "Do you offer subscriptions?",
    keywords: ["studio", "dx studio subscriptions", "subscriptions", "offer", "do you offer"],
    responseTemplates: [
      {
        template: "Yes. Our subscription plans provide ongoing access to visualisation tools, models, and insights tailored to your project’s needs. This ensures continuous clarity from design through construction.",
        tone: "professional"
      },
    ],
    pageLink: "/studio",
    category: "studio",
    suggestions: ["", ""]
  },
  {
    id: "studio-7",
    question: "How do I get started?",
    keywords: ["studio", "dx studio get started", "get started", "start", "how"],
    responseTemplates: [
      {
        template: "Simply connect with us to discuss your project. We'll recommend the right mix of services and tools to help you build smarter, visualise perfectly, and deliver flawlessly.",
        tone: "professional"
      },
    ],
    pageLink: "/studio",
    category: "studio",
    suggestions: ["", ""]
  },
  {
    id: "interior-1",
    question: "What is DX Interior?",
    keywords: ["interior", "dx interior", "interior", "what"],
    responseTemplates: [
      {
        template: "Simply connect with us to discuss your project. We'll recommend the right mix of services and tools to help you build smarter, visualise perfectly, and deliver flawlessly.",
        tone: "professional"
      },
    ],
    pageLink: "/interiors",
    category: "interior",
    suggestions: ["", ""]
  },
  {
    id: "interior-2",
    question: "How does it benefit homeowners and designers?",
    keywords: ["interior", "dx interior", "homeowners", "designers", "benefits", "how"],
    responseTemplates: [
      {
        template: "Validate design ideas before committing; Access real materials, finishes, and supplier products to ensure designs are realistic and achievable; Start with a free plan to experiment, or unlock premium access for a full library of products and finishes.",
        tone: "professional"
      },
    ],
    pageLink: "/interiors",
    category: "interior",
    suggestions: ["", ""]
  },
  {
    id: "interior-3",
    question: "What are the benefits for suppliers?",
    keywords: ["interior", "dx interior", "suppliers", "benefits", "what"],
    responseTemplates: [
      {
        template: "Boost purchase intent by letting clients visualise products in real design settings, Strengthen partnerships with developers and designers, Streamline the marketing-to-sales funnel and gain insights into customer demand",
        tone: "professional"
      },
    ],
    pageLink: "/interiors",
    category: "interior",
    suggestions: ["", ""]
  },
  {
    id: "interior-4",
    question: "What's the difference between Free and Premium plans?",
    keywords: ["interior", "dx interior", "free", "premium", "what"],
    responseTemplates: [
      {
        template: "Free Plan: Access to essential tools to test and experiment with design ideas; Premium Plan: Unlocks full supplier product catalogs, finishes, and advanced visualisation tools to create personalized, future-ready interiors.",
        tone: "professional"
      },
    ],
    pageLink: "/interiors",
    category: "interior",
    suggestions: ["", ""]
  },
  {
    id: "interior-5",
    question: "Who should use DX Interior?",
    keywords: ["interior", "dx interior", "interior", "homeowners", "designers", "benefits", "how"],
    responseTemplates: [
      {
        template: "Homeowners looking to design their dream space with confidence; Architects & Designers seeking immersive, accurate tools to validate and present concepts; Suppliers & Brands aiming for digital-first exposure and stronger connections with projects.",
        tone: "professional"
      },
    ],
    pageLink: "/interiors",
    category: "interior",
    suggestions: ["", ""]
  },
  {
    id: "interior-6",
    question: "Who should use DX Interior?",
    keywords: ["interior", "dx interior", "interior", "homeowners", "designers", "benefits", "how"],
    responseTemplates: [
      {
        template: "DX Interior goes beyond inspiration boards; it bridges creativity with real-world materials, making sure every design detail is both beautiful and buildable.",
        tone: "professional"
      },
    ],
    pageLink: "/interiors",
    category: "interior",
    suggestions: ["", ""]
  },
  {
    id: "interior-7",
    question: "How do I get started?",
    keywords: ["interior", "dx interior", "interior", "homeowners", "designers", "benefits", "how"],
    responseTemplates: [
      {
        template: "Simply choose your plan  Free or Premium  then  begin exploring; Whether you're designing, showcasing, or sourcing, DX Living makes interiors real, interactive, and future-proof.",
        tone: "professional"
      },
    ],
    pageLink: "/interiors",
    category: "interior",
    suggestions: ["", ""]
  },
  {
    id: "model-1",
    question: "What is DX Model?",
    keywords: ["model", "dx model", "model", "what"],
    responseTemplates: [
      {
        template: "DX Model is a web-based design and visualisation platform that allows you to experiment with interior design ideas in real-time. Swap finishes, rearrange furniture, adjust lighting, and experience your space in photorealistic 4D walkthroughs.",
        tone: "professional"
      },
    ],
    pageLink: "/model",
    category: "model",
    suggestions: ["", ""]
  },
  {
    id: "model-2",
    question: "How does it benefit homeowners?",
    keywords: ["model", "dx model", "homeowners", "benefits", "how"],
    responseTemplates: [
      {
        template: "Experiment freely: Try different layouts, finishes, and furniture without the risk of costly mistakes; Immersive walkthroughs: Visualise your space in 4D before you build; Learn & explore: An intuitive tool to build confidence in design decisions; Premium upgrade: Unlock access to a wide range of supplier products and finishes for truly personalized spaces.",
        tone: "professional"
      },
    ],
    pageLink: "/model",
    category: "model",
    suggestions: ["", ""]
  },
  {
    id: "model-3",
    question: "How does it benefit suppliers & trade professionals?",
    keywords: ["model", "dx model", "suppliers", "trade professionals", "benefits", "how"],
    responseTemplates: [
      {
        template: "Massive exposure: Feature your products across DX Interior, Model, and Prestige;Photorealistic product showcasing: Help customers see your products in lifelike settings; Marketing-to-sales funnel: Convert visual interest into direct sales via our integrated system;Stronger partnerships: Collaborate seamlessly with architects, designers, and developers; Market insights: Track demand trends to align your offerings with real consumer preferences",
        tone: "professional"
      },
    ],
    pageLink: "/model",
    category: "model",
    suggestions: ["", ""]
  },
  {
    id: "model-4",
    question: "Can I collaborate with professionals on DX Model?",
    keywords: ["model", "dx model", "collaborate", "professionals", "can i"],
    responseTemplates: [
      {
        template: "Yes. DX Model creates a collaborative ecosystem where homeowners, designers, architects, and builders can work together in real-time, ensuring your vision is aligned with expert input.",
        tone: "professional"
      },
    ],
    pageLink: "/model",
    category: "model",
    suggestions: ["", ""]
  },
  {
    id: "model-5",
    question: "What makes DX Model different from other design tools?",
    keywords: ["model", "dx model", "different", "other", "design tools", "benefits", "what"],
    responseTemplates: [
      {
        template: "Unlike static mood boards or design apps, DX Model offers: 4D walkthroughs for true-to-life visualisation; Real product integration from leading suppliers; Real-time collaboration with professionals; Confidence in decision-making, reducing design risk.",
        tone: "professional"
      },
    ],
    pageLink: "/model",
    category: "model",
    suggestions: ["", ""]
  },
  {
    id: "model-6",
    question: "How do I get started?",
    keywords: ["model", "dx model", "get started", "start", "how"],
    responseTemplates: [
      {
        template: "Sign up for a free account to explore basic tools, then upgrade to DX Model Premium for full access to supplier catalogs, finishes, and advanced collaboration features.",
        tone: "professional"
      },
    ],
    pageLink: "/model",
    category: "model",
    suggestions: ["", ""]
  },
  {
    id: "prestige-1",
    question: "What is DX Prestige?",
    keywords: ["prestige", "dx prestige", "what"],
    responseTemplates: [
      {
        template: "DX Prestige is the flagship VIP experience of DX Living, combining DX Studio, DX Interior, and DX Model into one premium service. It provides 4D and VR-ready visualisation, white-glove collaboration, and real-world supplier integration for luxury residential projects.",
        tone: "professional"
      },
    ],
    pageLink: "/prestige",
    category: "prestige",
    suggestions: ["", ""]
  },
  {
    id: "prestige-2",
    question: "Who is DX Prestige for?",
    keywords: ["prestige", "dx prestige", "who"],
    responseTemplates: [
      {
        template: "DX Prestige is designed for: Luxury homeowners building or renovating dream homes; Architects, designers, and developers creating high-end residences; Premium suppliers seeking to showcase products in photorealistic, immersive environments;",
        tone: "professional"
      },
    ],
    pageLink: "/prestige",
    category: "prestige",
    suggestions: ["", ""]
  },
  {
    id: "prestige-3",
    question: "How is DX Prestige different from other DX Living services?",
    keywords: ["prestige", "dx prestige", "different", "other", "services", "how"],
    responseTemplates: [
      {
        template: "Unlike standard Module, DX Prestige offers: Unified access to all DX Living platforms in one ecosystem; Exclusive VIP support and collaboration across all stakeholders; 4D walkthroughs + optional VR immersion for ultimate realism; Seamless integration of curated, high-end supplier products; White-glove service from concept to completion;",
        tone: "professional"
      },
    ],
    pageLink: "/prestige",
    category: "prestige",
    suggestions: ["", ""]
  },
  {
    id: "prestige-4",
    question: "What kind of visualisation do I get?",
    keywords: ["prestige", "dx prestige", "visualisation", "kind", "what"],
    responseTemplates: [
      {
        template: "You’ll receive: Photorealistic interior & exterior visuals; Immersive 4D walkthroughs of your home design; VR-ready experiences (optional equipment add-on); Interactive models with real-world supplier finishes and products;",
        tone: "professional"
      },
    ],
    pageLink: "/prestige",
    category: "prestige",
    suggestions: ["", ""]
  },
  {
    id: "prestige-5",
    question: "How does DX Prestige help homeowners?",
    keywords: ["prestige", "dx prestige", "different", "other", "services", "how"],
    responseTemplates: [
      {
        template: "Validate design ideas instantly and avoid costly mistakes; Experience your future home in detail before construction begins; Collaborate seamlessly with your architect, builder, and designer; Enjoy a smooth, white-glove design journey backed by expert insight",
        tone: "professional"
      },
    ],
    pageLink: "/prestige",
    category: "prestige",
    suggestions: ["", ""]
  },
  {
    id: "prestige-5",
    question: "How does DX Prestige help homeowners?",
    keywords: ["prestige", "dx prestige", "different", "other", "services", "how"],
    responseTemplates: [
      {
        template: "Validate design ideas instantly and avoid costly mistakes; Experience your future home in detail before construction begins; Collaborate seamlessly with your architect, builder, and designer; Enjoy a smooth, white-glove design journey backed by expert insight",
        tone: "professional"
      },
    ],
    pageLink: "/prestige",
    category: "prestige",
    suggestions: ["", ""]
  },
  {
    id: "prestige-6",
    question: "What's the benefit for suppliers and trade professionals?",
    keywords: ["prestige", "dx prestige", "benefit", "suppliers", "trade professionals", "how"],
    responseTemplates: [
      {
        template: "Premium brand exposure in luxury projects; Higher purchase intent with realistic product showcasing; Seamless marketing-to-sales funnel with integrated commissions; Valuable market insights into customer demand and trends; Stronger partnerships with top-tier architects and developers;",
        tone: "professional"
      },
    ],
    pageLink: "/prestige",
    category: "prestige",
    suggestions: ["", ""]
  },
  {
    id: "prestige-7",
    question: "How is DX Prestige priced?",
    keywords: ["prestige", "dx prestige", "priced", "how"],
    responseTemplates: [
      {
        template: "DX Prestige includes: Upfront project fee; VIP monthly subscription for access to all supplier products, material libraries, and ongoing project maintenance; Optional add-on: VR equipment package;",
        tone: "professional"
      },
    ],
    pageLink: "/prestige",
    category: "prestige",
    suggestions: ["", ""]
  },
  {
    id: "prestige-8",
    question: "Do I need technical knowledge to use DX Prestige?",
    keywords: ["prestige", "dx prestige", "technical knowledge", "need", "know", "technical", "do i"],
    responseTemplates: [
      {
        template: "No. DX Prestige is fully guided by our experts. You collaborate, review, and approve, while we handle the complex technical side  ensuring a stress-free, intuitive experience.",
        tone: "professional"
      },
    ],
    pageLink: "/prestige",
    category: "prestige",
    suggestions: ["", ""]
  },
  {
    id: "prestige-9",
    question: "Can DX Prestige support international projects?",
    keywords: ["prestige", "dx prestige", "international projects", "projects", "international", "support"],
    responseTemplates: [
      {
        template: "Yes. DX Prestige is globally accessible through its web-based platform, with VR and 4D-ready experiences available anywhere.",
        tone: "professional"
      },
    ],
    pageLink: "/prestige",
    category: "prestige",
    suggestions: ["", ""]
  },
  {
    id: "prestige-10",
    question: "How do I get started?",
    keywords: ["prestige", "dx prestige", "get started", "start", "how"],
    responseTemplates: [
      {
        template: "Simply contact our team to book a consultation. We'll discuss your project, walk you through the DX Prestige process, and set up your exclusive VIP design journey.",
        tone: "professional"
      },
    ],
    pageLink: "/prestige",
    category: "prestige",
    suggestions: ["", ""]
  },
  {
    id: "projects-1",
    question: "What does DX Living's portfolio showcase?",
    keywords: ["projects", "dx living", "portfolio", "showcase", "what"],
    responseTemplates: [
      {
        template: "Our portfolio features immersive visualisations that transform ideas, allowing you to see every detail before construction begins.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "projects",
    suggestions: ["", ""]
  },
  {
    id: "projects-2",
    question: "How is this different from traditional design presentations?",
    keywords: ["projects", "dx living", "different", "traditional", "design", "presentations", "what"],
    responseTemplates: [
      {
        template: "Our portfolio features immersive visualisations that transform ideas, allowing you to see every detail before construction begins.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "projects",
    suggestions: ["", ""]
  },
  {
    id: "projects-3",
    question: "How is this different from traditional design presentations?",
    keywords: ["projects", "dx living", "different", "traditional", "design", "presentations", "what"],
    responseTemplates: [
      {
        template: "Our portfolio features immersive visualisations that transform ideas, allowing you to see every detail before construction begins.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "projects",
    suggestions: ["", ""]
  },
  {
    id: "projects-4",
    question: "Can DX Living help with decision-making during the design phase?",
    keywords: ["projects", "dx living", "decision-making", "design", "phase", "help", "what"],
    responseTemplates: [
      {
        template: "Our portfolio features immersive visualisations that transform ideas, allowing you to see every detail before construction begins.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "projects",
    suggestions: ["", ""]
  },
  {
    id: "projects-5",
    question: "Can DX Living help with decision-making during the design phase?",
    keywords: ["projects", "dx living", "decision-making", "design", "phase", "help", "what"],
    responseTemplates: [
      {
        template: "By offering clear, lifelike previews of your project, DX Living removes guesswork, aligns expectations, and ensures every choice supports your vision.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "projects",
    suggestions: ["", ""]
  },
  {
    id: "projects-6",
    question: "Why choose DX Living?",
    keywords: ["projects", "dx living", "choose", "why"],
    responseTemplates: [
      {
        template: "Because with us, you don’t just imagine your home as you experience it. Our approach guarantees clarity, confidence, and a final build that matches your vision.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "projects",
    suggestions: ["", ""]
  },
  {
    id: "projects-7",
    question: "What Solutions Does DX Living Offer",
    keywords: ["projects", "dx living", "solutions", "offer", "what"],
    responseTemplates: [
      {
        template: "DX Living provides a suite of integrated solutions designed to bring clarity, confidence, and precision to every stage of the design and build process: For Developers: Data-rich visualisations that accelerate sales, attract investors, and de-risk projects. For Architects: Tools to communicate design intent with accuracy, ensuring your vision is understood and executed. For Custom Builders: Seamless supplier integration that streamlines planning, reduces errors, and keeps projects on track. For Homeowners & Investors: Immersive experiences that allow you to see and feel your future home before construction begins. For Suppliers: Partnership opportunities to showcase products within prestigious projects, integrated directly into 3D models and VR environments.",
        tone: "professional"
      },
    ],
    pageLink: "/projects",
    category: "projects",
    suggestions: ["", ""]
  },
  {
    id: "contact-1",
    question: "Where are your offices located?",
    keywords: ["office", "offices", "location", "locations", "address", "addresses", "where", "contact", "phone", "email", "headquarters", "branches"],
    responseTemplates: [
      {
        template: "We have offices across Australia to serve you better. Our **head office** is in Victoria, and we also have locations in NSW, QLD, and WA. You can reach us at **{contactInfo}** or email us at **{email}** for any inquiries.",
        tone: "professional"
      },
    ],
    pageLink: "/contact",
    category: "contact",
    suggestions: ["How can I contact you?", "What are your office hours?", "Do you have international offices?"]
  },
  {
    id: "contact-2",
    question: "How can I contact you?",
    keywords: ["contact", "phone", "email", "call", "reach", "get in touch", "speak to", "talk to", "connect"],
    responseTemplates: [
      {
        template: "You can contact us in several ways: Call us at **{contactInfo}**, email us at **{email}**, or visit one of our offices across Australia. We're here to help with all your project visualization needs.",
        tone: "professional"
      },
    ],
    pageLink: "/contact",
    category: "contact",
    suggestions: ["Where are your offices located?", "What are your office hours?", "Do you offer consultations?"]
  },
  {
    id: "contact-3",
    question: "What are your office hours?",
    keywords: ["office hours", "hours", "business hours", "when", "open", "closed", "available", "time"],
    responseTemplates: [
      {
        template: "Our offices are open **Monday to Friday, 9 AM to 5 PM** local time. You can reach us at **{contactInfo}** during business hours, or email us at **{email}** anytime and we'll get back to you promptly.",
        tone: "professional"
      },
    ],
    pageLink: "/contact",
    category: "contact",
    suggestions: ["How can I contact you?", "Where are your offices located?", "Do you offer consultations?"]
  },
];

// Dynamic content placeholders
export const dynamicContent = {
  services: "3D visualisation, virtual reality walkthroughs, interactive design solutions, and architectural rendering services",
  projects: "251 Station Street, Victoria Parade development, and several other exciting projects",
  officeInfo: "VIC (HEAD OFFICE), Suite 70 44 Lakeview DR Scoresby VIC 3179 contact info: 1800 333 539; NSW, Level 10 418A Elizabeth ST Surry Hills NSW 2010, 1800 333 539; QLD, Level 14/167 Eagle ST Brisbane QLD 4000, 1800 333 539; WA, Level 12 197 St Georges Terrace Perth WA 6000, 1800 333 539",
  contactInfo: "1800 333 539",
  email: "info@dxliving.com.au",
  moduleInfo: "interactive design tools, 3D walkthroughs, material selection interfaces, and real-time collaboration features",
  aboutInfo: "We're a Melbourne-based design visualisation company specializing in bringing architectural and interior designs to life through cutting-edge 3D technology and virtual reality experiences.",
  processInfo: "We start with an initial consultation, gather your requirements, create initial concepts, refine through feedback, and deliver stunning final visualisations. The whole process typically takes 2-4 weeks depending on complexity.",
  techInfo: "We use Unreal Engine for real-time rendering, Blender for 3D modeling, VR headsets for immersive experiences, and cloud-based collaboration tools for seamless project management"
};
