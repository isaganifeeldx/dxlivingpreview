'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getPageWelcomeMessage } from '@/data/chatWelcomeMessages';
import { pageContentExtractor } from '@/lib/chat/pageContentExtractor';
import type { SiteSettingsData } from '@/lib/settings/defaults';
import type { ChatMessage, ChatResponse } from '@/types/chat';

const parseMarkdownBold = (text: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold">
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

const navigateTo = (url: string) => {
  const win = window as Window & { navigateWithTransition?: (path: string) => void };
  if (win.navigateWithTransition) {
    win.navigateWithTransition(url);
  } else {
    window.location.href = url;
  }
};

const CONTACT_BUTTON_COLOR = '#2A3040';

function normalizePublicPath(pathname: string): string {
  return pathname.startsWith('/pages/') ? pathname.slice('/pages'.length) || '/' : pathname;
}

function isExternalHref(href: string) {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  );
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12.004 2C6.477 2 2 6.477 2 12.004c0 1.76.46 3.47 1.335 4.98L2 22l5.233-1.37A9.96 9.96 0 0012.004 22C17.53 22 22 17.53 22 12.004 22 6.477 17.53 2 12.004 2zm0 18.164a8.14 8.14 0 01-4.15-1.134l-.298-.177-3.104.814.83-3.027-.194-.31A8.14 8.14 0 013.864 12c0-4.49 3.65-8.14 8.14-8.14s8.14 3.65 8.14 8.14-3.65 8.164-8.14 8.164z" />
  </svg>
);

const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.9 1.19 5.4 3.14 7.14V22l3.05-1.67c.89.25 1.84.38 2.81.38 5.64 0 10.2-4.13 10.2-9.7C21.2 6.13 16.64 2 12 2zm1.02 13.06l-2.61-2.78-5.1 2.78 5.6-5.94 2.67 2.78 5.04-2.78-5.6 5.94z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.486 2 2 5.589 2 10c0 1.846.633 3.543 1.688 4.897L2 22l7.335-1.662A9.96 9.96 0 0012 18c5.514 0 10-3.589 10-8s-4.486-8-10-8zm0 14.5a8.2 8.2 0 01-4.07-1.09l-.292-.174-3.04.688.69-2.97-.18-.287A8.2 8.2 0 014 10c0-4.136 3.582-7.5 8-7.5s8 3.364 8 7.5-3.582 7.5-8 7.5z" />
    <path d="M7.5 9.75h9v1.5h-9v-1.5zm0 3h6v1.5h-6v-1.5z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CallIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path
      d="M6.5 4.5c.4-.4 1-.5 1.5-.3l2.2 1c.5.2.8.7.8 1.2v1.8c0 .4-.2.8-.5 1.1l-1.3 1.3c.9 1.6 2.2 2.9 3.8 3.7l1.3-1.3c.3-.3.7-.5 1.1-.5h1.8c.5 0 1 .3 1.2.8l1.1 2.2c.2.5.1 1.1-.3 1.5l-1.2 1.2c-.5.5-1.2.7-1.9.6-3.3-.5-6.3-2.3-8.5-4.5-2.2-2.2-4-5.2-4.5-8.5-.1-.7.1-1.4.6-1.9l1.1-1.1z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ContactMenuItemProps {
  label: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
}

const ContactMenuItem = ({
  label,
  onClick,
  href,
  external = false,
  disabled = false,
  ariaLabel,
  children,
}: ContactMenuItemProps) => {
  const content = (
    <>
      <span className="relative bg-white text-[#2A3040] text-[15px] font-medium px-4 py-2 rounded-md shadow-md whitespace-nowrap">
        {label}
        <span
          className="absolute top-1/2 -right-[6px] -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-white"
          aria-hidden="true"
        />
      </span>
      <span
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg shrink-0"
        style={{ backgroundColor: CONTACT_BUTTON_COLOR }}
      >
        {children}
      </span>
    </>
  );

  const className = `flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 transition-opacity'}`;

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel ?? label}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel ?? label}
    >
      {content}
    </button>
  );
};

