import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';

type ContactCTAProps = {
  title?: string;
  subtitle?: string;
};

export function ContactCTA({ title = 'Prêt à cadrer une intervention patrimoniale ?', subtitle = 'Nous prenons le temps de lire le lieu, d’identifier ses contraintes et de structurer une réponse respectueuse de son histoire.' }: ContactCTAProps) {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="surface-card relative overflow-hidden rounded-[0.75rem] p-8 sm:p-10 lg:p-14">
          <div className="absolute inset-y-8 right-8 hidden w-px bg-[linear-gradient(180deg,var(--accent),transparent)] opacity-60 lg:block" />
          <div className="max-w-3xl">
            <SectionLabel label="Contact" title={title} />
            <Reveal>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--muted)]">{subtitle}</p>
            </Reveal>
          </div>
          <Reveal className="mt-8 flex flex-wrap gap-4" delay={0.08}>
            <Button href="/contact" variant="primary">
              Démarrer votre projet <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/projets" variant="secondary">
              Voir les références
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
