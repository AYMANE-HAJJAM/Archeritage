'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins } from '@/lib/gsap';
import { motion } from '@/lib/motion-config';

export function PageMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    registerGsapPlugins();
    const root = ref.current;
    if (!root || reduced) return;

    root.querySelectorAll<HTMLElement>('.showcase-section').forEach((section) => {
      const eyebrow = section.querySelector('.eyebrow');
      const title = section.querySelector('h2');
      const intro = section.querySelector('.showcase-section__intro > p');
      const cards = section.querySelectorAll('.site-info-card');
      const points = section.querySelectorAll('.site-point-list > div');
      const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 78%', once: true } });
      if (eyebrow) timeline.fromTo(eyebrow, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: .45 });
      if (title) timeline.fromTo(title, { clipPath: 'inset(0 0 100% 0)', y: 32 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1, ease: motion.ease.strong }, .05);
      if (intro) timeline.fromTo(intro, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .65 }, .28);
      if (cards.length) timeline.fromTo(cards, { opacity: 0, y: 35, clipPath: 'inset(0 0 14% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', stagger: .09, duration: .78, ease: motion.ease.strong }, .35);
      if (points.length) timeline.fromTo(points, { opacity: 0, scaleX: .85, transformOrigin: 'left center' }, { opacity: 1, scaleX: 1, stagger: .07, duration: .55 }, .38);
    });

    const formFields = root.querySelectorAll('.contact-form label, .contact-form button');
    if (formFields.length) gsap.fromTo(formFields, { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: .07, duration: .65, ease: motion.ease.strong, scrollTrigger: { trigger: '.contact-form-panel', start: 'top 80%', once: true } });
  }, { scope: ref, dependencies: [reduced] });

  return <div ref={ref}>{children}</div>;
}
