import { 
  ChatData, 
  ChatResponse, 
  ChatMessage, 
  ConversationContext, 
  UserPreferences, 
  Emotion,
  ResponseTemplate,
  ProjectLink
} from '@/types/chat';
import { chatData, dynamicContent } from '@/data/chatData';
import { ClaudeApiService } from '@/lib/chat/claudeServer';
import { pageContentExtractor } from '@/lib/chat/pageContentExtractor';
import { projects } from '@/data/projects';

// Define PageContent interface locally to avoid import issues
interface PageContent {
  title: string;
  description: string;
  keyPoints: string[];
  fullText: string;
  route: string;
}

class NaturalLanguageGenerator {
  addNaturalPatterns(response: string): string {
    // Add professional contractions naturally
    response = response.replace(/I would/g, "I'd");
    response = response.replace(/we are/g, "we're");
    response = response.replace(/it is/g, "it's");
    response = response.replace(/that is/g, "that's");
    response = response.replace(/you are/g, "you're");
    response = response.replace(/they are/g, "they're");
    
    // Add natural conversational elements
    response = this.addConversationalElements(response);
    
    // Add professional emphasis naturally
    response = this.addProfessionalEmphasis(response);
    
    return response;
  }
  
  private addConversationalElements(response: string): string {
    // Add natural thinking expressions occasionally
    if (Math.random() < 0.1) {
      const thinkingPhrases = [
        "Let me think about that... ",
        "That's a great question! ",
        "I'm glad you asked! ",
        "Absolutely! ",
        "Of course! "
      ];
      response = thinkingPhrases[Math.floor(Math.random() * thinkingPhrases.length)] + response;
    }
    
    // Add natural transitions for longer responses
    if (response.length > 150 && Math.random() < 0.15) {
      const transitions = [
        "Here's what I can tell you: ",
        "Let me break that down for you: ",
        "I'd be happy to explain: ",
        "Here's the thing: "
      ];
      response = transitions[Math.floor(Math.random() * transitions.length)] + response;
    }
    
    return response;
  }
  
  private addProfessionalEmphasis(response: string): string {
    // Add emphasis only when it enhances clarity, not randomly
    if (response.includes("important") && Math.random() < 0.2) {
      response = response.replace("important", `particularly important`);
    }
    
    if (response.includes("quality") && Math.random() < 0.2) {
      response = response.replace("quality", `exceptional quality`);
    }
    
    if (response.includes("help") && Math.random() < 0.2) {
      response = response.replace("help", `really help`);
    }
    
    return response;
  }
}

class EmotionalAgent {
  detectUserEmotion(message: string): Emotion {
    const positiveWords = ["great", "awesome", "love", "excited", "amazing", "fantastic", "wonderful", "perfect", "excellent", "brilliant"];
    const negativeWords = ["frustrated", "confused", "help", "problem", "issue", "difficult", "stuck", "wrong", "error", "trouble", "worried"];
    const urgentWords = ["urgent", "asap", "quickly", "immediately", "fast", "rush", "emergency", "critical"];
    
    const words = message.toLowerCase().split(/\s+/);
    
    if (words.some(w => urgentWords.includes(w))) return 'urgent';
    if (words.some(w => negativeWords.includes(w))) return 'concerned';
    if (words.some(w => positiveWords.includes(w))) return 'positive';
    
    return 'neutral';
  }
  
  adjustResponseForEmotion(response: string, emotion: Emotion): string {
    switch (emotion) {
      case 'urgent':
        return `I can see this is really important to you. ${response} Let me make sure we get this sorted out quickly for you.`;
      
      case 'concerned':
        return `I totally understand your concern. ${response} Don't worry - I'm here to help make this clearer and get you the support you need.`;
      
      case 'positive':
        return `That's fantastic to hear! ${response} I'm really excited to help you explore this further.`;
      
      default:
        return response;
    }
  }
}

class ContextualAgent {
  private conversationHistory: ChatMessage[] = [];
  
  analyzeContext(): ConversationContext {
    const lastMessages = this.conversationHistory.slice(-3);
    
    return {
      isFollowUp: lastMessages.some(m => 
        m.content.includes('more') || 
        m.content.includes('tell me') || 
        m.content.includes('also') ||
        m.content.includes('what else')
      ),
      userSeemsFrustrated: lastMessages.some(m => 
        m.content.includes('help') || 
        m.content.includes('confused') || 
        m.content.includes('?') ||
        m.content.includes('dont understand')
      ),
      userIsNew: this.conversationHistory.length < 3,
      currentTopic: this.extractCurrentTopic(lastMessages)
    };
  }
  
