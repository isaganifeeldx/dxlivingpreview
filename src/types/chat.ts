export interface ChatData {
  id: string;
  question: string;
  keywords: string[];
  responseTemplates: ResponseTemplate[];
  pageLink?: string;
  category: string;
  suggestions?: string[];
}

export interface ResponseTemplate {
  template: string;
  tone: 'friendly' | 'professional' | 'casual';
  context?: string[];
}

export interface ProjectLink {
  url: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  pageLink?: string;
  buttonText?: string;
  projectLinks?: ProjectLink[];
  suggestions?: string[];
  timestamp: Date;
  isTyping?: boolean;
  category?: string;
}

export interface ChatResponse {
  answer: string;
  pageLink?: string;
  buttonText?: string;
  projectLinks?: ProjectLink[];
  suggestions?: string[];
  category?: string;
}

export interface ConversationContext {
  isFollowUp: boolean;
  userSeemsFrustrated: boolean;
  userIsNew: boolean;
  currentTopic?: string;
}

export interface UserPreferences {
  preferredTone?: 'friendly' | 'professional' | 'casual';
  name?: string;
}

export type Emotion = 'positive' | 'concerned' | 'urgent' | 'neutral';
