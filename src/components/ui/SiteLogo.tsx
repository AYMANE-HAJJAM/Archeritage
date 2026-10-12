'use client';

import Image from 'next/image';

import {
  HEADER_LOGO_HEIGHT,
  HEADER_LOGO_ON_DARK,
  HEADER_LOGO_ON_LIGHT,
  HEADER_LOGO_WIDTH,
} from '@/lib/brand/logo-meta';
import { cn } from '@/lib/utils';

type SiteLogoVariant = 'header' | 'footer';
type HeaderLogoTheme = 'light' | 'dark';

type SiteLogoProps = {
  variant?: SiteLogoVariant;
  /** Header only — deterministic variant from Header scroll/surface state */
  theme?: HeaderLogoTheme;
  className?: string;
  priority?: boolean;
};

export function SiteLogo({ variant = 'header', theme = 'dark', className, priority }: SiteLogoProps) {
  if (variant === 'footer') {
    return (
      <span className={cn('site-logo__mark site-logo__mark--footer', className)}>
        <Image
          src={HEADER_LOGO_ON_DARK}
          alt="ARCHERITAGE"
          width={HEADER_LOGO_WIDTH}
          height={HEADER_LOGO_HEIGHT}
          className="site-logo__image"
          sizes="(max-width: 767px) 16rem, (max-width: 1023px) 19rem, 22.5rem"
        />
      </span>
    );
  }

  const showLight = theme === 'light';

  return (
    <span className={cn('site-logo__frame', className)} aria-hidden="true">
      <Image
        src={HEADER_LOGO_ON_LIGHT}
        alt=""
        width={HEADER_LOGO_WIDTH}
        height={HEADER_LOGO_HEIGHT}
        priority={priority ?? true}
        sizes="(max-width: 480px) 11rem, (max-width: 768px) 12.5rem, 16.25rem"
        className={cn('site-logo__variant', showLight && 'site-logo__variant--active')}
      />
      <Image
        src={HEADER_LOGO_ON_DARK}
        alt=""
        width={HEADER_LOGO_WIDTH}
        height={HEADER_LOGO_HEIGHT}
        sizes="(max-width: 480px) 11rem, (max-width: 768px) 12.5rem, 16.25rem"
        className={cn('site-logo__variant', !showLight && 'site-logo__variant--active')}
      />
    </span>
  );
}
