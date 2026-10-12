'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import {
  getHeaderDropdown,
  headerRoutes,
  type HeaderDropdownKey,
} from '@/content/site/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const CLOSE_DELAY_MS = 160;
const OPEN_DELAY_MS = 70;

export function DesktopNav() {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const [openMenu, setOpenMenu] = useState<HeaderDropdownKey | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const toggleRefs = useRef<Partial<Record<HeaderDropdownKey, HTMLButtonElement | null>>>({});

  const clearTimers = () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    openTimerRef.current = null;
    closeTimerRef.current = null;
  };

  const showMenu = (key: HeaderDropdownKey, immediate = false) => {
    clearTimers();
    if (immediate) {
      setOpenMenu(key);
      return;
    }
    openTimerRef.current = window.setTimeout(() => setOpenMenu(key), OPEN_DELAY_MS);
  };

  const scheduleClose = () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  };

  const closeMenu = () => {
    clearTimers();
    setOpenMenu(null);
  };

  useEffect(() => closeMenu(), [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) closeMenu();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !openMenu) return;
      event.preventDefault();
      const activeToggle = toggleRefs.current[openMenu];
      closeMenu();
      activeToggle?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimers();
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  return (
    <nav ref={navRef} className="desktop-nav" aria-label={tCommon('mainNavigation')}>
      {headerRoutes
        .filter((item) => item.href !== '/contact')
        .map((item) => {
          const dropdown = getHeaderDropdown(item.key);
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : item.key === 'offer'
                ? pathname === '/expertises' || pathname.startsWith('/expertises/') || pathname === '/solutions' || pathname.startsWith('/solutions/')
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

          if (!dropdown) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('desktop-nav__link', isActive && 'is-active')}
                aria-current={isActive ? 'page' : undefined}
              >
                {t(item.key)}
              </Link>
            );
          }

          const isOpen = openMenu === dropdown.key;
          const menuId = `header-${dropdown.key}-menu`;
          const translationBase = `dropdowns.${dropdown.key}`;

          return (
            <div
              key={item.href}
              className="desktop-nav__item"
              onMouseEnter={() => showMenu(dropdown.key)}
              onMouseLeave={scheduleClose}
              onFocusCapture={() => showMenu(dropdown.key, true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleClose();
              }}
            >
              <div className="desktop-nav__topline">
                <Link
                  href={item.href}
                  className={cn('desktop-nav__link', isActive && 'is-active')}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={closeMenu}
                >
                  {t(item.key)}
                </Link>
                <button
                  ref={(node) => { toggleRefs.current[dropdown.key] = node; }}
                  type="button"
                  className={cn('desktop-nav__toggle', isOpen && 'is-open')}
                  aria-label={t(`${translationBase}.toggle`)}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  onClick={() => {
                    clearTimers();
                    setOpenMenu(isOpen ? null : dropdown.key);
                  }}
                >
                  <ChevronDown aria-hidden="true" />
                </button>
              </div>

              {isOpen ? (
                <div
                  id={menuId}
                  className={cn(
                    'header-dropdown',
                    `header-dropdown--${dropdown.key}`,
                    `header-dropdown--align-${dropdown.align}`,
                  )}
                  role="menu"
                  aria-label={t(item.key)}
                >
                  {dropdown.sections ? (
                    <div className="header-offer__columns">
                      {dropdown.sections.map((section) => {
                        const sectionBase = `dropdowns.${section.key}`;
                        return (
                          <section className="header-offer__column" key={section.key} aria-labelledby={`header-offer-${section.key}`}>
                            <p className="header-offer__label" id={`header-offer-${section.key}`}>{t(section.key)}</p>
                            <div className="header-offer__items">
                              {section.items.map((child) => (
                                <Link
                                  key={child.key}
                                  href={child.href}
                                  className="header-offer__link"
                                  role="menuitem"
                                  onClick={closeMenu}
                                >
                                  <strong>{t(`${sectionBase}.items.${child.key}.title`)}</strong>
                                  <span aria-hidden="true">→</span>
                                </Link>
                              ))}
                            </div>
                            <Link href={section.actionHref} className="header-offer__action" role="menuitem" onClick={closeMenu}>
                              {t(`${sectionBase}.viewAll`)} <span aria-hidden="true">→</span>
                            </Link>
                          </section>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      <div className="header-dropdown__items">
                        <div className="header-dropdown__column">
                          {(dropdown.items ?? []).map((child, index) => {
                            const itemBase = `${translationBase}.items.${child.key}`;
                            return (
                              <Link
                                key={child.key}
                                href={child.href}
                                className="header-dropdown__link"
                                role="menuitem"
                                onClick={closeMenu}
                              >
                                <span className="header-dropdown__index">{String(index + 1).padStart(2, '0')}</span>
                                <span className="header-dropdown__copy">
                                  <strong>{t(`${itemBase}.title`)}</strong>
                                  <span>{t(`${itemBase}.description`)}</span>
                                </span>
                                <span className="header-dropdown__arrow" aria-hidden="true">→</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                      <Link href={dropdown.actionHref ?? item.href} className="header-dropdown__action" role="menuitem" onClick={closeMenu}>
                        {t(`${translationBase}.viewAll`)} <span aria-hidden="true">→</span>
                      </Link>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
    </nav>
  );
}
