"use client";

import { useRef } from 'react';

import { useGSAP } from '@gsap/react';

import { gsap, registerGsapPlugins } from '@/lib/gsap';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
  childSelector?: string;
  as?: React.ElementType;
};

const offsets = {
  up: { y: 42, x: 0 },
  down: { y: -42, x: 0 },
  left: { x: 42, y: 0 },
  right: { x: -42, y: 0 },
  none: { x: 0, y: 0 },
} as const;

export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 1.05,
  stagger = 0,
  once = true,
  amount = 0.82,
  childSelector = '[data-reveal-item]',
  as: Component = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      registerGsapPlugins();

      if (!ref.current) {
        return;
      }

      const target = ref.current;
      const animatedChildren = target.querySelectorAll<HTMLElement>(childSelector);
      const initial = offsets[direction];
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        gsap.set([target, ...Array.from(animatedChildren)], { clearProps: 'all', opacity: 1, x: 0, y: 0 });
        return;
      }

      if (stagger > 0 && animatedChildren.length > 0) {
        gsap.fromTo(animatedChildren, { autoAlpha: 0, ...initial }, {
          autoAlpha: 1,
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          ease: 'power3.out',
          stagger,
          delay,
          scrollTrigger: { trigger: target, start: `top ${amount * 100}%`, once },
        });
        return;
      }

      gsap.fromTo(target, { autoAlpha: 0, ...initial }, {
        autoAlpha: 1,
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        ease: 'power3.out',
        delay,
        scrollTrigger: { trigger: target, start: `top ${amount * 100}%`, once },
      });
    },
    { scope: ref },
  );

  return (
    <Component ref={ref as never} className={className}>
      {children}
    </Component>
  );
}
