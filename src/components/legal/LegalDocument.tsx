import { getFormatter, getTranslations } from 'next-intl/server';

import { Container } from '@/components/ui/Container';
import { CTASection } from '@/components/ui/CTASection';
import { contactDetails, contactLinks } from '@/content/site/contact-details';
import { legalLastUpdatedIso } from '@/content/site/legal-meta';
import { Link } from '@/i18n/navigation';

export type LegalSection = {
  id?: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};

type LegalDocumentProps = {
  reviewNote: string;
  sections: LegalSection[];
  lastUpdatedLabel: string;
  showPrivacyLink?: boolean;
};

export async function LegalDocument({
  reviewNote,
  sections,
  lastUpdatedLabel,
  showPrivacyLink = false,
}: LegalDocumentProps) {
  const tCommon = await getTranslations('common');
  const formatter = await getFormatter();
  const lastUpdated = formatter.dateTime(new Date(`${legalLastUpdatedIso}T12:00:00`), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <section className="section section--ivory legal-page">
        <Container className="legal-copy">
          <p className="legal-copy__review">{reviewNote}</p>
          {sections.map((section) => (
            <article key={section.id ?? section.title} className="legal-copy__section">
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.id === 'contact' ? (
                <div className="legal-copy__contact-block">
                  <address>
                    {contactDetails.addressLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                  <p>
                    <a href={contactLinks.email} dir="ltr">
                      {contactDetails.email}
                    </a>
                    {' · '}
                    <a href={contactLinks.phone} dir="ltr">
                      {contactDetails.phoneDisplay}
                    </a>
                  </p>
                </div>
              ) : null}
              {section.list?.length ? (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.id === 'privacy' && showPrivacyLink ? (
                <p className="legal-copy__inline-link">
                  <Link href="/confidentialite">{tCommon('privacyPolicy')}</Link>
                </p>
              ) : null}
            </article>
          ))}
          <p className="legal-copy__updated">
            {lastUpdatedLabel} {lastUpdated}
          </p>
        </Container>
      </section>
      <CTASection text={tCommon('discussProject')} label={tCommon('contactUsCta')} />
    </>
  );
}
