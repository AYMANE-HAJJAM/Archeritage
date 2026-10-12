import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from './Container';

type CTASectionProps = {
  title?: string;
  text: string;
  label?: string;
  href?: string;
};

export async function CTASection({ title, text, label, href = '/contact' }: CTASectionProps) {
  const t = await getTranslations('common');
  const resolvedTitle = title ?? t('discussProject');
  const resolvedLabel = label ?? t('contactUsCta');

  return (
    <section className="cta-section" data-motion="section">
      <Container className="cta-section__inner">
        <div>
          <p className="eyebrow" data-motion-eyebrow>{t('firstExchange')}</p>
          <h2 data-motion-heading>{resolvedTitle}</h2>
          <p data-motion-copy>{text}</p>
        </div>
        <Link href={href} className="button button--primary" data-motion-item>
          {resolvedLabel}
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </Container>
    </section>
  );
}
