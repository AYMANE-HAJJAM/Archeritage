import { Container } from '@/components/ui/Container';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function MissionContent() {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <Container className="grid gap-14 lg:grid-cols-2 lg:items-start">
        <div className="space-y-8">
          <SectionLabel label="Notre approche" title="Lire le lieu avant de le transformer." />
          <Reveal>
            <div className="space-y-6 text-sm leading-7 text-[var(--muted)] sm:text-base">
              <p>
                Notre rôle est de comprendre la valeur d’un lieu, d’en mesurer les contraintes, puis de construire une stratégie d’intervention qui respecte son histoire tout en ouvrant des usages nouveaux.
              </p>
              <p>
                Pour les institutions, propriétaires, investisseurs marocains, MRE ou porteurs de projets à l’étranger, ARCHERITAGE apporte une méthode entre rigueur technique, sensibilité culturelle et connaissance du contexte local.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-6">
          <ImageReveal src="/images/missions/mission-etude-plans.jpg" alt="Étude de plans dans un contexte de projet architectural" className="aspect-[5/4]" fallbackLabel="Étude architecturale" />
          <Reveal>
            <p className="surface-card rounded-[0.75rem] p-6 text-sm leading-7 text-[var(--muted)]">
              Patrimoine, investissement et territoire doivent être pensés ensemble: le projet doit conserver l’âme du lieu, clarifier ses contraintes et retrouver un usage viable.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
