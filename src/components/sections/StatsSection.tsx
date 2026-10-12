import { Container } from '@/components/ui/Container';
import { RevealGroup } from '@/components/ui/RevealGroup';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StatItem } from '@/components/ui/StatItem';
import { cn } from '@/lib/utils';
import type { Stat } from '@/types';

type StatsSectionProps = {
  items?: Stat[];
  className?: string;
  title?: string;
  label?: string;
};

export function StatsSection({ items = [], className, title = 'Une pratique précise et durable', label = 'Repères' }: StatsSectionProps) {
  return (
    <section className={cn('py-20 sm:py-24 lg:py-28', className)}>
      <Container>
        <SectionLabel label={label} title={title} />
        <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
