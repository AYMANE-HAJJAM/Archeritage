"use client";

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

type DropdownMenuProps = {
  item: NavItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath: string;
};

export function DropdownMenu({ item, open, onOpenChange, currentPath }: DropdownMenuProps) {
  if (!item.children?.length) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-1 text-[0.78rem] font-medium uppercase tracking-[0.18em] transition-colors hover:text-[var(--accent)]',
          currentPath.startsWith(item.href) ? 'text-[var(--accent)]' : 'text-[var(--foreground)]',
        )}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        onFocus={() => onOpenChange(true)}
        onBlur={(event) => {
          if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
            onOpenChange(false);
          }
        }}
      >
        {item.label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-300', open && 'rotate-180')} />
      </button>

      <div
        className={cn(
          'absolute left-0 top-full z-50 mt-3 w-[21rem] rounded-[0.75rem] border border-[var(--border)] bg-[rgba(14,14,12,0.96)] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300',
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        {item.children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className={cn(
              'block rounded-[0.45rem] px-4 py-3 text-sm transition-colors hover:bg-white/5 hover:text-[var(--accent)]',
              currentPath === child.href ? 'text-[var(--accent)]' : 'text-[var(--foreground)]',
            )}
            onClick={() => onOpenChange(false)}
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
