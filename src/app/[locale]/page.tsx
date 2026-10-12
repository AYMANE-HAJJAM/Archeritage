import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Box, ClipboardList, Search, Settings, UsersRound } from 'lucide-react';

import './home.css';
import { HomeHeroSlider } from '@/components/home/HomeHeroSlider';
import { HomeReveal } from '@/components/home/HomeReveal';
import { ReferenceCard } from '@/components/sections/ReferenceCard';
import { Container } from '@/components/ui/Container';
import { CTASection } from '@/components/ui/CTASection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { homepageReferences } from '@/content/site/references';
import { solutionCatalog, solutionHref, type SolutionSlug } from '@/content/site/solutions';
import { Link } from '@/i18n/navigation';
import { getProfessionalServiceJsonLd } from '@/lib/seo';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

type HomeMessages = {
  hero: {
    eyebrow: string;
    title: string;
    introduction: string;
    ctaPrimary: string;
    controls: { sliderLabel: string; imageOf: string; previousImage: string; nextImage: string; pause: string; play: string };
  };
  situations: {
    title: string;
    items: Record<SolutionSlug, { title: string; description: string; cta: string; category: string }>;
  };
  solutions: {
    eyebrow: string;
    title: string;
    startingAt: string;
    pricingNote: string;
    discoverAll: string;
    items: Record<SolutionSlug, { title: string; description: string; cta: string; category: string }>;
  };
  method: {
    eyebrow: string;
    title: string;
    intro: string;
    cta: string;
    steps: { title: string; text: string; outcome: string }[];
  };
  diagnostic: { eyebrow: string; title: string; intro: string; cta: string; stages: string[] };
  references: { eyebrow: string; title: string; attribution: string };
  finalCta: { title: string; text: string; label: string };
};

