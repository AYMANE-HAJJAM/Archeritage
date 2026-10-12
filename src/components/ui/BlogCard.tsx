import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { SafeImage } from './SafeImage';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types';

type BlogCardProps = {
  post: Post;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="surface-card group overflow-hidden rounded-[0.75rem] transition-colors duration-300 hover:border-[var(--accent)]" data-card>
      <Link href={`/histoires/${post.slug}`} className="block h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <SafeImage src={post.coverImage || post.heroImage} alt={post.altText} fallbackLabel={post.title} className="h-full w-full rounded-none border-0 transition-transform duration-700 group-hover:scale-[1.06]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,14,12,0.76)] via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
        </div>
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">
            <span>{post.category}</span>
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]">{post.title}</h3>
            <ArrowUpRight className="mt-1 h-4 w-4 text-[var(--muted)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
          </div>
          <p className="text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
          <p className="inline-flex items-center gap-2 text-sm text-[var(--accent)]">
            Lire plus
            <span className="h-px w-8 bg-[var(--accent)] transition-all duration-300 group-hover:w-12" />
          </p>
        </div>
      </Link>
    </article>
  );
}
