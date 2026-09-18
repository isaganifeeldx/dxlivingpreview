import type { FaqItem } from '@/data/faqData'
import { getSiteUrl } from '@/lib/siteUrl'

/** Curated FAQPage entities used when CMS items are unavailable. */
const FALLBACK_FAQ_ENTITIES = [
  {
    name: 'What is DX Living?',
    text: 'DX Living is a premium residential visualisation and immersive design service based in Victoria, Australia. It helps developers, architects, builders, and homeowners experience unbuilt homes with clarity and confidence before construction begins. Using high-fidelity 3D visualisation, BIM-linked models, interactive design tools, 4D sequencing, and virtual reality, DX Living helps remove uncertainty from the residential design and pre-construction process.',
  },
  {
    name: 'What problem does DX Living solve?',
    text: 'Residential projects often involve major decisions being made from drawings, plans, or static images. This can create uncertainty, misalignment, and costly late-stage changes. DX Living solves this by making unbuilt homes visible, walkable, and easier to understand; aligning expectations between clients, architects, builders, and developers; reducing late design changes and costly construction variations; and helping buyers and clients commit with greater confidence.',
  },
  {
    name: 'Who is DX Living designed for?',
    text: 'DX Living is designed for residential developers selling off-the-plan homes, architects presenting concepts and protecting design intent, custom and luxury builders aiming to reduce rework and misalignment, and homeowners and investors who want certainty before committing. It is best suited to high-end, architecturally driven, and detail-sensitive residential projects.',
  },
  {
    name: 'How is DX Living different from traditional 3D rendering services?',
    text: 'Traditional 3D rendering services typically deliver static images used only for presentation or marketing. DX Living delivers interactive, explorable 3D and 4D environments that show sequencing and project progression over time, real-world supplier finishes instead of generic materials, BIM-linked models that reflect build logic and sequencing, and tools that evolve throughout design, sales, planning, and client decision-making. DX Living is not just visual output, it is a decision-making system.',
  },
  {
    name: 'What services or modules does DX Living offer?',
    text: 'DX Living offers four core modules: DX Studio, DX Interiors, DX Model, and DX Prestige. Each module serves a different purpose and can be used independently or together, depending on project needs.',
  },
  {
    name: 'What is DX Studio?',
    text: 'DX Studio is the core visualisation and planning module of DX Living. It transforms drawings and BIM data into immersive 3D and 4D environments that allow stakeholders to walk through a home before it is built, understand scale, flow, and spatial relationships, review layout, proportions, and design intent, and visualise construction sequencing and project progression. DX Studio is commonly used by architects, builders, and developers during early design and planning stages.',
  },
  {
    name: 'What is DX Interiors?',
    text: 'DX Interiors focuses on real material and finish visualisation. It allows users to view real tiles, stone, cabinetry, lighting, furniture, appliances, and finishes inside the model, swap finishes and colours in real time, compare design options side by side, and connect visual selections with real product references or supplier-based selections. DX Interiors reduces guesswork and helps clients make confident design decisions earlier.',
  },
  {
    name: 'What is DX Model?',
    text: 'DX Model is an interactive presentation and sales-focused module. It is designed to support off-the-plan sales, display suite presentations, buyer walkthroughs and configuration experiences, and marketing visuals and cinematic CGI outputs. DX Model helps buyers understand what they are purchasing, supporting stronger engagement, clearer expectations, and more confident sales conversations.',
  },
  {
    name: 'What is DX Prestige?',
    text: 'DX Prestige is the highest-tier offering within DX Living. It is a unified, premium experience that combines DX Studio, DX Interiors, and DX Model into one integrated, VIP-level workflow. DX Prestige is designed for complex, high-value residential projects where clarity, quality, coordination, and presentation are critical.',
  },
  {
    name: 'What features are included in DX Prestige?',
    text: 'DX Prestige typically includes a unified platform that brings all DX Living capabilities together, high-end immersive 4D and VR visualisation, supplier-based finishes and real product references, enhanced collaboration and version comparison, curated visual storytelling and presentation outputs, and dedicated guidance and streamlined coordination for complex projects. It is often chosen for flagship developments, premium custom homes, and complex residential projects requiring a high level of clarity and presentation quality.',
  },
] as const

/** FAQ page JSON-LD (FAQPage only — Organization/WebSite live on the homepage). */
export const buildFaqPageJsonLd = (
  items?: Array<Pick<FaqItem, 'question' | 'answer'>>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const entities =
    items && items.length > 0
      ? items.map((item) => ({ name: item.question, text: item.answer }))
      : FALLBACK_FAQ_ENTITIES

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}/faq#faqpage`,
    mainEntity: entities.map((item) => ({
      '@type': 'Question',
      name: item.name,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.text,
      },
    })),
  }
}
