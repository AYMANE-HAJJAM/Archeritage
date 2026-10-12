import type { SitePage } from './types';

export const cabinetPage: SitePage = {
  eyebrow: 'Cabinet',
  title: 'Architecture, patrimoine et gouvernance des projets complexes',
  introduction: 'Fondé par Ahmed Taoufik Naciri, architecte, Archeritage accompagne les opérations où la qualité architecturale doit s’articuler à une maîtrise rigoureuse des décisions, des responsabilités et des risques.',
  statement: 'Un cabinet d’architecture, de patrimoine et de gouvernance des projets complexes.',
  sections: [
    {
      eyebrow: 'Une approche née du terrain',
      title: 'Comprendre le lieu. Structurer le projet. Sécuriser sa réalisation.',
      introduction: 'L’expérience des projets patrimoniaux et institutionnels montre qu’une intention architecturale ne suffit pas. La réussite dépend aussi d’un cadre clair, d’arbitrages documentés et d’une coordination capable de relier les acteurs, les contraintes et les décisions.',
      variant: 'split',
      cards: [
        { title: 'Architecture', text: 'Lire le bâti, son histoire, ses usages et son potentiel avant de concevoir une intervention juste.' },
        { title: 'Gouvernance', text: 'Clarifier les responsabilités, organiser les validations et donner au maître d’ouvrage une vision fiable du projet.' },
        { title: 'Maîtrise opérationnelle', text: 'Identifier les risques, documenter les faits et accompagner les décisions jusqu’aux phases critiques.' },
      ],
    },
    {
      eyebrow: 'Notre conviction',
      title: 'Le patrimoine est une matière vivante',
      introduction: 'Un lieu patrimonial engage une mémoire, des usages, un territoire et des responsabilités. Archeritage défend une approche ni figée ni décorative : préserver ce qui fonde la valeur du lieu, permettre son adaptation et construire les conditions de sa transmission.',
      points: ['Exigence architecturale', 'Connaissance historique et constructive', 'Faisabilité opérationnelle', 'Lisibilité des décisions'],
      variant: 'list',
    },
    {
      eyebrow: 'Le fondateur',
      title: 'Ahmed Taoufik Naciri, architecte',
      introduction: 'Son parcours relie architecture, patrimoine, maîtrise d’ouvrage, gouvernance territoriale et projets institutionnels complexes. Avec Archeritage, il porte une pratique attentive à la valeur culturelle des lieux autant qu’à la solidité des processus qui permettent de les transformer.',
      variant: 'split',
    },
    {
      eyebrow: 'Notre manière d’intervenir',
      title: 'Une réponse calibrée pour chaque situation',
      introduction: 'Chaque mission commence par la compréhension du contexte, des acteurs, des contraintes et des objectifs. Le cabinet définit ensuite l’accompagnement utile : diagnostic, cadrage stratégique, mission d’architecture, AMO, audit, gouvernance, redressement ou valorisation.',
      cards: [
        { title: 'Comprendre', text: 'Établir une lecture précise du lieu, de l’opération et de son niveau réel de maturité.' },
        { title: 'Structurer', text: 'Hiérarchiser les enjeux, clarifier les circuits de décision et organiser la documentation.' },
        { title: 'Accompagner', text: 'Soutenir les équipes et le maître d’ouvrage sans se substituer aux responsabilités existantes.' },
      ],
      variant: 'steps',
    },
    {
      eyebrow: 'Engagements',
      title: 'Indépendance, rigueur et clarté',
      introduction: 'Archeritage s’engage sur la précision des diagnostics, la qualité des documents, la traçabilité des décisions et la protection de la valeur patrimoniale. Son ambition : contribuer à une culture du patrimoine plus structurée, plus opérationnelle et mieux transmissible.',
      points: ['Décider avec discernement', 'Piloter avec méthode', 'Documenter avec précision', 'Transmettre durablement'],
      variant: 'list',
    },
  ],
  cta: { title: 'Parler d’un projet avec Archeritage', text: 'Présentez-nous votre contexte, vos enjeux et le stade de votre opération.', label: 'Nous contacter', href: '/contact' },
};
