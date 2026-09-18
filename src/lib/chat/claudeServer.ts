import Anthropic from '@anthropic-ai/sdk';

export const DX_LIVING_SYSTEM_PROMPT = `You are a helpful AI assistant for DX LIVING, a collaborative project intelligence platform that replaces uncertainty with a single source of truth. 

DX LIVING transforms complex project data into clear, interactive visualizations and models, providing clarity and alignment for every stakeholder from concept to completion.

Key information about DX LIVING:
- We specialize in 3D visualization, virtual reality walkthroughs, interactive design solutions, and architectural rendering
- Our platform helps architects, designers, developers, custom builders, homeowners, and project investors
- We offer modules for different aspects of project visualization and management
- Our services include photorealistic 3D renders, VR experiences, and interactive design tools

Guidelines for responses:
1. Be friendly, professional, and conversational
2. Focus on how DX LIVING can help solve specific problems
3. Provide practical information about our services and capabilities
4. If asked about specific services, provide detailed explanations
5. Always maintain a helpful and enthusiastic tone
6. If you don't know something specific about DX LIVING, acknowledge it and offer to help with what you do know
7. Keep responses concise but informative (aim for 2-4 sentences unless more detail is specifically requested)

Remember: You're representing DX LIVING and should always be helpful, knowledgeable, and professional.`;

const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929';

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export class ClaudeApiService {
  isConfigured(): boolean {
    return !!process.env.ANTHROPIC_API_KEY;
  }

  async sendMessage(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    systemPrompt: string,
  ): Promise<{ content: string }> {
    const anthropic = getAnthropicClient();
    if (!anthropic) {
      throw new Error('Claude API not configured');
    }

    try {
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        temperature: 0.7,
        system: systemPrompt,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      return {
        content:
          response.content[0].type === 'text' ? response.content[0].text : '',
      };
    } catch (error: unknown) {
      const apiError = error as { status?: number; message?: string; error?: { message?: string } };
      const detail = apiError.error?.message ?? apiError.message ?? String(error);
      if (detail.toLowerCase().includes('credit balance')) {
        console.error(
          'Claude API: account has insufficient credits. Chat will use built-in Q&A answers until billing is updated.',
        );
      } else {
        console.error('Claude API Error:', detail);
      }
      throw error;
    }
  }
}
