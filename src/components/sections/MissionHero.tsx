import { Container } from '@/components/ui/Container';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';

export function MissionHero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <Container className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div className="pb-10">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--accent)]">Notre mission</p>
          <SplitTextReveal text="Préserver la mémoire des lieux, accompagner leur transformation." className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-[var(--light)] sm:text-6xl lg:text-[clamp(4rem,6vw,6.5rem)]" />
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            ARCHERITAGE intervient à l’intersection de l’architecture, du patrimoine et du développement territorial.
          </p>
        </div>
        <ImageReveal src="/images/references/tinmel-cover.jpg" alt="Patrimoine architectural de la mosquée de Tinmel" className="aspect-[4/5]" priority fallbackLabel="Mission patrimoine" />
      </Container>
    </section>
  );
}
