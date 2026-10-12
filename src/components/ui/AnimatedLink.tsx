import Link from 'next/link';

import { cn } from '@/lib/utils';

type AnimatedLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function AnimatedLink({ href, children, className }: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-2 text-sm text-[var(--foreground)] transition-colors hover:text-[var(--accent)]', className)}
    >
      <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--accent)] after:transition-transform after:duration-300 group-hover:after:scale-x-100">
        {children}
      </span>
    </Link>
  );
}
