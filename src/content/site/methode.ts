import type { SitePage } from './types';

export const methodePage: SitePage = {
  eyebrow: 'Méthode',
  title: 'PATRIGOV by Archeritage',
  introduction: 'Une méthode de gouvernance, de sécurisation documentaire et de pilotage opérationnel conçue pour les projets patrimoniaux complexes. Elle rend les responsabilités, les décisions et les risques plus lisibles, sans se substituer aux acteurs du projet.',
  statement: 'Clarifier le cadre. Fiabiliser les décisions. Maîtriser la trajectoire du projet.',
  sections: [
    {
      eyebrow: 'Pourquoi PATRIGOV',
      title: 'Une méthode adaptée à la complexité patrimoniale',
      introduction: 'Les opérations patrimoniales réunissent incertitudes historiques, fragilité du bâti, contraintes techniques, responsabilités multiples et attentes institutionnelles fortes. PATRIGOV organise cette complexité pour permettre au maître d’ouvrage de décider avec une information structurée et traçable.',
      variant: 'split',
    },
    {
      eyebrow: 'Principes',
      title: 'Sept principes de maîtrise',
      variant: 'steps',
      cards: [
        { title: 'Clarifier', text: 'Définir les objectifs, les rôles, les responsabilités et les circuits de décision.' },
        { title: 'Documenter', text: 'Conserver les faits, les pièces, les validations et la mémoire des arbitrages.' },
        { title: 'Hiérarchiser', text: 'Distinguer l’essentiel, l’urgent, le sensible et ce qui relève du suivi courant.' },
        { title: 'Sécuriser', text: 'Réduire les zones grises et fiabiliser les décisions qui engagent le projet.' },
        { title: 'Piloter', text: 'Suivre l’avancement réel, les risques, les dépendances et les prochaines actions.' },
        { title: 'Alerter', text: 'Faire remonter les écarts au bon moment et au bon niveau de responsabilité.' },
        { title: 'Capitaliser', text: 'Transformer l’expérience en mémoire utile et transmissible.' },
      ],
    },
    {
      eyebrow: 'Cycle d’intervention',
      title: 'Six étapes pour structurer l’action',
      variant: 'steps',
      cards: [
        { title: 'Comprendre le contexte', text: 'Lire le site, les acteurs, le cadre institutionnel et les objectifs.' },
        { title: 'Diagnostiquer la situation', text: 'Évaluer l’état réel, les risques, les blocages et les besoins de décision.' },
        { title: 'Structurer le cadre', text: 'Organiser les responsabilités, les documents, les validations et le reporting.' },
        { title: 'Accompagner la mise en œuvre', text: 'Déployer le dispositif avec les équipes et l’adapter aux réalités du projet.' },
        { title: 'Suivre, alerter et ajuster', text: 'Contrôler les écarts, qualifier les alertes et réorienter les actions.' },
        { title: 'Capitaliser et transmettre', text: 'Formaliser les enseignements, les décisions et la mémoire de l’opération.' },
      ],
    },
    {
      eyebrow: 'Outils',
      title: 'Des familles d’outils au service de la décision',
      introduction: 'Selon le contexte, la méthode mobilise des dispositifs de cadrage, de responsabilité, de suivi, de validation, d’alerte et de capitalisation. Leur contenu détaillé reste adapté à chaque mission et au niveau de confidentialité requis.',
      points: ['Cadrage et responsabilités', 'Décisions et validations', 'Risques, alertes et plans d’action', 'Suivi opérationnel et reporting', 'Capitalisation et transmission'],
      variant: 'list',
    },
    {
      eyebrow: 'Valeur produite',
      title: 'Un cadre commun pour le maître d’ouvrage et les équipes',
      variant: 'split',
      cards: [
        { title: 'Pour les maîtres d’ouvrage', text: 'Une vision plus fiable de l’opération, des responsabilités mieux définies et des arbitrages mieux préparés.' },
        { title: 'Pour les équipes projet', text: 'Des priorités partagées, des échanges mieux structurés et une documentation plus facilement exploitable.' },
      ],
    },
    {
      eyebrow: 'Méthode propriétaire',
      title: 'Un dispositif adaptable et confidentiel',
      introduction: 'PATRIGOV by Archeritage est une méthode propriétaire. Elle est calibrée pour chaque projet, respecte les responsabilités contractuelles existantes et protège les informations sensibles, les outils détaillés et les cadres spécifiques développés pendant la mission.',
      variant: 'split',
    },
  ],
  cta: { title: 'Adapter PATRIGOV à votre projet', text: 'Un échange permet d’identifier les enjeux de gouvernance, de documentation et de pilotage propres à votre opération.', label: 'Parler d’un projet', href: '/contact' },
};
