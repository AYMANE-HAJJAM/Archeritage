'use client';

import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins } from '@/lib/gsap';
import { motion } from '@/lib/motion-config';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    registerGsapPlugins();
    const root = ref.current;
    if (!root || reduced) return;
    const timeline = gsap.timeline({ defaults: { ease: motion.ease.strong } });
    timeline.fromTo(root, { opacity: 0.88, scale: 0.997 }, { opacity: 1, scale: 1, duration: motion.duration.standard });
    if (pathname !== '/') {
      const eyebrow = root.querySelector('.showcase-hero .eyebrow');
      const title = root.querySelector('.showcase-hero h1');
      const intro = root.querySelector('.showcase-hero__intro');
      const statement = root.querySelector('.showcase-statement');
      if (eyebrow) timeline.fromTo(eyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: motion.duration.fast }, 0.08);
      if (title) timeline.fromTo(title, { clipPath: 'inset(0 0 100% 0)', y: 38 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: motion.duration.slow }, 0.12);
      if (intro) timeline.fromTo(intro, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: motion.duration.standard }, 0.42);
      if (statement) timeline.fromTo(statement, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: motion.duration.standard }, 0.52);
    }
  }, { scope: ref, dependencies: [pathname, reduced] });

  return <div ref={ref} key={pathname} className="relative z-10">{children}</div>;
}
