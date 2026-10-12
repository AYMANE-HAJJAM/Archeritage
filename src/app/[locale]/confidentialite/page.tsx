import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { PageHero } from '@/components/ui/PageHero';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

type PrivacyMessages = {
  eyebrow: string;
  title: string;
  introduction: string;
  reviewNote: string;
  lastUpdatedLabel: string;
  sections: Record<string, LegalSection & { fields?: string[] }>;
};

function buildPrivacySections(sections: PrivacyMessages['sections']): LegalSection[] {
  return [
    { id: 'controller', ...sections.controller },
    { id: 'contactForm', ...sections.contactForm, list: sections.contactForm.fields },
    { id: 'attachments', ...sections.attachments },
    { id: 'assistant', ...sections.assistant },
    { id: 'purpose', ...sections.purpose },
    { id: 'recipients', ...sections.recipients },
    { id: 'cookies', ...sections.cookies },
    { id: 'security', ...sections.security },
    { id: 'rights', ...sections.rights },
    { id: 'updates', ...sections.updates },
  ];
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const alternates = buildLocaleAlternates('/confidentialite', locale);
  return {
    title: { absolute: t('confidentialite.title') },
    description: t('confidentialite.description'),
    robots: { index: false, follow: true },
    alternates,
    openGraph: getLocaleOpenGraph(locale, {
      title: t('confidentialite.title'),
      description: t('confidentialite.description'),
      url: alternates.canonical as string,
    }),
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as { legal: { privacy: PrivacyMessages } };
  const privacy = messages.legal.privacy;

  return (
    <>
      <PageHero eyebrow={privacy.eyebrow} title={privacy.title} introduction={privacy.introduction} compact />
      <LegalDocument
        reviewNote={privacy.reviewNote}
        sections={buildPrivacySections(privacy.sections)}
        lastUpdatedLabel={privacy.lastUpdatedLabel}
      />
    </>
  );
}