  private extractCurrentTopic(messages: ChatMessage[]): string | undefined {
    const lastBotMessage = messages.filter(m => m.role === 'bot').pop();
    return lastBotMessage?.category;
  }
  
  makeFollowUpResponse(response: string, context: ConversationContext): string {
    if (!context.isFollowUp) return response;
    
    // Only add follow-up phrases for longer responses that need structure
    if (response.length > 120) {
      const followUpPhrases = [
        "Let me tell you more about that ",
        "Here's what else you should know ",
        "I'd be happy to expand on that, ",
        "Also worth mentioning ",
        "Another thing to consider: "
      ];
      
      return followUpPhrases[Math.floor(Math.random() * followUpPhrases.length)] + response;
    }
    
    return response;
  }
  
  addEmpathy(response: string, context: ConversationContext): string {
    if (!context.userSeemsFrustrated) return response;
    
    // Only add empathy for genuinely concerned users, not randomly
    const empathyPhrases = [
      "I totally get it - that can be confusing. ",
      "No worries at all! ",
      "I completely understand your concern. ",
      "That's totally understandable. ",
      "I can see why that might be unclear. "
    ];
    
    return empathyPhrases[Math.floor(Math.random() * empathyPhrases.length)] + response;
  }
  
  addWelcomeTone(response: string, context: ConversationContext): string {
    if (!context.userIsNew) return response;
    
    // Only add welcome tone for first-time users, and only occasionally
    if (Math.random() < 0.3) {
      const welcomePhrases = [
        "Hi there! Welcome to DX LIVING. ",
        "Great to have you here! ",
        "Thanks for stopping by! ",
        "Welcome! I'm here to help. "
      ];
      
      return welcomePhrases[Math.floor(Math.random() * welcomePhrases.length)] + response;
    }
    
    return response;
  }
  
  updateHistory(message: ChatMessage): void {
    this.conversationHistory.push(message);
    // Keep only last 10 messages for context
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }
  }
}

export class HumanLikeChatAgent {
  private qaData: ChatData[];
  private naturalGenerator = new NaturalLanguageGenerator();
  private emotionalAgent = new EmotionalAgent();
  private contextualAgent = new ContextualAgent();
  private userPreferences: UserPreferences = {};
  private claudeService: ClaudeApiService;
  private useClaudeForComplex: boolean = true;
  
  constructor(data: ChatData[] = chatData) {
    this.qaData = data;
    this.claudeService = new ClaudeApiService();
  }
  
  async findResponse(userMessage: string): Promise<ChatResponse> {
    console.log('🔍 Processing message:', userMessage);
    console.log('🤖 Claude configured:', this.claudeService.isConfigured());
    
    // Always use Claude AI for responses, with chatData as context
    if (this.claudeService.isConfigured()) {
      console.log('🚀 Using Claude AI with chatData context...');
      try {
        const claudeResponse = await this.getClaudeResponseWithContext(userMessage);
        console.log('✅ Claude response received');
        return claudeResponse;
      } catch (error) {
        console.warn('❌ Claude API failed, using fallback:', error);
        return this.getFallbackResponse(userMessage);
      }
    } else {
      console.log('⚠️ Claude not available, using fallback');
      return this.getFallbackResponse(userMessage);
    }
  }
  
  private findBestMatch(userMessage: string): ChatData | null {
    // Try exact match first
    let match = this.exactMatch(userMessage);
    if (match) return match;
    
    // Try keyword matching
    match = this.keywordMatch(userMessage);
    if (match) return match;
    
    // Try fuzzy matching
    match = this.fuzzyMatch(userMessage);
    if (match) return match;
    
    return null;
  }

  private exactMatch(message: string): ChatData | null {
    // First try exact match
    let match = this.qaData.find(item => 
      item.question.toLowerCase() === message.toLowerCase()
    );
    
    if (match) return match;
    
    // Try normalized match (without punctuation)
    const normalizedMessage = message.toLowerCase().replace(/[?.,!]/g, '').trim();
    match = this.qaData.find(item => 
      item.question.toLowerCase().replace(/[?.,!]/g, '').trim() === normalizedMessage
    );
    
    return match || null;
  }
  
