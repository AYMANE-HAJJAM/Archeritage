import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';

import { Container } from '@/components/ui/Container';
import { localePath } from '@/lib/i18n/seo';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations('errors.notFound');

  return (
    <section className="not-found">
      <Container>
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1>{t('title')}</h1>
        <p>{t('text')}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={localePath('/', locale)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.55rem] border border-[var(--accent)] bg-[var(--accent)] px-5 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-white"
          >
            {t('backHome')}
          </Link>
          <Link
            href={localePath('/contact', locale)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.55rem] border border-[var(--border)] bg-transparent px-5 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]"
          >
            {t('contact')}
          </Link>
        </div>
      </Container>
    </section>
  );
}
