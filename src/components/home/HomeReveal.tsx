'use client';

import { useEffect, useRef } from 'react';

/** Progressive enhancement: content remains visible without JavaScript. */
export function HomeReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (query.matches || !root.current) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        animations.push(target.animate(
          [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 650, easing: 'cubic-bezier(.22,.61,.36,1)' },
        ));
        observer.unobserve(target);
      });
    }, { threshold: 0.08 });
    root.current.querySelectorAll('[data-motion="section"]').forEach((section) => observer.observe(section));
    const stop = () => { if (query.matches) { observer.disconnect(); animations.forEach((animation) => animation.cancel()); } };
    query.addEventListener('change', stop);
    return () => { observer.disconnect(); animations.forEach((animation) => animation.cancel()); query.removeEventListener('change', stop); };
  }, []);
  return <div className="home-redesign" ref={root}>{children}</div>;
}
