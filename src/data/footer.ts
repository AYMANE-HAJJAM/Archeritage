import type { FooterGroup } from '@/types';

export const footerGroups: FooterGroup[] = [
  {
    title: 'ARCHERITAGE',
    links: [
      { label: 'Mission', href: '/mission' },
      { label: 'Expertises', href: '/services' },
      { label: 'Références', href: '/projets' },
      { label: 'Journal', href: '/histoires' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Expertises',
    links: [
      { label: 'Diagnostic patrimonial', href: '/services/diagnostic-patrimonial' },
      { label: 'Restauration & réhabilitation', href: '/services/restauration-rehabilitation' },
      { label: 'Reconversion & valorisation', href: '/services/reconversion-valorisation' },
      { label: 'Accompagnement investisseurs', href: '/services/accompagnement-investisseurs' },
      { label: 'Études & autorisations', href: '/services/etudes-autorisations' },
      { label: 'Suivi patrimonial', href: '/services/suivi-chantier-patrimonial' },
    ],
  },
  {
    title: 'Références',
    links: [
      { label: 'Patrimoine religieux', href: '/projets?category=patrimoine-religieux' },
      { label: 'Kasbahs & médinas', href: '/projets?category=kasbahs-medinas' },
      { label: 'Équipements culturels', href: '/projets?category=equipements-culturels' },
      { label: 'Sites historiques', href: '/projets?category=sites-historiques' },
      { label: 'Études & conseils', href: '/projets?category=etudes-conseils' },
    ],
  },
];

export const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Pinterest', href: 'https://pinterest.com' },
];
