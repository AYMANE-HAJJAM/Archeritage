export const siteRouteHrefs = [
  '/',
  '/cabinet',
  '/missions',
  '/methode',
  '/expertises',
  '/#solutions',
  '/references',
  '/journal',
  '/contact',
] as const;

export type SiteRouteHref = (typeof siteRouteHrefs)[number];

export const siteRouteKeys = [
  'home',
  'cabinet',
  'missions',
  'method',
  'expertises',
  'solutions',
  'references',
  'journal',
  'contact',
] as const;

export type SiteRouteKey = (typeof siteRouteKeys)[number];

/** Stable hrefs for navigation; labels come from i18n messages. */
export const siteRoutes = siteRouteHrefs.map((href, index) => ({
  href,
  key: siteRouteKeys[index],
}));

export const headerRoutes = [
  { href: '/', key: 'home' },
  { href: '/cabinet', key: 'cabinet' },
  { href: '/missions', key: 'missions' },
  { href: '/methode', key: 'method' },
  { href: '/#solutions', key: 'offer' },
  { href: '/references', key: 'references' },
  { href: '/journal', key: 'journal' },
  { href: '/contact', key: 'contact' },
] as const;

export type HeaderRouteKey = (typeof headerRoutes)[number]['key'];
export type HeaderDropdownKey = 'missions' | 'offer';

type HeaderDropdownItem = { key: string; href: string };

export type HeaderDropdownSection = {
  key: 'expertises' | 'solutions';
  actionHref: string;
  items: readonly HeaderDropdownItem[];
};

type HeaderDropdown = {
  key: HeaderDropdownKey;
  align: 'start' | 'center' | 'end';
  actionHref?: string;
  items?: readonly HeaderDropdownItem[];
  sections?: readonly HeaderDropdownSection[];
};

/**
 * Shared desktop/mobile submenu structure. Child destinations are limited to
 * routes or Homepage anchors that currently exist.
 */
export const headerDropdowns: Record<HeaderDropdownKey, HeaderDropdown> = {
  missions: {
    key: 'missions',
    align: 'start',
    actionHref: '/missions',
    items: [
      { key: 'architecture', href: '/missions' },
      { key: 'land', href: '/missions' },
      { key: 'realEstate', href: '/missions' },
      { key: 'heritage', href: '/missions' },
      { key: 'governance', href: '/missions' },
    ],
  },
  offer: {
    key: 'offer',
    align: 'center',
    sections: [
      {
        key: 'expertises',
        actionHref: '/expertises',
        items: [
          { key: 'architecture', href: '/expertises/architecture-projets-envergure' },
          { key: 'land', href: '/expertises/valorisation-fonciere' },
          { key: 'heritage', href: '/expertises/valorisation-patrimoine' },
          { key: 'realEstate', href: '/expertises' },
          { key: 'complexProjects', href: '/expertises' },
        ],
      },
      {
        key: 'solutions',
        actionHref: '/#solutions',
        items: [
          { key: 'landPotential', href: '/#potentiel-foncier' },
          { key: 'assetValorisation', href: '/#valorisation-actif' },
          { key: 'decisionSketch', href: '/#esquisse-decisionnelle' },
          { key: 'heritageDiagnosis', href: '/#diagnostic-patrimoine' },
          { key: 'securedHeritageProject', href: '/#projet-patrimonial-securise' },
        ],
      },
    ],
  },
};

export function getHeaderDropdown(key: HeaderRouteKey): HeaderDropdown | undefined {
  return key === 'missions' || key === 'offer' ? headerDropdowns[key] : undefined;
}
