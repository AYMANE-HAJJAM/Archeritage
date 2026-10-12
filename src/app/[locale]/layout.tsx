import { Noto_Sans_Arabic, Fraunces, Inter } from 'next/font/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { AssistantWidgetMount } from '@/components/assistant/AssistantWidgetMount';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { isRtlLocale, routing } from '@/i18n/routing';

import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const arabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'common' });
  const rtl = isRtlLocale(locale);

  return (
    <html lang={locale} dir={rtl ? 'rtl' : 'ltr'}>
      <body
        className={`${inter.variable} ${display.variable} ${arabic.variable} min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased${rtl ? ' locale-ar' : ''}`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <a className="skip-link" href="#main-content">
            {t('skipToContent')}
          </a>
          <SiteChrome>{children}</SiteChrome>
          <AssistantWidgetMount />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
