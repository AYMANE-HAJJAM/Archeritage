import type { MetadataRoute } from 'next';

import { siteRoutes } from '@/content/site';
import { expertiseSlugs } from '@/content/site/expertises';
import { getReferenceDetailRecords } from '@/content/site/references';
import { site } from '@/data/site';
import { locales } from '@/i18n/routing';
import { getPublishedJournalPosts } from '@/lib/journal';
import { localePath } from '@/lib/i18n/seo';

function buildAlternates(pathname: string) {
  const languages: Record<string, string> = {
    'x-default': new URL(localePath(pathname, 'fr'), site.url).toString(),
  };
  for (const locale of locales) {
    languages[locale] = new URL(localePath(pathname, locale), site.url).toString();
  }
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedJournalPosts();
  const staticPaths = Array.from(
    new Map(
      [{ href: '/' }, ...siteRoutes]
        .filter((route) => !route.href.includes('#'))
        .map((route) => [route.href, route.href]),
    ).values(),
  );

  const pathnames = [
    ...staticPaths,
    ...expertiseSlugs.map((slug) => `/expertises/${slug}`),
    ...getReferenceDetailRecords().map(({ slug }) => `/references/${slug}`),
    ...posts.map((post) => `/journal/${post.slug}`),
  ];

  return pathnames.flatMap((pathname) =>
    locales.map((locale) => ({
      url: new URL(localePath(pathname, locale), site.url).toString(),
      changeFrequency: pathname.startsWith('/journal') ? ('weekly' as const) : ('monthly' as const),
      alternates: {
        languages: buildAlternates(pathname),
      },
    })),
  );
}
