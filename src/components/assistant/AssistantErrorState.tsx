'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

type AssistantErrorStateProps = {
  message: string;
};

export function AssistantErrorState({ message }: AssistantErrorStateProps) {
  const t = useTranslations('assistant');

  return (
    <div className="assistant-error-state" role="status" aria-live="polite">
      <p>{message}</p>
      <Link href="/contact" className="assistant-inline-link">
        {t('contactCta')}
      </Link>
    </div>
  );
}
