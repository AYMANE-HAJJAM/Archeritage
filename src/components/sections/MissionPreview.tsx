import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ImageReveal } from '@/components/ui/ImageReveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionMarker } from '@/components/ui/SectionMarker';
import { Reveal } from '@/components/ui/Reveal';

export function MissionPreview() {
  return (
    <section id="mission-preview" className="bg-white/[0.015] py-20 sm:py-24 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <SectionMarker className="hidden sm:inline-flex" />
            <SectionLabel label="Mission" title="Préserver la mémoire des lieux, accompagner leur transformation." />
          </div>
          <Reveal>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              ARCHERITAGE intervient à l’intersection de l’architecture, du patrimoine et du développement territorial au Maroc.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              Notre rôle est de comprendre la valeur d’un lieu, d’en mesurer les contraintes, puis de construire une stratégie d’intervention qui respecte son histoire tout en ouvrant des usages nouveaux.
            </p>
          </Reveal>
          <Reveal className="mt-8" delay={0.08}>
            <Button href="/mission" variant="secondary">
              Découvrir la mission <ArrowRight className="h-4 w-4" />
            </Button>
          </Reveal>
        </div>
        <div className="relative">
          <ImageReveal src="/images/references/tiznit-cover.jpg" alt="Contexte urbain et patrimonial de Tiznit" className="aspect-[4/5]" fallbackLabel="Mission patrimoine" direction="right" />
          <div className="absolute left-4 top-4 max-w-[16rem] rounded-[0.65rem] border border-white/12 bg-[rgba(14,14,12,0.72)] p-4 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)]">Casablanca · Maroc</p>
            <p className="mt-2 text-sm leading-6 text-[var(--light)]">Un accompagnement pour lire, restaurer et valoriser les lieux patrimoniaux avec méthode.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
