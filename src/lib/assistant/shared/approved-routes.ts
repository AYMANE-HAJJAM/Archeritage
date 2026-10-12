export const approvedAssistantRoutes = [
  '/',
  '/cabinet',
  '/expertises',
  '/expertises/valorisation-fonciere',
  '/expertises/architecture-projets-envergure',
  '/expertises/valorisation-patrimoine',
  '/missions',
  '/methode',
  '/references',
  '/references/tinmel',
  '/references/tiznit',
  '/journal',
  '/contact',
  '/mentions-legales',
  '/confidentialite',
] as const;

export const approvedAssistantRouteSet = new Set<string>(approvedAssistantRoutes);
