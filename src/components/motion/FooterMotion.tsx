'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins } from '@/lib/gsap';
import { ensureSectionVisible, fadeRise, forceVisible, motionTokens, planeReveal } from '@/lib/motion';

export function FooterMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    registerGsapPlugins();
    if (!ref.current) return;

    if (reduced) {
      forceVisible(gsap, ref.current);
      return;
    }

    const wordmark = ref.current.querySelector('.site-footer__logo');
    const columns = ref.current.querySelectorAll('.site-footer__grid > *');
    const bottom = ref.current.querySelector('.site-footer__bottom');
    const topRule = ref.current.querySelector('.site-footer__rule');

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: motionTokens.trigger.footer,
        once: true,
        fastScrollEnd: true,
      },
      defaults: { ease: motionTokens.ease.reveal },
    });

    if (topRule) {
      gsap.set(topRule, { scaleX: 0, transformOrigin: 'left center' });
      timeline.to(topRule, { scaleX: 1, duration: 0.48 }, 0);
    }

    if (wordmark) {
      timeline.add(planeReveal(gsap, wordmark, { duration: 0.42 })!, 0.06);
    }

    if (columns.length) {
      timeline.add(
        fadeRise(gsap, columns, {
          duration: 0.4,
          stagger: motionTokens.stagger.inner,
          y: 10,
        })!,
        0.12,
      );
    }

    if (bottom) {
      timeline.fromTo(bottom, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.32 }, '-=0.18');
    }

    ensureSectionVisible(timeline, ref.current, 92);
  }, { scope: ref, dependencies: [reduced] });

  return <div ref={ref}>{children}</div>;
}
