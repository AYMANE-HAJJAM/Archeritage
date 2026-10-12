type LegalDetails = {
  legalEntityType: string | null;
  registrationNumber: string | null;
  taxIdentifier: string | null;
  ice: string | null;
  publicationDirector: string | null;
  hostingProviderName: string | null;
  hostingProviderAddress: string | null;
};

export const legalDetails: LegalDetails = {
  legalEntityType: null,
  registrationNumber: null,
  taxIdentifier: null,
  ice: null,
  publicationDirector: null,
  hostingProviderName: null,
  hostingProviderAddress: null,
};

export const legalValidationRequired = [
  'forme juridique et identification légale de l’éditeur',
  'numéros RC, IF et ICE',
  'direction de la publication',
  'identité et adresse contractuelles de l’hébergeur',
] as const;
