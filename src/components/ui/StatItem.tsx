import { cn } from '@/lib/utils';
import type { Stat } from '@/types';

type StatItemProps = {
  stat: Stat;
  className?: string;
};

export function StatItem({ stat, className }: StatItemProps) {
  return (
    <div
      className={cn(
        'surface-card group flex h-full min-h-[12.5rem] flex-col rounded-[0.75rem] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-white/[0.035] sm:p-6',
        className,
      )}
      data-card
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <p className="max-w-[16rem] text-[10px] uppercase leading-5 tracking-[0.24em] text-[var(--accent)] sm:text-[11px]">{stat.label}</p>
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full border border-[var(--accent)] opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <p className="break-words text-[clamp(1.625rem,2.7vw,2.5rem)] font-semibold leading-tight tracking-[-0.025em] text-[var(--light)]">{stat.value}</p>
      <p className="mt-4 max-w-[18rem] text-sm leading-7 text-[var(--muted)]">{stat.detail}</p>
    </div>
  );
}
