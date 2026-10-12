/** Stable values shared by incoming links, validation and delivery. */
export const clientProfileKeys = ['proprietaire', 'investisseur', 'promoteur', 'maitre-ouvrage', 'collectivite', 'entreprise', 'professionnel', 'autre'] as const;
export const projectTypeKeys = ['architecture', 'foncier', 'valorisation-immobiliere', 'patrimoine', 'gouvernance', 'potentiel-foncier', 'valorisation-actif', 'esquisse-decisionnelle', 'diagnostic-patrimoine', 'projet-patrimonial-securise', 'cadrage-mission', 'autre'] as const;
export type ClientProfileKey = (typeof clientProfileKeys)[number];
export type ProjectTypeKey = (typeof projectTypeKeys)[number];
export type ContactInitialValues = { profile?: ClientProfileKey; projectType?: ProjectTypeKey; context?: ProjectTypeKey };
const legacyNeeds: Record<string, ProjectTypeKey> = { envergure: 'architecture', rehabilitation: 'patrimoine', amo: 'cadrage-mission', partenariat: 'autre' };
export function getContactInitialValues(searchParams: Record<string, string | string[] | undefined>): ContactInitialValues {
  const profile = searchParams.profil;
  const selected = [searchParams.besoin, searchParams.solution, searchParams.mission, searchParams.type]
    .filter((value): value is string => typeof value === 'string')
    .map((value) => legacyNeeds[value] ?? value)
    .find((value) => (projectTypeKeys as readonly string[]).includes(value)) as ProjectTypeKey | undefined;
  return {
    profile: typeof profile === 'string' && (clientProfileKeys as readonly string[]).includes(profile) ? profile as ClientProfileKey : undefined,
    projectType: selected, context: selected,
  };
}
