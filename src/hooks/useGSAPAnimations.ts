"use client";

import { RefObject, useEffect } from 'react';

import { useGSAP } from '@gsap/react';

import { gsap, registerGsapPlugins } from '@/lib/gsap';

export function useGSAPAnimations(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    registerGsapPlugins();
  }, []);

  useGSAP(
    () => {
      const scope = scopeRef.current;

      if (!scope) {
        return;
      }

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        return;
      }

      const revealItems = scope.querySelectorAll<HTMLElement>('[data-reveal]');
      const cardItems = scope.querySelectorAll<HTMLElement>('[data-card]');

      gsap.set(revealItems, { opacity: 0, y: 28 });
      gsap.set(cardItems, { opacity: 0, y: 36 });

      gsap.to(revealItems, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: scope,
          start: 'top 80%',
        },
      });

      gsap.to(cardItems, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: scope,
          start: 'top 78%',
        },
      });
    },
    { scope: scopeRef },
  );
}
