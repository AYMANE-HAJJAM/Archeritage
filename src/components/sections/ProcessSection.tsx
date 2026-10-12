import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionMarker } from '@/components/ui/SectionMarker';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { cn } from '@/lib/utils';
import { processSteps } from '@/data/process';
import type { ProcessStep } from '@/types';

type ProcessSectionProps = {
  steps?: ProcessStep[];
  className?: string;
  title?: string;
  label?: string;
  intro?: string;
};

export function ProcessSection({ steps = processSteps, className, title = 'Un processus lisible du premier échange à la livraison', label = 'Processus', intro }: ProcessSectionProps) {
  return (
    <section className={cn('bg-white/[0.015] py-20 sm:py-24 lg:py-28', className)}>
      <Container>
        <div className="flex items-center gap-4">
          <SectionMarker className="hidden sm:inline-flex" />
          <SectionLabel label={label} title={title} />
        </div>
        {intro ? <p className="mt-6 max-w-3xl text-sm leading-7 text-[var(--muted)]">{intro}</p> : null}
        <RevealGroup className="mt-10 grid gap-5 overflow-x-auto pb-2 md:grid-cols-2 lg:grid-cols-5 lg:overflow-visible">
          {steps.map((step) => (
              <article key={step.number} className="surface-card h-full rounded-[0.75rem] p-5" data-card>
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">{step.number}</span>
                  <span className="h-px flex-1 bg-[linear-gradient(90deg,var(--accent),transparent)]" />
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{step.description}</p>
              </article>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
