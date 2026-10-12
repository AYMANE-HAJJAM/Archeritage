import Link from 'next/link';

import { Container } from '@/components/ui/Container';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Reveal } from '@/components/ui/Reveal';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { cn } from '@/lib/utils';
import type { Project, ProjectCategory } from '@/types';

const filters: Array<{ label: string; value: ProjectCategory | 'all' }> = [
  { label: 'Tous', value: 'all' },
  { label: 'Patrimoine religieux', value: 'patrimoine-religieux' },
  { label: 'Kasbahs & médinas', value: 'kasbahs-medinas' },
  { label: 'Équipements culturels', value: 'equipements-culturels' },
  { label: 'Sites historiques', value: 'sites-historiques' },
  { label: 'Études & conseils', value: 'etudes-conseils' },
];

type ProjectsGridProps = {
  projects: Project[];
  activeCategory: ProjectCategory | 'all';
};

export function ProjectsGrid({ projects, activeCategory }: ProjectsGridProps) {
  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <Container>
        <Reveal className="flex flex-wrap gap-3" direction="up" stagger={0.04} childSelector="[data-filter-link]">
          {filters.map((filter) => (
            <Link
              key={filter.value}
              data-filter-link
              href={filter.value === 'all' ? '/projets' : `/projets?category=${filter.value}`}
              className={cn(
                'rounded-[0.55rem] border px-4 py-2 text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-colors',
                activeCategory === filter.value
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--background)]'
                  : 'border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
              )}
            >
              {filter.label}
            </Link>
          ))}
        </Reveal>
        <RevealGroup className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
