"use client";

import { useMemo, useRef } from 'react';

import { useGSAP } from '@gsap/react';

import { gsap, registerGsapPlugins } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type SplitTextRevealProps = {
  text: string;
  as?: React.ElementType;
  className?: string;
};

export function SplitTextReveal({ text, as: Tag = 'h1', className }: SplitTextRevealProps) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement | null>(null);
  const words = useMemo(() => text.split(' '), [text]);

  useGSAP(
    () => {
      registerGsapPlugins();

      if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const wordItems = ref.current.querySelectorAll<HTMLElement>('[data-split-word]');

      gsap.fromTo(wordItems, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.03 });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={cn('text-balance', className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} data-split-word className="mr-[0.22em] inline-block">
          {word}
        </span>
      ))}
    </Tag>
  );
}