  private keywordMatch(message: string): ChatData | null {
    const userWords = message.toLowerCase().split(/\s+/);
    
    // Remove question marks and normalize the message for better matching
    const normalizedMessage = message.toLowerCase().replace(/[?.,!]/g, '').trim();
    const normalizedWords = normalizedMessage.split(/\s+/);
    
    // Score each Q&A entry
    const scored = this.qaData.map(item => ({
      item,
      score: this.calculateScore(userWords, item.keywords),
      normalizedScore: this.calculateScore(normalizedWords, item.keywords)
    }));
    
    // Use the higher score between original and normalized
    const finalScored = scored.map(s => ({
      ...s,
      finalScore: Math.max(s.score, s.normalizedScore)
    }));
    
    // Return highest scoring match above threshold
    const bestMatch = finalScored
      .filter(s => s.finalScore > 0.2) // Lowered threshold for better matching
      .sort((a, b) => b.finalScore - a.finalScore)[0];
    
    return bestMatch?.item || null;
  }
  
  private calculateScore(userWords: string[], keywords: string[]): number {
    let score = 0;
    let exactMatches = 0;
    
    userWords.forEach(userWord => {
      keywords.forEach(keyword => {
        // Exact match gets higher score
        if (userWord === keyword) {
          score += 2;
          exactMatches++;
        }
        // Partial match gets lower score
        else if (userWord.includes(keyword) || keyword.includes(userWord)) {
          score += 1;
        }
      });
    });
    
    // Bonus for multiple exact matches
    if (exactMatches > 1) {
      score += exactMatches * 0.5;
    }
    
    return score / keywords.length; // Normalize score
  }
  
  private fuzzyMatch(message: string): ChatData | null {
    const userWords = message.toLowerCase().split(/\s+/);
    const normalizedMessage = message.toLowerCase().replace(/[?.,!]/g, '').trim();
    const normalizedWords = normalizedMessage.split(/\s+/);
    
    // Try with original words first
    for (const item of this.qaData) {
      for (const keyword of item.keywords) {
        for (const userWord of userWords) {
          if (this.calculateSimilarity(userWord, keyword) > 0.7) {
            return item;
          }
        }
      }
    }
    
    // Try with normalized words
    for (const item of this.qaData) {
      for (const keyword of item.keywords) {
        for (const userWord of normalizedWords) {
          if (this.calculateSimilarity(userWord, keyword) > 0.7) {
            return item;
          }
        }
      }
    }
    
    return null;
  }
  
  private calculateSimilarity(word1: string, word2: string): number {
    const longer = word1.length > word2.length ? word1 : word2;
    const shorter = word1.length > word2.length ? word2 : word1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }
  
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  private formatResponse(data: ChatData, userMessage: string): ChatResponse {
    // Detect user emotion
    const emotion = this.emotionalAgent.detectUserEmotion(userMessage);
    
    // Analyze conversation context
    const context = this.contextualAgent.analyzeContext();
    
    // Select appropriate template based on tone preference or random selection
    const template = this.selectTemplate(data.responseTemplates, userMessage);
    
    // Generate base response
    let response = this.fillTemplate(template.template, data);
    
    // Apply contextual adjustments more carefully
    response = this.applyContextualAdjustments(response, context, emotion);
    
    // Add natural language patterns
    response = this.naturalGenerator.addNaturalPatterns(response);
    
    // Add page link if available
    if (data.pageLink) {
      response += this.addPageLink(data.pageLink);
    }
    
    return {
      answer: response,
      pageLink: data.pageLink,
      suggestions: data.suggestions,
      category: data.category
    };
  }
  
  private applyContextualAdjustments(response: string, context: ConversationContext, emotion: Emotion): string {
    // Apply adjustments more selectively and naturally
    
    // Only add empathy for genuinely concerned users
    if (context.userSeemsFrustrated && emotion === 'concerned') {
      response = this.contextualAgent.addEmpathy(response, context);
    }
    
    // Only add welcome tone for new users, and only occasionally
    if (context.userIsNew && Math.random() < 0.2) {
      response = this.contextualAgent.addWelcomeTone(response, context);
    }
    
    // Only add follow-up phrases for longer responses that need structure
    if (context.isFollowUp && response.length > 120) {
      response = this.contextualAgent.makeFollowUpResponse(response, context);
    }
    
    // Apply emotional adjustments naturally
    response = this.emotionalAgent.adjustResponseForEmotion(response, emotion);
    
    return response;
  }
  
