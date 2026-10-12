import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { services } from '@/data/services';

export function ServicesContent() {
  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <Container>
        <SectionLabel label="Expertises" title="Des expertises au service du patrimoine et des projets durables." />
        <Reveal>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            Chaque projet patrimonial demande une lecture fine du lieu, de son histoire, de ses contraintes et de son potentiel d’usage. ARCHERITAGE structure cette démarche depuis le diagnostic jusqu’à la réalisation.
          </p>
        </Reveal>
        <RevealGroup className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
