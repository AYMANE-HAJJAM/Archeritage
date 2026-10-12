'use client';

import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap';

export function CursorFollower() {
  const ref = useRef<HTMLDivElement | null>(null);
  const fine = useMediaQuery('(pointer: fine) and (min-width: 1024px)');
  const reduced = useReducedMotion();

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor || !fine || reduced) return;
    document.documentElement.classList.add('has-custom-cursor');
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });
    const move = (event: PointerEvent) => { xTo(event.clientX); yTo(event.clientY); };
    const over = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('a,button,[data-cursor]');
      const input = (event.target as HTMLElement).closest('input,textarea,select');
      cursor.dataset.state = input ? 'input' : target ? 'active' : 'default';
      cursor.dataset.label = target?.dataset.cursor ?? '';
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    return () => { document.documentElement.classList.remove('has-custom-cursor'); window.removeEventListener('pointermove', move); document.removeEventListener('pointerover', over); };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return <div ref={ref} className="motion-cursor" data-state="default" aria-hidden="true"><span /></div>;
}
