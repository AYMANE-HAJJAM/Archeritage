import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

import { EditorialMotion } from '@/components/motion/EditorialMotion';
import { Container } from '@/components/ui/Container';
import { getExpertiseBySlug, getExpertiseNavigation, expertiseSlugs } from '@/content/site/expertises';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type ExpertisePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type ExpertiseDetailMessages = {
  shortTitle: string;
  eyebrow: string;
  title: string;
  introduction: string;
  imageAlt: string;
  competencies: string[];
  projectNeeds: string[];
  clientProfiles: string[];
  interventionFormats: string[];
  patrigovConnection: string;
  contactCtaLabel: string;
};

type ExpertisesMessages = {
  overview: {
    governanceEyebrow: string;
    governanceTitle: string;
  };
  labels: {
    competencies: string;
    projectNeeds: string;
    clientProfiles: string;
    interventionFormats: string;
    patrigov: string;
  };
  details: Record<string, ExpertiseDetailMessages>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => expertiseSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: ExpertisePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const expertise = getExpertiseBySlug(slug);
  if (!expertise) {
    const errors = await getTranslations({ locale, namespace: 'errors' });
    return { title: errors('expertiseNotFound'), robots: { index: false, follow: false } };
  }

  const metadata = await getTranslations({ locale, namespace: 'metadata' });
  const copy = (await getMessages({ locale }) as { expertises: ExpertisesMessages }).expertises.details[slug];
  const title = metadata(`expertiseDetails.${slug}.title`);
  const description = metadata(`expertiseDetails.${slug}.description`);
  const alternates = buildLocaleAlternates(`/expertises/${expertise.slug}`, locale);

  return {
    title: { absolute: title },
    description,
    alternates,
    openGraph: getLocaleOpenGraph(locale, { title: copy?.title ?? title, description, url: alternates.canonical as string }),
  };
}

export default async function ExpertiseDetailPage({ params }: ExpertisePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const expertise = getExpertiseBySlug(slug);

  if (!expertise) {
    notFound();
  }

  const messages = (await getMessages()) as {
    expertises: ExpertisesMessages;
    common: Record<string, string>;
    contact: { promise: string };
  };
  const copy = messages.expertises.details[slug];
  const labels = messages.expertises.labels;
  const overview = messages.expertises.overview;
  const common = messages.common;

  if (!copy) {
    notFound();
  }

  const navigation = getExpertiseNavigation(expertise.slug);
  const navTitles = messages.expertises.details;

  return (
    <EditorialMotion className="expertise-detail">
      <header className="expertise-detail__hero" data-motion="hero">
        <Container>
          <nav aria-label="Breadcrumb" className="expertise-detail__breadcrumb">
            <Link href="/expertises">{common.discoverExpertises}</Link>
            <span aria-hidden="true">/</span>
            <span>{copy.title}</span>
          </nav>
          <div className="expertise-detail__hero-grid">
            <div className="expertise-detail__hero-copy">
              <p className="eyebrow" data-motion-eyebrow>{copy.eyebrow}</p>
              <h1 data-motion-heading>{copy.title}</h1>
              <p className="expertise-detail__hero-intro" data-motion-copy>{copy.introduction}</p>
              <Link href={expertise.contactCtaHref} className="button button--primary expertise-detail__hero-cta" data-motion-copy>
                {copy.contactCtaLabel}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
            <div className="expertise-detail__hero-media" data-motion-media data-motion-dir="right">
              <Image
                src={expertise.image}
                alt={copy.imageAlt}
                fill
                priority
                sizes="(max-width: 767px) 100vw, 48vw"
              />
            </div>
          </div>
        </Container>
      </header>

      <section className="section section--compact section--ivory" data-motion="section">
        <Container>
          <div className="expertise-detail__competencies">
            <h2 className="eyebrow eyebrow-heading" data-motion-eyebrow>{labels.competencies}</h2>
            <ol className="expertise-detail__competency-grid">
              {copy.competencies.map((competency, i) => (
                <li key={competency} data-motion-item>
                  <span className="expertise-detail__competency-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="expertise-detail__competency-label">{competency}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="section section--compact section--alt" data-motion="section">
        <Container>
          <div className="expertise-detail__fits" data-motion-item>
            <div className="expertise-detail__fits-grid">
              <div className="expertise-detail__fits-col">
                <h3>{labels.projectNeeds}</h3>
                <ul className="expertise-detail__needs">
                  {copy.projectNeeds.map((need) => (
                    <li key={need}>{need}</li>
                  ))}
                </ul>
              </div>
              <div className="expertise-detail__fits-col">
                <h3>{labels.clientProfiles}</h3>
                <div className="expertise-detail__chips">
                  {copy.clientProfiles.map((profile) => (
                    <span key={profile} className="expertise-detail__chip">{profile}</span>
                  ))}
                </div>
              </div>
              <div className="expertise-detail__fits-col">
                <h3>{labels.interventionFormats}</h3>
                <ul className="expertise-detail__formats">
                  {copy.interventionFormats.map((format) => (
                    <li key={format}>{format}</li>
                  ))}
                </ul>
                <Link href="/missions" className="text-link">
                  {common.discoverInterventionFormats} <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section section--compact section--ivory" data-motion="section">
        <Container>
          <div className="expertise-detail__patrigov" data-motion-item>
            <div className="expertise-detail__patrigov-left">
              <p className="eyebrow">{overview.governanceEyebrow}</p>
              <h2 data-motion-heading>{overview.governanceTitle}</h2>
            </div>
            <div className="expertise-detail__patrigov-right">
              <p data-motion-copy>{copy.patrigovConnection}</p>
              <Link href="/methode" className="text-link">
                {common.discoverMethod} <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="section section--compact section--alt" data-motion="section">
        <Container>
          <div className="expertise-detail__footer">
            {navigation ? (
              <nav aria-label={common.discoverExpertises} className="expertise-detail__explore" data-motion-item>
                <p className="eyebrow">{common.discover}</p>
                <div className="expertise-detail__explore-links">
                  <Link href={`/expertises/${navigation.previous.slug}`} className="expertise-detail__explore-link">
                    <ArrowLeft aria-hidden="true" />
                    <span>
                      <small>{common.previous}</small>
                      <strong>{navTitles[navigation.previous.slug]?.title ?? navigation.previous.title}</strong>
                    </span>
                  </Link>
                  <Link href="/expertises" className="expertise-detail__explore-center">
                    {common.discoverExpertises}
                  </Link>
                  <Link href={`/expertises/${navigation.next.slug}`} className="expertise-detail__explore-link expertise-detail__explore-link--next">
                    <span>
                      <small>{common.next}</small>
                      <strong>{navTitles[navigation.next.slug]?.title ?? navigation.next.title}</strong>
                    </span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </nav>
            ) : null}
            <div className="expertise-detail__final-cta" data-motion-item>
              <h2>{copy.contactCtaLabel}</h2>
              <p>{messages.contact.promise}</p>
              <Link href={expertise.contactCtaHref} className="button button--primary">
                {common.contactUsCta}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </EditorialMotion>
  );
}
