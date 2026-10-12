export const solutionCatalog = [
  { slug: 'potentiel-foncier', price: '7 500 DH HT' },
  { slug: 'valorisation-actif', price: '18 000 DH HT' },
  { slug: 'esquisse-decisionnelle', price: '12 000 DH HT' },
  { slug: 'diagnostic-patrimoine', price: '18 000 DH HT' },
  { slug: 'projet-patrimonial-securise', price: '35 000 DH HT' },
] as const;

export type SolutionSlug = (typeof solutionCatalog)[number]['slug'];

export const solutionHref = (slug: SolutionSlug) => `/contact?solution=${slug}` as const;
