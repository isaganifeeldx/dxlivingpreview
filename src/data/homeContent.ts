import type { ArticleData } from '@/data/articles';
import type { FaqItem } from '@/data/faqData';
import {
  DEFAULT_SOCIAL_LINKS,
  type SocialLinks as SocialLinksData,
} from '@/lib/socialLinks';

export interface HomeSliderItem {
  heading: string;
  content: string;
  button: string;
  buttonLink: string;
}

export interface HomeCtaBlock {
  heading: string;
  content: string;
  buttonText: string;
  buttonLink: string;
}

export interface HomeComparisonBlock extends HomeCtaBlock {
  leftImage: string;
  rightImage: string;
  leftCaption: string;
  rightCaption: string;
}

export interface HomeModuleCard {
  subTitle: string;
  title: string;
  content: string;
}

export interface HomeExploreBlock {
  heading: string;
  content: string;
  modules: HomeModuleCard[];
}

export interface HomeProjectVideo {
  id: string;
  title: string;
}

export interface HomeProjectGallery {
  heading: string;
  content: string;
  videos: HomeProjectVideo[];
  buttonText: string;
  buttonLink: string;
}

export interface HomeWorkflowItem {
  title: string;
  content: string;
}

export interface HomeOptimizeBlock {
  heading: string;
  content: string;
  items: HomeWorkflowItem[];
  buttonText: string;
  buttonLink: string;
  image: string;
}

export interface HomePageContentData {
  sliderItems: HomeSliderItem[];
  socialLinks: SocialLinksData;
  interactiveButton: {
    label: string;
    link: string;
  };
  redefiningHome: HomeCtaBlock;
  bringYourDesigns: HomeComparisonBlock;
  exploreLimitless: HomeExploreBlock;
  ourProject: HomeProjectGallery;
  spaceRealisation: HomeComparisonBlock;
  optimizeDesign: HomeOptimizeBlock;
  /** Server-resolved Vimeo upload thumbnail for the hero (LCP). */
  heroPosterUrl?: string | null;
  /** FAQ items for the homepage preview (first 10 shown). */
  faqItems?: FaqItem[];
  /** Recent articles for the homepage preview. */
  articles?: ArticleData[];
}

