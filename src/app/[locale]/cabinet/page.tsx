import type { Metadata } from 'next';
import Image from 'next/image';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { EditorialMotion } from '@/components/motion/EditorialMotion';
import { Container } from '@/components/ui/Container';
import { CTASection } from '@/components/ui/CTASection';
import { PageHero } from '@/components/ui/PageHero';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type CabinetPageProps = {
  params: Promise<{ locale: string }>;
};

type CabinetMessages = {
  eyebrow: string;
  title: string;
  introduction: string;
  archeritage: {
    eyebrow: string;
    title: string;
    paragraphs: [string, string];
  };
  vision: {
    eyebrow: string;
    title: string;
    paragraphs: [string, string];
  };
  founder: {
    eyebrow: string;
    title: string;
    paragraphs: [string, string];
    experienceLabel: string;
    fields: string[];
  };
  commitments: {
    eyebrow: string;
    title: string;
    items: { title: string; text: string }[];
  };
  finalCta: string;
};

export async function generateMetadata({ params }: CabinetPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const alternates = buildLocaleAlternates('/cabinet', locale);
  return {
    title: { absolute: t('cabinet.title') },
    description: t('cabinet.description'),
    alternates,
    openGraph: getLocaleOpenGraph(locale, {
      title: t('cabinet.title'),
      description: t('cabinet.description'),
      url: alternates.canonical as string,
    }),
  };
}

export default async function CabinetPage({ params }: CabinetPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as { cabinet: CabinetMessages };
  const cabinet = messages.cabinet;

  return (
    <EditorialMotion className="cabinet-page">
      <PageHero eyebrow={cabinet.eyebrow} title={cabinet.title} introduction={cabinet.introduction} compact />

      <section className="section section--ivory cabinet-section cabinet-archeritage" data-motion="section">
        <Container>
          <div className="cabinet-editorial-split">
            <div className="cabinet-section-heading">
              <p className="eyebrow" data-motion-eyebrow>{cabinet.archeritage.eyebrow}</p>
              <h2 data-motion-heading>{cabinet.archeritage.title}</h2>
            </div>
            <div className="cabinet-section-copy" data-motion-copy>
              {cabinet.archeritage.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </Container>
      </section>

      <section className="section section--alt cabinet-section cabinet-vision" data-motion="section">
        <Container>
          <div className="cabinet-vision__inner">
            <p className="eyebrow" data-motion-eyebrow>{cabinet.vision.eyebrow}</p>
            <h2 data-motion-heading>{cabinet.vision.title}</h2>
            <span className="cabinet-vision__rule" data-motion-line aria-hidden="true" />
            <div className="cabinet-section-copy" data-motion-copy>
              {cabinet.vision.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </Container>
      </section>

      <section className="section section--ink cabinet-section cabinet-founder-section" data-motion="section">
        <Container>
          <article className="founder-grid" data-motion-item>
            <div className="founder-image" data-motion-media data-motion-dir="left">
              <Image
                src="/images/profile/nacir.jpeg"
                alt={cabinet.founder.title}
                fill
                sizes="(max-width: 1023px) 88vw, 40vw"
              />
            </div>
            <div className="founder-copy" data-motion-body>
              <p className="eyebrow">{cabinet.founder.eyebrow}</p>
              <h2>{cabinet.founder.title}</h2>
              <div className="founder-copy__bio">
                {cabinet.founder.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="founder-experience">
                <p className="founder-experience__label">{cabinet.founder.experienceLabel}</p>
                <ul>
                  {cabinet.founder.fields.map((field, index) => (
                    <li key={field}>
                      <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </Container>
      </section>

      <section className="section section--ivory cabinet-section cabinet-commitments" data-motion="section">
        <Container>
          <div className="cabinet-section-heading cabinet-commitments__heading">
            <p className="eyebrow" data-motion-eyebrow>{cabinet.commitments.eyebrow}</p>
            <h2 data-motion-heading>{cabinet.commitments.title}</h2>
          </div>
          <ol className="cabinet-commitments__list">
            {cabinet.commitments.items.map((commitment, index) => (
              <li key={commitment.title} data-motion-item>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{commitment.title}</h3>
                <p>{commitment.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CTASection text={cabinet.finalCta} />
    </EditorialMotion>
  );
}
