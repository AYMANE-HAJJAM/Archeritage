'use client';

import { useEffect, useState } from 'react';

export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  useEffect(() => {
    let previous = window.scrollY;
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const current = window.scrollY;
        if (Math.abs(current - previous) > 8) setDirection(current > previous && current > 120 ? 'down' : 'up');
        previous = current;
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
  }, []);
  return direction;
}