export default function ChatBox({
  settings,
}: {
  settings: SiteSettingsData['floatingCta'];
}) {
  const pathname = usePathname();
  const publicPath = normalizePublicPath(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChatView, setShowChatView] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [typingMessages, setTypingMessages] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const closeAll = () => {
    setIsMenuOpen(false);
    setShowChatView(false);
  };

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  const handleOpenChat = () => {
    setIsMenuOpen(false);
    setShowChatView(true);
  };

  const handleSubmitForm = () => {
    closeAll();
    const href = settings.submitForm.href?.trim();
    if (href) navigateTo(href);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  };

  const typeMessage = (messageId: string, fullText: string, onComplete?: () => void) => {
    const words = fullText.split(' ');
    let currentWordIndex = 0;
    const baseTypingSpeed = 10;
    const maxVariation = 50;

    const typeNextWord = () => {
      if (currentWordIndex <= words.length) {
        const randomVariation = Math.random() * maxVariation;
        const currentSpeed = baseTypingSpeed + randomVariation;
        const currentText = words.slice(0, currentWordIndex).join(' ');

        setTypingMessages((prev) => ({
          ...prev,
          [messageId]: currentText,
        }));

        currentWordIndex++;

        setTimeout(() => {
          scrollToBottom();
        }, 10);

        setTimeout(typeNextWord, currentSpeed);
      } else if (onComplete) {
        onComplete();
      }
    };

    setTimeout(typeNextWord, 150);
  };

  const buildHistoryPayload = (currentMessages: ChatMessage[]) =>
    currentMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

  const requestBotResponse = async (userText: string, historyMessages: ChatMessage[]) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText,
        pathname: publicPath,
        history: buildHistoryPayload(historyMessages),
      }),
    });

    if (!response.ok) {
      throw new Error('Chat request failed');
    }

    return (await response.json()) as ChatResponse;
  };

  const appendBotResponse = (response: ChatResponse) => {
    const botMessage: ChatMessage = {
      id: `${Date.now()}-bot`,
      role: 'bot',
      content: response.answer,
      pageLink: response.pageLink,
      buttonText: response.buttonText,
      projectLinks: response.projectLinks,
      suggestions: response.suggestions,
      timestamp: new Date(),
      category: response.category,
    };

    setMessages((prev) => [...prev, { ...botMessage, content: '' }]);

    typeMessage(botMessage.id, response.answer, () => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === botMessage.id ? { ...msg, content: response.answer } : msg)),
      );

      setTypingMessages((prev) => {
        const next = { ...prev };
        delete next[botMessage.id];
        return next;
      });
    });
  };

  const sendUserMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const response = await requestBotResponse(trimmed, messages);
        appendBotResponse(response);
      } catch (error) {
        console.error('Error getting response:', error);
        appendBotResponse({
          answer:
            "I'm sorry, I'm having trouble processing your request right now. Please try again or contact our support team.",
          category: 'error',
        });
      } finally {
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 1000);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessages]);

  useEffect(() => {
    if (showChatView && !hasShownWelcome) {
      const pageWelcome = getPageWelcomeMessage(publicPath);

      const welcomeMessage: ChatMessage = {
        id: `${Date.now()}-welcome`,
        role: 'bot',
        content: pageWelcome.welcomeMessage,
        timestamp: new Date(),
        category: 'welcome',
      };

      const followUpMessage: ChatMessage = {
        id: `${Date.now() + 1}-welcome`,
        role: 'bot',
        content: pageWelcome.followUpMessage,
        suggestions: pageWelcome.suggestions,
        timestamp: new Date(),
        category: 'welcome',
      };

      setMessages([welcomeMessage, followUpMessage]);
      setHasShownWelcome(true);
    }
  }, [showChatView, hasShownWelcome, publicPath]);

  useEffect(() => {
    setHasShownWelcome(false);
    setIsMenuOpen(false);
    setShowChatView(false);
    setMessages([]);
    setIsTyping(false);
    pageContentExtractor.clearCache();
  }, [publicPath]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendUserMessage(message);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await sendUserMessage(suggestion);
  };

  if (!settings?.enabled) return null;

  const whatsappHref = settings.whatsapp.href?.trim() ?? '';
  const messengerHref = settings.messenger.href?.trim() ?? '';
  const callHref = settings.call.href?.trim() ?? '';
  const submitFormHref = settings.submitForm.href?.trim() ?? '';

  return (
    <div className="fixed bottom-[45px] right-8 z-50 flex flex-col items-end gap-3">
      {isMenuOpen && !showChatView && (
        <div className="flex flex-col items-end gap-4 mb-1">
          {whatsappHref ? (
            <ContactMenuItem
              label={settings.whatsapp.label}
              href={whatsappHref}
              external={isExternalHref(whatsappHref)}
              ariaLabel={settings.whatsapp.label}
            >
              <WhatsAppIcon />
            </ContactMenuItem>
          ) : (
            <ContactMenuItem
              label={settings.whatsapp.label}
              disabled
              ariaLabel={`${settings.whatsapp.label} (unavailable)`}
            >
              <WhatsAppIcon />
            </ContactMenuItem>
          )}

          {messengerHref ? (
            <ContactMenuItem
              label={settings.messenger.label}
              href={messengerHref}
              external={isExternalHref(messengerHref)}
              ariaLabel={settings.messenger.label}
            >
              <MessengerIcon />
            </ContactMenuItem>
          ) : null}

          <ContactMenuItem
            label={settings.support.label}
            onClick={handleOpenChat}
            ariaLabel="Open support chat"
          >
            <ChatIcon />
          </ContactMenuItem>

          {submitFormHref ? (
            <ContactMenuItem
              label={settings.submitForm.label}
              onClick={handleSubmitForm}
              ariaLabel={settings.submitForm.label}
            >
              <EmailIcon />
            </ContactMenuItem>
          ) : null}

          {callHref ? (
            <ContactMenuItem
              label={settings.call.label}
              href={callHref}
              ariaLabel={settings.call.label}
            >
              <CallIcon />
            </ContactMenuItem>
          ) : null}
        </div>
      )}

      {showChatView && (
        <div className="fixed bottom-[109px] right-8 w-[350px] h-[580px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="bg-[#2A3040] text-white p-2 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span className="text-[16px]">
                <strong>DX</strong> LIVING Support
              </span>
            </div>
            <button
              type="button"
              onClick={closeAll}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 bg-[#BFB6AD] rounded-full flex items-center justify-center text-white text-sm font-semibold overflow-hidden relative">
                      <Image src="/images/dxchat.png" alt="DX LIVING" fill className="object-cover" sizes="32px" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-lg shadow-sm max-w-[calc(100%-50px)] ${
                      msg.role === 'user' ? 'bg-[#2A3040] text-white' : 'bg-white text-gray-800'
                    }`}
                  >
                    <div className="text-sm">
                      {msg.role === 'bot' && typingMessages[msg.id] !== undefined
                        ? typingMessages[msg.id].split('\n').map((line, index) => (
                            <p key={index} className={index > 0 ? 'mt-2' : ''}>
                              {parseMarkdownBold(line)}
                            </p>
                          ))
                        : msg.content.split('\n').map((line, index) => (
                            <p key={index} className={index > 0 ? 'mt-2' : ''}>
                              {parseMarkdownBold(line)}
                            </p>
                          ))}
                      {msg.role === 'bot' && typingMessages[msg.id] !== undefined && (
                        <span className="animate-pulse text-[#BFB6AD] font-bold">|</span>
                      )}
                    </div>

                    {msg.projectLinks && msg.projectLinks.length > 0 && !typingMessages[msg.id] && (
                      <div className="mt-2 space-y-1">
                        {msg.projectLinks.map((link, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => navigateTo(link.url)}
                            className="block w-full text-left px-3 py-2 bg-[#BFB6AD] text-white text-xs rounded-lg hover:bg-[#A69B8F] transition-colors"
                          >
                            {link.text}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.pageLink && !msg.projectLinks && !typingMessages[msg.id] && (
                      <button
                        type="button"
                        onClick={() => navigateTo(msg.pageLink!)}
                        className="inline-block mt-2 px-3 py-1 bg-[#BFB6AD] text-white text-xs rounded-full hover:bg-[#A69B8F] transition-colors"
                      >
                        {msg.buttonText || 'Learn More →'}
                      </button>
                    )}

                    {msg.suggestions && msg.suggestions.length > 0 && !typingMessages[msg.id] && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-gray-500">You might also ask:</p>
                        {msg.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-xs text-gray-500 mt-1 block">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-[#BFB6AD] rounded-full flex items-center justify-center overflow-hidden relative">
                    <Image src="/images/dxchat.png" alt="DX LIVING" fill className="object-cover" sizes="32px" />
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-2 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[transparent] focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="bg-[#BFB6AD] hover:bg-[#A69B8F] text-white px-4 py-2 rounded-lg transition-colors"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z"
                    fill="#ffffff"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {!showChatView && (
        <button
          type="button"
          onClick={isMenuOpen ? closeMenu : openMenu}
          className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 ${
            isMenuOpen
              ? 'bg-white text-[#2A3040] hover:bg-gray-50'
              : 'bg-[#2A3040] hover:bg-[#A69B8F] text-white border-[1px] border-white border-opacity-40'
          }`}
          aria-label={isMenuOpen ? 'Close contact menu' : 'Open contact menu'}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