type ReferenceItemMessages = {
  title: string;
  imageAlt?: string;
  summary: string;
  role: string;
  missionType: string;
  sections?: Record<string, string>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const alternates = buildLocaleAlternates('/', locale);
  return {
    title: { absolute: t('home.title') },
    description: t('home.description'),
    alternates,
    openGraph: getLocaleOpenGraph(locale, {
      title: t('home.title'),
      description: t('home.description'),
      url: alternates.canonical as string,
    }),
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as {
    home: HomeMessages;
    common: { contactUsCta: string; seeAllReferences: string };
    references: { items: Record<string, ReferenceItemMessages>; attribution: string };
  };
  const home = messages.home;
  const common = messages.common;
  const referenceItems = messages.references.items;
  const jsonLd = getProfessionalServiceJsonLd();
  const solutionVisuals = [
    '/images/pillars/pillar-valorisation-fonciere.jpg',
    '/images/cabinet/cabinet-architecture-institutionnelle.jpg',
    '/images/missions/mission-etude-plans.jpg',
    '/images/references/diagnostic-cover.jpg',
    '/images/references/tiznit-cover.jpg',
  ] as const;
  const situationVisuals = [
    '/images/pillars/pillar-valorisation-fonciere.jpg',
    '/images/optional/architecture-interieur-bureaux.jpg',
    '/images/pillars/pillar-architecture-envergure.jpg',
    '/images/references/diagnostic-cover.jpg',
  ] as const;
  const methodIcons = [Search, ClipboardList, Box, UsersRound, Settings] as const;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeroSlider
        eyebrow={home.hero.eyebrow}
        title={home.hero.title}
        introduction={home.hero.introduction}
        primaryLabel={home.hero.ctaPrimary}
        secondaryLabel={home.method.cta}
        controls={home.hero.controls}
      />
      <HomeReveal>
        <section className="section section--alt home-pillars-section" data-motion="section">
          <Container>
            <SectionHeading title={home.situations.title} />
            <div className="client-segment-grid situation-grid">
              {solutionCatalog.slice(0, 4).map((solution, index) => {
                const copy = home.situations.items[solution.slug];
                return (
                  <article className="client-segment-card home-commercial-card situation-card" key={solution.slug} data-motion-item>
                    <div className="situation-card__media">
                      <Image src={situationVisuals[index]} alt="" fill sizes="(min-width: 900px) 25vw, (min-width: 600px) 50vw, 100vw" quality={80} />
                    </div>
                    <div className="situation-card__body">
                    <div className="situation-label"><span>{String(index + 1).padStart(2, '0')}</span><span>{copy.category}</span></div>
                    <h3>{copy.title}</h3>
                    <p className="home-commercial-card__description">{copy.description}</p>
                    <Link href={solutionHref(solution.slug)}>
                      {copy.cta}<span className="architectural-link-arrow" aria-hidden="true">→</span>
                    </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>
        <section className="section section--ink home-solutions-section" id="solutions" data-motion="section">
          <Container className="home-solutions-shell">
            <div className="solutions-editorial">
              <header className="solutions-editorial__intro" data-motion-item>
                <div className="solutions-editorial__visual" data-motion-media data-motion-dir="right">
                  <Image src="/images/references/tinmel-cover.jpg" alt="" fill sizes="(min-width: 1180px) 31vw, 100vw" quality={80} />
                  <span aria-hidden="true">01—05</span>
                </div>
                <div className="solutions-editorial__heading">
                  <p className="eyebrow" data-motion-eyebrow>{home.solutions.eyebrow}</p>
                  <h2 data-motion-heading>{home.solutions.title}</h2>
                  <Link href="/contact?mission=cadrage-mission" className="text-link" data-motion-item>
                    {home.solutions.discoverAll} <span className="architectural-link-arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
                <ol className="solutions-editorial__index" aria-hidden="true">
                  {solutionCatalog.map((solution, index) => (
                    <li key={solution.slug}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <span>{home.solutions.items[solution.slug].title}</span>
                    </li>
                  ))}
                </ol>
              </header>
              <div className="solutions-editorial__offers">
              {solutionCatalog.map((solution, index) => {
                const copy = home.solutions.items[solution.slug];
                return (
                  <article
                    className="solution-offer"
                    id={solution.slug}
                    key={solution.slug}
                    data-motion-item
                  >
                    <div className="solution-offer__content">
                      <div className="solution-offer__meta">
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <span>{copy.category}</span>
                      </div>
                      <h3>{copy.title}</h3>
                      <p className="solution-offer__description">{copy.description}</p>
                      <p className="solution-offer__price">
                        <span>{home.solutions.startingAt}</span>
                        <bdi>{solution.price}</bdi>
                      </p>
                    <Link href={solutionHref(solution.slug)}>
                      {copy.cta}<span className="architectural-link-arrow" aria-hidden="true">→</span>
                    </Link>
                    </div>
                    <div className="solution-offer__media" data-motion-media data-motion-dir={index % 2 === 0 ? 'right' : 'left'}>
                      <Image src={solutionVisuals[index]} alt="" fill sizes="(min-width: 1180px) 22vw, (min-width: 700px) 45vw, 100vw" quality={80} />
                      <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  </article>
                );
              })}
              </div>
            </div>
            <p className="solution-grid__pricing-note" data-motion-copy>{home.solutions.pricingNote}</p>
          </Container>
        </section>
        <section className="section section--alt home-method-section" data-motion="section">
          <Container className="home-method-shell">
            <div className="method-editorial">
              <div className="method-editorial__visual" data-motion-media data-motion-dir="right">
                <Image src="/images/missions/mission-etude-plans.jpg" alt="" fill sizes="100vw" quality={80} />
                <span aria-hidden="true">01 / 05</span>
              </div>
              <div className="method-editorial__heading">
                <p className="eyebrow" data-motion-eyebrow>{home.method.eyebrow}</p>
                <h2 data-motion-heading>{home.method.title}</h2>
                <span className="section-heading__rule" data-motion-line aria-hidden="true" />
                <p data-motion-copy>{home.method.intro}</p>
                <Link href="/methode" className="text-link" data-motion-item>
                  {home.method.cta} <span className="architectural-link-arrow" aria-hidden="true">↗</span>
                </Link>
              </div>
              <ol className="method-editorial__steps" aria-label={home.method.title}>
                {home.method.steps.map((step, index) => (
                  <li key={step.title} data-motion-item>
                    {(() => { const StepIcon = methodIcons[index]; return <StepIcon className="method-editorial__icon" aria-hidden="true" />; })()}
                    <span className="method-editorial__number">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    <span className="method-editorial__outcome">
                      <span aria-hidden="true">→</span> {step.outcome}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>
        <section className="section section--ink home-references-section" data-motion="section">
          <Container>
            <SectionHeading
              eyebrow={home.references.eyebrow}
              title={home.references.title}
              text={home.references.attribution}
              light
            />
            <div className="reference-grid reference-grid--home">
              {homepageReferences.map((reference, index) => {
                const copy = referenceItems[reference.slug];
                return (
                  <ReferenceCard
                    key={reference.slug}
                    reference={reference}
                    href={`/references/${reference.slug}`}
                    index={index}
                    variant="home"
                    title={copy?.title}
                    summary={copy?.summary}
                    attribution={messages.references.attribution}
                    role={copy?.role}
                    missionType={copy?.missionType}
                    imageAlt={copy?.imageAlt}
                  />
                );
              })}
            </div>
            <div className="home-reference-cta" data-motion-item>
              <Link href="/references" className="text-link">
                {common.seeAllReferences} <span aria-hidden="true" className="language-directional-icon">↗</span>
              </Link>
            </div>
          </Container>
        </section>
        <CTASection title={home.finalCta.title} text={home.finalCta.text} label={home.finalCta.label} />
      </HomeReveal>
    </>
  );
}
