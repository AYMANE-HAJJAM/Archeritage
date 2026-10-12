export const ASSISTANT_DEFAULTS = {
  enabled: true,
  provider: 'github',
  githubBaseUrl: 'https://models.github.ai/inference',
  maxInputChars: 1200,
  maxHistoryMessages: 8,
  maxTotalChars: 7000,
  maxOutputTokens: 600,
  timeoutMs: 25_000,
  rateLimitRequests: 8,
  rateLimitWindowSeconds: 300,
  requestBodyLimitBytes: 24 * 1024,
  maxPageTitleChars: 120,
  maxKnowledgeContextChars: 8_500,
  maxSelectedKnowledgeEntries: 10,
  clientSendCooldownMs: 1200,
} as const;

export const ASSISTANT_ERROR_MESSAGES = {
  invalidRequest: "Votre question n’a pas pu être envoyée. Vérifiez le texte et réessayez.",
  unavailable: "L’assistant est temporairement indisponible.",
  rateLimited: "L’assistant a reçu trop de demandes. Merci de réessayer dans quelques instants.",
  timeout: "La réponse prend plus de temps que prévu. Merci de réessayer.",
  providerUnavailable: "L’assistant est momentanément indisponible. Vous pouvez contacter directement l’équipe ARCHERITAGE.",
} as const;

export const ASSISTANT_UI_COPY = {
  title: 'Assistant ARCHERITAGE',
  status: 'Informations publiques validées',
  supporting: 'Expertises, missions, méthode et références.',
  greeting: 'Bonjour. Comment puis-je vous orienter ?',
  greetingSupport:
    'Je peux vous renseigner sur les expertises, les missions, PATRIGOV et les références publiques d’ARCHERITAGE.',
  note: 'Réponses fondées sur les informations publiques validées du site.',
  suggestions: [
    'Que fait ARCHERITAGE ?',
    'Quelle expertise pour mon projet ?',
    'Qu’est-ce que PATRIGOV ?',
    'Présenter un site ou un projet',
  ],
  placeholder: 'Posez votre question ou décrivez votre projet…',
  streaming: 'L’assistant prépare sa réponse…',
} as const;

export const ASSISTANT_WIDGET_IDS = {
  trigger: 'assistant-widget-trigger',
  dialog: 'assistant-widget-dialog',
  title: 'assistant-widget-title',
  description: 'assistant-widget-description',
  messages: 'assistant-widget-messages',
  composerError: 'assistant-widget-composer-error',
} as const;

export const ASSISTANT_ROUTE_LABELS: Record<string, string> = {
  '/expertises': 'Découvrir les expertises',
  '/methode': 'Voir PATRIGOV',
  '/references': 'Consulter les références',
  '/contact': 'Contacter ARCHERITAGE',
  '/missions': 'Découvrir les missions',
  '/cabinet': 'Découvrir le Cabinet',
};
