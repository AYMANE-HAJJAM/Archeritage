'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';

export function useLocaleSwitch(onComplete?: () => void) {
  const pathname = usePathname();
  const router = useRouter();

  return useCallback(
    (next: AppLocale, current: AppLocale) => {
      if (next === current) {
        onComplete?.();
        return;
      }
      const query = typeof window !== 'undefined' ? window.location.search : '';
      const href = query ? `${pathname}${query}` : pathname;
      router.replace(href, { locale: next });
      onComplete?.();
    },
    [onComplete, pathname, router],
  );
}
