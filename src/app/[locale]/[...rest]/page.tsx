import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type CatchAllProps = {
  params: Promise<{ locale: string; rest: string[] }>;
};

/**
 * Catch-all so unmatched paths inside a locale segment resolve to
 * `[locale]/not-found.tsx` instead of the root `not-found.tsx`.
 */
export default async function CatchAll({ params }: CatchAllProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
