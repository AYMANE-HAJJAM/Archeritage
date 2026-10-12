export type ReferenceSection = {
  title: 'Contexte' | 'Mission conduite' | 'Enjeux' | 'Approche';
  text: string;
};

export type ReferenceContentStatus = 'complete' | 'partial' | 'listing-only';

export type ReferenceRecord = {
  slug: 'tinmel' | 'tiznit' | 'cervantes' | 'safi';
  title: string;
  institution?: string;
  location?: string;
  image?: string;
  imageAlt?: string;
  summary: string;
  attribution: string;
  role: string;
  missionType: string;
  contentStatus: ReferenceContentStatus;
  statusLabel?: string;
  sections: ReferenceSection[];
};

const founderAttribution = 'Expérience professionnelle du fondateur';

export const referenceRecords: ReferenceRecord[] = [
  {
    slug: 'tinmel',
    title: 'Mosquée de Tinmel',
    institution: 'Ministère des Habous',
    location: 'Tinmel',
    image: '/images/references/tinmel-cover.jpg',
    imageAlt: 'Architecture patrimoniale de la mosquée de Tinmel',
    summary: 'Restauration d’un édifice historique du Haut Atlas, entre lecture du lieu et gouvernance de chantier.',
    attribution: founderAttribution,
    role: 'Coordination technique et gouvernance documentaire',
    missionType: 'Restauration patrimoniale',
    contentStatus: 'complete',
    sections: [
      { title: 'Contexte', text: 'Restauration d’un édifice historique majeur du Haut Atlas.' },
      { title: 'Mission conduite', text: 'Lecture historique, coordination technique et gouvernance documentaire du chantier.' },
      { title: 'Approche', text: 'Une conduite de mission structurée autour de la traçabilité et de la coordination.' },
    ],
  },
  {
    slug: 'tiznit',
    title: 'Kasbah de Tiznit et Place Mechouar',
    location: 'Tiznit',
    image: '/images/references/tiznit-cover.jpg',
    imageAlt: 'Ensemble patrimonial de la kasbah de Tiznit et de la place Mechouar',
    summary: 'Valorisation d’un ensemble historique urbain, entre restauration et usage contemporain.',
    attribution: founderAttribution,
    role: 'Restauration et mise en usage',
    missionType: 'Valorisation patrimoniale',
    contentStatus: 'partial',
    sections: [
      { title: 'Contexte', text: 'Valorisation patrimoniale d’un ensemble historique urbain.' },
      { title: 'Mission conduite', text: 'Restauration et mise en usage contemporaine.' },
    ],
  },
  {
    slug: 'cervantes',
    title: 'Théâtre Cervantès — Tanger',
    institution: 'APDN',
    location: 'Tanger',
    image: '/images/references/cervantes-cover.jpg',
    imageAlt: 'Façade du Théâtre Cervantès à Tanger',
    summary: 'Réhabilitation d’un patrimoine du XXe siècle, sous maîtrise d’ouvrage de l’APDN.',
    attribution: founderAttribution,
    role: 'Accompagnement de réhabilitation',
    missionType: 'Patrimoine du XXe siècle',
    contentStatus: 'listing-only',
    statusLabel: 'Fiche en cours de documentation',
    sections: [
      { title: 'Contexte', text: 'Accompagnement d’une opération de réhabilitation d’un patrimoine architectural du XXe siècle.' },
      { title: 'Mission conduite', text: 'Sous maîtrise d’ouvrage de l’Agence de promotion et de développement du Nord.' },
    ],
  },
  {
    slug: 'safi',
    title: 'Murailles portugaises et Château de Mer — Safi',
    institution: 'Direction régionale de la Culture',
    location: 'Safi',
    summary: 'Intervention sur un monument classé du XVIe siècle, en lien avec la Direction régionale de la Culture.',
    attribution: founderAttribution,
    role: 'Intervention sur monument classé',
    missionType: 'Restauration patrimoniale',
    contentStatus: 'listing-only',
    statusLabel: 'Fiche en cours de documentation',
    sections: [
      { title: 'Contexte', text: 'Intervention sur un monument classé du XVIe siècle.' },
      { title: 'Mission conduite', text: 'En lien avec la Direction régionale de la Culture.' },
    ],
  },
];

export const homepageReferences = referenceRecords.filter((reference) => reference.contentStatus !== 'listing-only').slice(0, 3);

export function referenceHasDetailPage(reference: ReferenceRecord) {
  return reference.contentStatus !== 'listing-only';
}

export function getReferenceDetailRecords() {
  return referenceRecords.filter(referenceHasDetailPage);
}

export function getReferenceBySlug(slug: string) {
  return referenceRecords.find((reference) => reference.slug === slug);
}

export function getReferenceNavigation(slug: string) {
  const detailRecords = getReferenceDetailRecords();
  const index = detailRecords.findIndex((reference) => reference.slug === slug);
  if (index < 0) return null;
  return {
    previous: detailRecords[(index - 1 + detailRecords.length) % detailRecords.length],
    next: detailRecords[(index + 1) % detailRecords.length],
  };
}
