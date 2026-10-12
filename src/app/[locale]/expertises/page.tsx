import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';

import { EditorialMotion } from '@/components/motion/EditorialMotion';
import { Container } from '@/components/ui/Container';
import { CTASection } from '@/components/ui/CTASection';
import { PageHero } from '@/components/ui/PageHero';
import { PillarCard } from '@/components/ui/PillarCard';
import { pillars as pillarAssets } from '@/content/site/official';
import { Link } from '@/i18n/navigation';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type ExpertisesPageProps = {
  params: Promise<{ locale: string }>;
};

type ExpertisesMessages = {
  overview: {
    eyebrow: string;
    title: string;
    introduction: string;
    supporting: string;
    governanceEyebrow: string;
    governanceTitle: string;
    governance: string;
    finalCta: string;
  };
  details: Record<
    string,
    { title: string; introduction: string; imageAlt: string; competencies: string[] }
  >;
};

export async function generateMetadata({ params }: ExpertisesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const alternates = buildLocaleAlternates('/expertises', locale);
  return {
    title: { absolute: t('expertises.title') },
    description: t('expertises.description'),
    alternates,
    openGraph: getLocaleOpenGraph(locale, {
      title: t('expertises.title'),
      description: t('expertises.description'),
      url: alternates.canonical as string,
    }),
  };
}

export default async function ExpertisesPage({ params }: ExpertisesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as {
    expertises: ExpertisesMessages;
    common: { discoverPatrigov: string; contactUsCta: string };
  };
  const { overview, details } = messages.expertises;
  const common = messages.common;

  const localizedPillars = pillarAssets.map((pillar) => {
    const slug = pillar.href.split('/').pop() ?? '';
    const copy = details[slug];
    return {
      ...pillar,
      title: copy?.title ?? pillar.title,
      description: copy?.introduction ?? pillar.description,
      imageAlt: copy?.imageAlt ?? pillar.imageAlt,
      competencies: copy?.competencies ?? pillar.competencies,
    };
  });

  return (
    <EditorialMotion className="expertises-page">
      <PageHero
        eyebrow={overview.eyebrow}
        title={overview.title}
        introduction={overview.introduction}
        supporting={overview.supporting}
      />
      <section className="section section--ivory expertises-cards-section" data-motion="section">
        <Container>
          <div className="pillar-grid pillar-grid--expertises">
            {localizedPillars.map((pillar, index) => (
              <PillarCard key={pillar.href} pillar={pillar} index={index} detailed headingLevel="h2" />
            ))}
          </div>
        </Container>
      </section>
      <section className="section section--alt expertises-patrigov-section" data-motion="section">
        <Container>
          <aside className="expertises-patrigov" data-motion-item>
            <span className="expertises-patrigov__accent" data-motion-line aria-hidden="true" />
            <div className="expertises-patrigov__heading">
              <p className="eyebrow">{overview.governanceEyebrow}</p>
              <h2>{overview.governanceTitle}</h2>
            </div>
            <div className="expertises-patrigov__copy">
              <p>{overview.governance}</p>
              <Link href="/methode" className="text-link">
                {common.discoverPatrigov} <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </Container>
      </section>
      <CTASection text={overview.finalCta} label={common.contactUsCta} />
    </EditorialMotion>
  );
}
