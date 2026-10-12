import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { ArcheritageIcon, methodPrincipleIcons } from '@/components/icons/ArcheritageIcon';
import { EditorialMotion } from '@/components/motion/EditorialMotion';
import { MethodTimeline } from '@/components/motion/MethodTimeline';
import { Container } from '@/components/ui/Container';
import { CTASection } from '@/components/ui/CTASection';
import { PageHero } from '@/components/ui/PageHero';
import { ProofBox } from '@/components/ui/ProofBox';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type MethodePageProps = {
  params: Promise<{ locale: string }>;
};

type MethodMessages = {
  eyebrow: string;
  title: string;
  introduction: string;
  proof: { eyebrow: string; accent: string; title: string; text: string };
  principles: { eyebrow: string; title: string; items: string[] };
  cycle: { eyebrow: string; title: string; steps: { title: string; text: string }[] };
  proprietary: { eyebrow: string; title: string; text: string };
  finalCta: string;
  finalCtaLabel: string;
};

export async function generateMetadata({ params }: MethodePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const alternates = buildLocaleAlternates('/methode', locale);
  return {
    title: { absolute: t('method.title') },
    description: t('method.description'),
    alternates,
    openGraph: getLocaleOpenGraph(locale, {
      title: t('method.title'),
      description: t('method.description'),
      url: alternates.canonical as string,
    }),
  };
}

export default async function MethodePage({ params }: MethodePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as { method: MethodMessages };
  const method = messages.method;
  const timelineSteps = method.cycle.steps.map((step) => [step.title, step.text] as const);

  return (
    <EditorialMotion>
      <PageHero eyebrow={method.eyebrow} title={method.title} introduction={method.introduction} />
      <section className="section section--ivory" data-motion="section">
        <Container>
          <div data-motion-item>
            <ProofBox eyebrow={method.proof.eyebrow} accent={method.proof.accent} title={method.proof.title}>
              <p>{method.proof.text}</p>
            </ProofBox>
          </div>
        </Container>
      </section>
      <section className="section section--ink" data-motion="section">
        <Container>
          <SectionHeading eyebrow={method.principles.eyebrow} title={method.principles.title} light />
          <div className="principle-grid">
            {method.principles.items.map((principle, index) => (
              <article key={principle} data-motion-item>
                <div className="principle-grid__meta">
                  <span>0{index + 1}</span>
                  <ArcheritageIcon name={methodPrincipleIcons[index]} variant="card" tone="light" />
                </div>
                <h3>{principle}</h3>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="section section--alt" data-motion="section">
        <Container>
          <SectionHeading eyebrow={method.cycle.eyebrow} title={method.cycle.title} />
          <MethodTimeline steps={timelineSteps} />
        </Container>
      </section>
      <section className="section section--ivory" data-motion="section">
        <Container>
          <div className="editorial-split">
            <div>
              <p className="eyebrow" data-motion-eyebrow>{method.proprietary.eyebrow}</p>
              <h2 data-motion-heading>{method.proprietary.title}</h2>
            </div>
            <p data-motion-copy>{method.proprietary.text}</p>
          </div>
        </Container>
      </section>
      <CTASection
        text={method.finalCta}
        label={method.finalCtaLabel}
        href="/contact?type=gouvernance"
      />
    </EditorialMotion>
  );
}
