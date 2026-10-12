import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { EditorialMotion } from '@/components/motion/EditorialMotion';
import { CTASection } from '@/components/ui/CTASection';
import { Container } from '@/components/ui/Container';
import {
  getReferenceBySlug,
  getReferenceNavigation,
  getReferenceDetailRecords,
  referenceHasDetailPage,
  type ReferenceSection,
} from '@/content/site/references';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type ReferencePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type ReferenceItemMessages = {
  title: string;
  imageAlt?: string;
  summary: string;
  role: string;
  missionType: string;
  sections?: Record<string, string>;
};

type ReferencesMessages = {
  attribution: string;
  sectionTitles: Record<string, string>;
  detailFinalCta: string;
  items: Record<string, ReferenceItemMessages>;
};

const sectionTitleToKey: Record<ReferenceSection['title'], string> = {
  Contexte: 'contexte',
  'Mission conduite': 'mission',
  Enjeux: 'enjeux',
  Approche: 'approche',
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getReferenceDetailRecords().map((reference) => ({ locale, slug: reference.slug })));
}

export async function generateMetadata({ params }: ReferencePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const reference = getReferenceBySlug(slug);
  if (!reference || !referenceHasDetailPage(reference)) {
    const errors = await getTranslations({ locale, namespace: 'errors' });
    return { title: errors('referenceNotFound'), robots: { index: false, follow: false } };
  }

  const metadata = await getTranslations({ locale, namespace: 'metadata' });
  const copy = (await getMessages({ locale }) as { references: ReferencesMessages }).references.items[slug];
  const title = copy?.title ?? reference.title;
  const description = copy?.summary ?? reference.summary;
  const alternates = buildLocaleAlternates(`/references/${reference.slug}`, locale);

  return {
    title: `${title} | ${metadata('referenceDetailSuffix')}`,
    description,
    alternates,
    openGraph: getLocaleOpenGraph(locale, { title, description, url: alternates.canonical as string }),
  };
}

export default async function ReferenceDetailPage({ params }: ReferencePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const reference = getReferenceBySlug(slug);

  if (!reference || !referenceHasDetailPage(reference)) {
    notFound();
  }

  const messages = (await getMessages()) as { references: ReferencesMessages; common: Record<string, string> };
  const references = messages.references;
  const common = messages.common;
  const copy = references.items[slug];

  const navigation = getReferenceNavigation(reference.slug);
  const title = copy?.title ?? reference.title;
  const summary = copy?.summary ?? reference.summary;
  const imageAlt = copy?.imageAlt ?? reference.imageAlt ?? title;

  return (
    <EditorialMotion className="reference-detail">
      <header className="reference-detail__hero" data-motion="hero">
        <Container>
          <nav aria-label="Breadcrumb" className="reference-detail__breadcrumb">
            <Link href="/references">{common.seeReferences}</Link>
            <span aria-hidden="true">/</span>
            <span>{title}</span>
          </nav>
          <div className="reference-detail__hero-grid">
            <div className="reference-detail__hero-copy">
              <p className="eyebrow" data-motion-eyebrow>{references.attribution}</p>
              <h1 data-motion-heading>{title}</h1>
              <p className="reference-detail__hero-meta" data-motion-copy>
                {[reference.institution, reference.location].filter(Boolean).join(' · ')}
              </p>
              <p className="reference-detail__hero-attribution" data-motion-copy>{references.attribution}</p>
            </div>
            {reference.image ? (
              <div className="reference-detail__hero-media" data-motion-media data-motion-dir="right">
                <Image src={reference.image} alt={imageAlt} fill priority sizes="(max-width: 1023px) 100vw, 58vw" />
              </div>
            ) : (
              <div className="reference-detail__hero-no-image" aria-hidden="true" data-motion-copy>
                <span className="reference-detail__hero-no-image-label">ARCHERITAGE</span>
                <span className="reference-detail__hero-no-image-title">{title}</span>
              </div>
            )}
          </div>
        </Container>
      </header>

      <section className="section section--ivory reference-detail__sections" data-motion="section">
        <Container>
          <div className="reference-detail__intro" data-motion-copy>
            <p>{summary}</p>
          </div>
          <div className="reference-detail__content">
            {reference.sections.map((section) => {
              const key = sectionTitleToKey[section.title];
              const localizedText = copy?.sections?.[key] ?? section.text;
              const localizedTitle = references.sectionTitles[key] ?? section.title;
              return (
                <section key={section.title} className="reference-detail__section" data-motion-item>
                  <h2 className="eyebrow eyebrow-heading">{localizedTitle}</h2>
                  <p>{localizedText}</p>
                </section>
              );
            })}
          </div>
          {navigation ? (
            <nav aria-label={common.seeReferences} className="reference-detail__nav" data-motion-item>
              <Link href={`/references/${navigation.previous.slug}`} className="reference-detail__nav-link">
                <ArrowLeft aria-hidden="true" />
                <span>
                  <small>{common.previous}</small>
                  <strong>{references.items[navigation.previous.slug]?.title ?? navigation.previous.title}</strong>
                </span>
              </Link>
              <Link href="/references" className="reference-detail__nav-center">{common.seeReferences}</Link>
              <Link href={`/references/${navigation.next.slug}`} className="reference-detail__nav-link reference-detail__nav-link--next">
                <span>
                  <small>{common.next}</small>
                  <strong>{references.items[navigation.next.slug]?.title ?? navigation.next.title}</strong>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </nav>
          ) : null}
        </Container>
      </section>

      <CTASection text={references.detailFinalCta} label={common.contactUsCta} />
    </EditorialMotion>
  );
}
