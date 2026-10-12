import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { EditorialMotion } from '@/components/motion/EditorialMotion';
import { Container } from '@/components/ui/Container';
import { CTASection } from '@/components/ui/CTASection';
import { PageHero } from '@/components/ui/PageHero';
import { ReferenceCard } from '@/components/sections/ReferenceCard';
import { referenceHasDetailPage, referenceRecords } from '@/content/site/references';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type ReferencesPageProps = {
  params: Promise<{ locale: string }>;
};

type ReferenceItemMessages = {
  title: string;
  imageAlt?: string;
  summary: string;
  role: string;
  missionType: string;
};

type ReferencesMessages = {
  eyebrow: string;
  title: string;
  introduction: string;
  attribution: string;
  listingOnlyLabel: string;
  finalCta: string;
  items: Record<string, ReferenceItemMessages>;
};

export async function generateMetadata({ params }: ReferencesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const alternates = buildLocaleAlternates('/references', locale);
  return {
    title: { absolute: t('references.title') },
    description: t('references.description'),
    alternates,
    openGraph: getLocaleOpenGraph(locale, {
      title: t('references.title'),
      description: t('references.description'),
      url: alternates.canonical as string,
    }),
  };
}

export default async function ReferencesPage({ params }: ReferencesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as { references: ReferencesMessages; common: { contactUsCta: string } };
  const references = messages.references;
  const common = messages.common;

  return (
    <EditorialMotion>
      <PageHero
        eyebrow={references.eyebrow}
        title={references.title}
        introduction={references.introduction}
        supporting={references.attribution}
      />
      <section className="section section--ivory" data-motion="section">
        <Container>
          <div className="references-grid references-grid--overview">
            {referenceRecords.map((reference, index) => {
              const copy = references.items[reference.slug];
              return (
                <ReferenceCard
                  key={reference.slug}
                  reference={reference}
                  href={referenceHasDetailPage(reference) ? `/references/${reference.slug}` : undefined}
                  index={index}
                  title={copy?.title}
                  summary={copy?.summary}
                  attribution={references.attribution}
                  role={copy?.role}
                  missionType={copy?.missionType}
                  imageAlt={copy?.imageAlt}
                  listingOnlyLabel={references.listingOnlyLabel}
                />
              );
            })}
          </div>
        </Container>
      </section>
      <CTASection text={references.finalCta} label={common.contactUsCta} />
    </EditorialMotion>
  );
}
