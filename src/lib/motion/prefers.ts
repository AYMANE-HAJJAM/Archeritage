export function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isMobileViewport() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(max-width: 767px)').matches;
}
