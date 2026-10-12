"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { useGSAP } from '@gsap/react';
import { ChevronDown, Menu, X } from 'lucide-react';

import { getHeaderDropdown, headerRoutes, type HeaderDropdownKey } from '@/content/site/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { gsap, registerGsapPlugins } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const pathname = usePathname();
  const t = useTranslations('common');
  const tNav = useTranslations('navigation');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const previousOpenRef = useRef(false);
  const previousPathnameRef = useRef(pathname);
  const lockedScrollYRef = useRef(0);
  const [openSection, setOpenSection] = useState<HeaderDropdownKey | null>(null);

  useEffect(() => {
    if (!open) {
      setOpenSection(null);
      return;
    }

    const body = document.body;
    const previousStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    lockedScrollYRef.current = window.scrollY;
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${lockedScrollYRef.current}px`;
    body.style.width = '100%';

    return () => {
      body.style.overflow = previousStyles.overflow;
      body.style.position = previousStyles.position;
      body.style.top = previousStyles.top;
      body.style.width = previousStyles.width;
      window.scrollTo(0, lockedScrollYRef.current);
    };
  }, [open]);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      onOpenChange(false);
    }
  }, [onOpenChange, pathname]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1360px)');
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        onOpenChange(false);
      }
    };

    desktopQuery.addEventListener('change', handleBreakpointChange);
    return () => desktopQuery.removeEventListener('change', handleBreakpointChange);
  }, [onOpenChange]);

  useEffect(() => {
    const wasOpen = previousOpenRef.current;
    previousOpenRef.current = open;

    if (open) {
      const animationFrame = window.requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });

      return () => window.cancelAnimationFrame(animationFrame);
    }

    if (wasOpen) {
      triggerRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const header = panelRef.current.closest('header');
      const focusableElements = Array.from(
        header?.querySelectorAll<HTMLElement>(
          '.site-logo, .header-actions a[href], .header-actions button:not([disabled]), .mobile-nav-trigger > button, #mobile-navigation a[href], #mobile-navigation button:not([disabled])',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstElement || !header?.contains(activeElement))) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (activeElement === lastElement || !header?.contains(activeElement))) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpenChange, open]);

  useGSAP(
    () => {
      registerGsapPlugins();

      if (!panelRef.current) {
        return;
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(panelRef.current, { y: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(panelRef.current, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' });
    },
    { dependencies: [open] },
  );

  return (
    <div className="mobile-nav-trigger">
      <button
        ref={triggerRef}
        type="button"
        className="mobile-navigation__trigger"
        aria-label={open ? t('closeMenu') : t('openMenu')}
        aria-expanded={open}
        aria-controls={open ? 'mobile-navigation' : undefined}
        onClick={() => onOpenChange(!open)}
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>

      {open ? (
        <div
          id="mobile-navigation"
          ref={panelRef}
          role="dialog"
          aria-label={t('mainNavigation')}
          tabIndex={-1}
          className="mobile-navigation"
        >
          <div className="mobile-navigation__scroll" data-lenis-prevent data-lenis-prevent-wheel data-lenis-prevent-touch>
          <nav className="mobile-navigation__list" aria-label={t('mobileNavigation')}>
            {headerRoutes
              .filter((item) => item.href !== '/contact')
              .map((item, index) => {
                const dropdown = getHeaderDropdown(item.key);
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : item.key === 'offer'
                      ? pathname === '/expertises' || pathname.startsWith('/expertises/') || pathname === '/solutions' || pathname.startsWith('/solutions/')
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                if (dropdown) {
                  const isSectionOpen = openSection === dropdown.key;
                  const panelId = `mobile-${dropdown.key}-navigation`;
                  const translationBase = `dropdowns.${dropdown.key}`;

                  return (
                    <div key={item.href} className={cn('mobile-navigation__group', isActive && 'is-active')}>
                      <button
                        type="button"
                        className="mobile-navigation__parent"
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={tNav(`${translationBase}.toggle`)}
                        aria-expanded={isSectionOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenSection(isSectionOpen ? null : dropdown.key)}
                      >
                          <span className="mobile-navigation__index">{String(index + 1).padStart(2, '0')}</span>
                          <span className="mobile-navigation__label">{tNav(item.key)}</span>
                          <ChevronDown aria-hidden="true" />
                      </button>
                      <div
                        id={panelId}
                        className={cn('mobile-navigation__accordion', isSectionOpen && 'is-open')}
                        aria-hidden={!isSectionOpen}
                        inert={!isSectionOpen}
                      >
                        <div className="mobile-navigation__accordion-inner">
                        <div className="mobile-navigation__subnav">
                          {dropdown.sections ? (
                            dropdown.sections.map((section) => {
                              const sectionBase = `dropdowns.${section.key}`;
                              return (
                                <section className="mobile-navigation__offer-section" key={section.key} aria-labelledby={`mobile-offer-${section.key}`}>
                                  <p id={`mobile-offer-${section.key}`}>{tNav(section.key)}</p>
                                  {section.items.map((child) => (
                                    <Link key={child.key} href={child.href} onClick={() => onOpenChange(false)}>
                                      <strong>{tNav(`${sectionBase}.items.${child.key}.title`)}</strong>
                                    </Link>
                                  ))}
                                  <Link className="mobile-navigation__view-all" href={section.actionHref} onClick={() => onOpenChange(false)}>
                                    {tNav(`${sectionBase}.viewAll`)} <span aria-hidden="true">→</span>
                                  </Link>
                                </section>
                              );
                            })
                          ) : (
                            <>
                              {(dropdown.items ?? []).map((child, childIndex) => (
                                <Link key={child.key} href={child.href} onClick={() => onOpenChange(false)}>
                                  <span>{String(index + 1).padStart(2, '0')}.{childIndex + 1}</span>
                                  <strong>{tNav(`${translationBase}.items.${child.key}.title`)}</strong>
                                </Link>
                              ))}
                              <Link className="mobile-navigation__view-all" href={dropdown.actionHref ?? item.href} onClick={() => onOpenChange(false)}>
                                {tNav(`${translationBase}.viewAll`)} <span aria-hidden="true">→</span>
                              </Link>
                            </>
                          )}
                        </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item.href} className={cn('mobile-navigation__direct', isActive && 'is-active')}>
                    <Link
                      href={item.href}
                      className="mobile-navigation__direct-link"
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => onOpenChange(false)}
                    >
                      <span className="mobile-navigation__index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="mobile-navigation__label">{tNav(item.key)}</span>
                    </Link>
                  </div>
                );
              })}
          </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
