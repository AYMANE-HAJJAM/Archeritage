"use client";

import { useRef } from 'react';

import { useGSAP } from '@gsap/react';

import { gsap, registerGsapPlugins } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { SafeImage } from './SafeImage';

type ImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  fallbackLabel?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
  delay?: number;
  duration?: number;
};

const revealInsets = {
  up: 'inset(100% 0 0 0)',
  down: 'inset(0 0 100% 0)',
  left: 'inset(0 100% 0 0)',
  right: 'inset(0 0 0 100%)',
} as const;

export function ImageReveal({ src, alt, className, priority, sizes, fill = true, fallbackLabel, direction = 'up', once = true, delay = 0, duration = 1.05 }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      registerGsapPlugins();

      if (!ref.current) {
        return;
      }

      const image = ref.current.querySelector<HTMLElement>('[data-image-reveal-media]');

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set([ref.current, image].filter(Boolean), { clearProps: 'all', opacity: 1, scale: 1, clipPath: 'inset(0 0 0 0)' });
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 84%', once },
        defaults: { ease: 'power3.out' },
      });

      timeline.fromTo(ref.current, { clipPath: revealInsets[direction], autoAlpha: 0, opacity: 0 }, { clipPath: 'inset(0 0 0 0)', autoAlpha: 1, opacity: 1, duration, delay });

      if (image) {
        timeline.fromTo(image, { scale: 1.08 }, { scale: 1, duration: duration + 0.15 }, '<');
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn('relative overflow-hidden rounded-[0.75rem] border border-[var(--border)] bg-white/5', className)}>
      <div data-image-reveal-media className="h-full w-full">
        <SafeImage src={src} alt={alt} priority={priority} sizes={sizes} fill={fill} fallbackLabel={fallbackLabel} />
      </div>
    </div>
  );
}
