import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Reveal } from '@/components/ui/Reveal';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { processSteps } from '@/data/process';
import { projects } from '@/data/projects';
import type { Service } from '@/types';

type ServiceDetailContentProps = {
  service: Service;
};

export function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  const relatedProjects = projects.filter((project) => service.relatedProjectSlugs.includes(project.slug));

  return (
    <>
      <section className="py-20 sm:py-24 lg:py-28">
        <Container className="grid gap-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionLabel label="Ce que couvre l’expertise" title="Une méthode claire pour intervenir avec responsabilité." />
            <Reveal>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">{service.description}</p>
            </Reveal>
          </div>
          <Reveal className="surface-card grid gap-5 rounded-[0.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">Livrables et points d’attention</h2>
            <ul className="grid gap-4 text-sm leading-7 text-[var(--muted)]">
              {service.highlights.map((highlight) => (
                <li key={highlight} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                  {highlight}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-24 lg:py-28">
        <Container>
          <SectionLabel label="Méthodologie" title="Les étapes patrimoniales appliquées à cette expertise." />
          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {processSteps.map((step) => (
              <article key={step.number} className="surface-card rounded-[0.75rem] p-5" data-card>
                <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">{step.number}</p>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{step.description}</p>
              </article>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {relatedProjects.length ? (
        <section className="py-20 sm:py-24 lg:py-28">
          <Container>
            <SectionLabel label="Références" title="Références associées à cette expertise." />
            <RevealGroup className="mt-10 grid gap-6 lg:grid-cols-2">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </RevealGroup>
          </Container>
        </section>
      ) : null}

      <section className="py-10 sm:py-14 lg:py-16">
        <Container>
          <Reveal className="flex flex-wrap gap-4">
            <Button href="/projets" variant="secondary">
              Voir les références
            </Button>
            <Button href="/contact" variant="primary">
              Nous contacter <ArrowRight className="h-4 w-4" />
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
