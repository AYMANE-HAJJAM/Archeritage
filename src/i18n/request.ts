import { getRequestConfig } from 'next-intl/server';

import { isAppLocale, routing } from './routing';

const namespaces = [
  'common',
  'navigation',
  'home',
  'cabinet',
  'expertises',
  'missions',
  'method',
  'references',
  'journal',
  'contact',
  'legal',
  'assistant',
  'errors',
  'metadata',
] as const;

export type MessageNamespace = (typeof namespaces)[number];

async function loadMessages(locale: string) {
  const entries = await Promise.all(
    namespaces.map(async (namespace) => {
      const messages = (await import(`../../messages/${locale}/${namespace}.json`)).default;
      return [namespace, messages] as const;
    }),
  );
  return Object.fromEntries(entries);
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !isAppLocale(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
