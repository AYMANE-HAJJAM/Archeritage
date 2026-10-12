'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins } from '@/lib/gsap';
import {
  curtainImage,
  drawLine,
  ensureSectionVisible,
  fadeRise,
  forceVisible,
  isMobileViewport,
  motionTokens,
  planeReveal,
  revealLineMask,
  sectionScrollTrigger,
} from '@/lib/motion';

type EditorialMotionProps = {
  children: React.ReactNode;
  className?: string;
};

const MEDIA_CARD_BODY =
  '[data-motion-body], .pillar-card__body, .reference-card__body, .journal-preview-card__body, .home-reference-card__body';

/**
 * Architectural motion controller.
 * One timeline per hero / section composition — not per-element fade-ups.
 *
 * data-motion="hero" | "section"
 * data-motion-heading | eyebrow | copy | line | item | media | body
 */
export function EditorialMotion({ children, className }: EditorialMotionProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    registerGsapPlugins();
    if (!root.current) return;

    const scope = root.current;
    const mobile = isMobileViewport();

    if (reduced) {
      forceVisible(gsap, scope);
      return;
    }

    // —— Page heroes (load entrance, no ScrollTrigger) ——
    scope.querySelectorAll<HTMLElement>('[data-motion="hero"]').forEach((hero) => {
      const eyebrow = hero.querySelector<HTMLElement>('.eyebrow, [data-motion-eyebrow]');
      const heading = hero.querySelector<HTMLElement>('h1, [data-motion-heading]');
      const copy = hero.querySelectorAll<HTMLElement>('[data-motion-copy], .lede, .page-hero__copy > p');
      const rule = hero.querySelector<HTMLElement>('[data-motion-line]');
      const heroMedia = hero.querySelectorAll<HTMLElement>('[data-motion-media]');
      const timeline = gsap.timeline({ defaults: { ease: motionTokens.ease.major } });

      if (eyebrow) {
        gsap.set(eyebrow, { autoAlpha: 0, x: mobile ? 0 : -8 });
        timeline.to(eyebrow, { autoAlpha: 1, x: 0, duration: motionTokens.duration.ui }, 0.04);
      }

      if (heading) {
        const tween = revealLineMask(gsap, heading, {
          duration: mobile ? 0.68 : motionTokens.duration.hero,
          stagger: motionTokens.stagger.inner,
        });
        if (tween) timeline.add(tween, 0.08);
      }

      if (rule) {
        gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
        timeline.to(rule, { scaleX: 1, duration: 0.5, ease: motionTokens.ease.reveal }, '-=0.55');
      }

      if (copy.length) {
        timeline.add(
          fadeRise(gsap, copy, {
            duration: mobile ? 0.4 : 0.5,
            stagger: motionTokens.stagger.inner,
            y: mobile ? 8 : 12,
          })!,
          '-=0.42',
        );
      }

      heroMedia.forEach((node, index) => {
        const dirAttr = node.dataset.motionDir as 'left' | 'right' | 'up' | undefined;
        const tween = curtainImage(gsap, node, mobile ? 'up' : (dirAttr ?? 'right'), {
          duration: mobile ? 0.5 : 0.72,
        });
        if (tween) timeline.add(tween, index === 0 ? '-=0.48' : '-=0.52');
      });
    });

    // —— Section compositions (one ScrollTrigger each) ——
    scope.querySelectorAll<HTMLElement>('[data-motion="section"]').forEach((section, sectionIndex) => {
      const heading = section.querySelector<HTMLElement>('[data-motion-heading], .section-heading h2');
      const eyebrow = section.querySelector<HTMLElement>('.section-heading .eyebrow, [data-motion-eyebrow]');
      const line = section.querySelectorAll<HTMLElement>('[data-motion-line]');
      const mediaCards = [...section.querySelectorAll<HTMLElement>('[data-motion-item]')].filter((el) =>
        el.querySelector('[data-motion-media]'),
      );
      const items = [...section.querySelectorAll<HTMLElement>('[data-motion-item]')].filter(
        (el) => !el.querySelector('[data-motion-media]'),
      );
      const standaloneMedia = [...section.querySelectorAll<HTMLElement>('[data-motion-media]')].filter(
        (node) => !mediaCards.some((card) => card.contains(node)),
      );
      const copy = section.querySelectorAll<HTMLElement>('[data-motion-copy]');
      const directions = ['right', 'left', 'up'] as const;
      const isEditorial =
        section.classList.contains('home-references-section') ||
        section.classList.contains('cabinet-section') ||
        section.classList.contains('expertise-detail');

      const startToken = mobile
        ? motionTokens.trigger.mobile
        : isEditorial
          ? motionTokens.trigger.editorial
          : motionTokens.trigger.desktop;
      const startPercent = Number.parseInt(startToken.replace(/\D/g, ''), 10) || 86;

      const timeline = gsap.timeline({
        scrollTrigger: sectionScrollTrigger(section, mobile, isEditorial),
        defaults: { ease: motionTokens.ease.reveal },
      });

      // 1. Structural cue (eyebrow + line)
      if (eyebrow) {
        gsap.set(eyebrow, { autoAlpha: 0, x: mobile ? 0 : -6 });
        timeline.to(eyebrow, { autoAlpha: 1, x: 0, duration: motionTokens.duration.ui }, 0);
      }

      if (line.length) {
        line.forEach((node, index) => {
          const axis = node.dataset.motionAxis === 'y' ? 'y' : 'x';
          timeline.add(drawLine(gsap, node, axis, { duration: 0.48 })!, index === 0 ? 0.02 : '-=0.4');
        });
      }

      // 2. Heading plane
      if (heading) {
        const tween = revealLineMask(gsap, heading, {
          duration: mobile ? 0.52 : 0.62,
          stagger: motionTokens.stagger.inner,
        });
        if (tween) timeline.add(tween, 0.04);
      }

      // 3. Supporting copy — almost immediately
      if (copy.length) {
        timeline.add(
          fadeRise(gsap, copy, {
            duration: 0.42,
            stagger: motionTokens.stagger.inner,
            y: mobile ? 8 : 10,
          })!,
          '-=0.36',
        );
      }

      // 4. Standalone media
      standaloneMedia.forEach((node, index) => {
        const dirAttr = node.dataset.motionDir as 'left' | 'right' | 'up' | undefined;
        const direction = dirAttr ?? directions[(sectionIndex + index) % directions.length];
        const tween = curtainImage(gsap, node, mobile ? 'up' : direction, {
          duration: mobile ? 0.48 : 0.62,
        });
        if (tween) timeline.add(tween, index === 0 ? '-=0.28' : `-=${mobile ? 0.42 : 0.5}`);
      });

      // 5. Media cards — one composition each, group stagger ~70ms (total under ~900ms)
      if (mediaCards.length) {
        timeline.addLabel('cards', standaloneMedia.length ? '-=0.2' : '-=0.14');
        mediaCards.forEach((card, index) => {
          const mediaNode = card.querySelector<HTMLElement>('[data-motion-media]');
          const body = card.querySelector<HTMLElement>(MEDIA_CARD_BODY);
          const dirAttr = mediaNode?.dataset.motionDir as 'left' | 'right' | 'up' | undefined;
          const direction = dirAttr ?? directions[(sectionIndex + index) % directions.length];
          const at = `cards+=${index * (mobile ? 0.055 : 0.07)}`;

          if (mediaNode) {
            const mediaTween = curtainImage(gsap, mediaNode, mobile ? 'up' : direction, {
              duration: mobile ? 0.4 : 0.5,
            });
            if (mediaTween) timeline.add(mediaTween, at);
          }

          if (body) {
            timeline.add(
              fadeRise(gsap, body, {
                duration: mobile ? 0.3 : 0.34,
                y: mobile ? 6 : 8,
              })!,
              `${at}+=0.07`,
            );
          }
        });
      }

      // 6. Text-only groups (profiles, matrix rows, CTAs) — coordinated, short stagger
      if (items.length) {
        const isFormatTable = section.classList.contains('missions-formats-section');
        const isAudienceBand = section.classList.contains('missions-audience-section');
        const isClientBand = section.classList.contains('home-clients-section') || Boolean(section.querySelector('.client-segment-grid'));

        if (isAudienceBand || (isClientBand && !mediaCards.length)) {
          timeline.add(
            planeReveal(gsap, items, {
              duration: 0.4,
              stagger: motionTokens.stagger.group,
            })!,
            mediaCards.length || standaloneMedia.length ? '-=0.3' : '-=0.28',
          );
        } else {
          timeline.add(
            fadeRise(gsap, items, {
              duration: isFormatTable ? (mobile ? 0.36 : 0.42) : mobile ? 0.34 : 0.4,
              stagger: isFormatTable ? motionTokens.stagger.group : motionTokens.stagger.inner,
              y: mobile ? 8 : 10,
            })!,
            mediaCards.length || standaloneMedia.length ? '-=0.28' : '-=0.24',
          );
        }
      }

      ensureSectionVisible(timeline, section, startPercent);
    });
  }, { scope: root, dependencies: [reduced] });

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
