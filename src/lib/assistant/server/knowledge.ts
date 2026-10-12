import {
  cabinet,
  contact,
  expertises,
  methode,
  missionFormats,
  missionIssues,
  missionsPage,
} from '@/content/site/official';
import { clientSegments } from '@/content/site/client-segments';
import { contactDetails } from '@/content/site/contact-details';
import { expertiseDetails } from '@/content/site/expertises';
import { referenceRecords } from '@/content/site/references';
import { approvedAssistantRouteSet } from '@/lib/assistant/shared/approved-routes';

export type AssistantKnowledgeCategory =
  | 'company'
  | 'expertise'
  | 'mission'
  | 'method'
  | 'reference'
  | 'contact'
  | 'founder'
  | 'navigation';

export type AssistantKnowledgeEntry = {
  id: string;
  category: AssistantKnowledgeCategory;
  title: string;
  content: string;
  route?: string;
  keywords: string[];
  public: true;
};

const baseAliases = {
  company: ['archeritage', 'cabinet', 'firm', 'bureau', 'studio'],
  contact: ['contact', 'tawasol', 'twasol', 'twasal', 'tawassol', 'تواصل', 'email', 'phone', 'telephone', 'coordonnees'],
  project: ['projet', 'project', 'machrou3', 'mashrou3', 'مشروع'],
  land: ['foncier', 'terrain', 'land', 'ard', '3ard', 'عقار', 'أرض'],
  heritage: ['patrimoine', 'heritage', 'tourat', 'torat', 'turath', 'تراث'],
  support: ['accompagnement', 'support', 'assistance', 'mouakaba', 'mowakaba', 'مواكبة'],
  method: ['patrigov', 'gouvernance documentaire', 'governance', 'documentation', 'منهجية'],
};

