"use client";

import { useRef } from 'react';

import { useGSAP } from '@gsap/react';

import { gsap, registerGsapPlugins } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type SectionLabelProps = {
  label: string;
  title?: string;
  className?: string;
};

export function SectionLabel({ label, title, className }: SectionLabelProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      registerGsapPlugins();

      if (!ref.current) {
        return;
      }

      const items = ref.current.querySelectorAll<HTMLElement>('[data-section-label-item]');

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(items, { clearProps: 'all', opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        items,
        { autoAlpha: 0, opacity: 0, y: 24 },
        {
          autoAlpha: 1,
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: 'top 84%', once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn('space-y-3', className)}>
      <p data-section-label-item className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">{label}</p>
      {title ? <h2 data-section-label-item className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl lg:text-5xl">{title}</h2> : null}
    </div>
  );
}
