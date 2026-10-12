"use client";

import { useRef } from 'react';

import { useGSAP } from '@gsap/react';

import { gsap, registerGsapPlugins } from '@/lib/gsap';

type RevealGroupProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
  childSelector?: string;
};

const offsets = {
  up: { y: 36, x: 0 },
  down: { y: -36, x: 0 },
  left: { x: 36, y: 0 },
  right: { x: -36, y: 0 },
  none: { x: 0, y: 0 },
} as const;

export function RevealGroup({
  children,
  className,
  as: Component = 'div',
  direction = 'up',
  delay = 0,
  duration = 0.95,
  stagger = 0.1,
  once = true,
  amount = 0.82,
  childSelector = '[data-card]',
}: RevealGroupProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      registerGsapPlugins();

      if (!ref.current) {
        return;
      }

      const group = ref.current;
      const selectedChildren = Array.from(group.querySelectorAll<HTMLElement>(childSelector));
      const items = selectedChildren.length > 0 ? selectedChildren : Array.from(group.children).filter((child): child is HTMLElement => child instanceof HTMLElement);

      if (items.length === 0) {
        return;
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(items, { clearProps: 'all', autoAlpha: 1, opacity: 1, x: 0, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        items,
        { autoAlpha: 0, opacity: 0, scale: 0.98, ...offsets[direction] },
        {
          autoAlpha: 1,
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          ease: 'power3.out',
          delay,
          stagger,
          scrollTrigger: { trigger: group, start: `top ${amount * 100}%`, once },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Component ref={ref as never} className={className}>
      {children}
    </Component>
  );
}
