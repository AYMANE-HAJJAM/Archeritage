import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { ArcheritageIcon } from '@/components/icons/ArcheritageIcon';
import { EditorialMotion } from '@/components/motion/EditorialMotion';
import { ContactForm } from '@/components/site/ContactForm';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { contactDetails, contactLinks } from '@/content/site/contact-details';
import { getContactInitialValues } from '@/content/site/contact-form';
import { getProfessionalServiceJsonLd } from '@/lib/seo';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';
import './contact.css';

type ContactPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type ContactMessages = {
  title: string;
  promise: string;
  introduction: string;
  reasons: string[];
  labels: {
    eyebrow: string;
    detailsEyebrow: string;
    detailsTitle: string;
    reasonsEyebrow: string;
    formEyebrow: string;
    formTitle: string;
  };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const alternates = buildLocaleAlternates('/contact', locale);
  return {
    title: { absolute: t('contact.title') },
    description: t('contact.description'),
    alternates,
    openGraph: getLocaleOpenGraph(locale, {
      title: t('contact.title'),
      description: t('contact.description'),
      url: alternates.canonical as string,
    }),
  };
}

export default async function ContactPage({ params, searchParams }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const initialValues = getContactInitialValues(await searchParams);
  const jsonLd = getProfessionalServiceJsonLd();
  const messages = (await getMessages()) as {
    contact: ContactMessages;
    cabinet: { founder: { eyebrow: string; title: string } };
    legal: { mentions: { publisherText: string } };
  };
  const contact = messages.contact;
  const labels = contact.labels;
  const t = await getTranslations('contact');

  return (
    <EditorialMotion className="contact-experience">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={labels.eyebrow}
        title={contact.title}
        introduction={contact.promise}
        supporting={contact.introduction}
      />
      <section className="section section--ivory" data-motion="section">
        <Container className="contact-layout">
          <div className="contact-guidance" data-motion-item>
            <div className="contact-details contact-details--primary">
              <p className="eyebrow">{labels.detailsEyebrow}</p>
              <h2>{labels.detailsTitle}</h2>
              <p className="contact-detail-line"><ArcheritageIcon name="mail" tone="accent" /><a href={contactLinks.email}>{contactDetails.email}</a></p>
              <p className="contact-detail-line"><ArcheritageIcon name="phone" tone="accent" /><a href={contactLinks.phone}>{contactDetails.phoneDisplay}</a></p>
              <address className="contact-detail-line"><ArcheritageIcon name="map-pin" tone="accent" /><span>{contactDetails.addressLines.map((line) => <span key={line}>{line}</span>)}</span></address>
            </div>
            <p className="eyebrow">{labels.reasonsEyebrow}</p>
            <ul>{contact.reasons.map((reason) => <li key={reason}><ArcheritageIcon name="check" tone="accent" />{reason}</li>)}</ul>
            <div className="contact-details contact-details--identity">
              <p>{messages.legal.mentions.publisherText}</p>
              <p>{messages.cabinet.founder.eyebrow} : {messages.cabinet.founder.title}</p>
            </div>
          </div>
          <div className="contact-form-panel">
            <p className="eyebrow">{labels.formEyebrow}</p>
            <h2>{labels.formTitle}</h2>
            <a className="contact-mobile-call" href={contactLinks.phone}>{t('call')}</a>
            <ContactForm initialValues={initialValues} />
          </div>
        </Container>
      </section>
    </EditorialMotion>
  );
}
