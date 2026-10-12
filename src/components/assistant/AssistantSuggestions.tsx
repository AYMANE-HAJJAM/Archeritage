'use client';

import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

type AssistantSuggestionsProps = {
  suggestions: readonly string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
};

export function AssistantSuggestions({ suggestions, onSelect, disabled = false }: AssistantSuggestionsProps) {
  const t = useTranslations('assistant');

  return (
    <div className="assistant-suggestions" aria-label={t('suggestedQuestions')}>
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion}
          type="button"
          className="assistant-suggestion"
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <span className="assistant-suggestion__index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="assistant-suggestion__label">{suggestion}</span>
          <ArrowUpRight className="assistant-suggestion__arrow language-directional-icon" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
