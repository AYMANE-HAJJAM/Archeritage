'use client';

import { ArrowUp, Square } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef } from 'react';

type AssistantComposerProps = {
  value: string;
  maxLength: number;
  disabled?: boolean;
  isStreaming?: boolean;
  error?: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
};

export function AssistantComposer({
  value,
  maxLength,
  disabled = false,
  isStreaming = false,
  error,
  onChange,
  onSubmit,
  onStop,
}: AssistantComposerProps) {
  const t = useTranslations('assistant');
  const labelId = useId();
  const errorId = useId();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const nearLimit = value.length >= maxLength * 0.9;
  const canSend = !disabled && value.trim().length > 0;

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }

    element.style.height = '0px';
    element.style.height = `${Math.min(Math.max(element.scrollHeight, 56), 132)}px`;
  }, [value]);

  return (
    <div className="assistant-composer">
      <label htmlFor={labelId} className="assistant-composer__label">
        {t('yourQuestion')}
      </label>
      <div className="assistant-composer__dock">
        <textarea
          ref={textareaRef}
          id={labelId}
          rows={2}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          placeholder={t('placeholder')}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              if (isStreaming || !canSend) {
                return;
              }
              onSubmit();
            }
          }}
        />
        <div className="assistant-composer__toolbar">
          <span
            className={nearLimit ? 'assistant-composer__count assistant-composer__count--near' : 'assistant-composer__count'}
            aria-hidden="true"
          >
            {value.length} / {maxLength}
          </span>
          {isStreaming ? (
            <button
              type="button"
              className="assistant-stop-button"
              onClick={onStop}
              aria-label={t('stopGeneration')}
              title={t('stopShort')}
            >
              <Square className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('stopShort')}</span>
            </button>
          ) : (
            <button
              type="button"
              className="assistant-send-button"
              onClick={onSubmit}
              disabled={!canSend}
              aria-disabled={!canSend}
              aria-label={t('send')}
              title={t('send')}
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
              <span>{t('send')}</span>
            </button>
          )}
        </div>
      </div>
      {error ? (
        <p id={errorId} className="assistant-composer__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
