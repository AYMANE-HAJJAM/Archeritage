import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { PageHero } from '@/components/ui/PageHero';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type LegalPageProps = {
  params: Promise<{ locale: string }>;
};

type MentionsMessages = {
  eyebrow: string;
  title: string;
  introduction: string;
  reviewNote: string;
  lastUpdatedLabel: string;
  sections: Record<string, LegalSection & { fields?: string[] }>;
};

function buildMentionsSections(sections: MentionsMessages['sections']): LegalSection[] {
  return [
    { id: 'publisher', ...sections.publisher },
    { id: 'contact', ...sections.contact },
    { id: 'hosting', ...sections.hosting },
    { id: 'intellectual', ...sections.intellectual },
    { id: 'liability', ...sections.liability },
    { id: 'externalLinks', ...sections.externalLinks },
    { id: 'privacy', ...sections.privacy },
    { id: 'legalContact', ...sections.legalContact },
  ];
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const alternates = buildLocaleAlternates('/mentions-legales', locale);
  return {
    title: { absolute: t('mentionsLegales.title') },
    description: t('mentionsLegales.description'),
    robots: { index: false, follow: true },
    alternates,
    openGraph: getLocaleOpenGraph(locale, {
      title: t('mentionsLegales.title'),
      description: t('mentionsLegales.description'),
      url: alternates.canonical as string,
    }),
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as { legal: { mentions: MentionsMessages } };
  const mentions = messages.legal.mentions;

  return (
    <>
      <PageHero eyebrow={mentions.eyebrow} title={mentions.title} introduction={mentions.introduction} compact />
      <LegalDocument
        reviewNote={mentions.reviewNote}
        sections={buildMentionsSections(mentions.sections)}
        lastUpdatedLabel={mentions.lastUpdatedLabel}
        showPrivacyLink
      />
    </>
  );
}
