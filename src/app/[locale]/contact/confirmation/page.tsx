import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { EditorialMotion } from '@/components/motion/EditorialMotion';
import { PageHero } from '@/components/ui/PageHero';
import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/navigation';
import '../contact.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact.confirmation' });
  return { title: t('title'), robots: { index: false, follow: true } };
}

export default async function ConfirmationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  return (
    <EditorialMotion className="contact-experience contact-confirmation">
      <PageHero compact eyebrow={t('labels.eyebrow')} title={t('confirmation.title')} introduction={t('confirmation.text')} />
      <section className="section section--ivory">
        <Container className="contact-confirmation-actions">
          <Link className="button button--primary" href="/">{t('confirmation.home')}</Link>
          <Link className="button button--secondary" href="/references">{t('confirmation.references')}</Link>
        </Container>
      </section>
    </EditorialMotion>
  );
}
