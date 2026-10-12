import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { ExpertiseVisualType } from '@/types';

type ExpertiseVisualProps = {
  type: ExpertiseVisualType;
  eyebrow: string;
  label: string;
  className?: string;
};

const motifPaths: Record<ExpertiseVisualType, ReactNode> = {
  diagnostic: (
    <>
      <path d="M18 22H86M18 42H86M18 62H86M30 12V76M54 12V76M78 12V76" />
      <path d="M24 55C39 35 53 69 76 28" />
      <circle cx="24" cy="55" r="3" />
      <circle cx="76" cy="28" r="3" />
    </>
  ),
  restoration: (
    <>
      <path d="M16 30C32 22 49 22 88 30M16 48C36 40 55 41 88 48M16 66C39 58 60 59 88 66" />
      <path d="M24 20L80 76M44 18L88 62" />
      <circle cx="36" cy="47" r="8" />
    </>
  ),
  reconversion: (
    <>
      <path d="M18 22H54V70H18zM54 34H90V70H54z" />
      <path d="M30 46H42M66 52H78M54 22C64 20 74 23 84 31" />
      <path d="M76 24L85 31L76 38" />
    </>
  ),
  investor: (
    <>
      <path d="M22 65C38 39 54 79 82 30" />
      <path d="M18 30L42 18L68 28L88 18V70L66 80L40 70L18 80z" />
      <circle cx="22" cy="65" r="4" />
      <circle cx="82" cy="30" r="4" />
    </>
  ),
  studies: (
    <>
      <path d="M26 14H72L86 28V78H26z" />
      <path d="M72 14V30H86M38 42H74M38 54H70M38 66H60" />
      <path d="M56 27C50 27 46 31 46 36C46 41 50 45 56 45C62 45 66 41 66 36C66 31 62 27 56 27Z" />
    </>
  ),
  site: (
    <>
      <path d="M18 70H88M26 70V28L52 16L78 28V70" />
      <path d="M36 42H48V54H36zM58 42H70V54H58zM32 70C38 58 48 58 54 70M62 70C66 62 72 62 78 70" />
      <path d="M22 24L52 10L82 24" />
    </>
  ),
};

export function ExpertiseVisual({ type, eyebrow, label, className }: ExpertiseVisualProps) {
  return (
    <div className={cn('relative h-full min-h-[13rem] overflow-hidden bg-[#11100c]', className)}>
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(216,195,165,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(216,195,165,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute inset-5 border border-[rgba(216,195,165,0.16)]" />
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-[rgba(183,139,74,0.22)] transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute bottom-7 left-7 right-7 h-px bg-[linear-gradient(90deg,var(--accent),transparent)] opacity-80" />
      <div className="absolute left-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-[0.55rem] border border-white/12 bg-black/25 text-sm font-semibold text-[var(--light)] backdrop-blur-sm">
        {eyebrow}
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 104 92"
        className="absolute bottom-9 right-6 h-28 w-32 text-[var(--accent)] opacity-75 transition-all duration-700 group-hover:-translate-y-1 group-hover:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      >
        {motifPaths[type]}
      </svg>
      <div className="absolute bottom-6 left-6 max-w-[13rem]">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)]">{label}</p>
      </div>
    </div>
  );
}
