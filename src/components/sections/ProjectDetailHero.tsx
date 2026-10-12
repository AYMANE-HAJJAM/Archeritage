import { Container } from '@/components/ui/Container';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import type { Project } from '@/types';

type ProjectDetailHeroProps = {
  project: Project;
};

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  return (
    <section className="pt-28 sm:pt-32 lg:pt-36">
      <Container className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div className="pb-8">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--accent)]">{project.categoryLabel}</p>
          <SplitTextReveal text={project.title} className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-[var(--light)] sm:text-6xl lg:text-[clamp(4rem,6vw,6.5rem)]" />
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">{project.excerpt}</p>
          <p className="mt-5 text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
            {project.location} · {project.year}{project.surface ? ` · ${project.surface}` : ''}
          </p>
        </div>
        <ImageReveal src={project.heroImage} alt={project.title} className="aspect-[4/5]" priority fallbackLabel={project.title} />
      </Container>
    </section>
  );
}
