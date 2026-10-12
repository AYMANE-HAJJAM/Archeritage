import type { SitePage } from './types';

export const journalPage: SitePage = {
  eyebrow: 'Journal',
  title: 'Réflexions sur l’architecture, le patrimoine et la maîtrise des projets',
  introduction: 'Le Journal Archeritage est un espace éditorial consacré aux idées, méthodes, retours d’expérience et transformations qui traversent les projets patrimoniaux et complexes.',
  sections: [
    {
      eyebrow: 'Ligne éditoriale',
      title: 'Observer, analyser et transmettre',
      introduction: 'Le Journal met en relation culture architecturale, réalités du terrain, gouvernance et enjeux territoriaux. Il privilégie des contenus argumentés, utiles aux maîtres d’ouvrage, professionnels, institutions, chercheurs et acteurs du patrimoine.',
      variant: 'split',
    },
    {
      eyebrow: 'Rubriques',
      title: 'Neuf regards complémentaires',
      variant: 'cards',
      cards: [
        { title: 'Notes de doctrine', text: 'Positions et principes qui structurent la pratique du cabinet.' },
        { title: 'Regards sur le patrimoine', text: 'Lectures de lieux, de cultures constructives et de transformations patrimoniales.' },
        { title: 'Architecture et territoires', text: 'Relations entre projet, identité urbaine, usages et développement local.' },
        { title: 'Carnets de projets', text: 'Enseignements issus de situations concrètes, dans le respect de leur confidentialité.' },
        { title: 'Chantiers complexes', text: 'Analyse des risques, des coordinations et des phases critiques de réalisation.' },
        { title: 'Méthode et gouvernance', text: 'Réflexions sur la décision, la traçabilité et la maîtrise des opérations.' },
        { title: 'Veille et analyses', text: 'Évolutions techniques, institutionnelles et territoriales utiles aux projets.' },
        { title: 'Publications et interventions', text: 'Contributions, conférences et prises de parole professionnelles.' },
        { title: 'Actualités du cabinet', text: 'Informations validées sur la vie et les activités d’Archeritage.' },
      ],
    },
    {
      eyebrow: 'Publications',
      title: 'Publications à venir',
      introduction: 'Les premiers contenus seront publiés progressivement. Aucun article ni projet n’est présenté avant validation de ses informations et de son cadre de diffusion.',
      variant: 'split',
    },
  ],
  cta: { title: 'Suivre la réflexion Archeritage', text: 'Le Journal constituera progressivement une mémoire vivante des idées, méthodes et enseignements du cabinet.', label: 'Découvrir le cabinet', href: '/cabinet' },
};
