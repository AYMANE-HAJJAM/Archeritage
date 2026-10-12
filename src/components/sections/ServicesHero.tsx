import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';

export function ServicesHero() {
  return (
    <section className="pt-28 sm:pt-32 lg:pt-36">
      <Container className="pb-10">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--accent)]">Expertises</p>
        <SplitTextReveal text="Des expertises au service du patrimoine et des projets durables." className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-0.06em] text-[var(--light)] sm:text-6xl lg:text-[clamp(4rem,6vw,6.25rem)]" />
        <Reveal>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            ARCHERITAGE accompagne les projets patrimoniaux au Maroc depuis la première lecture du lieu jusqu’aux dossiers, à la coordination et au suivi de chantier.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
