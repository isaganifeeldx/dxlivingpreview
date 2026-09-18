import { projects } from '@/data/projects';

// Utility to extract text content from React pages for AI context
export interface PageContent {
  title: string;
  description: string;
  keyPoints: string[];
  fullText: string;
  route: string;
}

// Define page routes and their content focus
export const PAGE_ROUTES = {
  '/': 'homepage',
  '/about': 'about',
  '/contact': 'contact',
  '/studio': 'studio',
  '/prestige': 'prestige',
  '/interiors': 'interiors',
  '/model': 'model',
  '/projects': 'projects',
  '/resources': 'resources',
  '/articles': 'articles',
  '/supplier': 'supplier',
  '/suppliers': 'suppliers',
  '/apply': 'apply',
  '/modules': 'modules',
  '/start-interactive': 'start-interactive',
} as const;

export class PageContentExtractor {
  private static instance: PageContentExtractor;
  private contentCache: Map<string, PageContent> = new Map();
  private staticContentMap: Map<string, PageContent> = new Map();
  private currentPathname = '/';

  static getInstance(): PageContentExtractor {
    if (!PageContentExtractor.instance) {
      PageContentExtractor.instance = new PageContentExtractor();
    }
    return PageContentExtractor.instance;
  }

  constructor() {
    this.initializeStaticContent();
  }

