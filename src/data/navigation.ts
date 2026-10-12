import { siteRoutes } from '@/content/site';

/**
 * @deprecated Unused legacy export. Header/Footer/MobileMenu read
 * `siteRoutes` from `@/content/site/navigation` directly and resolve labels
 * via `useTranslations('navigation')`.
 */
export const navigation = siteRoutes;
