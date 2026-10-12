import type { SitePage } from './types';

export const missionsPage: SitePage = {
  eyebrow: 'Missions',
  title: 'Accompagner les projets patrimoniaux, architecturaux et institutionnels complexes',
  introduction: 'Archeritage intervient de la compréhension du site à la maîtrise opérationnelle du projet. Ses missions associent conception architecturale, assistance au maître d’ouvrage, gouvernance, documentation et valorisation.',
  sections: [
    {
      eyebrow: 'Champs d’intervention',
      title: 'Dix missions, une même exigence de maîtrise',
      introduction: 'Les missions sont composées selon le contexte, la maturité de l’opération et les responsabilités déjà en place.',
      variant: 'cards',
      cards: [
        { title: 'Architecture patrimoniale', text: 'Concevoir à partir d’une lecture historique, architecturale et constructive du lieu.', points: ['Études', 'Conception', 'Suivi architectural'] },
        { title: 'Réhabilitation, restauration et reconversion', text: 'Préserver la valeur du bâti tout en l’adaptant à de nouveaux usages et aux exigences contemporaines.', points: ['Scénarios', 'Priorités', 'Articulation ancien-contemporain'] },
        { title: 'Assistance à maîtrise d’ouvrage patrimoniale', text: 'Aider le maître d’ouvrage à cadrer son besoin, organiser les études et préparer les arbitrages.', points: ['Programme', 'Consultations', 'Décisions'] },
        { title: 'Gouvernance des projets complexes', text: 'Structurer les rôles, les circuits de validation et la coordination des intervenants.', points: ['Responsabilités', 'Arbitrages', 'Reporting'] },
        { title: 'Sécurisation documentaire et traçabilité', text: 'Fiabiliser les pièces, les validations et la mémoire des décisions tout au long de l’opération.', points: ['Registres', 'Validation', 'Traçabilité'] },
        { title: 'Audit de projet et diagnostic de situation', text: 'Établir une lecture objective de l’avancement, des écarts, des risques et des blocages.', points: ['État réel', 'Risques', 'Recommandations'] },
        { title: 'Redressement opérationnel de chantier', text: 'Reconstituer les faits, hiérarchiser les urgences et restaurer un cadre de pilotage exploitable.', points: ['Plan d’action', 'Alertes', 'Suivi'] },
        { title: 'Valorisation territoriale du patrimoine', text: 'Relier patrimoine, identité locale, usages et stratégie de développement territorial.', points: ['Diagnostic', 'Positionnement', 'Mise en récit'] },
        { title: 'Documentation, transmission et capitalisation', text: 'Transformer l’expérience du projet en mémoire utile pour les institutions et les équipes.', points: ['Retour d’expérience', 'Carnets', 'Transmission'] },
        { title: 'Méthodes, référentiels et outils de pilotage', text: 'Concevoir des cadres opérationnels qui rendent le projet plus lisible et maîtrisable.', points: ['Matrices', 'Tableaux de bord', 'Procédures'] },
      ],
    },
    {
      eyebrow: 'Moments d’intervention',
      title: 'À chaque étape de la vie du projet',
      variant: 'steps',
      cards: [
        { title: 'Idée & diagnostic', text: 'Qualifier l’opportunité, comprendre le site et définir les premières orientations.' },
        { title: 'Programmation & études', text: 'Structurer le besoin, le cadre de décision et les conditions de faisabilité.' },
        { title: 'Conception & consultation', text: 'Accompagner les arbitrages et fiabiliser les pièces avant l’engagement opérationnel.' },
        { title: 'Chantier & situations critiques', text: 'Suivre, alerter, documenter et, si nécessaire, organiser le redressement.' },
        { title: 'Réception & transmission', text: 'Capitaliser les décisions, les enseignements et la mémoire de l’opération.' },
      ],
    },
    {
      eyebrow: 'Maîtres d’ouvrage',
      title: 'Des interventions adaptées aux cadres publics, institutionnels et privés',
      introduction: 'Le cabinet accompagne notamment les institutions publiques, collectivités, agences de développement, administrations, fondations, opérateurs privés, investisseurs, porteurs de projets patrimoniaux et équipes de maîtrise d’œuvre confrontées à une opération complexe.',
      variant: 'split',
    },
    {
      eyebrow: 'Livrables',
      title: 'Des documents conçus pour décider et agir',
      points: ['Notes de cadrage et diagnostics patrimoniaux', 'Rapports d’audit et plans de redressement', 'Matrices de responsabilités et registres de décisions', 'Tableaux de bord, fiches d’alerte et synthèses', 'Rapports de capitalisation et référentiels méthodologiques'],
      variant: 'list',
    },
  ],
  cta: { title: 'Construire une mission adaptée à votre contexte', text: 'Un premier échange permet de préciser la situation, les responsabilités et le niveau d’accompagnement utile.', label: 'Parler d’un projet', href: '/contact' },
};