  // Initialize static content mapping for each page
  private initializeStaticContent(): void {
    // About page content
    this.staticContentMap.set('/about', {
      title: 'About - DX LIVING',
      description: 'Learn about DX LIVING\'s mission to transform complex project data into clear, interactive visualizations.',
      keyPoints: [
        'DX LIVING brings renders to life, explore and style true-to-life furniture and finishes instantly',
        'We don\'t just show you what your home will look like, we let you live in it',
        'DX LIVING combines cinematic realism, intelligent modeling, and authentic materials to turn uncertainty into absolute clarity',
        'Collaborative project intelligence platform that replaces uncertainty with a single source of truth',
        'Transforms complex project data into clear, interactive visualizations and models'
      ],
      fullText: 'DX LIVING brings renders to life, explore and style true-to-life furniture and finishes instantly. We don\'t just show you what your home will look like, we let you live in it. DX Living combines cinematic realism, intelligent modeling, and authentic materials to turn uncertainty into absolute clarity. We are a collaborative project intelligence platform that replaces uncertainty with a single source of truth. We transform complex project data into clear, interactive visualizations and models, providing clarity and alignment for every stakeholder from concept to completion.',
      route: '/about'
    });

    // Contact page content
    this.staticContentMap.set('/contact', {
      title: 'Contact - DX LIVING',
      description: 'Get in touch with DX LIVING for your project visualization needs.',
      keyPoints: [
        'Contact us for project inquiries',
        'Phone: 1800 DX LIVING',
        'Email: info@dxliving.com.au',
        'Office locations across Australia',
        'Ready to collaborate on your next project'
      ],
      fullText: 'Contact DX LIVING for all your project visualization needs. Call us at 1800 DX LIVING or email info@dxliving.com.au. We have office locations across Australia and are ready to collaborate on your next project.',
      route: '/contact'
    });

    // Studio page content
    this.staticContentMap.set('/studio', {
      title: 'DX Studio - DX LIVING',
      description: 'Professional 3D visualization and photorealistic rendering services.',
      keyPoints: [
        'Professional 3D visualization services',
        'Photorealistic rendering capabilities',
        'Cinematic quality visualizations',
        'Architectural visualization expertise',
        'High-end rendering solutions'
      ],
      fullText: 'DX Studio provides professional 3D visualization and photorealistic rendering services. We specialize in cinematic quality visualizations and architectural rendering expertise, delivering high-end rendering solutions for your projects.',
      route: '/studio'
    });

    // Prestige page content
    this.staticContentMap.set('/prestige', {
      title: 'DX Prestige - DX LIVING',
      description: 'Luxury visualization services for high-end projects.',
      keyPoints: [
        'Luxury visualization services',
        'High-end project solutions',
        'Premium rendering quality',
        'Exclusive client services',
        'Bespoke visualization solutions'
      ],
      fullText: 'DX Prestige offers luxury visualization services for high-end projects. We provide premium rendering quality and exclusive client services with bespoke visualization solutions tailored to your luxury project needs.',
      route: '/prestige'
    });

    // Interiors page content
    this.staticContentMap.set('/interiors', {
      title: 'DX Interiors - DX LIVING',
      description: 'Interior design visualization and furniture integration services.',
      keyPoints: [
        'Interior design visualization',
        'Furniture and finishes integration',
        'True-to-life material representation',
        'Interactive interior design tools',
        'Style and explore interior spaces'
      ],
      fullText: 'DX Interiors specializes in interior design visualization and furniture integration services. We provide true-to-life material representation and interactive interior design tools that let you style and explore interior spaces.',
      route: '/interiors'
    });

    // Model page content
    this.staticContentMap.set('/model', {
      title: 'DX Model - DX LIVING',
      description: 'Interactive 3D models and virtual reality walkthroughs.',
      keyPoints: [
        'Interactive 3D models',
        'Virtual reality walkthroughs',
        'Immersive 4D experiences',
        'Real-time interaction capabilities',
        'Seamless supplier material integration'
      ],
      fullText: 'DX Model provides interactive 3D models and virtual reality walkthroughs. We offer immersive 4D experiences with real-time interaction capabilities and seamless supplier material integration for your projects.',
      route: '/model'
    });

    // Projects page content with actual project data
    const projectNames = projects.map(p => p.title).join(', ');
    const completedProjects = projects.filter(p => p.status === 'Completed').map(p => p.title).join(', ');
    const inProgressProjects = projects.filter(p => p.status === 'In Progress').map(p => p.title).join(', ');
    const projectTypes = [...new Set(projects.map(p => p.type))].join(', ');
    const projectLocations = [...new Set(projects.map(p => `${p.location}, ${p.state}`))].join('; ');
    
    this.staticContentMap.set('/projects', {
      title: 'Projects - DX LIVING',
      description: 'Explore our portfolio of completed visualization projects including residential and mixed-use developments across Australia.',
      keyPoints: [
        `Current projects: ${projectNames}`,
        `Completed projects: ${completedProjects}`,
        `In progress: ${inProgressProjects}`,
        `Project types: ${projectTypes}`,
        `Locations: ${projectLocations}`,
        'Featured project: 251 Station St. - A home where aesthetics and emotion intertwine',
        'Technologies used: 4D sequencing, VR flythrough, BIM modeling, Digital twin, 3D visualization, AR walkthrough'
      ],
      fullText: `Our portfolio showcases ${projects.length} projects including residential and mixed-use developments. Featured projects include 251 Station St. in Edithvale VIC (completed), 20 Head Street in Brighton NSW (in progress), 2510 St. Aidans in Kennington QLD (completed), and 387 Wattletree in Malvern East (planning). We use advanced technologies including 4D sequencing, VR flythrough, BIM modeling, digital twin, 3D visualization, and AR walkthrough. Projects span across Victoria, New South Wales, and Queensland.`,
      route: '/projects'
    });

    // Resources page content
    this.staticContentMap.set('/resources', {
      title: 'Resources - DX LIVING',
      description: 'News, journals, and resources about visualization technology.',
      keyPoints: [
        'Industry news and updates',
        'Technical journals and articles',
        'Visualization resources',
        'Industry insights and trends',
        'Educational content and guides'
      ],
      fullText: 'Access our comprehensive resources including industry news, technical journals, articles, and educational content. Stay updated with visualization technology insights and trends.',
      route: '/resources'
    });

    // Supplier page content
    this.staticContentMap.set('/supplier', {
      title: 'Suppliers - DX LIVING',
      description: 'Partner with DX Living as a supplier for material integration.',
      keyPoints: [
        'Supplier partnership opportunities',
        'Material integration services',
        'Supply chain collaboration',
        'Vendor partnership programs',
        'Material database integration'
      ],
      fullText: 'Partner with DX LIVING as a supplier for material integration. We offer supply chain collaboration, vendor partnership programs, and material database integration services.',
      route: '/supplier'
    });

    const resourcesContent = this.staticContentMap.get('/resources')!;
    this.staticContentMap.set('/articles', { ...resourcesContent, route: '/articles', title: 'Articles - DX LIVING' });

    const supplierContent = this.staticContentMap.get('/supplier')!;
    this.staticContentMap.set('/suppliers', { ...supplierContent, route: '/suppliers' });

    this.staticContentMap.set('/apply', {
      title: 'Apply - DX LIVING',
      description: 'Partnership and collaboration applications for DX LIVING.',
      keyPoints: [
        'Partnership application process',
        'Collaborate with Australia\'s premium design ecosystem',
        'Supplier, builder, and professional partnerships',
      ],
      fullText:
        'Apply to partner with DX LIVING. Join Australia\'s leading immersive design platform to connect your products, expertise, or innovations with architects, designers, and developers.',
      route: '/apply',
    });

    this.staticContentMap.set('/modules', {
      title: 'Modules - DX LIVING',
      description: 'DX Living modules for visualization and project intelligence.',
      keyPoints: [
        'DX Studio, DX Interiors, DX Model, and DX Prestige',
        'Modular tools for different project needs',
        'Scalable from concept to completion',
      ],
      fullText:
        'Explore DX Living modules including Studio for photorealistic rendering, Interiors for real-time material styling, Model for interactive walkthroughs, and Prestige for luxury projects.',
      route: '/modules',
    });
  }

