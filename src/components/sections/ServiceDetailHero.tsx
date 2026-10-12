import { Container } from '@/components/ui/Container';
import { ExpertiseVisual } from '@/components/ui/ExpertiseVisual';
import { Reveal } from '@/components/ui/Reveal';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import type { Service } from '@/types';

type ServiceDetailHeroProps = {
  service: Service;
};

export function ServiceDetailHero({ service }: ServiceDetailHeroProps) {
  return (
    <section className="pt-28 sm:pt-32 lg:pt-36">
      <Container className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-end">
        <div className="pb-10">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--accent)]">Expertise {service.eyebrow}</p>
          <SplitTextReveal text={service.title} className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-[var(--light)] sm:text-6xl lg:text-[clamp(4rem,6vw,6.5rem)]" />
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">{service.intro}</p>
        </div>
        <Reveal className="aspect-[4/5] overflow-hidden rounded-[0.75rem] border border-[var(--border)]" direction="right">
          <ExpertiseVisual type={service.visualType} eyebrow={service.eyebrow} label={service.visualLabel} className="h-full min-h-full" />
        </Reveal>
      </Container>
    </section>
  );
}
