import Link from 'next/link';

import { Container } from '@/components/ui/Container';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { Reveal } from '@/components/ui/Reveal';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { projects } from '@/data/projects';
import type { Project } from '@/types';

type ProjectDetailContentProps = {
  project: Project;
};

export function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const previousProject = projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <>
      <section className="py-20 sm:py-24 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <SectionLabel label="Référence" title="Une intervention à documenter avec prudence et précision." />
            <Reveal className="article mt-6 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base" stagger={0.08} childSelector="[data-project-paragraph]">
              <p data-project-paragraph>{project.description}</p>
              <p data-project-paragraph>
                Les informations détaillées, visuels, partenaires et données sensibles seront intégrés après validation du client afin d’éviter toute affirmation non documentée.
              </p>
            </Reveal>
          </div>
          <Reveal className="surface-card grid gap-4 rounded-[0.75rem] p-6 text-sm leading-7 text-[var(--muted)]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">Localisation</p>
              <p className="mt-2 text-[var(--foreground)]">{project.location}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">Statut</p>
              <p className="mt-2 text-[var(--foreground)]">{project.year}</p>
            </div>
            {project.surface ? (
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">Surface</p>
                <p className="mt-2 text-[var(--foreground)]">{project.surface}</p>
              </div>
            ) : null}
          </Reveal>
        </Container>
      </section>

      <section className="py-10 sm:py-14 lg:py-16">
        <Container>
          <RevealGroup className="grid gap-4 md:grid-cols-2" childSelector="[data-project-nav-card]">
            <Link data-project-nav-card href={`/projets/${previousProject.slug}`} className="surface-card rounded-[0.75rem] p-6 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">Référence précédente</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{previousProject.title}</p>
            </Link>
            <Link data-project-nav-card href={`/projets/${nextProject.slug}`} className="surface-card rounded-[0.75rem] p-6 text-right transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">Référence suivante</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{nextProject.title}</p>
            </Link>
          </RevealGroup>
        </Container>
      </section>

      <section className="py-20 sm:py-24 lg:py-28">
        <Container>
          <SectionLabel label="Galerie" title="Visuels à compléter avec les documents validés." />
          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2" childSelector="[data-gallery-item]">
            {project.gallery.map((image, index) => (
              <div key={image} data-gallery-item>
                <ImageReveal src={image} alt={`${project.title} - image ${index + 1}`} className="aspect-[4/3]" fallbackLabel={project.title} />
              </div>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </>
  );
}
