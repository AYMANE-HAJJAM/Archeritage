import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'mosquee-de-tinmel',
    title: 'Mosquée de Tinmel',
    category: 'patrimoine-religieux',
    categoryLabel: 'Patrimoine religieux',
    location: 'Haut Atlas, Maroc',
    year: 'Étude / restauration patrimoniale',
    excerpt:
      'Intervention autour d’un monument majeur de l’architecture almohade, nécessitant une lecture fine des structures, des décors, des matériaux et de la mémoire collective du site.',
    description:
      'Référence patrimoniale à documenter avec les visuels et informations validés par le client. Le sujet appelle une approche attentive aux structures, aux matériaux, aux décors et à la mémoire collective du site.',
    coverImage: '/images/references/tinmel-cover.jpg',
    altText: 'Mosquée historique de Tinmel et architecture almohade',
    heroImage: '/images/references/tinmel-cover.jpg',
    gallery: [
      '/images/references/tinmel-cover.jpg',
      '/images/references/tinmel-cover.jpg',
      '/images/references/tinmel-cover.jpg',
    ],
    serviceSlugs: ['diagnostic-patrimonial', 'restauration-rehabilitation', 'suivi-chantier-patrimonial'],
  },
  {
    slug: 'kasbah-de-tiznit',
    title: 'Kasbah de Tiznit',
    category: 'kasbahs-medinas',
    categoryLabel: 'Kasbahs & médinas',
    location: 'Tiznit, Maroc',
    year: 'Réhabilitation patrimoniale',
    excerpt:
      'Projet lié à la valorisation d’un ensemble patrimonial inscrit dans le tissu historique de Tiznit, entre remparts, mémoire urbaine et usages contemporains.',
    description:
      'Référence à documenter avec les visuels et informations validés par le client. Le projet s’inscrit dans une logique de réhabilitation patrimoniale, de lecture urbaine et de valorisation des usages contemporains.',
    coverImage: '/images/references/tiznit-cover.jpg',
    altText: 'Remparts et tissu patrimonial de Tiznit',
    heroImage: '/images/references/tiznit-cover.jpg',
    gallery: [
      '/images/references/tiznit-cover.jpg',
      '/images/references/tiznit-cover.jpg',
      '/images/references/tiznit-cover.jpg',
    ],
    serviceSlugs: ['diagnostic-patrimonial', 'reconversion-valorisation', 'etudes-autorisations'],
  },
  {
    slug: 'gran-teatro-cervantes',
    title: 'Gran Teatro Cervantes',
    category: 'equipements-culturels',
    categoryLabel: 'Équipements culturels',
    location: 'Tanger, Maroc',
    year: 'Restauration / équipement culturel',
    excerpt:
      'Référence liée à un édifice culturel emblématique de Tanger, à la croisée du patrimoine architectural, de la mémoire urbaine et de la coopération culturelle.',
    description:
      'Référence à documenter avec les visuels et informations validés par le client. Le bâtiment appelle une lecture croisée entre conservation, équipement culturel et mémoire urbaine.',
    coverImage: '/images/references/cervantes-cover.jpg',
    altText: 'Édifice culturel patrimonial à Tanger',
    heroImage: '/images/references/cervantes-cover.jpg',
    gallery: [
      '/images/references/cervantes-cover.jpg',
      '/images/references/cervantes-cover.jpg',
      '/images/references/cervantes-cover.jpg',
    ],
    serviceSlugs: ['restauration-rehabilitation', 'reconversion-valorisation', 'suivi-chantier-patrimonial'],
  },
  {
    slug: 'accompagnement-investisseur-patrimonial',
    title: 'Accompagnement investisseur patrimonial',
    category: 'etudes-conseils',
    categoryLabel: 'Études & conseils',
    location: 'Maroc',
    year: 'Conseil stratégique',
    excerpt:
      'Accompagnement d’un porteur de projet dans la compréhension du contexte local, des contraintes patrimoniales, du potentiel de reconversion et des étapes administratives.',
    description:
      'Cette référence illustre l’accompagnement stratégique d’un projet entrant au Maroc: première lecture du territoire, identification des contraintes patrimoniales, clarification des étapes et préparation d’une feuille de route réaliste.',
    coverImage: '/images/hero/hero-urbanisme-foncier.jpg',
    altText: 'Étude et accompagnement investisseur pour patrimoine au Maroc',
    heroImage: '/images/hero/hero-urbanisme-foncier.jpg',
    gallery: [
      '/images/hero/hero-urbanisme-foncier.jpg',
      '/images/references/diagnostic-cover.jpg',
      '/images/optional/architecture-villa-contemporaine.jpg',
    ],
    serviceSlugs: ['accompagnement-investisseurs', 'etudes-autorisations', 'reconversion-valorisation'],
  },
  {
    slug: 'releve-diagnostic-batiment-ancien',
    title: 'Relevé & diagnostic d’un bâtiment ancien',
    category: 'sites-historiques',
    categoryLabel: 'Sites historiques',
    location: 'Maroc',
    year: 'Diagnostic',
    excerpt:
      'Lecture architecturale, relevé, état des lieux et recommandations pour guider une intervention respectueuse du bâti existant.',
    description:
      'La référence présente une démarche de diagnostic préalable: observation, relevé, identification des pathologies, lecture constructive et recommandations avant toute décision de restauration ou de reconversion.',
    coverImage: '/images/references/diagnostic-cover.jpg',
    altText: 'Relevé et diagnostic d’un bâtiment ancien au Maroc',
    heroImage: '/images/references/diagnostic-cover.jpg',
    gallery: [
      '/images/references/diagnostic-cover.jpg',
      '/images/missions/mission-etude-plans.jpg',
      '/images/references/diagnostic-cover.jpg',
    ],
    serviceSlugs: ['diagnostic-patrimonial', 'etudes-autorisations'],
  },
];
