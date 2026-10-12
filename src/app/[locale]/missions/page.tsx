import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { EditorialMotion } from '@/components/motion/EditorialMotion';
import { Container } from '@/components/ui/Container';
import { CTASection } from '@/components/ui/CTASection';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type MissionsPageProps = {
  params: Promise<{ locale: string }>;
};

type MissionsMessages = {
  eyebrow: string;
  title: string;
  introduction: string;
  issues: {
    eyebrow: string;
    title: string;
    items: { title: string; text: string; formats: string }[];
  };
  formats: {
    eyebrow: string;
    title: string;
    tableHeaders: { format: string; outcome: string };
    items: { name: string; outcome: string }[];
  };
  audience: { eyebrow: string; title: string; text: string };
  finalCta: string;
  finalCtaLabel: string;
};

export async function generateMetadata({ params }: MissionsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const alternates = buildLocaleAlternates('/missions', locale);
  return {
    title: { absolute: t('missions.title') },
    description: t('missions.description'),
    alternates,
    openGraph: getLocaleOpenGraph(locale, {
      title: t('missions.title'),
      description: t('missions.description'),
      url: alternates.canonical as string,
    }),
  };
}

export default async function MissionsPage({ params }: MissionsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as { missions: MissionsMessages };
  const missions = messages.missions;

  return (
    <EditorialMotion className="missions-page">
      <PageHero eyebrow={missions.eyebrow} title={missions.title} introduction={missions.introduction} />

      <section className="section section--ivory missions-section missions-entry-section" data-motion="section">
        <Container>
          <SectionHeading eyebrow={missions.issues.eyebrow} title={missions.issues.title} />
          <div className="missions-entry-grid">
            {missions.issues.items.map((issue, index) => (
              <article className="missions-entry" key={issue.title} data-motion-item>
                <span className="missions-entry__index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{issue.title}</h3>
                <p>{issue.text}</p>
                <p className="missions-entry__formats">{issue.formats}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section section--alt missions-section missions-formats-section" data-motion="section">
        <Container>
          <SectionHeading eyebrow={missions.formats.eyebrow} title={missions.formats.title} />
          <span className="mission-formats__progress" data-motion-line aria-hidden="true" />
          <div className="mission-table-wrap">
            <table className="mission-table">
              <thead>
                <tr data-motion-item>
                  <th scope="col">{missions.formats.tableHeaders.format}</th>
                  <th scope="col">{missions.formats.tableHeaders.outcome}</th>
                </tr>
              </thead>
              <tbody>
                {missions.formats.items.map((format, index) => (
                  <tr key={format.name} data-motion-item>
                    <th scope="row">
                      <span className="mission-format-title">
                        <span className="mission-format-index">{String(index + 1).padStart(2, '0')}</span>
                        <span className="mission-format-name">{format.name}</span>
                      </span>
                    </th>
                    <td>
                      <span className="mission-table__mobile-label">{missions.formats.tableHeaders.outcome}</span>
                      {format.outcome}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="section section--ivory missions-section missions-audience-section" data-motion="section">
        <Container>
          <aside className="missions-audience" data-motion-item>
            <span className="missions-audience__accent" data-motion-line aria-hidden="true" />
            <div className="missions-audience__heading">
              <p className="eyebrow">{missions.audience.eyebrow}</p>
              <h2>{missions.audience.title}</h2>
            </div>
            <p className="missions-audience__copy">{missions.audience.text}</p>
          </aside>
        </Container>
      </section>

      <CTASection text={missions.finalCta} label={missions.finalCtaLabel} />
    </EditorialMotion>
  );
}
