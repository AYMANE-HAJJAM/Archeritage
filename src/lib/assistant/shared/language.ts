import type { AssistantClientMessage } from '@/lib/assistant/shared/types';

export type AssistantLanguage = 'fr' | 'en' | 'ar' | 'darija-latin' | 'darija-arabic';

const ARABIC_SCRIPT = /[\u0600-\u06FF]/
const DARIJA_LATIN =
  /\b(wach|chno|ach|bghit|bghiti|3andi|3andk|t9dro|t9dar|kifach|salam|fin|katdir|kydir|3awnoni|taawnoni|ma3louma|msada9|no9ta|dyalk|dyal|had|3la|wach|projet|terrain)\b/i;
const DARIJA_ARABIC = /(واش|شنو|بغيت|عندي|عندك|كيفاش|تقدر|تقدرو|تعاون|هاذ|هاد|ديالك|الأرض|ارض)/;
const FRENCH =
  /\b(bonjour|bonsoir|merci|quelles?|quelle|comment|votre|vos|est-ce|pour|avec|dans|que|fait|explique|expliquer|expertise|expertises|méthode|methode|contactez)\b/i;
const ENGLISH =
  /\b(hello|hi|hey|what|how|please|could|would|services?|explain|english|now|about|your|provide|help)\b/i;
const EXPLICIT_ENGLISH = /\b(in english|en anglais|بالإنجليزية|بالانجليزية)\b/i;
const EXPLICIT_FRENCH = /\b(in french|en français|en francais|بالفرنسية)\b/i;
const EXPLICIT_ARABIC = /\b(in arabic|en arabe|بالعربية)\b/i;

/**
 * Lightweight language signal for static errors and prompt hints.
 * The model still owns natural multilingual generation.
 */
export function detectAssistantLanguage(messages: readonly AssistantClientMessage[]): AssistantLanguage {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== 'user') continue;
    const detected = detectLanguageFromText(message.content);
    if (detected) return detected;
  }
  return 'fr';
}

export function detectLanguageFromText(text: string): AssistantLanguage | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  if (EXPLICIT_ENGLISH.test(trimmed)) return 'en';
  if (EXPLICIT_FRENCH.test(trimmed)) return 'fr';
  if (EXPLICIT_ARABIC.test(trimmed)) return 'ar';

  const lower = trimmed.toLowerCase();
  if (/^(bonjour|bonsoir)\b/.test(lower)) return 'fr';
  if (/^(hello|hi|hey)\b/.test(lower)) return 'en';
  if (/^(salam|salaam)\b/.test(lower)) return 'darija-latin';
  if (/^(السلام عليكم|السلام)/.test(trimmed)) {
    return DARIJA_ARABIC.test(trimmed) ? 'darija-arabic' : 'ar';
  }

  const hasArabic = ARABIC_SCRIPT.test(trimmed);
  if (hasArabic) {
    return DARIJA_ARABIC.test(trimmed) ? 'darija-arabic' : 'ar';
  }

  if (DARIJA_LATIN.test(trimmed)) return 'darija-latin';

  const frenchScore = countMatches(trimmed, FRENCH);
  const englishScore = countMatches(trimmed, ENGLISH);

  if (frenchScore === 0 && englishScore === 0) {
    // Ambiguous short Latin text — no reliable signal.
    return null;
  }

  if (englishScore > frenchScore) return 'en';
  if (frenchScore > englishScore) return 'fr';

  // Tie or mixed: prefer the script-dominant cue from Latin markers density.
  return frenchScore >= englishScore ? 'fr' : 'en';
}

export function assistantLanguageLabel(language: AssistantLanguage): string {
  switch (language) {
    case 'en':
      return 'English';
    case 'ar':
      return 'Arabic (Modern Standard Arabic unless the visitor is clearly using Darija)';
    case 'darija-latin':
      return 'Moroccan Darija written in Latin characters';
    case 'darija-arabic':
      return 'Moroccan Darija written in Arabic script';
    case 'fr':
    default:
      return 'French';
  }
}

