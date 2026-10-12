import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { services } from '@/data/services';
import { SectionMarker } from '@/components/ui/SectionMarker';
import { Reveal } from '@/components/ui/Reveal';
import { RevealGroup } from '@/components/ui/RevealGroup';

export function ServicesOverview() {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <SectionMarker className="hidden sm:inline-flex" />
            <SectionLabel label="Expertises" title="Accompagner les projets patrimoniaux de l’étude au chantier" />
          </div>
          <Reveal delay={0.12}>
            <Button href="/services" variant="secondary">
              Toutes les expertises <ArrowRight className="h-4 w-4" />
            </Button>
          </Reveal>
        </div>
        <RevealGroup className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} variant="featured" />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
