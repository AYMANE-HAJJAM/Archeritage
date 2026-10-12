import type { Metadata } from 'next';

import { locales, type AppLocale } from '@/i18n/routing';
import { site } from '@/data/site';

export function localePath(pathname: string, locale: string) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (locale === 'fr') return normalized === '/' ? '/' : normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

export function buildLocaleAlternates(pathname: string, locale: string): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {
    'x-default': new URL(localePath(pathname, 'fr'), site.url).toString(),
  };
  for (const item of locales) {
    languages[item] = new URL(localePath(pathname, item), site.url).toString();
  }
  return {
    canonical: new URL(localePath(pathname, locale), site.url).toString(),
    languages,
  };
}

export function getLocaleOpenGraph(
  locale: string,
  input: { title: string; description: string; url: string },
): Metadata['openGraph'] {
  const ogLocale = locale === 'ar' ? 'ar_MA' : locale === 'en' ? 'en_GB' : 'fr_FR';
  return {
    title: input.title,
    description: input.description,
    url: input.url,
    siteName: site.brand,
    type: 'website',
    locale: ogLocale,
    images: [{ url: '/images/hero/hero-architecture-publique.jpg', width: 2400, height: 1350, alt: 'ARCHERITAGE' }],
  };
}

export function assertLocale(locale: string): AppLocale {
  if (locale === 'fr' || locale === 'en' || locale === 'ar') return locale;
  return 'fr';
}