export type AssistantErrorMessageKey =
  | 'invalidRequest'
  | 'unavailable'
  | 'rateLimited'
  | 'timeout'
  | 'providerUnavailable';

const LOCALIZED_ERROR_MESSAGES: Record<AssistantLanguage, Record<AssistantErrorMessageKey, string>> = {
  fr: {
    invalidRequest: 'Votre question n’a pas pu être envoyée. Vérifiez le texte et réessayez.',
    unavailable: 'L’assistant est temporairement indisponible.',
    rateLimited: 'L’assistant a reçu trop de demandes. Merci de réessayer dans quelques instants.',
    timeout: 'La réponse prend plus de temps que prévu. Merci de réessayer.',
    providerUnavailable:
      'L’assistant est momentanément indisponible. Vous pouvez contacter directement l’équipe ARCHERITAGE.',
  },
  en: {
    invalidRequest: 'Your question could not be sent. Please check the text and try again.',
    unavailable: 'The assistant is temporarily unavailable.',
    rateLimited: 'The assistant has received too many requests. Please try again in a moment.',
    timeout: 'The response is taking longer than expected. Please try again.',
    providerUnavailable:
      'The assistant is temporarily unavailable. You can contact the ARCHERITAGE team directly.',
  },
  ar: {
    invalidRequest: 'تعذر إرسال سؤالكم. يرجى التحقق من النص والمحاولة مرة أخرى.',
    unavailable: 'المساعد غير متاح مؤقتاً.',
    rateLimited: 'تلقى المساعد عدداً كبيراً من الطلبات. يرجى المحاولة بعد لحظات.',
    timeout: 'تستغرق الإجابة وقتاً أطول من المتوقع. يرجى المحاولة مرة أخرى.',
    providerUnavailable:
      'المساعد غير متاح حالياً. يمكنكم التواصل مباشرة مع فريق ARCHERITAGE.',
  },
  'darija-latin': {
    invalidRequest: 'Ma t9adrach tsift so2al dyalk. Chouf nass w 3awd jarab.',
    unavailable: 'L’assistant ma disponiblech daba.',
    rateLimited: 'L’assistant tla9a bzaf dyal talabat. 3awd jarab mn ba3d chwiya.',
    timeout: 'Jawab kayakhod w9t ktar mn lmotawa9a3. 3awd jarab.',
    providerUnavailable:
      'L’assistant ma disponiblech daba. T9dar tcontacti équipe ARCHERITAGE directement.',
  },
  'darija-arabic': {
    invalidRequest: 'ماقدراش تصيفط السؤال ديالك. شوف النص وعاود جرب.',
    unavailable: 'المساعد ما متاحش دابا.',
    rateLimited: 'المساعد تلقا بزاف ديال الطلبات. عاود جرب من بعد شوية.',
    timeout: 'الجواب كياخد وقت كثر من المتوقع. عاود جرب.',
    providerUnavailable:
      'المساعد ما متاحش دابا. تقدر تتواصل مباشرة مع فريق ARCHERITAGE.',
  },
};

const ERROR_CODE_TO_KEY: Record<string, AssistantErrorMessageKey> = {
  invalid_request: 'invalidRequest',
  missing_configuration: 'unavailable',
  disabled: 'unavailable',
  rate_limited: 'rateLimited',
  timeout: 'timeout',
  provider_authentication_failed: 'providerUnavailable',
  provider_forbidden: 'providerUnavailable',
  provider_unavailable: 'providerUnavailable',
  invalid_provider_response: 'providerUnavailable',
  internal_error: 'providerUnavailable',
};

export function getLocalizedAssistantErrorMessage(code: string, language: AssistantLanguage): string {
  const key = ERROR_CODE_TO_KEY[code] ?? 'providerUnavailable';
  return LOCALIZED_ERROR_MESSAGES[language][key];
}

function countMatches(text: string, pattern: RegExp) {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const global = new RegExp(pattern.source, flags);
  return [...text.matchAll(global)].length;
}
