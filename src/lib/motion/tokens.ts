export const motionTokens = {
  duration: {
    /** Fast UI / header / hover */
    ui: 0.2,
    /** Small content transition */
    soft: 0.38,
    /** Section composition (total target ~650–950ms) */
    reveal: 0.62,
    /** Image plane / curtain */
    image: 0.68,
    /** Large hero entrance */
    hero: 0.92,
  },
  stagger: {
    /** Internal card elements */
    inner: 0.045,
    /** Card-to-card / column */
    group: 0.075,
    /** Loose editorial rows */
    loose: 0.1,
  },
  ease: {
    ui: 'power2.out',
    reveal: 'power2.out',
    major: 'power3.out',
    mask: 'power4.out',
    crossfade: 'power2.inOut',
  },
  distance: {
    desktop: 14,
    mobile: 10,
    hero: 18,
  },
  /** Subtle image settle — not Ken Burns */
  imageScale: 1.025,
  slideScale: 1.02,
  /** ScrollTrigger starts — earlier = content begins before center */
  trigger: {
    desktop: 'top 86%',
    mobile: 'top 90%',
    editorial: 'top 80%',
    footer: 'top 92%',
  },
} as const;

/** @deprecated Prefer motionTokens — kept for legacy motion modules */
export const motion = {
  duration: {
    fast: motionTokens.duration.ui,
    standard: motionTokens.duration.reveal,
    slow: motionTokens.duration.image,
    cinematic: motionTokens.duration.hero,
  },
  stagger: {
    small: motionTokens.stagger.inner,
    standard: motionTokens.stagger.group,
    large: motionTokens.stagger.loose,
  },
  ease: {
    standard: motionTokens.ease.major,
    strong: motionTokens.ease.mask,
    cinematic: motionTokens.ease.major,
    inOut: motionTokens.ease.crossfade,
  },
  breakpoint: { desktop: 1024, finePointer: '(pointer: fine)' },
} as const;
