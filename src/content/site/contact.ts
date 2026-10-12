import { contactDetails } from './contact-details';

export const contactPage = {
  eyebrow: 'Contact',
  title: 'Parler d’un projet avec Archeritage',
  introduction: 'Vous portez un projet architectural, patrimonial, urbain ou institutionnel ? Présentez-nous son contexte, son stade d’avancement et les enjeux que vous souhaitez clarifier.',
  guidance: [
    { title: 'Une première lecture qualifiée', text: 'Chaque demande est examinée afin de comprendre le site, les acteurs, les contraintes et la forme d’accompagnement la plus utile.' },
    { title: 'Confidentialité', text: 'Les informations et documents transmis sont utilisés uniquement pour comprendre votre demande et préparer un premier échange.' },
    { title: 'Premier rendez-vous', text: 'L’échange initial permet de préciser la situation, les objectifs, les risques identifiés et les prochaines étapes envisageables.' },
  ],
  details: [
    `Email : ${contactDetails.email}`,
    `Téléphone : ${contactDetails.phoneDisplay}`,
    ...contactDetails.addressLines,
  ],
};
