import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SafeImage } from '@/components/ui/SafeImage';

export function HomeHero() {
  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-[#0d0d0a]">
      <div className="absolute inset-0">
        <SafeImage
          src="/images/references/tinmel-cover.jpg"
          alt="Patrimoine architectural marocain"
          priority
          sizes="100vw"
          fallbackLabel="ARCHERITAGE"
          className="h-full w-full rounded-none border-0"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,13,10,0.92),rgba(13,13,10,0.52)_48%,rgba(13,13,10,0.32)),linear-gradient(180deg,rgba(13,13,10,0.35),rgba(13,13,10,0.92))]" />
      </div>

      <div className="absolute inset-0 heritage-grid opacity-[0.08]" />

      <Container className="relative z-10 flex min-h-[92svh] items-end pb-12 pt-32 sm:pb-16 lg:items-center lg:pb-0 lg:pt-24">
        <Reveal className="max-w-5xl" direction="up" stagger={0.08} childSelector="[data-hero-item]">
          <p data-hero-item className="text-[11px] uppercase tracking-[0.34em] text-[var(--accent)]">
            Casablanca · Maroc · Architecture du patrimoine
          </p>
          <h1 data-hero-item className="mt-6 max-w-5xl text-[clamp(3.5rem,8vw,8rem)] font-semibold leading-[0.93] tracking-[-0.07em] text-[var(--light)]">
            Réhabiliter le patrimoine marocain pour lui donner un avenir.
          </h1>
          <p data-hero-item className="mt-7 max-w-2xl text-base leading-8 text-[rgba(245,240,232,0.78)] sm:text-lg">
            ARCHERITAGE accompagne les projets de restauration, de réhabilitation et de valorisation du patrimoine architectural au Maroc.
          </p>
          <div data-hero-item className="mt-9 flex flex-wrap gap-4">
            <Button href="#expertises" variant="primary">
              Découvrir nos expertises <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/contact" variant="secondary" className="bg-black/25 backdrop-blur-sm">
              Parler d’un projet
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
