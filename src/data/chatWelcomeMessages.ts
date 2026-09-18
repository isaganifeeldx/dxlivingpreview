export interface PageWelcomeMessage {
  page: string;
  welcomeMessage: string;
  followUpMessage: string;
  suggestions: string[];
}

export const pageWelcomeMessages: PageWelcomeMessage[] = [
  {
    page: "/",
    welcomeMessage: "Welcome to **DX** LIVING! We're excited to help you explore our design visualisation services and find the perfect solution for your needs.",
    followUpMessage: "Whether you're looking for 3D visualisation, VR experiences, or interactive design solutions, we're here to assist you in finding exactly what you need.",
    suggestions: ["What is DX Living?", "What makes DX Living different from other platforms?", "What advantages does DX Living offer?", "How does DX Living protect my investment as a Project Investor?", "What's included in DX Living services?", "How do I schedule a consultation?"]
  },
  {
    page: "/studio",
    welcomeMessage: "Welcome to **DX** Studio! Step into our creative space where your architectural dreams become stunning visual experiences.",
    followUpMessage: "Our studio specialises in bringing architectural and interior designs to life through cutting-edge technology and professional expertise.",
    suggestions: ["What's included in DX Studio services?", "Does DX Studio support real-time changes?", "Can DX Studio help reduce design revisions or miscommunication?"]
  },
  {
    page: "/interiors",
    welcomeMessage: "Welcome to **DX** Interiors! Create your own interior experience using real materials from trusted suppliers and see your vision come to life in realism.",
    followUpMessage: "Design and visualise your interior space in real time using authentic materials from trusted suppliers, exactly as it will appear once built.",
    suggestions: ["What makes DX Interiors different?", "Can I change materials or finishes in real time?", "Do I need to pay to use DX Interiors?"]
  },
  {
    page: "/model",
    welcomeMessage: "Welcome to **DX** Model! Bring precision and detail to your projects with **DX** Model's advanced 3D visualisation.",
    followUpMessage: "**DX** Model allows architects, designers, and developers to visualise every detail using real supplier materials, with precision that goes beyond expectation.",
    suggestions: ["What can I do with DX Model?", "How realistic are the visuals in DX Model?", "Can I share my DX Model project with clients or partners?"]
  },
  {
    page: "/prestige",
    welcomeMessage: "Welcome to **DX** Prestige! Experience our premium design visualisation services tailored for high-end projects and discerning clients.",
    followUpMessage: "Our Prestige line offers the highest quality visualisation specifically designed for luxury and high-end projects that demand excellence.",
    suggestions: ["What makes DX Prestige different from other DX Living modules?", "How does DX Prestige ensure discretion and project privacy?", "How can I apply to access DX Prestige services?"]
  },
  {
    page: "/projects",
    welcomeMessage: "Welcome to our Projects showcase! Explore the extraordinary projects we've brought to life",
    followUpMessage: "Browse through our recent work to see how we've helped clients visualise and bring their architectural and design projects to life.",
    suggestions: ["What types of residential projects does DX Living feature?", "Can I contact DX Living about creating a similar project for my own development?", "Are new projects added regularly to the showcase?"]
  },
  {
    page: "/modules",
    welcomeMessage: "Welcome to our Modules section! Discover powerful, flexible tools designed to enhance your visualisation projects.",
    followUpMessage: "Our modular system provides everything you need for successful design visualisation projects with flexible and scalable options.",
    suggestions: ["What are the different modules offered by DX Living?", "What's the main difference between DX Studio, DX Interiors, and DX Model?", "Can I upgrade from one module to another as my project grows?"]
  },
  {
    page: "/about",
    welcomeMessage: "Welcome to our About page! Learn more about **DX** LIVING, our mission, values, and our dedicated team of professionals.",
    followUpMessage: "Discover our story, values, and commitment to delivering exceptional design visualisation services and innovative solutions to our clients.",
    suggestions: ["How is DX Living different from other visualisation or design platforms?", "How does DX Living use technology to enhance home design?", "What is the mission and vision behind DX Living?"]
  },
  {
    page: "/contact",
    welcomeMessage: "Welcome to our Contact page! We're ready to turn your design concepts into reality.",
    followUpMessage: "Ready to discuss your design visualisation needs? We'd love to hear from you and help bring your vision to life.",
    suggestions: ["Can I book a demo or consultation with DX Living?", "What information should I include to help your team understand my project better?", "Who should I contact about partnership or supplier opportunities?"]
  },
  {
    page: "/articles",
    welcomeMessage: "Welcome to our Resource Center! Stay ahead with expert insights, trends, and best practices in design visualisation.",
    followUpMessage: "Stay updated with the latest trends and best practices in design visualisation through our curated articles and expert insights.",
    suggestions: ["What kind of topics does DX Living publish in its articles?", "Can I subscribe to receive updates when new articles are released?", "How can I use the insights from these articles to improve my own projects?"]
  },
  {
    page: "/suppliers",
    welcomeMessage: "Welcome to our Supplier portal! Learn about partnering with **DX** LIVING and becoming part of our trusted network of quality suppliers.",
    followUpMessage: "We work with trusted suppliers to deliver the best materials and finishes for our visualisation and maintain our high standards.",
    suggestions: ["How does DX Living integrate real supplier materials into its platform?", "Is there a cost or membership fee to become a featured supplier?", "Can I update or manage my product catalogue once integrated?"]
  },
  {
    page: "/apply",
    welcomeMessage: "Welcome to our Partnership Application page. Let's collaborate, innovate, and grow within Australia's premium design ecosystem.",
    followUpMessage: "Join us as a partner to connect your products, expertise, or innovations with Australia's leading immersive design platform.",
    suggestions: ["What kind of partnerships can I apply for with DX Living?", "How does the application process work?", "Is there a fee or agreement required after approval?"]
  },
  {
    page: "/start-interactive",
    welcomeMessage: "Welcome to our Start Interactive page! Step into the future of design visualisation with our interactive platform",
    followUpMessage: "Dive into our immersive tools and see how we can bring your design vision to life in real-time.",
    suggestions: ["Do I need to install anything to view the interactive model?", "Can I view the model on my phone or tablet?", "How do I change materials, colours, or lighting in the interactive model?"]
  },
];

export const getPageWelcomeMessage = (pathname: string): PageWelcomeMessage => {
  // Find exact match first
  const exactMatch = pageWelcomeMessages.find(msg => msg.page === pathname);
  if (exactMatch) return exactMatch;
  
  // Find partial matches for dynamic routes
  const partialMatch = pageWelcomeMessages.find(msg => 
    pathname.startsWith(msg.page) && msg.page !== "/"
  );
  if (partialMatch) return partialMatch;
  
  // Default to homepage message
  return pageWelcomeMessages.find(msg => msg.page === "/") || pageWelcomeMessages[0];
};
