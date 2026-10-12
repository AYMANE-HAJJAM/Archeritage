import { Container } from '@/components/ui/Container';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { Reveal } from '@/components/ui/Reveal';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';

export function ContactHero() {
  return (
    <section className="pt-28 sm:pt-32 lg:pt-36">
      <Container className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div className="pb-10">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--accent)]">Contact</p>
          <SplitTextReveal text="Parlons de votre projet patrimonial au Maroc." className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-[var(--light)] sm:text-6xl lg:text-[clamp(4rem,6vw,6.5rem)]" />
          <Reveal>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              Que vous soyez propriétaire, institution, investisseur marocain, MRE ou porteur de projet à l’étranger, ARCHERITAGE vous accompagne dans la compréhension, la structuration et la mise en œuvre de votre projet.
            </p>
          </Reveal>
        </div>
        <ImageReveal src="/images/cabinet/cabinet-architecture-institutionnelle.jpg" alt="Architecture institutionnelle dans son contexte territorial" className="aspect-[4/5]" priority fallbackLabel="Contact ARCHERITAGE" />
      </Container>
    </section>
  );
}