  private selectTemplate(templates: ResponseTemplate[], userMessage: string): ResponseTemplate {
    // If user has a preferred tone, try to use it
    if (this.userPreferences.preferredTone) {
      const preferredTemplate = templates.find(t => t.tone === this.userPreferences.preferredTone);
      if (preferredTemplate) return preferredTemplate;
    }
    
    // Otherwise, select randomly for variety
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  private fillTemplate(template: string, data: ChatData): string {
    let response = template;
    
    // Replace placeholders with dynamic content
    Object.entries(dynamicContent).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      response = response.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return response;
  }

  private replaceDynamicContentPlaceholders(response: string): string {
    let processedResponse = response;
    
    // Replace [placeholder] syntax with actual dynamic content
    Object.entries(dynamicContent).forEach(([key, value]) => {
      // Handle various placeholder formats that AI might generate
      const patterns = [
        `[${key}]`,
        `[${key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}]`, // Convert camelCase to readable
        `[${key.replace(/([A-Z])/g, ' $1').toLowerCase().trim().replace(/\s+/g, '-')}]`, // Convert to kebab-case
        `[${key.replace(/([A-Z])/g, ' $1').toLowerCase().trim().replace(/\s+/g, '_')}]`, // Convert to snake_case
      ];
      
      patterns.forEach(pattern => {
        // Escape special regex characters in the pattern
        const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        processedResponse = processedResponse.replace(new RegExp(escapedPattern, 'gi'), value);
      });
    });
    
    return processedResponse;
  }
  
  private addPersonalityTouches(response: string, userMessage: string): string {
    // Add professional personality touches very sparingly and only when appropriate
    if (Math.random() < 0.02) { // Reduced from 5% to 2%
      const professionalTouches = [
        " We're committed to delivering excellence in every project.",
        " Our team takes pride in exceeding client expectations."
      ];
      response += professionalTouches[Math.floor(Math.random() * professionalTouches.length)];
    }
    
    return response;
  }
  
  private addPageLink(pageLink: string): string {
    const linkPhrases = [
      ` Feel free to check out our ${pageLink.replace('/', '')} page for more details!`,
      ` You can find more information on our ${pageLink.replace('/', '')} section.`,
      ` Take a look at our ${pageLink.replace('/', '')} page - there's lots more to explore!`,
      ` Head over to our ${pageLink.replace('/', '')} section to dive deeper into this topic.`
    ];
    
    return linkPhrases[Math.floor(Math.random() * linkPhrases.length)];
  }
  
  private getFallbackResponse(userMessage: string): ChatResponse {
    const match = this.findBestMatch(userMessage);
    if (match) {
      return this.formatResponse(match, userMessage);
    }

    const fallbackResponses = [
      "Hmm, that's a great question! I don't have specific information about that particular topic, but I'd love to help you with information about our services, projects, or how to connect with our team.",
      "That's an interesting one! While I might not have all the details on that specific topic, I can definitely help you with information about our design services, recent projects, or how to get in touch with us.",
      "Good question! I don't have specific information about that particular aspect, but I'd be happy to help you with details about our services, project examples, or how to reach our team.",
      "That's a thoughtful question! While I may not have all the details on that specific topic, I can definitely provide information about our services, portfolio, or how to connect with our team.",
    ];

    const suggestions = [
      'What is DX Living?',
      'What services do you offer?',
      'Show me your projects',
      'How can I contact you?',
    ];

    return {
      answer: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      suggestions,
      category: 'general',
    };
  }
  
  updateUserPreferences(preferences: Partial<UserPreferences>): void {
    this.userPreferences = { ...this.userPreferences, ...preferences };
  }
  
  updateConversationHistory(message: ChatMessage): void {
    this.contextualAgent.updateHistory(message);
  }

  private shouldUseClaudeForShortMessage(message: string): boolean {
    const trimmedMessage = message.trim().toLowerCase();
    
    // Very short messages (1-2 words) but exclude specific DX LIVING questions
    if (trimmedMessage.split(/\s+/).length <= 2) {
      // Don't treat specific DX Living questions as casual
      const specificQuestions = [
        'what is dx living', 'what are dx living', 'how does dx living',
        'who is dx living', 'when does dx living', 'where is dx living'
      ];
      
      if (specificQuestions.some(q => trimmedMessage.includes(q))) {
        return false;
      }
      
      return true;
    }
    
    // Casual greetings and short phrases
    const casualPhrases = [
      'hi', 'hello', 'hey', 'hi there', 'hello there', 'good morning', 'good afternoon', 
      'good evening', 'thanks', 'thank you', 'bye', 'goodbye', 'see you', 'ok', 'okay',
      'yes', 'no', 'sure', 'maybe'
    ];
    
    return casualPhrases.some(phrase => 
      trimmedMessage === phrase || 
      trimmedMessage.startsWith(phrase + ' ') || 
      trimmedMessage.endsWith(' ' + phrase)
    );
  }

  private async getClaudeResponseWithContext(userMessage: string): Promise<ChatResponse> {
    // Get conversation history for context
    const conversationHistory = this.contextualAgent['conversationHistory'];
    
    // Convert to Claude format
    const claudeMessages = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

    // Add current user message
    claudeMessages.push({
      role: 'user' as const,
      content: userMessage
    });

    // Find the best matching chatData entry for context
    const bestMatch = this.findBestMatch(userMessage);
    
    // Intelligently determine which page content to include based on user question
    const relevantPageContent = pageContentExtractor.determineRelevantPageContent(userMessage);
    
    // Check if user is asking about specific projects
    const projectDetails = this.extractProjectDetails(userMessage, relevantPageContent);
    const projectLink = this.extractProjectLink(userMessage);
    
    // Create enhanced system prompt with chatData context and relevant page content
    const enhancedSystemPrompt = this.createEnhancedSystemPrompt(relevantPageContent, projectDetails);

    // Get Claude's response
    const claudeResponse = await this.claudeService.sendMessage(claudeMessages, enhancedSystemPrompt);
    
    // Replace dynamic content placeholders in the response
    const processedResponse = this.replaceDynamicContentPlaceholders(claudeResponse.content);
    
    // Generate suggestions based on the response and best match
    const suggestions = this.generateSuggestionsFromResponse(processedResponse, bestMatch);

    // Determine the most appropriate page link based on response content and relevant page
    const appropriatePageLink = this.determineAppropriatePageLink(processedResponse, bestMatch, relevantPageContent, projectLink);
    
    // Generate contextual button text based on the response and link
    const contextualButtonText = this.generateContextualButtonText(processedResponse, appropriatePageLink, projectLink);

    // Extract project links from the response
    const projectLinks = this.extractProjectLinksFromResponse(processedResponse, userMessage);

    // If we have multiple specific links (services), don't show a generic pageLink
    // Only show a single pageLink if there are no specific links found
    const shouldShowSingleLink = projectLinks.length === 0;

    return {
      answer: processedResponse,
      pageLink: shouldShowSingleLink ? appropriatePageLink : undefined,
      buttonText: shouldShowSingleLink ? contextualButtonText : undefined,
      projectLinks: projectLinks.length > 0 ? projectLinks : undefined,
      suggestions: suggestions,
      category: bestMatch?.category || 'ai-generated'
    };
  }

  private extractProjectDetails(userMessage: string, relevantPageContent?: PageContent | null): string {
    const message = userMessage.toLowerCase();
    
    // Check if user is asking about projects
    if (message.includes('project') || message.includes('portfolio') || message.includes('251 station') || 
        message.includes('head street') || message.includes('aidans') || message.includes('wattletree') ||
        message.includes('link') || message.includes('url') || message.includes('view')) {
      
      // Check for specific project mentions
      if (message.includes('251 station') || message.includes('station st')) {
        return pageContentExtractor.getProjectDetails('251 Station St.');
      } else if (message.includes('head street') || message.includes('20 head')) {
        return pageContentExtractor.getProjectDetails('20 Head street');
      } else if (message.includes('aidans') || message.includes('2510')) {
        return pageContentExtractor.getProjectDetails('2510 st. aidans');
      } else if (message.includes('wattletree') || message.includes('387')) {
        return pageContentExtractor.getProjectDetails('387 wattletree');
      } else {
        // General project information
        return pageContentExtractor.getProjectDetails();
      }
    }
    
    return '';
  }

  private extractProjectLink(userMessage: string): string | null {
    const message = userMessage.toLowerCase();
    
    // Check for specific project mentions and return their links
    if (message.includes('251 station') || message.includes('station st')) {
      return pageContentExtractor.getProjectLink('251 Station St.');
    } else if (message.includes('head street') || message.includes('20 head')) {
      return pageContentExtractor.getProjectLink('20 Head street');
    } else if (message.includes('aidans') || message.includes('2510')) {
      return pageContentExtractor.getProjectLink('2510 st. aidans');
    } else if (message.includes('wattletree') || message.includes('387')) {
      return pageContentExtractor.getProjectLink('387 wattletree');
    }
    
    return null;
  }

  private extractProjectLinksFromResponse(response: string, userMessage: string): ProjectLink[] {
    const responseLower = response.toLowerCase();
    const messageLower = userMessage.toLowerCase();
    
    const pageLinks: ProjectLink[] = [];
    
    // Define all pages and their keywords
    const pageKeywords: {[key: string]: string[]} = {
      '/studio': ['dx studio', 'studio'],
      '/prestige': ['dx prestige', 'prestige'],
      '/interiors': ['dx interior', 'interior', 'dx interiors'],
      '/model': ['dx model', 'model'],
      '/projects': ['projects', 'portfolio'],
      '/about': ['about', 'who we are'],
      '/contact': ['contact', 'phone', 'email', 'address', 'office']
    };
    
    // Check if the response mentions multiple projects or asks about all projects
    const isGeneralProjectQuery = messageLower.includes('projects') || 
                                  messageLower.includes('portfolio') || 
                                  messageLower.includes('what projects') ||
                                  messageLower.includes('show projects') ||
                                  messageLower.includes('completed projects') ||
                                  responseLower.includes('projects such as') ||
                                  responseLower.includes('include');
    
    if (isGeneralProjectQuery) {
      // Extract all projects and create links
      projects.forEach(project => {
        pageLinks.push({
          url: project.link,
          text: `View ${project.title} →`
        });
      });
    } else {
      // Check for specific project mentions
      projects.forEach(project => {
        const projectTitleLower = project.title.toLowerCase();
        
        // Check if this project is mentioned in the response or user message
        if (responseLower.includes(projectTitleLower) || 
            messageLower.includes(projectTitleLower)) {
          pageLinks.push({
            url: project.link,
            text: `View ${project.title} →`
          });
        }
      });
    }
    
    // Extract page links for services and other pages
    Object.keys(pageKeywords).forEach(path => {
      const keywords = pageKeywords[path];
      
      // Check if any keyword is mentioned in the response
      const isMentioned = keywords.some(keyword => 
        responseLower.includes(keyword) || messageLower.includes(keyword)
      );
      
      if (isMentioned) {
        // Only add if not already added (avoid duplicates)
        const isDuplicate = pageLinks.some(link => link.url === path);
        
        // Skip /projects if we're handling it separately, OR if we have specific service links
        const hasServiceLinks = pageLinks.some(link => 
          link.url === '/studio' || link.url === '/prestige' || 
          link.url === '/interiors' || link.url === '/model'
        );
        
        if (!isDuplicate && path !== '/projects') { // Exclude /projects as it's handled separately
          pageLinks.push({
            url: path,
            text: path === '/studio' ? 'Explore DX Studio →' :
                  path === '/prestige' ? 'Discover DX Prestige →' :
                  path === '/interiors' ? 'View DX Interiors →' :
                  path === '/model' ? 'Try DX Model →' :
                  path === '/about' ? 'Learn About Us →' :
                  path === '/contact' ? 'Contact Us →' :
                  'Learn More →'
          });
        }
      }
    });
    
    return pageLinks;
  }

  private generateContextualButtonText(response: string, pageLink?: string, projectLink?: string | null): string | undefined {
    if (!pageLink) return undefined;
    
    const responseLower = response.toLowerCase();
    
    // Project-specific button text
    if (projectLink) {
      if (responseLower.includes('251 station') || responseLower.includes('station st')) {
        return 'View 251 Station St →';
      } else if (responseLower.includes('head street') || responseLower.includes('20 head')) {
        return 'View 20 Head Street →';
      } else if (responseLower.includes('aidans') || responseLower.includes('2510')) {
        return 'View 2510 St. Aidans →';
      } else if (responseLower.includes('wattletree') || responseLower.includes('387')) {
        return 'View 387 Wattletree →';
      } else {
        return 'View Project →';
      }
    }
    
    // Page-specific button text
    switch (pageLink) {
      case '/about':
        return 'Learn About Us →';
      case '/contact':
        return 'Contact Us →';
      case '/studio':
        return 'Explore DX Studio →';
      case '/prestige':
        return 'Discover DX Prestige →';
      case '/interiors':
        return 'View DX Interiors →';
      case '/model':
        return 'Try DX Model →';
      case '/projects':
        return 'View All Projects →';
      case '/resources':
        return 'Browse Resources →';
      case '/supplier':
        return 'Partner With Us →';
      default:
        return 'Learn More →';
    }
  }

  private createEnhancedSystemPrompt(relevantPageContent?: PageContent | null, projectDetails?: string): string {
    // Extract relevant information from chatData including response templates
    const chatDataContext = this.qaData.map(item => ({
      question: item.question,
      keywords: item.keywords.join(', '),
      category: item.category,
      templates: item.responseTemplates.map(t => t.template).join(' | ')
    }));

    const contextString = chatDataContext.map(item => 
      `- ${item.question} (Keywords: ${item.keywords})
    Template Examples: ${item.templates}`
    ).join('\n');

    // Create dynamic content reference
    const dynamicContentString = Object.entries(dynamicContent).map(([key, value]) => 
      `- ${key}: ${value}`
    ).join('\n');

    // Get current page content for additional context
    const currentPageContent = pageContentExtractor.extractCurrentPageContent();
    const currentPageString = currentPageContent ? 
      `\n\nCURRENT PAGE CONTEXT (${currentPageContent.route}):
Title: ${currentPageContent.title}
Description: ${currentPageContent.description}
Key Points: ${currentPageContent.keyPoints.join(' | ')}
Main Content: ${currentPageContent.fullText.substring(0, 500)}...` : '';

    // Add relevant page content if different from current page
    const relevantPageString = relevantPageContent && relevantPageContent.route !== currentPageContent?.route ? 
      `\n\nRELEVANT PAGE CONTEXT (${relevantPageContent.route}):
Title: ${relevantPageContent.title}
Description: ${relevantPageContent.description}
Key Points: ${relevantPageContent.keyPoints.join(' | ')}
Main Content: ${relevantPageContent.fullText.substring(0, 500)}...` : '';

    // Add project details if available
    const projectDetailsString = projectDetails ? 
      `\n\nSPECIFIC PROJECT INFORMATION:
${projectDetails}` : '';

    return `You are a helpful AI assistant for DX LIVING, a collaborative project intelligence platform that replaces uncertainty with a single source of truth. 

DX LIVING transforms complex project data into clear, interactive visualizations and models, providing clarity and alignment for every stakeholder from concept to completion.

Key information about DX LIVING:
- We specialize in 3D visualization, virtual reality walkthroughs, interactive design solutions, and architectural rendering
- Our platform helps architects, designers, developers, custom builders, homeowners, and project investors
- We offer modules for different aspects of project visualization and management
- Our services include photorealistic 3D renders, VR experiences, and interactive design tools

Available Q&A Context with Response Templates:
${contextString}

Dynamic Content Information (use these exact values when mentioning contact details, services, etc.):
${dynamicContentString}${currentPageString}${relevantPageString}${projectDetailsString}

CRITICAL GUIDELINES:
1. ALWAYS base your response on the provided template examples above
2. Use the template content as your foundation but rephrase it naturally
3. Maintain the core message and key points from the templates
4. Keep responses concise and to the point (2-3 sentences maximum unless user specifically asks for more detail)
5. Use clear, simple language that anyone can understand
6. Structure responses with proper formatting using line breaks for readability
7. Always end with a helpful question or suggestion to keep the conversation flowing
8. Avoid adding information not present in the templates
9. Stay consistent with DX LIVING's established messaging
10. When mentioning contact information, services, or other specific details, use the exact values from the Dynamic Content Information above
11. NEVER include raw URLs or links in your response text - the system will handle links automatically
12. When mentioning projects, describe them naturally without including "/projects/..." links in the text
13. Focus on providing helpful information - links will be provided as buttons automatically
14. When listing multiple projects, mention them by their names (e.g., "251 Station St.", "20 Head Street", "85 Commodore Drive", etc.) - the system will automatically detect these and create clickable links
15. When mentioning services (DX Studio, DX Prestige, DX Interior, DX Model, About, Contact), mention them naturally in your response - the system will automatically create clickable links for each mentioned service/page
16. When mentioning DX Living, use the exact name **DX** LIVING in bold (use markdown format with ** for bold text)
17. When mentioning the titles, items, benefits, features, etc. use ":" before the title do not use "-" on the response

Response Format:
- Use line breaks to separate key points
- Keep paragraphs short (1-2 sentences)
- Use bullet points or numbered lists when appropriate
- Make responses scannable and easy to read

Remember: You're representing DX LIVING and should always be helpful, knowledgeable, and professional. Base your responses on the provided templates to ensure consistency and minimize confusion.`;
  }

  private determineAppropriatePageLink(response: string, bestMatch?: ChatData | null, relevantPageContent?: PageContent | null, projectLink?: string | null): string | undefined {
    // If we have a specific project link, prioritize it
    if (projectLink) {
      return projectLink;
    }

    // If we have relevant page content, prioritize its link
    if (relevantPageContent) {
      return relevantPageContent.route;
    }

    // If we have a best match with a page link, use it as the default
    let pageLink = bestMatch?.pageLink;
    
    // Analyze the response content to determine if a different page link would be more appropriate
    const responseLower = response.toLowerCase();
    
    // Contact/Office related content should link to contact page
    if (responseLower.includes('contact') || 
        responseLower.includes('phone') || 
        responseLower.includes('email') || 
        responseLower.includes('office') || 
        responseLower.includes('address') || 
        responseLower.includes('1800') ||
        responseLower.includes('info@dxliving.com.au')) {
      pageLink = '/contact';
    }
    
    // Service related content should link to appropriate service pages
    else if (responseLower.includes('studio') && !responseLower.includes('prestige')) {
      pageLink = '/studio';
    }
    else if (responseLower.includes('prestige')) {
      pageLink = '/prestige';
    }
    else if (responseLower.includes('interior')) {
      pageLink = '/interiors';
    }
    else if (responseLower.includes('model')) {
      pageLink = '/model';
    }
    
    // Project related content should link to projects page
    else if (responseLower.includes('project') || 
             responseLower.includes('portfolio') || 
             responseLower.includes('251 station') ||
             responseLower.includes('victoria parade')) {
      pageLink = '/projects';
    }
    
    // About/company information should link to about page
    else if (responseLower.includes('about') || 
             responseLower.includes('company') || 
             responseLower.includes('dx living') ||
             responseLower.includes('who we are')) {
      pageLink = '/about';
    }
    
    return pageLink;
  }

  private generateSuggestionsFromResponse(response: string, bestMatch?: ChatData | null): string[] {
    // Start with suggestions from the best match if available
    let suggestions: string[] = [];
    
    if (bestMatch && bestMatch.suggestions) {
      suggestions = [...bestMatch.suggestions];
    }
    
    // Add contextual suggestions based on the AI response
    const contextualSuggestions = [
      "Tell me more about that",
      "What are the next steps?",
      "How can I get started?",
      "How can I contact you?"
    ];
    
    // Add specific suggestions based on response content
    if (response.toLowerCase().includes('service')) {
      contextualSuggestions.push("What services do you offer?");
    }
    if (response.toLowerCase().includes('project')) {
      contextualSuggestions.push("Show me your projects");
    }
    if (response.toLowerCase().includes('contact')) {
      contextualSuggestions.push("How can I contact you?");
    }
    
    // Combine and deduplicate suggestions
    const allSuggestions = [...suggestions, ...contextualSuggestions];
    const uniqueSuggestions = Array.from(new Set(allSuggestions));
    
    // Filter out empty strings to prevent empty buttons
    const filteredSuggestions = uniqueSuggestions.filter(s => s.trim().length > 0);
    
    return filteredSuggestions.slice(0, 4); // Return max 4 suggestions
  }

  // Configuration methods
  toggleClaudeUsage(enabled: boolean): void {
    this.useClaudeForComplex = enabled;
  }

  isClaudeConfigured(): boolean {
    return this.claudeService.isConfigured();
  }
}
