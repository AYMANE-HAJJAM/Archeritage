import type { ProcessStep } from '@/types';

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Première lecture',
    description: 'Comprendre le lieu, son histoire, son état et les intentions du porteur de projet.',
  },
  {
    number: '02',
    title: 'Diagnostic',
    description: 'Relevés, analyse des matériaux, état sanitaire, contraintes patrimoniales et opportunités.',
  },
  {
    number: '03',
    title: 'Stratégie d’intervention',
    description: 'Définir ce qui doit être préservé, restauré, transformé ou valorisé.',
  },
  {
    number: '04',
    title: 'Dossiers & coordination',
    description: 'Préparer les documents, organiser les échanges et accompagner les étapes administratives.',
  },
  {
    number: '05',
    title: 'Chantier & transmission',
    description: 'Suivre l’exécution, contrôler les détails et assurer la cohérence patrimoniale du projet.',
  },
];
