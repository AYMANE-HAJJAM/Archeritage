"use client";

import { useRef } from 'react';

import { useGSAP } from '@gsap/react';

import { gsap, registerGsapPlugins } from '@/lib/gsap';
import { Button } from './Button';

type MagneticButtonProps = React.ComponentProps<typeof Button>;

export function MagneticButton(props: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      registerGsapPlugins();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      onMouseMove={(event) => {
        const target = event.currentTarget;
        const bounds = target.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
        const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
        gsap.to(target, { x, y, duration: 0.3, ease: 'power3.out' });
      }}
      onMouseLeave={(event) => {
        gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
      }}
    >
      <Button {...props} />
    </div>
  );
}
