import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';

export function ProjectsHero() {
  return (
    <section className="pt-28 sm:pt-32 lg:pt-36">
      <Container className="pb-10">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--accent)]">Références</p>
        <SplitTextReveal text="Des références patrimoniales à documenter et valoriser avec précision." className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-0.06em] text-[var(--light)] sm:text-6xl lg:text-[clamp(4rem,6vw,6.5rem)]" />
        <Reveal>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            Cette sélection présente des sujets de restauration, de réhabilitation, de diagnostic et d’accompagnement. Les informations sensibles restent à compléter avec les éléments validés par le client.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
