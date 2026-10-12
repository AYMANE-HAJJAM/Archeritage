'use client';

import { useTranslations } from 'next-intl';

import { AssistantMarkdown } from '@/components/assistant/AssistantMarkdown';
import type { AssistantWidgetMessage } from '@/lib/assistant/shared/types';

type AssistantMessageProps = {
  message: AssistantWidgetMessage;
};

const arabicScriptPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

export function AssistantMessage({ message }: AssistantMessageProps) {
  const t = useTranslations('assistant');
  const isAssistant = message.role === 'assistant';
  const isRtl = arabicScriptPattern.test(message.content);
  const isStreamingEmpty = isAssistant && message.state === 'streaming' && !message.content.trim();

  return (
    <article
      className={isAssistant ? 'assistant-message assistant-message--assistant' : 'assistant-message assistant-message--user'}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="assistant-message__meta">
        <span>{isAssistant ? t('roleAssistant') : t('roleYou')}</span>
        {message.state === 'streaming' ? (
          <span className="assistant-message__streaming" aria-live="polite">
            <span className="assistant-streaming-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            {t('streaming')}
          </span>
        ) : null}
      </div>

      {isStreamingEmpty ? (
        <div className="assistant-message__pending" aria-hidden="true">
          <span className="assistant-streaming-line" />
        </div>
      ) : (
        <div className="assistant-message__body">
          {isAssistant ? <AssistantMarkdown content={message.content} /> : <p>{message.content}</p>}
        </div>
      )}
    </article>
  );
}
