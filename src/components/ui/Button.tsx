import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

const variants: Record<ButtonVariant, string> = {
  primary: 'border border-[var(--accent)] bg-[var(--accent)] text-white hover:border-[var(--color-rust)] hover:bg-[var(--color-rust)]',
  secondary: 'border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
  ghost: 'border border-transparent bg-transparent text-[var(--foreground)] hover:border-[var(--border)] hover:bg-white/5',
  link: 'bg-transparent px-0 py-0 text-[var(--accent)] underline-offset-4 hover:underline',
};

export function Button({ href, children, variant = 'primary', className, onClick, type = 'button' }: ButtonProps) {
  const classes = cn(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.55rem] px-5 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.16em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
