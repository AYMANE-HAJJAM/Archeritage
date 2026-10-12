import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { projects } from '@/data/projects';
import { SectionMarker } from '@/components/ui/SectionMarker';
import { RevealGroup } from '@/components/ui/RevealGroup';

export function FeaturedProjects() {
  return (
    <section className="bg-white/[0.015] py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <SectionMarker className="hidden sm:inline-flex" />
            <SectionLabel label="Références" title="Sujets patrimoniaux à documenter et valoriser" />
          </div>
          <Button href="/projets" variant="secondary">
            Voir les références <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <RevealGroup className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {projects.slice(0, 4).map((project) => (
            <ProjectCard key={project.slug} project={project} variant="featured" />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
