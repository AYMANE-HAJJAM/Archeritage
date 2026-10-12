'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { DesktopNav } from './DesktopNav';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { ContactPhoneIcon } from '@/components/ui/ContactPhoneIcon';
import { Container } from '@/components/ui/Container';
import { SiteLogo } from '@/components/ui/SiteLogo';
import { Link, usePathname } from '@/i18n/navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const direction = useScrollDirection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'site-header',
        direction === 'down' && !mobileOpen && !hasFocusWithin && 'site-header--hidden',
        scrolled && 'site-header--scrolled',
        mobileOpen && 'site-header--menu-open',
        locale === 'ar' && 'site-header--rtl',
      )}
      onFocusCapture={() => setHasFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHasFocusWithin(false);
        }
      }}
    >
      <Container className="site-header__inner flex h-[4.5rem] items-center justify-between gap-4 lg:h-[5rem] lg:gap-6">
        <Link href="/" aria-label={t('homeAria')} className="site-logo">
          <SiteLogo variant="header" theme="dark" priority />
        </Link>

        <DesktopNav />

        <div className="header-utility-group">
          <div className="header-actions">
            <LanguageSwitcher />
            <Link
              href="/contact"
              aria-label={t('contactUs')}
              aria-current={pathname === '/contact' ? 'page' : undefined}
              className="header-contact"
            >
              <span>{t('contactUsCta')}</span>
              <ContactPhoneIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              aria-label={t('contactUs')}
              aria-current={pathname === '/contact' ? 'page' : undefined}
              className="header-contact-icon"
            >
              <ContactPhoneIcon aria-hidden="true" />
            </Link>
          </div>

          <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
        </div>
      </Container>
    </header>
  );
}
