import type { SitePage } from './types';

export type ExpertiseDetail = {
  slug: string;
  index: number;
  title: string;
  shortTitle: string;
  eyebrow: string;
  introduction: string;
  image: string;
  imageAlt: string;
  competencies: string[];
  projectNeeds: string[];
  clientProfiles: string[];
  interventionFormats: string[];
  patrigovConnection: string;
  contactCtaLabel: string;
  contactCtaHref: string;
  metaTitle: string;
  metaDescription: string;
};

export const expertiseDetails: ExpertiseDetail[] = [
  {
    slug: 'valorisation-fonciere',
    index: 0,
    title: 'Valorisation foncière et territoriale',
    shortTitle: 'Foncier',
    eyebrow: 'Expertise 01',
    introduction:
      "Comprendre le potentiel d’un site et structurer une opération foncière avant les décisions structurantes.",
    image: '/images/pillars/pillar-valorisation-fonciere.jpg',
    imageAlt: "Vue aérienne d'un site foncier structuré par ses parcelles et ses accès",
    competencies: [
      'Études de faisabilité et optimisation parcellaire',
      'Conception de lotissements et insertion urbaine',
      'Stratégies de valorisation territoriale pour collectivités et investisseurs',
      'Analyse réglementaire et structuration d\'opérations foncières complexes',
    ],
    projectNeeds: [
      'Évaluer un site avant acquisition ou décision',
      'Structurer une opération foncière',
      'Réduire les risques réglementaires et opérationnels',
    ],
    clientProfiles: [
      'Investisseurs',
      'Promoteurs immobiliers',
      'Propriétaires fonciers',
      'Collectivités territoriales',
      'Institutions publiques',
    ],
    interventionFormats: [
      'Diagnostic flash',
      'Étude de faisabilité',
      'Assistance à maîtrise d\'ouvrage',
      'Stratégie de valorisation territoriale',
    ],
    patrigovConnection: 'Les opérations foncières complexes exigent une gouvernance documentaire rigoureuse : structurer les responsabilités, documenter les arbitrages et sécuriser les décisions à chaque étape.',
    contactCtaLabel: 'Présenter un site ou une opération',
    contactCtaHref: '/contact?type=foncier',
    metaTitle: 'Valorisation foncière et territoriale | ARCHERITAGE',
    metaDescription: "Archeritage accompagne les études de faisabilité, l'optimisation parcellaire, la structuration d'opérations foncières et les stratégies de valorisation territoriale pour collectivités et investisseurs.",
  },
  {
    slug: 'architecture-projets-envergure',
    index: 1,
    title: 'Architecture et projets d\'envergure',
    shortTitle: 'Architecture',
    eyebrow: 'Expertise 02',
    introduction:
      "Concevoir, coordonner et piloter des bâtiments publics, équipements collectifs et opérations multi-acteurs.",
    image: '/images/pillars/pillar-architecture-envergure.jpg',
    imageAlt: 'Architecture contemporaine d\'un équipement de grande envergure',
    competencies: [
      'Conception architecturale de bâtiments publics et équipements collectifs',
      'Coordination de projets multi-acteurs et institutionnels',
      'Maîtrise d\'ouvrage déléguée et assistance à maîtrise d\'ouvrage',
      'Audit, redressement et sécurisation de projets en difficulté',
    ],
    projectNeeds: [
      'Concevoir un bâtiment ou un équipement',
      'Coordonner une opération multi-acteurs',
      'Sécuriser un projet complexe ou en difficulté',
    ],
    clientProfiles: [
      'Maîtres d\'ouvrage',
      'Institutions publiques',
      'Collectivités territoriales',
      'Opérateurs privés',
      'Responsables de programme',
    ],
    interventionFormats: [
      'Diagnostic flash',
      'Étude de faisabilité',
      'Assistance à maîtrise d\'ouvrage',
      'Audit et redressement',
    ],
    patrigovConnection: 'Les projets multi-acteurs nécessitent une gouvernance claire : circuits de validation, matrice de responsabilités, traçabilité des décisions et sécurisation des arbitrages.',
    contactCtaLabel: 'Discuter d\'un projet architectural',
    contactCtaHref: '/contact?type=architecture',
    metaTitle: 'Architecture et projets d\'envergure | ARCHERITAGE',
    metaDescription: "Archeritage conçoit et pilote des bâtiments publics, équipements collectifs et opérations institutionnelles complexes, avec une gouvernance de projet rigoureuse.",
  },
  {
    slug: 'valorisation-patrimoine',
    index: 2,
    title: 'Valorisation du patrimoine',
    shortTitle: 'Patrimoine',
    eyebrow: 'Expertise 03',
    introduction:
      "Diagnostiquer, restaurer, réhabiliter et revaloriser le patrimoine bâti — de la lecture du lieu à sa mise en valeur territoriale.",
    image: '/images/references/tiznit-cover.jpg',
    imageAlt: 'Ensemble patrimonial de la kasbah de Tiznit et de la place Mechouar',
    competencies: [
      'Diagnostic patrimonial et lecture historique, constructive et matérielle',
      'Restauration, réhabilitation et reconversion de bâtiments anciens',
      'Valorisation territoriale de sites historiques, kasbahs et médinas',
      'Documentation, transmission et récit patrimonial',
    ],
    projectNeeds: [
      'Comprendre et diagnostiquer un bâtiment ancien',
      'Restaurer, réhabiliter ou reconvertir',
      'Valoriser un site historique dans son territoire',
    ],
    clientProfiles: [
      'Institutions publiques',
      'Collectivités territoriales',
      'Propriétaires de bâtiments historiques',
      'Organisations culturelles',
      'Maîtres d\'ouvrage',
    ],
    interventionFormats: [
      'Diagnostic patrimonial',
      'Étude de faisabilité',
      'Assistance à maîtrise d\'ouvrage',
      'Mission de gouvernance complète',
    ],
    patrigovConnection: 'La restauration patrimoniale exige une documentation irréprochable : chaque décision, chaque arbitrage et chaque intervention doit être traçable et sécurisée juridiquement.',
    contactCtaLabel: 'Présenter un site patrimonial',
    contactCtaHref: '/contact?type=patrimoine',
    metaTitle: 'Valorisation du patrimoine | ARCHERITAGE',
    metaDescription: "Archeritage accompagne le diagnostic, la restauration, la réhabilitation et la valorisation territoriale du patrimoine bâti — monuments, kasbahs et médinas.",
  },
];

