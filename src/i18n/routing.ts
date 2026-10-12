import { defineRouting } from 'next-intl/routing';

export const locales = ['fr', 'en', 'ar'] as const;
export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

export function isRtlLocale(locale: string) {
  return locale === 'ar';
}
