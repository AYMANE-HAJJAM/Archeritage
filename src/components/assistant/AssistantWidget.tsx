'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { usePathname } from 'next/navigation';

import { AssistantPanel } from '@/components/assistant/AssistantPanel';
import { ASSISTANT_DEFAULTS, ASSISTANT_WIDGET_IDS } from '@/lib/assistant/shared/constants';
import type { AssistantErrorPayload, AssistantWidgetMessage } from '@/lib/assistant/shared/types';

const featureEnabled = process.env.NEXT_PUBLIC_ASSISTANT_ENABLED !== 'false';

function TriggerMark() {
  return (
    <svg className="assistant-trigger__mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7.5H20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 12H14.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 16.5H11" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16.5 11.5L20 15L16.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function AssistantWidget() {
  const t = useTranslations('assistant');
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const nextRequestAllowedAtRef = useRef(0);
  const requestCounterRef = useRef(0);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AssistantWidgetMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [composerError, setComposerError] = useState<string | null>(null);
  const [serviceMessage, setServiceMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  const errorMessageForCode = (code?: string) => {
    switch (code) {
      case 'invalid_request':
        return t('errors.invalidRequest');
      case 'unavailable':
        return t('errors.unavailable');
      case 'rate_limited':
        return t('errors.rateLimited');
      case 'timeout':
        return t('errors.timeout');
      default:
        return t('errors.providerUnavailable');
    }
  };

  if (!featureEnabled) {
    return null;
  }

  const submit = async (forcedText?: string) => {
    if (isStreaming) {
      return;
    }

    const content = (forcedText ?? input).trim();
    if (!content) {
      setComposerError(t('errors.invalidRequest'));
      return;
    }

    if (Date.now() < nextRequestAllowedAtRef.current) {
      return;
    }

    nextRequestAllowedAtRef.current = Date.now() + ASSISTANT_DEFAULTS.clientSendCooldownMs;
    setComposerError(null);
    setServiceMessage(null);
    setInput('');
    setIsOpen(true);
    setIsStreaming(true);

    const userMessage: AssistantWidgetMessage = {
      id: createMessageId('user', requestCounterRef),
      role: 'user',
      content,
      state: 'done',
    };
    const assistantMessage: AssistantWidgetMessage = {
      id: createMessageId('assistant', requestCounterRef),
      role: 'assistant',
      content: '',
      state: 'streaming',
    };

    const nextMessages = [...messages, userMessage, assistantMessage];
    setMessages(nextMessages);
    const requestHistory = [...messages, userMessage]
      .filter((message) => message.state !== 'error')
      .slice(-(ASSISTANT_DEFAULTS.maxHistoryMessages))
      .map(({ role, content: messageContent }) => ({ role, content: messageContent }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: requestHistory,
          pageContext: {
            pathname,
            title: typeof document !== 'undefined' ? document.title : undefined,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const payload = await safeReadError(response, errorMessageForCode);
        throw payload;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        answer += decoder.decode(value, { stream: true });
        setMessages((current) => current.map((message) => (
          message.id === assistantMessage.id
            ? { ...message, content: answer, state: 'streaming' }
            : message
        )));
      }

      setMessages((current) => current.map((message) => (
        message.id === assistantMessage.id
          ? { ...message, content: answer.trim(), state: 'done' }
          : message
      )));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setMessages((current) => current.map((message) => (
          message.id === assistantMessage.id
            ? { ...message, content: message.content || t('interrupted'), state: 'done' }
            : message
        )));
        return;
      }

      const payload = normalizeClientError(error, errorMessageForCode);
      setServiceMessage(payload.message);
      setMessages((current) => current.filter((message) => message.id !== assistantMessage.id));
    } finally {
      abortRef.current = null;
      setIsStreaming(false);
    }
  };

  return (
    <div className="assistant-widget">
      <button
        ref={triggerRef}
        id={ASSISTANT_WIDGET_IDS.trigger}
        type="button"
        className="assistant-trigger"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? ASSISTANT_WIDGET_IDS.dialog : undefined}
        aria-label={t('open')}
        title={t('title')}
        onClick={() => setIsOpen((current) => !current)}
      >
        <TriggerMark />
        <span>{t('triggerLabel')}</span>
        <span className="assistant-trigger__accent" aria-hidden="true" />
      </button>

      <AssistantPanel
        isOpen={isOpen}
        isStreaming={isStreaming}
        input={input}
        maxInputChars={ASSISTANT_DEFAULTS.maxInputChars}
        messages={messages}
        unavailableMessage={serviceMessage}
        composerError={composerError}
        onClose={() => setIsOpen(false)}
        onClear={() => {
          const hasUserMessages = messages.some((message) => message.role === 'user');
          if (hasUserMessages && !window.confirm(t('clearConfirm'))) {
            return;
          }
          if (isStreaming) {
            abortRef.current?.abort();
          }
          setMessages([]);
          setComposerError(null);
          setServiceMessage(null);
        }}
        onInputChange={(value) => {
          setInput(value);
          if (composerError) {
            setComposerError(null);
          }
        }}
        onSuggestionSelect={(value) => {
          setInput(value);
          void submit(value);
        }}
        onSubmit={() => void submit()}
        onStop={() => abortRef.current?.abort()}
      />
    </div>
  );
}

function createMessageId(role: 'user' | 'assistant', counterRef: MutableRefObject<number>) {
  counterRef.current += 1;
  return `${role}-${counterRef.current}-${crypto.randomUUID()}`;
}

async function safeReadError(
  response: Response,
  fallback: (code?: string) => string,
): Promise<AssistantErrorPayload> {
  try {
    const payload = await response.json() as AssistantErrorPayload;
    return {
      ...payload,
      message: fallback(payload.code),
    };
  } catch {
    return {
      code: 'provider_unavailable',
      message: fallback('provider_unavailable'),
    };
  }
}

function normalizeClientError(
  error: unknown,
  fallback: (code?: string) => string,
): AssistantErrorPayload {
  if (error && typeof error === 'object' && 'message' in error) {
    const candidate = error as AssistantErrorPayload;
    return {
      code: candidate.code ?? 'provider_unavailable',
      message: fallback(candidate.code),
      retryAfterSeconds: candidate.retryAfterSeconds,
    };
  }

  return {
    code: 'provider_unavailable',
    message: fallback('provider_unavailable'),
  };
}