export function getExpertiseBySlug(slug: string): ExpertiseDetail | undefined {
  return expertiseDetails.find((e) => e.slug === slug);
}

export function getExpertiseNavigation(slug: string) {
  const index = expertiseDetails.findIndex((e) => e.slug === slug);
  if (index < 0) return null;
  const len = expertiseDetails.length;
  return {
    previous: expertiseDetails[(index - 1 + len) % len],
    next: expertiseDetails[(index + 1) % len],
  };
}

export const expertiseSlugs = expertiseDetails.map((e) => e.slug);

/* ------------------------------------------------------------------ */
/*  Overview page data (unchanged)                                     */
/* ------------------------------------------------------------------ */

export const expertisesPage: SitePage = {
  eyebrow: 'Expertises',
  title: 'Une expertise transversale au service du patrimoine et de la décision',
  introduction:
    'Archeritage combine lecture architecturale, connaissance du bâti ancien, compréhension institutionnelle et maîtrise des opérations complexes. Cette transversalité permet d\'intervenir avec justesse, de la matière du lieu jusqu\'au cadre de décision.',
  sections: [
    {
      eyebrow: 'A',
      title: 'Comprendre le patrimoine',
      introduction: 'Établir une connaissance solide du lieu avant toute transformation.',
      variant: 'cards',
      cards: [
        { title: 'Architecture patrimoniale', text: 'Lire les valeurs architecturales, les usages et le potentiel d\'évolution des bâtiments, tissus et sites patrimoniaux.' },
        { title: 'Diagnostic patrimonial et architectural', text: 'Qualifier l\'état, les fragilités, les contraintes et les orientations d\'intervention possibles.' },
        { title: 'Lecture historique, constructive et matérielle', text: 'Comprendre les systèmes constructifs, les matériaux, les traces et les transformations successives du bâti.' },
      ],
    },
    {
      eyebrow: 'B',
      title: 'Transformer avec justesse',
      introduction: 'Concilier conservation, usage, faisabilité et qualité architecturale.',
      variant: 'cards',
      cards: [
        { title: 'Restauration, réhabilitation et reconversion', text: 'Définir une intervention responsable, attentive à la valeur du lieu et à sa nouvelle trajectoire d\'usage.' },
        { title: 'Patrimoine, territoire et identité urbaine', text: 'Inscrire le projet dans son contexte urbain, culturel, social et territorial.' },
        { title: 'Valorisation, transmission et récit patrimonial', text: 'Rendre lisibles l\'histoire, les choix et les savoir-faire afin de mieux transmettre la valeur du patrimoine.' },
      ],
    },
    {
      eyebrow: 'C',
      title: 'Maîtriser les projets complexes',
      introduction: 'Donner aux maîtres d\'ouvrage une vision claire des responsabilités, des risques et de l\'avancement réel.',
      variant: 'cards',
      cards: [
        { title: 'Maîtrise d\'ouvrage et projets institutionnels', text: 'Cadrer le besoin, préparer les décisions et accompagner les phases sensibles d\'une opération.' },
        { title: 'Gouvernance documentaire et traçabilité', text: 'Organiser les documents, les validations et la mémoire des arbitrages.' },
        { title: 'Pilotage des chantiers patrimoniaux complexes', text: 'Coordonner les informations, suivre les risques et soutenir les décisions en phase d\'exécution.' },
        { title: 'Audit, redressement et sécurisation des projets', text: 'Analyser les écarts, reconstituer les faits et remettre en place un cadre de maîtrise opérationnelle.' },
      ],
    },
    {
      eyebrow: 'D',
      title: 'Structurer la décision',
      introduction: 'Transformer la complexité en informations utiles, hiérarchisées et exploitables.',
      variant: 'cards',
      cards: [
        { title: 'Référentiels, méthodes et outils', text: 'Créer des procédures, matrices et tableaux de bord adaptés au fonctionnement réel du projet.' },
        { title: 'Conseil stratégique patrimonial', text: 'Éclairer les orientations, les priorités d\'investissement et les trajectoires de valorisation.' },
      ],
    },
  ],
  cta: { title: 'Mobiliser les expertises utiles à votre projet', text: 'Archeritage compose son intervention selon le lieu, les enjeux et le niveau de complexité de l\'opération.', label: 'Nous contacter', href: '/contact' },
};
