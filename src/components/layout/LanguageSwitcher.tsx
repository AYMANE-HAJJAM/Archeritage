'use client';

import { Check, ChevronDown, Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { useLocaleSwitch } from '@/hooks/useLocaleSwitch';
import { locales, type AppLocale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  onSelect?: () => void;
};

export function LanguageSwitcher({ onSelect }: LanguageSwitcherProps) {
  const t = useTranslations('navigation');
  const locale = useLocale() as AppLocale;
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuId = useId();
  const switchLocale = useLocaleSwitch(onSelect);

  const closeMenu = useCallback((returnFocus = true) => {
    setOpen(false);
    setFocusIndex(-1);
    if (returnFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu(false);
      }
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [closeMenu, open]);

  useEffect(() => {
    if (!open || focusIndex < 0) return;
    const buttons = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]');
    buttons?.[focusIndex]?.focus();
  }, [focusIndex, open]);

  const handleSelect = (next: AppLocale) => {
    if (next === locale) {
      closeMenu();
      return;
    }
    switchLocale(next, locale);
    closeMenu();
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
      setFocusIndex(locales.indexOf(locale));
      return;
    }
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      closeMenu();
    }
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusIndex((current) => (current + 1) % locales.length);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusIndex((current) => (current - 1 + locales.length) % locales.length);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      setFocusIndex(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      setFocusIndex(locales.length - 1);
    }
  };

  const currentLanguage = t(`locales.${locale}`);

  return (
    <div ref={rootRef} className="language-switcher">
      <button
        ref={triggerRef}
        type="button"
        className={cn('language-switcher__trigger', open && 'is-open')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('changeLanguageAria', { language: currentLanguage })}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onTriggerKeyDown}
      >
        <Languages className="language-switcher__icon" aria-hidden="true" />
        <span className="language-switcher__code" dir="ltr">
          {locale.toUpperCase()}
        </span>
        <ChevronDown className="language-switcher__chevron" aria-hidden="true" />
      </button>
      {open ? (
        <ul
          ref={menuRef}
          id={menuId}
          className="language-switcher__menu"
          role="menu"
          aria-label={t('languageMenu')}
          onKeyDown={onMenuKeyDown}
        >
          {locales.map((item, index) => {
            const selected = item === locale;
            return (
              <li key={item} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  className={cn('language-switcher__option', selected && 'is-active')}
                  onClick={() => handleSelect(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleSelect(item);
                    }
                  }}
                  tabIndex={focusIndex === index || (focusIndex < 0 && selected) ? 0 : -1}
                >
                  <span className="language-switcher__option-code" dir="ltr">
                    <bdi>{item.toUpperCase()}</bdi>
                  </span>
                  <span className="language-switcher__option-label">{t(`locales.${item}`)}</span>
                  {selected ? (
                    <Check className="language-switcher__check" aria-hidden="true" />
                  ) : (
                    <span className="language-switcher__check language-switcher__check--placeholder" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

type MobileLanguageSectionProps = {
  onSelect?: () => void;
};

export function MobileLanguageSection({ onSelect }: MobileLanguageSectionProps) {
  const t = useTranslations('navigation');
  const locale = useLocale() as AppLocale;
  const switchLocale = useLocaleSwitch(onSelect);

  return (
    <section className="mobile-language-section" aria-label={t('languageMenu')}>
      <p className="mobile-language-section__label">{t('languageSection')}</p>
      <div className="mobile-language-section__list" role="group" aria-label={t('languageSection')}>
        {locales.map((item) => {
          const selected = item === locale;
          return (
            <button
              key={item}
              type="button"
              className={cn('mobile-language-section__option', selected && 'is-active')}
              aria-current={selected ? 'true' : undefined}
              onClick={() => switchLocale(item, locale)}
            >
              <span className="mobile-language-section__option-label">{t(`locales.${item}`)}</span>
              <span className="mobile-language-section__option-code" dir="ltr">
                <bdi>{item.toUpperCase()}</bdi>
              </span>
              {selected ? <Check className="mobile-language-section__check" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
