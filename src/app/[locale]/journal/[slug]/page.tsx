import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Container } from '@/components/ui/Container';
import { CTASection } from '@/components/ui/CTASection';
import { getJournalPostBySlug, getPublishedJournalPosts } from '@/lib/journal';
import { routing } from '@/i18n/routing';
import { buildLocaleAlternates, getLocaleOpenGraph } from '@/lib/i18n/seo';

type JournalPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type JournalPostMessages = { title: string; description: string; category: string; imageAlt?: string };

export async function generateStaticParams() {
  const posts = await getPublishedJournalPosts();
  return routing.locales.flatMap((locale) => posts.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: JournalPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) return {};

  const copy = (await getMessages({ locale }) as { journal: { posts: Record<string, JournalPostMessages> } }).journal.posts[slug];
  const title = copy?.title ?? post.title;
  const description = copy?.description ?? post.description;
  const alternates = buildLocaleAlternates(`/journal/${slug}`, locale);

  return {
    title,
    description,
    alternates,
    openGraph: getLocaleOpenGraph(locale, { title, description, url: alternates.canonical as string }),
  };
}

export default async function JournalPostPage({ params }: JournalPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getJournalPostBySlug(slug);
  if (!post) notFound();

  const messages = (await getMessages()) as {
    journal: { posts: Record<string, JournalPostMessages>; finalCta: { text: string } };
    common: { contactUsCta: string };
  };
  const copy = messages.journal.posts[slug];
  const title = copy?.title ?? post.title;
  const description = copy?.description ?? post.description;
  const category = copy?.category ?? post.category;
  const imageAlt = copy?.imageAlt ?? post.imageAlt ?? '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    publisher: { '@type': 'Organization', name: 'ARCHERITAGE' },
    mainEntityOfPage: `https://archeritage.ma/journal/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="article-page">
        <Container>
          <p className="eyebrow">{category}</p>
          <h1>{title}</h1>
          <p className="article-page__lede">{description}</p>
          {post.image ? (
            <div className="article-page__image">
              <Image src={post.image} alt={imageAlt} fill priority sizes="(min-width: 1024px) 1280px, 100vw" />
            </div>
          ) : null}
          {/* Body paragraphs are not yet localized per-locale in the content pipeline; they
              render as authored (currently empty until the Journal is populated). */}
          <div className="article-page__body">
            {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </Container>
      </article>
      <CTASection text={messages.journal.finalCta.text} label={messages.common.contactUsCta} />
    </>
  );
}
