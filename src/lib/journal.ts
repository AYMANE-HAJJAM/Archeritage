import { journalPosts, type JournalPost } from '@/content/site/official';

const sanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);

export function isJournalPostPublished(post: JournalPost): boolean {
  return post.body.some((paragraph) => paragraph.trim().length > 0);
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  // The local, approved publications remain the safe fallback until Sanity is configured.
  // A future Sanity adapter can be introduced here without coupling pages to the CMS.
  void sanityConfigured;
  return journalPosts;
}

export async function getPublishedJournalPosts(): Promise<JournalPost[]> {
  const posts = await getJournalPosts();
  return posts.filter(isJournalPostPublished);
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  const posts = await getPublishedJournalPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
