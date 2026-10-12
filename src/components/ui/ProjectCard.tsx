import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { SafeImage } from './SafeImage';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

type ProjectCardProps = {
  project: Project;
  className?: string;
  variant?: 'default' | 'featured';
};

export function ProjectCard({ project, className, variant = 'default' }: ProjectCardProps) {
  const imageSrc = project.coverImage || project.heroImage;

  return (
    <article
      className={cn(
        'surface-card group overflow-hidden rounded-[0.75rem] transition-colors duration-300 hover:border-[var(--accent)]',
        variant === 'featured' ? 'shadow-[0_18px_60px_rgba(0,0,0,0.22)]' : '',
        className,
      )}
      data-card
    >
      <Link href={`/projets/${project.slug}`} className="block h-full">
        <div className={cn('relative overflow-hidden', variant === 'featured' ? 'aspect-[4/5]' : 'aspect-[4/3]')}>
          <SafeImage src={imageSrc} alt={project.altText} fallbackLabel={project.title} className="h-full w-full rounded-none border-0 transition-transform duration-700 group-hover:scale-[1.06]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,14,12,0.82)] via-[rgba(14,14,12,0.18)] to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
          <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-[0.45rem] border border-white/12 bg-black/25 px-3 py-1.5 text-[10px] uppercase tracking-[0.35em] text-[var(--light)] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            {project.categoryLabel}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">{project.location} · {project.year}{project.surface ? ` · ${project.surface}` : ''}</p>
            <h3 className="mt-3 max-w-[18ch] text-2xl font-semibold tracking-[-0.04em] text-[var(--light)] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)] sm:text-[2.15rem]">
              {project.title}
            </h3>
          </div>
        </div>
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="max-w-[28ch] text-sm leading-7 text-[var(--muted)]">{project.excerpt}</p>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
          </div>
        </div>
      </Link>
    </article>
  );
}