  setPathname(pathname: string): void {
    this.currentPathname = pathname || '/';
  }

  private getActivePathname(): string {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return this.currentPathname;
  }

  // Extract content from the current DOM page
  extractCurrentPageContent(): PageContent | null {
    const currentPath = this.getActivePathname();
    
    // Check cache first
    if (this.contentCache.has(currentPath)) {
      return this.contentCache.get(currentPath)!;
    }

    try {
      const content = this.extractFromDOM();
      if (content) {
        this.contentCache.set(currentPath, content);
        return content;
      }
    } catch (error) {
      console.error('Error extracting page content:', error);
    }

    return null;
  }

  private extractFromDOM(): PageContent | null {
    const currentPath = window.location.pathname;
    
    // Get page title
    const title = document.title || '';
    
    // Get meta description
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    // Extract main content text
    const mainContent = this.extractMainContent();
    
    // Extract key points (headings, important paragraphs)
    const keyPoints = this.extractKeyPoints();
    
    return {
      title,
      description: metaDescription,
      keyPoints,
      fullText: mainContent,
      route: currentPath
    };
  }

  private extractMainContent(): string {
    // Target main content areas, excluding navigation, footer, etc.
    const contentSelectors = [
      '.page-content',
      'main',
      '.content',
      '[data-animation]',
      'p',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ];

    const contentTexts: string[] = [];
    
    contentSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // Skip navigation, footer, and other non-content elements
        if (this.shouldSkipElement(element)) {
          return;
        }
        
        const text = element.textContent?.trim();
        if (text && text.length > 10) { // Only include substantial text
          contentTexts.push(text);
        }
      });
    });

    // Remove duplicates and join
    const uniqueTexts = [...new Set(contentTexts)];
    return uniqueTexts.join(' ').substring(0, 2000); // Limit to 2000 chars
  }

  private extractKeyPoints(): string[] {
    const keyPoints: string[] = [];
    
    // Extract headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const text = heading.textContent?.trim();
      if (text && text.length > 5 && text.length < 100) {
        keyPoints.push(text);
      }
    });

    // Extract important paragraphs (those with specific classes or data attributes)
    const importantParagraphs = document.querySelectorAll('p[data-animation], .black, .font-semibold');
    importantParagraphs.forEach(p => {
      const text = p.textContent?.trim();
      if (text && text.length > 20 && text.length < 200) {
        keyPoints.push(text);
      }
    });

    return [...new Set(keyPoints)].slice(0, 10); // Limit to 10 key points
  }

  private shouldSkipElement(element: Element): boolean {
    const tagName = element.tagName.toLowerCase();
    const className = element.className.toLowerCase();
    
    // Skip navigation, footer, and UI elements
    const skipSelectors = [
      'nav', 'header', 'footer', 'aside',
      'script', 'style', 'noscript',
      '.navigation', '.nav', '.menu',
      '.footer', '.header', '.sidebar',
      '.chat', '.modal', '.popup',
      '.button', '.btn', '.link'
    ];

    return skipSelectors.some(selector => 
      tagName === selector || 
      className.includes(selector.replace('.', ''))
    );
  }

  // Intelligently determine which page content to fetch based on user question
  determineRelevantPageContent(userMessage: string): PageContent | null {
    const message = userMessage.toLowerCase();
    
    // Define keywords that map to specific pages
    const pageKeywords = {
      '/about': ['about', 'what is', 'who are', 'company', 'dx living', 'overview', 'mission', 'vision', 'story', 'tell me about', 'explain', 'describe'],
      '/contact': ['contact', 'phone', 'email', 'address', 'office', 'reach', 'get in touch', 'call', 'visit', 'location', 'where', 'how to contact'],
      '/studio': ['studio', 'dx studio', '3d rendering', 'photorealistic', 'visualization', 'rendering', '3d', 'cinematic'],
      '/prestige': ['prestige', 'dx prestige', 'luxury', 'high-end', 'premium', 'exclusive', 'bespoke'],
      '/interiors': ['interior', 'interiors', 'dx interiors', 'design', 'furniture', 'finishes', 'materials', 'style', 'decor'],
      '/model': ['model', 'dx model', 'interactive', 'walkthrough', 'vr', 'virtual reality', '4d', 'immersive', 'experience'],
      '/projects': ['project', 'projects', 'portfolio', 'case study', 'examples', 'work', 'showcase', 'gallery'],
      '/resources': ['resource', 'resources', 'news', 'journal', 'blog', 'insights', 'trends', 'education'],
      '/articles': ['article', 'articles', 'resource center', 'publication', 'read'],
      '/supplier': ['supplier', 'partnership', 'materials', 'vendors', 'supply chain', 'collaboration'],
      '/suppliers': ['supplier portal', 'supplier network', 'become a supplier', 'vendor'],
      '/apply': ['apply', 'application', 'partner', 'partnership application', 'collaborate'],
      '/modules': ['module', 'modules', 'dx studio', 'dx interiors', 'dx model', 'dx prestige'],
    };

    // Find the best matching page based on keywords
    let bestMatch = '';
    let maxMatches = 0;

    Object.entries(pageKeywords).forEach(([route, keywords]) => {
      const matches = keywords.filter(keyword => message.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = route;
      }
    });

    // If we found a relevant page, get its content
    if (bestMatch && maxMatches > 0) {
      return this.getContentForRoute(bestMatch);
    }

    // Fallback to current page content
    return this.extractCurrentPageContent();
  }

  // Get content for a specific route (using static content map)
  getContentForRoute(route: string): PageContent | null {
    // Check cache first
    if (this.contentCache.has(route)) {
      return this.contentCache.get(route)!;
    }

    // Get from static content map
    const staticContent = this.staticContentMap.get(route);
    if (staticContent) {
      // Cache it for future use
      this.contentCache.set(route, staticContent);
      return staticContent;
    }

    // If we're currently on the target page, extract from DOM when available
    if (this.getActivePathname() === route && typeof window !== 'undefined') {
      return this.extractCurrentPageContent();
    }

    return null;
  }

  // Get all available page content for comprehensive context
  getAllPageContent(): PageContent[] {
    const allContent: PageContent[] = [];
    
    this.staticContentMap.forEach((content) => {
      allContent.push(content);
    });

    return allContent;
  }

  // Get specific project information for detailed responses
  getProjectDetails(projectTitle?: string): string {
    if (projectTitle) {
      const project = projects.find(p => 
        p.title.toLowerCase().includes(projectTitle.toLowerCase()) ||
        projectTitle.toLowerCase().includes(p.title.toLowerCase())
      );
      
      if (project) {
        return `Project: ${project.title}
Description: ${project.description}
Location: ${project.location}, ${project.state}
Type: ${project.type}
Status: ${project.status}
Timeframe: ${project.timeframe}
Technologies: ${project.technologies}`;
      }
    }
    
    // Return summary of all projects without links in text
    const projectSummary = projects.slice(0, 5).map(p => 
      `${p.title} (${p.location}, ${p.state}) - ${p.status}`
    ).join('; ');
    
    return `Current projects include: ${projectSummary}. Total portfolio: ${projects.length} projects across residential and mixed-use developments.`;
  }

  // Get project link for specific project
  getProjectLink(projectTitle?: string): string | null {
    if (projectTitle) {
      const project = projects.find(p => 
        p.title.toLowerCase().includes(projectTitle.toLowerCase()) ||
        projectTitle.toLowerCase().includes(p.title.toLowerCase())
      );
      
      return project ? project.link : null;
    }
    
    return null;
  }

  // Clear cache when page changes
  clearCache(): void {
    this.contentCache.clear();
  }
}

// Export singleton instance
export const pageContentExtractor = PageContentExtractor.getInstance();
