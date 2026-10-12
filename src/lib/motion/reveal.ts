import type { gsap as GsapType } from 'gsap';
import { gsap } from '@/lib/gsap';
import { motionTokens } from './tokens';
import { isMobileViewport } from './prefers';

type TweenTarget = gsap.TweenTarget;
type Gsap = typeof GsapType;

export function prepareLineMask(element: HTMLElement) {
  if (element.dataset.lineMasked === 'true') return;

  const fullText = element.textContent?.trim() ?? '';
  if (!fullText) return;

  element.setAttribute('aria-label', fullText);
  const parts = fullText.includes('. ')
    ? fullText.split(/(?<=\.)\s+/).filter(Boolean)
    : [fullText];

  const useSingle = isMobileViewport() && parts.length > 2;
  const lines = useSingle ? [fullText] : parts;

  element.textContent = '';
  element.classList.add('line-mask');

  for (const part of lines) {
    const line = document.createElement('span');
    line.className = 'line-mask__line';
    line.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.className = 'line-mask__inner';
    inner.textContent = part;
    line.appendChild(inner);
    element.appendChild(line);
  }

  element.dataset.lineMasked = 'true';
}

export function revealLineMask(
  gsap: Gsap,
  element: HTMLElement,
  options: { duration?: number; stagger?: number; delay?: number } = {},
) {
  prepareLineMask(element);
  const inners = element.querySelectorAll<HTMLElement>('.line-mask__inner');
  if (!inners.length) return null;

  gsap.set(inners, { yPercent: 110, opacity: 0 });
  return gsap.to(inners, {
    yPercent: 0,
    opacity: 1,
    duration: options.duration ?? motionTokens.duration.reveal,
    stagger: options.stagger ?? motionTokens.stagger.inner,
    delay: options.delay ?? 0,
    ease: motionTokens.ease.major,
  });
}

export function drawLine(
  gsap: Gsap,
  element: TweenTarget,
  axis: 'x' | 'y' = 'x',
  options: { duration?: number; delay?: number } = {},
) {
  const from = axis === 'x' ? { scaleX: 0 } : { scaleY: 0 };
  const to = axis === 'x' ? { scaleX: 1 } : { scaleY: 1 };
  gsap.set(element, {
    ...from,
    transformOrigin: axis === 'x' ? 'left center' : 'top center',
  });
  return gsap.to(element, {
    ...to,
    duration: options.duration ?? motionTokens.duration.soft,
    delay: options.delay ?? 0,
    ease: motionTokens.ease.reveal,
  });
}

export function curtainImage(
  gsap: Gsap,
  media: HTMLElement,
  direction: 'left' | 'right' | 'up' = 'up',
  options: { duration?: number; delay?: number; reduced?: boolean; simple?: boolean } = {},
) {
  const image = media.querySelector('img') ?? media;
  const clips = {
    up: 'inset(100% 0 0 0)',
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
  } as const;

  if (options.reduced) {
    gsap.set([media, image], { clearProps: 'all', opacity: 1, scale: 1, clipPath: 'inset(0 0 0 0)' });
    return null;
  }

  const mobile = isMobileViewport() || options.simple;
  const duration = options.duration ?? (mobile ? 0.48 : motionTokens.duration.image);

  if (mobile) {
    gsap.set(media, { autoAlpha: 0, y: 12 });
    gsap.set(image, { scale: 1.015 });
    const timeline = gsap.timeline({ delay: options.delay ?? 0 });
    timeline.to(media, {
      autoAlpha: 1,
      y: 0,
      duration,
      ease: motionTokens.ease.major,
    });
    timeline.to(image, {
      scale: 1,
      duration: duration + 0.08,
      ease: motionTokens.ease.reveal,
    }, '<');
    return timeline;
  }

  gsap.set(media, { clipPath: clips[direction], autoAlpha: 1 });
  gsap.set(image, { scale: motionTokens.imageScale });

  const timeline = gsap.timeline({ delay: options.delay ?? 0 });
  timeline.to(media, {
    clipPath: 'inset(0 0 0 0)',
    duration,
    ease: motionTokens.ease.mask,
  });
  timeline.to(image, {
    scale: 1,
    duration: duration + 0.1,
    ease: motionTokens.ease.reveal,
  }, '<');
  return timeline;
}

/** Short, restrained rise — not a generic 30–60px fade-up. */
export function fadeRise(
  gsap: Gsap,
  targets: TweenTarget,
  options: { duration?: number; stagger?: number; delay?: number; y?: number } = {},
) {
  const y = options.y ?? (isMobileViewport() ? motionTokens.distance.mobile : motionTokens.distance.desktop);
  gsap.set(targets, { autoAlpha: 0, y });
  return gsap.to(targets, {
    autoAlpha: 1,
    y: 0,
    duration: options.duration ?? (isMobileViewport() ? 0.4 : motionTokens.duration.soft),
    stagger: options.stagger ?? 0,
    delay: options.delay ?? 0,
    ease: motionTokens.ease.reveal,
  });
}

/** Soft plane fade without vertical travel — for already-structured bands. */
export function planeReveal(
  gsap: Gsap,
  targets: TweenTarget,
  options: { duration?: number; stagger?: number; delay?: number } = {},
) {
  gsap.set(targets, { autoAlpha: 0 });
  return gsap.to(targets, {
    autoAlpha: 1,
    duration: options.duration ?? motionTokens.duration.soft,
    stagger: options.stagger ?? 0,
    delay: options.delay ?? 0,
    ease: motionTokens.ease.reveal,
  });
}

export function forceVisible(gsap: Gsap, scope: ParentNode) {
  gsap.set(
    scope.querySelectorAll(
      '[data-motion-heading], [data-motion-item], [data-motion-copy], [data-motion-media], [data-motion-line], [data-motion-eyebrow], [data-motion="hero"] *, .line-mask__inner, .site-footer__logo, .site-footer__grid > *, .site-footer__bottom, .site-footer__rule',
    ),
    {
      clearProps: 'all',
      opacity: 1,
      autoAlpha: 1,
      y: 0,
      x: 0,
      yPercent: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      clipPath: 'none',
    },
  );
}

/** If a section is already past the start line (fast scroll / restore), finish immediately. */
export function ensureSectionVisible(
  timeline: gsap.core.Timeline,
  trigger: HTMLElement,
  startPercent: number,
) {
  const rect = trigger.getBoundingClientRect();
  const threshold = (window.innerHeight * startPercent) / 100;
  if (rect.top < threshold) {
    timeline.progress(1);
    // Guarantee media planes are fully open after skip/fast-scroll
    gsap.set(trigger.querySelectorAll('[data-motion-media], [data-motion-media] img'), {
      clearProps: 'clipPath,transform',
      autoAlpha: 1,
      opacity: 1,
      scale: 1,
      y: 0,
    });
  }
}

export function sectionScrollTrigger(
  trigger: HTMLElement,
  mobile: boolean,
  editorial = false,
) {
  const start = mobile
    ? motionTokens.trigger.mobile
    : editorial
      ? motionTokens.trigger.editorial
      : motionTokens.trigger.desktop;

  return {
    trigger,
    start,
    once: true as const,
    fastScrollEnd: true,
    invalidateOnRefresh: true,
  };
}
