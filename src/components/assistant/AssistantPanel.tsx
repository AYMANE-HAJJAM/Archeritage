'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';

import { AssistantComposer } from '@/components/assistant/AssistantComposer';
import { AssistantErrorState } from '@/components/assistant/AssistantErrorState';
import { AssistantMessage } from '@/components/assistant/AssistantMessage';
import { AssistantSuggestions } from '@/components/assistant/AssistantSuggestions';
import { ASSISTANT_WIDGET_IDS } from '@/lib/assistant/shared/constants';
import type { AssistantWidgetMessage } from '@/lib/assistant/shared/types';

type AssistantPanelProps = {
  isOpen: boolean;
  isStreaming: boolean;
  input: string;
  maxInputChars: number;
  messages: AssistantWidgetMessage[];
  unavailableMessage: string | null;
  composerError: string | null;
  onClose: () => void;
  onClear: () => void;
  onInputChange: (value: string) => void;
  onSuggestionSelect: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
};

function AssistantMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7.5H20" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 12H14.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 16.5H11" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16.5 11.5L20 15L16.5 18.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}

export function AssistantPanel({
  isOpen,
  isStreaming,
  input,
  maxInputChars,
  messages,
  unavailableMessage,
  composerError,
  onClose,
  onClear,
  onInputChange,
  onSuggestionSelect,
  onSubmit,
  onStop,
}: AssistantPanelProps) {
  const t = useTranslations('assistant');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const shouldStickToBottomRef = useRef(true);
  const lockedScrollYRef = useRef(0);

  const suggestions = t.raw('suggestions') as string[];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lockedScrollYRef.current = window.scrollY;

    const html = document.documentElement;
    const { body } = document;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${lockedScrollYRef.current}px`;
    body.style.width = '100%';

    const animationFrame = window.requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      window.scrollTo(0, lockedScrollYRef.current);
      window.cancelAnimationFrame(animationFrame);
      lastFocusedRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const element = messagesRef.current;
    if (!element || !shouldStickToBottomRef.current) {
      return;
    }

    element.scrollTo({ top: element.scrollHeight, behavior: 'auto' });
  }, [messages, unavailableMessage]);

  const hasConversation = messages.length > 0;
  const introState = useMemo(() => !hasConversation, [hasConversation]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="assistant-overlay" aria-hidden={false} data-lenis-prevent>
      <div
        ref={panelRef}
        id={ASSISTANT_WIDGET_IDS.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ASSISTANT_WIDGET_IDS.title}
        aria-describedby={ASSISTANT_WIDGET_IDS.description}
        className="assistant-panel"
        tabIndex={-1}
        data-lenis-prevent
      >
        <header className="assistant-panel__header">
          <div className="assistant-panel__identity">
            <span className="assistant-panel__mark" aria-hidden="true">
              <AssistantMark />
            </span>
            <div className="assistant-panel__heading">
              <div className="assistant-panel__title-row">
                <h2 id={ASSISTANT_WIDGET_IDS.title}>{t('title')}</h2>
                <span className="assistant-panel__status">{t('status')}</span>
              </div>
              <p id={ASSISTANT_WIDGET_IDS.description} className="assistant-panel__supporting">
                {t('supporting')}
              </p>
            </div>
          </div>
          <div className="assistant-panel__header-actions">
            {hasConversation ? (
              <button
                type="button"
                className="assistant-clear-button"
                onClick={onClear}
                aria-label={t('clearConversation')}
                title={t('clearConversation')}
              >
                {t('clearShort')}
              </button>
            ) : null}
            <button
              type="button"
              className="assistant-close-button"
              onClick={onClose}
              aria-label={t('close')}
              title={t('closeShort')}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div
          ref={messagesRef}
          className="assistant-panel__messages"
          id={ASSISTANT_WIDGET_IDS.messages}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          onScroll={(event) => {
            const element = event.currentTarget;
            const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
            shouldStickToBottomRef.current = distanceFromBottom < 80;
          }}
          onWheel={(event) => {
            event.stopPropagation();
          }}
          onTouchMove={(event) => {
            event.stopPropagation();
          }}
        >
          {introState ? (
            <section className="assistant-intro">
              <p className="assistant-intro__greeting">{t('greeting')}</p>
              <p className="assistant-intro__support">{t('greetingSupport')}</p>
              <p className="assistant-intro__note">{t('note')}</p>
              {unavailableMessage ? <AssistantErrorState message={unavailableMessage} /> : null}
              <AssistantSuggestions
                suggestions={suggestions}
                onSelect={onSuggestionSelect}
                disabled={isStreaming}
              />
            </section>
          ) : (
            <>
              {messages.map((message) => (
                <AssistantMessage key={message.id} message={message} />
              ))}
              {unavailableMessage ? <AssistantErrorState message={unavailableMessage} /> : null}
            </>
          )}
        </div>

        <AssistantComposer
          value={input}
          maxLength={maxInputChars}
          disabled={false}
          isStreaming={isStreaming}
          error={composerError}
          onChange={onInputChange}
          onSubmit={onSubmit}
          onStop={onStop}
        />
      </div>
      <button type="button" className="assistant-overlay__backdrop" onClick={onClose} aria-label={t('close')} />
    </div>
  );
}
