'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap';
import {
  ensureSectionVisible,
  fadeRise,
  isMobileViewport,
  motionTokens,
  prefersReducedMotion,
} from '@/lib/motion';

/**
 * PATRIGOV method progression — one entrance timeline + one shared active-stage observer.
 * No per-step entrance fade-ups; steps become active as they enter.
 */
export function MethodTimeline({ steps }: { steps: readonly (readonly [string, string])[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGsapPlugins();
    if (!root.current) return;

    const line = root.current.querySelector('[data-line]');
    const items = root.current.querySelectorAll<HTMLElement>('li');
    const mobile = isMobileViewport();
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set([line, ...items].filter(Boolean), {
        clearProps: 'all',
        opacity: 1,
        autoAlpha: 1,
        scaleX: 1,
        scaleY: 1,
        y: 0,
      });
      items.forEach((item) => item.classList.add('is-active'));
      return;
    }

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: mobile ? 'top 88%' : 'top 82%',
        once: true,
        fastScrollEnd: true,
      },
      defaults: { ease: motionTokens.ease.reveal },
    });

    if (line) {
      gsap.set(line, {
        ...(mobile ? { scaleY: 0 } : { scaleX: 0 }),
        transformOrigin: mobile ? 'top center' : 'left center',
      });
      timeline.to(line, {
        ...(mobile ? { scaleY: 1 } : { scaleX: 1 }),
        duration: mobile ? 0.7 : 0.85,
      }, 0);
    }

    timeline.add(
      fadeRise(gsap, items, {
        duration: mobile ? 0.38 : 0.48,
        stagger: motionTokens.stagger.group,
        y: mobile ? 8 : 12,
      })!,
      0.08,
    );

    ensureSectionVisible(timeline, root.current, mobile ? 88 : 82);

    // Single observer pattern: mark steps active as they enter — no separate entrance ST per item
    items.forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 78%',
        once: true,
        fastScrollEnd: true,
        onEnter: () => item.classList.add('is-active'),
      });
    });
  }, { scope: root });

  return (
    <div className="method-timeline" ref={root}>
      <div className="method-timeline__line" data-line />
      <ol>
        {steps.map(([title, text], index) => (
          <li key={title}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
