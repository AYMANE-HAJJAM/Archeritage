"use client";

import { useEffect } from 'react';

import Lenis from 'lenis';

import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap';

let activeLenisCount = 0;

export function useLenis() {
  useEffect(() => {
    registerGsapPlugins();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    activeLenisCount += 1;
    if (activeLenisCount > 1) {
      // Guard against accidental duplicate providers in the same document.
      return () => {
        activeLenisCount = Math.max(0, activeLenisCount - 1);
      };
    }

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    const onVisibility = () => (document.hidden ? lenis.stop() : lenis.start());
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    const refreshScrollTrigger = () => window.requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener('load', refreshScrollTrigger);
    document.addEventListener('visibilitychange', onVisibility);
    document.fonts.ready.then(refreshScrollTrigger);

    return () => {
      activeLenisCount = Math.max(0, activeLenisCount - 1);
      gsap.ticker.remove(raf);
      window.removeEventListener('load', refreshScrollTrigger);
      document.removeEventListener('visibilitychange', onVisibility);
      lenis.destroy();
    };
  }, []);
}
