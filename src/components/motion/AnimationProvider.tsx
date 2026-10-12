'use client';

import { useLenis } from '@/hooks/useLenis';

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  useLenis();
  return children;
}
