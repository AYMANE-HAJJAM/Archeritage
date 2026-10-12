'use client';

import { useTranslations } from 'next-intl';

import { approvedAssistantRouteSet } from '@/lib/assistant/shared/approved-routes';
import { Link } from '@/i18n/navigation';

type AssistantMarkdownProps = {
  content: string;
};

const internalRoutePattern = /(\/(?:cabinet|expertises(?:\/[a-z-]+)?|missions|methode|references(?:\/(?:tinmel|tiznit))?|journal|contact|mentions-legales|confidentialite)?)/g;

const routeKeyByPath: Record<string, string> = {
  '/expertises': 'expertises',
  '/methode': 'method',
  '/references': 'references',
  '/contact': 'contact',
  '/missions': 'missions',
  '/cabinet': 'cabinet',
};

export function AssistantMarkdown({ content }: AssistantMarkdownProps) {
  const t = useTranslations('assistant');
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const renderInline = (text: string) => {
    const parts = text.split(internalRoutePattern);

    return parts.map((part, index) => {
      if (approvedAssistantRouteSet.has(part)) {
        const routeKey = routeKeyByPath[part];
        const label = routeKey ? t(`routeLabels.${routeKey}`) : part;
        return (
          <Link key={`${part}-${index}`} href={part} className="assistant-inline-link">
            {label}
          </Link>
        );
      }

      return <span key={`${part}-${index}`}>{part}</span>;
    });
  };

  return (
    <div className="assistant-rich-text">
      {blocks.map((block, index) => {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
        const isList = lines.length > 1 && lines.every((line) => /^[-*•]\s+/.test(line));

        if (isList) {
          return (
            <ul key={`${block}-${index}`}>
              {lines.map((line) => (
                <li key={line}>{renderInline(line.replace(/^[-*•]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }

        return <p key={`${block}-${index}`}>{renderInline(block)}</p>;
      })}
    </div>
  );
}
