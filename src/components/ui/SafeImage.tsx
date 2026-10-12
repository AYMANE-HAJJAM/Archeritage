"use client";

import { useState } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

type SafeImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  fallbackLabel?: string;
};

export function SafeImage({ src, alt, className, sizes, priority, fill = true, width, height, fallbackLabel }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  const fallbackContent = (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit] border border-[var(--border)] bg-[#12110d]">
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(245,240,232,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(245,240,232,0.075)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-4 border border-[rgba(245,240,232,0.14)]" />
      <div className="absolute bottom-8 left-8 right-8 h-px bg-[linear-gradient(90deg,var(--accent),transparent)] opacity-80" />
      <div className="absolute left-8 top-8 h-24 w-px bg-[linear-gradient(180deg,var(--accent),transparent)] opacity-80" />
      <div className="absolute inset-0 flex items-end p-6 sm:p-8">
        <div className="max-w-[20rem]">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[var(--accent)]">{fallbackLabel ?? 'Image d’architecture'}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{alt}</p>
        </div>
      </div>
    </div>
  );

  if (hasError || !src) {
    return <div className={cn('relative h-full w-full overflow-hidden rounded-[0.75rem] bg-[#11110f]', className)}>{fallbackContent}</div>;
  }

  return fill ? (
    <div className={cn('relative h-full w-full overflow-hidden rounded-[0.75rem] bg-[#11110f]', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  ) : (
    <div className={cn('relative overflow-hidden rounded-[0.75rem] bg-[#11110f]', className)}>
      <Image
        src={src}
        alt={alt}
        width={width ?? 1600}
        height={height ?? 1200}
        priority={priority}
        sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