/** Server-safe fallbacks — keep out of `'use client'` modules. */
export const FALLBACK_HOME_CONTENT: HomePageContentData = {
  sliderItems: [
    {
      heading: 'Who we are',
      content:
        'We bring your dream home to life through immersive visualisation and exceptional design.',
      button: 'Learn More',
      buttonLink: '/about',
    },
    {
      heading: 'Our Expertise',
      content:
        'Experience future living through immersive visualisation and intelligent design.',
      button: 'Learn More',
      buttonLink: '/modules',
    },
    {
      heading: 'Collaborate With Us',
      content: 'Bring your designs to life in the spaces your clients envision.',
      button: 'Learn More',
      buttonLink: '/suppliers',
    },
    {
      heading: 'Stay Informed',
      content: 'Explore the latest in high-end residential design and innovation.',
      button: 'Learn More',
      buttonLink: '/articles',
    },
  ],
  socialLinks: DEFAULT_SOCIAL_LINKS,
  interactiveButton: {
    label: 'Start Interactive',
    link: '/start-interactive',
  },
  redefiningHome: {
    heading: 'Redefining Home Building Experience',
    content:
      'Step inside lifelike digital homes where architecture, interiors, and products come together seamlessly. DX Living transforms how homes are designed, explored, and specified through immersive 3D environments.',
    buttonText: 'Learn More About Us',
    buttonLink: '/about',
  },
  bringYourDesigns: {
    heading: 'Bring your designs to life',
    content:
      'Convert elevation drawings and facade sketches into realistic exterior visuals. Review materials, proportions, and architectural character before committing with lighting and context that reflect real conditions.',
    leftImage: '/images/home/blueprint-image-op.webp',
    rightImage: '/images/home/4d-image-op.webp',
    leftCaption: 'Sketch',
    rightCaption: 'Rendered',
    buttonText: 'Check out DX Studio',
    buttonLink: '/studio',
  },
  exploreLimitless: {
    heading: 'Explore Limitless Design Potential',
    content:
      'Our intelligent modules transform how residential projects are planned and delivered, reducing ambiguity, aligning all stakeholders, and preserving design intent through every stage of the journey.',
    modules: [
      {
        subTitle: 'Home Interiors',
        title: 'Home Redesign',
        content:
          'Upload a photo of your space and reimagine the design instantly. Experiment with different interior layouts, color palettes, and decor styles while maintaining the original structure of your home.',
      },
      {
        subTitle: 'Property Exteriors',
        title: 'Exterior Transformation',
        content:
          "Upload a photo of any property to visualise curb-appeal enhancements instantly. Apply new architectural textures, landscaping styles, and outdoor finishes while maintaining the building's original structure.",
      },
      {
        subTitle: 'Project Visualisation',
        title: 'Sketch to Life',
        content:
          'Turn your 2D floor plans or 3D CAD drawings into photorealistic 4K visualisations. Instantly apply true-to-life lighting, textures, and premium materials to see your project finished before construction even begins.',
      },
      {
        subTitle: 'Plan to render',
        title: '3D Floorplan Logic',
        content:
          'Convert 2D floorplan blueprints into furnished, top-down 3D visualizations. Automatically transform room labels and door swings into realistic interior layouts.',
      },
      {
        subTitle: 'Interior styling',
        title: 'Virtual Interior Staging',
        content:
          'Transform empty rooms into beautifully staged living spaces instantly. Select your room type and furniture style, or upload reference images to achieve precise staging results tailored to your property.',
      },
      {
        subTitle: 'Supplier sourcing',
        title: 'Digital Material Library',
        content:
          'Browse an extensive catalog of real-world building materials and finishes. Access up-to-date textures, technical specs, and availability from local and international suppliers in one place.',
      },
      {
        subTitle: 'Residential master planning',
        title: 'Total Property Visualisation',
        content:
          'Transform your land survey into a comprehensive 3D master plan. Visualize the ideal placement for your home, guest house, and outbuildings to maximize land utility and privacy.',
      },
      {
        subTitle: '4D interactive tours',
        title: 'Time-Based Visualisation',
        content:
          'Experience your property across different times of day and seasons. Toggle between morning light and evening ambiance to see how natural illumination and integrated lighting systems transform the atmosphere of your home.',
      },
      {
        subTitle: 'Virtual reality',
        title: 'Guided 4D Exploration',
        content:
          "Navigate through your future residence using interactive hotspots. Zoom into specific architectural details or jump between floors to get a true sense of the property's layout before a single brick is laid.",
      },
      {
        subTitle: 'Spatial experience',
        title: 'Living Space Transitions',
        content:
          'Switch between an empty architectural shell and a fully staged interior with a single click. Understand the true scale of your rooms and visualize how different furniture layouts optimize the flow of your home.',
      },
      {
        subTitle: 'Real-time customisation',
        title: 'Dynamic Finish Explorer',
        content:
          'Change floorings, wall colors, and cabinetry finishes instantly while walking through your virtual space. Compare various material combinations in a fully rendered environment to make confident design decisions.',
      },
      {
        subTitle: 'Smart visualisation',
        title: 'Real-World Texturing',
        content:
          'Apply actual supplier-specific textures directly to your designs. See exactly how a specific stone, timber, or metal finish will look under realistic lighting conditions before placing an order.',
      },
    ],
  },
  ourProject: {
    heading: 'Our Project Gallery',
    content:
      'Explore residential spaces crafted with a focus on light, proportion, materiality, and atmosphere. From modern family homes to refined luxury interiors, this gallery helps teams align on mood and direction early.',
    videos: [
      { id: '1125050493', title: 'Brighton Smart Home Project | DX LIVING Project' },
      { id: '1125056634', title: 'Brighton Smart Home Project | DX LIVING Project' },
      { id: '1125050516', title: 'Brighton Smart Home Project | DX LIVING Project' },
      { id: '1125056466', title: 'Brighton Smart Home Project | DX LIVING Project' },
      { id: '1125050088', title: 'Brighton Smart Home Project | DX LIVING Project' },
      { id: '1125050726', title: 'Brighton Smart Home Project | DX LIVING Project' },
    ],
    buttonText: 'View More',
    buttonLink: '/projects',
  },
  spaceRealisation: {
    heading: 'Space Realisation',
    content:
      'Turn annotated floorplans into fully rendered interior views. Upload your labeled floorplan and watch as our app generates realistic visualisations with furniture and decor that match the purpose of every room.',
    leftImage: '/images/home/floorplan-op.webp',
    rightImage: '/images/home/4dinteractive-op.webp',
    leftCaption: 'Floorplan',
    rightCaption: '4D Interactive',
    buttonText: 'Check out DX Model',
    buttonLink: '/start-interactive',
  },
  optimizeDesign: {
    heading: 'Optimize Your Design Workflow',
    content:
      'Join other professionals who have revolutionised their project delivery. Create presentation-ready visuals in minutes, win more contracts, and deliver results that impress every stakeholder.',
    items: [
      {
        title: 'Secure More Projects',
        content: 'Present high-end visuals that close deals 30% faster.',
      },
      {
        title: 'Save Valuable Time',
        content: 'Replace days of manual rendering with minutes of efficient design.',
      },
      {
        title: 'No Technical Barriers',
        content:
          'App interface that makes professional-grade visualisation accessible to everyone.',
      },
      {
        title: 'Industry Standard',
        content:
          'Trusted by leading global firms and award-winning companies in the construction industry.',
      },
    ],
    buttonText: 'Book a Discovery Call',
    buttonLink: '/contact',
    image: '/images/home/workflow-image-op.webp',
  },
};
