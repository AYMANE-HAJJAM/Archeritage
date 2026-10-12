import type { Metadata } from 'next';
import Image from 'next/image';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { EditorialMotion } from '@/components/motion/EditorialMotion';
import { Container } from '@/components/ui/Container';
import { CTASection } from '@/components/ui/CTASection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EditorialRubricsAccordion } from '@/components/journal/EditorialRubricsAccordion';
import { journalPosts, editorialRubrics } from '@/content/site/official';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type JournalPageProps = {
  params: Promise<{ locale: string }>;
};

type JournalMessages = {
  eyebrow: string;
  title: string;
  introduction: string;
  editorialLine: string;
  forthcoming: string;
  upcomingTitle: string;
  rubrics: { eyebrow: string; title: string; intro: string };
  editorialRubrics: Record<string, { title: string; description: string }>;
  posts: Record<string, { title: string; description: string; category: string; imageAlt?: string; status: string }>;
  finalCta: { title: string; text: string };
};

export async function generateMetadata({ params }: JournalPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const alternates = buildLocaleAlternates('/journal', locale);
  return {
    title: { absolute: t('journal.title') },
    description: t('journal.description'),
    alternates,
    openGraph: getLocaleOpenGraph(locale, {
      title: t('journal.title'),
      description: t('journal.description'),
      url: alternates.canonical as string,
    }),
  };
}

export default async function JournalPage({ params }: JournalPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as { journal: JournalMessages; common: { contactUsCta: string } };
  const journal = messages.journal;
  const common = messages.common;

  const rubrics = editorialRubrics.map((rubric) => {
    const copy = journal.editorialRubrics[rubric.id];
    const plannedPost = journalPosts.find((post) => post.slug === rubric.plannedPublicationSlug);
    return {
      ...rubric,
      title: copy?.title ?? rubric.title,
      description: copy?.description ?? rubric.description,
      plannedPublicationTitle: plannedPost ? journal.posts[plannedPost.slug]?.title ?? plannedPost.title : undefined,
    };
  });

  return (
    <EditorialMotion>
      <header className="journal-hero" data-motion="hero">
        <Container className="journal-hero__inner">
          <div>
            <p className="eyebrow" data-motion-eyebrow>{journal.eyebrow}</p>
            <h1 data-motion-heading>{journal.title}</h1>
          </div>
          <div className="journal-hero__copy">
            <p className="journal-hero__introduction" data-motion-copy>{journal.introduction}</p>
            <p className="journal-hero__line" data-motion-copy>{journal.editorialLine}</p>
          </div>
        </Container>
      </header>

      <section className="journal-publications section section--ivory" data-motion="section">
        <Container>
          <SectionHeading eyebrow={journal.forthcoming} title={journal.upcomingTitle} />
          <div className="journal-preview-grid">
            {journalPosts.map((post, index) => {
              const copy = journal.posts[post.slug];
              return (
                <article key={post.slug} className="journal-preview-card" data-motion-item>
                  {post.image ? (
                    <div className="journal-preview-card__image" data-motion-media data-motion-dir={index % 2 ? 'left' : 'right'}>
                      <Image
                        src={post.image}
                        alt={copy?.imageAlt ?? post.imageAlt ?? ''}
                        fill
                        sizes="(max-width: 679px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      />
                      <span className="journal-preview-card__badge">{copy?.status ?? journal.forthcoming}</span>
                    </div>
                  ) : null}
                  <div className="journal-preview-card__body" data-motion-body>
                    <div className="journal-preview-card__meta">
                      <span>{copy?.category ?? post.category}</span>
                      <span>0{index + 1}</span>
                    </div>
                    <h3>{copy?.title ?? post.title}</h3>
                    <p>{copy?.description ?? post.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="journal-rubrics section section--alt" data-motion="section">
        <Container>
          <div data-motion-item>
            <EditorialRubricsAccordion
              rubrics={rubrics}
              eyebrow={journal.rubrics.eyebrow}
              title={journal.rubrics.title}
              intro={journal.rubrics.intro}
              publicationLabel={journal.upcomingTitle}
              forthcomingLabel={journal.forthcoming}
            />
          </div>
        </Container>
      </section>

      <div className="journal-cta">
        <CTASection
          title={journal.finalCta.title}
          text={journal.finalCta.text}
          label={common.contactUsCta}
        />
      </div>
    </EditorialMotion>
  );
}
