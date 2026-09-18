import { NextResponse } from 'next/server';
import { HumanLikeChatAgent } from '@/lib/chat/humanChatAgent';
import { pageContentExtractor } from '@/lib/chat/pageContentExtractor';
import type { ChatMessage, ChatResponse } from '@/types/chat';

interface ChatRequestBody {
  message?: string;
  pathname?: string;
  history?: Array<{
    role: 'user' | 'bot';
    content: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    pageContentExtractor.setPathname(body.pathname ?? '/');
    pageContentExtractor.clearCache();

    const agent = new HumanLikeChatAgent();

    for (const entry of body.history ?? []) {
      const historyMessage: ChatMessage = {
        id: `history-${entry.role}-${entry.content.slice(0, 12)}`,
        role: entry.role,
        content: entry.content,
        timestamp: new Date(),
      };
      agent.updateConversationHistory(historyMessage);
    }

    const response: ChatResponse = await agent.findResponse(message);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 },
    );
  }
}
