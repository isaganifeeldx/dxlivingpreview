export interface ProjectVideos {
  hero: string;
  primary: string;
  galleryLeft: string;
  galleryRight: string;
  fullWidth: string;
  carousel: [string, string, string];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  timeframe: string;
  location: string;
  state: string;
  technologies: string;
  status: string;
  /** Vimeo ID for the projects listing card preview */
  video: string;
  videos: ProjectVideos;
  featuredTitle: string;
  link: string;
  type: string;
  image: string;
  images: string[];
  /** Center hero title on mobile (reference layout for select projects) */
  centerHeroOnMobile?: boolean;
  /** Right-align long technologies list in meta block */
  alignTechnologiesEnd?: boolean;
}

export const projects: Project[] = [
  {
    slug: '251-station-st',
    title: '251 Station St.',
    description:
      '251 Station St. is a home where aesthetics and emotion intertwine. Guided by natural light, organic forms, and refined materials, this space invites serenity, balance, and a deeper connection to the essential — elevating everyday living into a sensory experience beyond the visible.',
    seoTitle: '251 Station St. | DX LIVING Project',
    seoDescription:
      'Explore 251 Station St., Edithvale — a residential project with 4D sequencing and VR flythrough by DX LIVING.',
    timeframe: '3 Months',
    location: 'Edithvale',
    state: 'VIC 3196',
    technologies: '4D sequencing, VR flythrough',
    status: 'Completed',
    video: '1125754827',
    videos: {
      hero: '1117317017',
      primary: '1117005629',
      galleryLeft: '1117005664',
      galleryRight: '1117005646',
      fullWidth: '1117005687',
      carousel: ['1117005709', '1117005722', '1117005748'],
    },
    featuredTitle: '',
    link: '/projects/251-station-st',
    type: 'Residential',
    image: '/images/projects/251-station-st.jpg',
    images: ['/placeholdervid.mp4'],
  },
  {
    slug: '20-head-street',
    title: '20 Head street',
    description:
      '20 Head Street demonstrates the pinnacle of contemporary refinement, harmonizing precise geometry with organic materials. The residence establishes an undeniable connection between its meticulously defined structure and the natural setting. Oversized window systems dissolve the interior boundary, reflecting technical precision, superior quality, and enduring sophistication.',
    seoTitle: '20 Head street | DX LIVING Project',
    seoDescription:
      'A Brighton residential flythrough blending 2D SMP and 3D visuals, finished in 10 days to communicate precision, quality, and calm proportions.',
    timeframe: '10 days',
    location: 'Brighton',
    state: 'VIC',
    technologies: '2D SMP, 3D Rendering, Flythrough',
    status: 'Completed',
    video: '1125754790',
    videos: {
      hero: '1125735647',
      primary: '1125056501',
      galleryLeft: '1125056466',
      galleryRight: '1125056634',
      fullWidth: '1125056525',
      carousel: ['1125056586', '1125056484', '1125056445'],
    },
    featuredTitle: 'Brighton Home Design | DX Living Project',
    link: '/projects/20-head-street',
    type: 'Residential',
    image: '/images/projects/20-head-street.jpg',
    images: ['/placeholdervid.mp4'],
    centerHeroOnMobile: true,
    alignTechnologiesEnd: true,
  },
  {
    slug: '85-commodore-drive',
    title: '85 Commodore Drive',
    description:
      '85 Commodore Drive, Surfers Paradise exemplifies peerless coastal opulence. Its gracefully contoured facades and vast structural glass expanses integrate with the ocean panorama, eliminating the divide between residence and vista. Each component, from the fluid architectural profile to the custom amenities, is formulated to evoke calm, engagement, and a powerful sense of locale.',
    seoTitle: '85 Commodore Drive Surfers Paradise | DX LIVING Project',
    seoDescription:
      'An architectural flythrough QLD pairs 2D SMP with 3D rendering to showcase expansive glazing and serene coastal form in 1 month.',
    timeframe: '1 month',
    location: 'Surfers Paradise',
    state: 'QLD',
    technologies: '2D SMP, 3D Rendering, Flythrough',
    status: 'Completed',
    video: '1125754741',
    videos: {
      hero: '1125735703',
      primary: '1125050726',
      galleryLeft: '1125050634',
      galleryRight: '1125050461',
      fullWidth: '1125050516',
      carousel: ['1125050585', '1125050493', '1125050424'],
    },
    featuredTitle: 'Luxury Home Commodore Dr | DX Living Project',
    link: '/projects/85-commodore-drive',
    type: 'Residential',
    image: '/images/projects/251-station-st.jpg',
    images: ['/placeholdervid.mp4'],
    centerHeroOnMobile: true,
    alignTechnologiesEnd: true,
  },
  {
    slug: '813-clarendon-street',
    title: '813 CLARENDON STREET',
    description:
      '20 Head Street demonstrates the pinnacle of contemporary refinement, harmonizing precise geometry with organic materials. The residence establishes an undeniable connection between its meticulously defined structure and the natural setting. Oversized window systems dissolve the interior boundary, reflecting technical precision, superior quality, and enduring sophistication.',
    seoTitle: '813 Clarendon Street | DX LIVING Project',
    seoDescription:
      'A 4D interactive flythrough unites 2D SMP, 3D rendering and 4D methodology for 813 Clarendon Street, VIC delivered in 1 month.',
    timeframe: '1 month',
    location: 'South Melbourne',
    state: 'VIC',
    technologies: '2D SMP, 3D Rendering, Flythrough, 4D Methodology, 4D Interactive',
    status: 'Completed',
    video: '1125754762',
    videos: {
      hero: '1125063961',
      primary: '1125063991',
      galleryLeft: '1117005664',
      galleryRight: '1117005646',
      fullWidth: '1125063930',
      carousel: ['1117005709', '1117005722', '1117005748'],
    },
    featuredTitle: 'Smart Living Clarendon St | DX Living Project',
    link: '/projects/813-clarendon-street',
    type: 'Residential',
    image: '/images/projects/251-station-st.jpg',
    images: ['/placeholdervid.mp4'],
    centerHeroOnMobile: true,
    alignTechnologiesEnd: true,
  },
  {
    slug: '31-mcilwain-drive',
    title: '31 McIlwain Drive',
    description:
      '31 Mcilwain Drive occupies a privileged position overlooking the water, crafting a powerful interaction between structure and the environment. Architectural massing, textural richness, and expansive proportions generate a quiet elegance—a private sanctuary where elevated modern living meets tranquil maritime surroundings.',
    seoTitle: '31 Mcilwain Drive | DX LIVING Project',
    seoDescription:
      'Experience a 3D rendering flythrough QLD of a Mermaid Waters residence 2D SMP + 3D visuals in 1 month, revealing massing, materials and waterfront flow.',
    timeframe: '1 Month',
    location: 'Mermaid Waters',
    state: 'QLD',
    technologies: '2D SMP, 3D Rendering, Flythrough',
    status: 'Completed',
    video: '1125754812',
    videos: {
      hero: '1125735757',
      primary: '1125050113',
      galleryLeft: '1125050177',
      galleryRight: '1125050161',
      fullWidth: '1125050088',
      carousel: ['1117005709', '1117005722', '1117005748'],
    },
    featuredTitle: 'Home Design Mermaid Waters | DX Living Project',
    link: '/projects/31-mcilwain-drive',
    type: 'Residential',
    image: '/images/projects/251-station-st.jpg',
    images: ['/placeholdervid.mp4'],
    centerHeroOnMobile: true,
    alignTechnologiesEnd: true,
  },
  {
    slug: 'nagambie-project',
    title: 'Nagambie Project',
    description:
      'The Nagambie Project embodies a sophisticated synthesis of elemental shapes and technical exactitude, forging an indelible bond with its landscape. Its remarkable oxidized metallic cladding and vast fenestration expertly capture scenic outlooks, merging the exterior into the primary living volume. This is a residence where exceptional materials and deliberate composition converge, yielding an immersive, understated, lavish haven.',
    seoTitle: 'Nagambie Project | DX LIVING Project',
    seoDescription:
      'A Nagambie project flythrough blends 2D SMP and 3D visuals in 1 month, capturing elemental forms, metal patina and immersive interior exterior flow.',
    timeframe: '1 month',
    location: 'Nagambie',
    state: 'VIC',
    technologies: '2D SMP, 3D Rendering, Flythrough',
    status: 'Completed',
    video: '1125754661',
    videos: {
      hero: '1125735521',
      primary: '1125063868',
      galleryLeft: '1125063843',
      galleryRight: '1125063766',
      fullWidth: '1125063819',
      carousel: ['1117005709', '1117005722', '1117005748'],
    },
    featuredTitle: 'Nagambie Home Design | DX Living Project',
    link: '/projects/nagambie-project',
    type: 'Residential',
    image: '/images/projects/251-station-st.jpg',
    images: ['/placeholdervid.mp4'],
    centerHeroOnMobile: true,
    alignTechnologiesEnd: true,
  },
];

export const getProjectBySlug = (slug: string) => projects.find((project) => project.slug === slug);

export const getProjectPath = (slug: string) => `/projects/${slug}`;