export function buildAssistantKnowledge(): AssistantKnowledgeEntry[] {
  const entries: AssistantKnowledgeEntry[] = [
    {
      id: 'company-identity',
      category: 'company',
      title: 'ARCHERITAGE positioning',
      route: '/cabinet',
      content: [
        'ARCHERITAGE est un cabinet d’architecture basé à Casablanca.',
        homeSummary(),
        cabinet.introduction,
        cabinet.distinction,
      ].join(' '),
      keywords: [
        ...baseAliases.company,
        'positionnement',
        'positioning',
        'services',
        'khadamat',
        'خدمات',
      ],
      public: true,
    },
    {
      id: 'founder-experience',
      category: 'founder',
      title: 'Founder experience and attribution',
      route: '/cabinet',
      content: [
        'Les références historiques mentionnées sur le site relèvent du parcours professionnel du fondateur Ahmed Taoufik Naciri et ne doivent pas être présentées comme des missions directes d’ARCHERITAGE sans cette précision.',
        cabinet.experience,
        cabinet.founder,
      ].join(' '),
      keywords: [
        'founder',
        'fondateur',
        'ahmed taoufik naciri',
        'experience',
        'parcours',
        'sira',
        'سيرة',
      ],
      public: true,
    },
    {
      id: 'contact-details',
      category: 'contact',
      title: 'Contact ARCHERITAGE',
      route: '/contact',
      content: [
        `Email public : ${contactDetails.email}.`,
        `Téléphone public : ${contactDetails.phoneDisplay}.`,
        `Adresse publique : ${contactDetails.addressLines.join(', ')}.`,
        contact.introduction,
        contact.guidance,
      ].join(' '),
      keywords: [
        ...baseAliases.contact,
        'adresse',
        'address',
        'email',
        'telephone',
        'appel',
        'rasel',
        'راسل',
      ],
      public: true,
    },
    {
      id: 'missions-overview',
      category: 'mission',
      title: 'Mission formats overview',
      route: '/missions',
      content: [
        missionsPage.introduction,
        'Formats d’intervention publics :',
        missionFormats.map(([name, description]) => `${name}: ${description}`).join(' '),
      ].join(' '),
      keywords: [
        'mission',
        'missions',
        'format',
        'intervention',
        'format d’intervention',
        'accompagnement',
        ...baseAliases.support,
      ],
      public: true,
    },
    {
      id: 'method-patrigov',
      category: 'method',
      title: 'PATRIGOV',
      route: '/methode',
      content: [
        methode.introduction,
        `Principes publics : ${methode.principles.join(', ')}.`,
        `Cycle public : ${methode.cycle.map(([title, text]) => `${title} (${text})`).join(' ; ')}.`,
        methode.proprietary,
      ].join(' '),
      keywords: [
        ...baseAliases.method,
        'patrigov by archeritage',
        'methode',
        'méthode',
        'chnahiya patrigov',
        'ما هي patrigov',
      ],
      public: true,
    },
    {
      id: 'project-presentation',
      category: 'contact',
      title: 'How to present a site or project',
      route: '/contact',
      content: [
        'Pour présenter un site ou un projet, ARCHERITAGE invite le visiteur à transmettre le type de projet, le stade d’avancement, la localisation et le contexte utile via la page Contact.',
        contact.guidance,
        contact.confidentiality,
      ].join(' '),
      keywords: [
        ...baseAliases.project,
        'presenter',
        'présenter',
        'submit',
        'send project',
        'nsift projet',
        'sift projet',
        'عرض مشروع',
      ],
      public: true,
    },
  ];

  for (const detail of expertiseDetails) {
    entries.push({
      id: `expertise-${detail.slug}`,
      category: 'expertise',
      title: detail.title,
      route: safeRoute(detail.contactCtaHref.startsWith('/contact') ? `/expertises/${detail.slug}` : undefined) ?? `/expertises/${detail.slug}`,
      content: [
        detail.introduction,
        `Compétences publiques : ${detail.competencies.join(' ; ')}.`,
        `Besoins de projet : ${detail.projectNeeds.join(' ; ')}.`,
        `Profils concernés : ${detail.clientProfiles.join(' ; ')}.`,
        `Formats d’intervention : ${detail.interventionFormats.join(' ; ')}.`,
        detail.patrigovConnection,
      ].join(' '),
      keywords: [
        detail.title,
        detail.shortTitle,
        ...detail.competencies,
        ...detail.projectNeeds,
        ...detail.clientProfiles,
        ...detail.interventionFormats,
        ...(detail.slug === 'valorisation-fonciere' ? baseAliases.land : []),
        ...(detail.slug === 'valorisation-patrimoine' ? baseAliases.heritage : []),
      ].map(normalizeKeyword),
      public: true,
    });
  }

  for (const issue of missionIssues) {
    entries.push({
      id: `mission-issue-${slugify(issue.title)}`,
      category: 'mission',
      title: issue.title,
      route: '/missions',
      content: [issue.text, issue.formats].join(' '),
      keywords: [issue.title, issue.text, issue.formats, ...baseAliases.project].map(normalizeKeyword),
      public: true,
    });
  }

  for (const reference of referenceRecords) {
    const detailRoute = reference.contentStatus === 'listing-only' ? '/references' : `/references/${reference.slug}`;
    const visibilityNote = reference.contentStatus === 'listing-only'
      ? 'Cette référence est publique uniquement sous forme de mention de liste. Il ne faut pas inventer de fiche détaillée ni fournir un lien de détail.'
      : reference.contentStatus === 'partial'
        ? 'Cette référence dispose d’une présentation publique partielle.'
        : 'Cette référence dispose d’une présentation publique documentée.';

    entries.push({
      id: `reference-${reference.slug}`,
      category: 'reference',
      title: reference.title,
      route: detailRoute,
      content: [
        reference.summary,
        `Attribution : ${reference.attribution}.`,
        `Rôle public mentionné : ${reference.role}.`,
        `Type de mission : ${reference.missionType}.`,
        reference.location ? `Localisation : ${reference.location}.` : '',
        reference.institution ? `Institution mentionnée : ${reference.institution}.` : '',
        visibilityNote,
        reference.statusLabel ? `Statut public : ${reference.statusLabel}.` : '',
        reference.sections.map((section) => `${section.title}: ${section.text}`).join(' '),
      ].filter(Boolean).join(' '),
      keywords: [
        reference.title,
        reference.slug,
        reference.location ?? '',
        reference.missionType,
        reference.role,
        reference.contentStatus,
      ].map(normalizeKeyword),
      public: true,
    });
  }

  for (const segment of clientSegments) {
    entries.push({
      id: `navigation-segment-${slugify(segment.title)}`,
      category: 'navigation',
      title: segment.title,
      route: '/contact',
      content: [
        `Public concerné : ${segment.title}.`,
        `Points d’entrée : ${segment.points.join(' ; ')}.`,
        `CTA public : ${segment.cta}.`,
      ].join(' '),
      keywords: [segment.title, ...segment.points, segment.cta, ...baseAliases.project].map(normalizeKeyword),
      public: true,
    });
  }

  entries.push({
    id: 'navigation-routes',
    category: 'navigation',
    title: 'Approved public routes',
    route: '/',
    content: `Routes publiques approuvées : ${Array.from(approvedAssistantRouteSet).join(', ')}.`,
    keywords: ['route', 'page', 'navigation', 'where', 'où', 'fin', 'أين'],
    public: true,
  });

  return entries;
}

function homeSummary() {
  return [
    expertises.introduction,
    'ARCHERITAGE intervient autour de trois familles d’expertise : valorisation foncière et territoriale, architecture et projets d’envergure, valorisation du patrimoine.',
  ].join(' ');
}

function safeRoute(route?: string) {
  if (!route) {
    return undefined;
  }

  return approvedAssistantRouteSet.has(route) ? route : undefined;
}

function slugify(value: string) {
  return normalizeKeyword(value).replace(/\s+/g, '-');
}

function normalizeKeyword(value: string) {
  return value.toLowerCase();
}
