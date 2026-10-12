import { ASSISTANT_DEFAULTS } from '@/lib/assistant/shared/constants';

const SECRET_KEYS = new Set([
  'GITHUB_MODELS_TOKEN',
  'OPENAI_API_KEY',
  'ASSISTANT_RATE_LIMIT_SALT',
]);

const ENV_KEYS = [
  'NEXT_PUBLIC_ASSISTANT_ENABLED',
  'AI_PROVIDER',
  'GITHUB_MODELS_TOKEN',
  'GITHUB_MODELS_MODEL',
  'GITHUB_MODELS_BASE_URL',
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'ASSISTANT_MAX_INPUT_CHARS',
  'ASSISTANT_MAX_HISTORY_MESSAGES',
  'ASSISTANT_MAX_TOTAL_CHARS',
  'ASSISTANT_MAX_OUTPUT_TOKENS',
  'ASSISTANT_TIMEOUT_MS',
  'ASSISTANT_RATE_LIMIT_REQUESTS',
  'ASSISTANT_RATE_LIMIT_WINDOW_SECONDS',
  'ASSISTANT_RATE_LIMIT_SALT',
] as const;

type EnvKey = (typeof ENV_KEYS)[number];
type RawAssistantEnv = Record<EnvKey, string | undefined>;

export type AssistantProviderName = 'github' | 'openai';

export type AssistantConfig = {
  enabled: boolean;
  provider: AssistantProviderName;
  github: {
    token: string;
    model: string;
    baseUrl: string;
  };
  openai: {
    apiKey: string;
    model: string;
  };
  limits: {
    maxInputChars: number;
    maxHistoryMessages: number;
    maxTotalChars: number;
    maxOutputTokens: number;
    timeoutMs: number;
    rateLimitRequests: number;
    rateLimitWindowSeconds: number;
    requestBodyLimitBytes: number;
    maxPageTitleChars: number;
    maxKnowledgeContextChars: number;
    maxSelectedKnowledgeEntries: number;
  };
  rateLimitSalt: string;
};

export type AssistantConfigDiagnostics = {
  environment: string;
  assistantEnabledPresent: boolean;
  aiProviderPresent: boolean;
  aiProviderAccepted: boolean;
  githubTokenPresent: boolean;
  githubModelPresent: boolean;
  githubBaseUrlPresent: boolean;
  openAiTokenPresent: boolean;
  openAiModelPresent: boolean;
  rateLimitSaltPresent: boolean;
  maxInputCharsValid: boolean;
  maxHistoryMessagesValid: boolean;
  maxTotalCharsValid: boolean;
  maxOutputTokensValid: boolean;
  timeoutValid: boolean;
  rateLimitRequestsValid: boolean;
  rateLimitWindowValid: boolean;
  selectedProvider: AssistantProviderName | null;
  selectedModel: string | null;
  failedFields: string[];
  valid: boolean;
};

type ConfigLoadResult =
  | { ok: true; config: AssistantConfig; diagnostics: AssistantConfigDiagnostics }
  | { ok: false; config: null; diagnostics: AssistantConfigDiagnostics };

/**
 * Lazy request-time configuration loader.
 * Never caches across requests so Vercel runtime env is always re-read.
 */
export function getAssistantConfig(): AssistantConfig | null {
  return loadAssistantConfig().config;
}

export function loadAssistantConfig(): ConfigLoadResult {
  const env = readNormalizedAssistantEnv();
  const issues: Array<{ path: string; message: string }> = [];

  let provider: AssistantProviderName | null = null;
  if (!env.AI_PROVIDER) {
    provider = 'github';
  } else if (env.AI_PROVIDER === 'github' || env.AI_PROVIDER === 'openai') {
    provider = env.AI_PROVIDER;
  } else {
    issues.push({ path: 'AI_PROVIDER', message: 'must be one of: github, openai' });
  }

  if (provider === 'github') {
    if (!env.GITHUB_MODELS_TOKEN) {
      issues.push({ path: 'GITHUB_MODELS_TOKEN', message: 'required when AI_PROVIDER=github' });
    }
    if (!env.GITHUB_MODELS_MODEL) {
      issues.push({ path: 'GITHUB_MODELS_MODEL', message: 'required when AI_PROVIDER=github' });
    }
    const baseUrl = env.GITHUB_MODELS_BASE_URL ?? ASSISTANT_DEFAULTS.githubBaseUrl;
    if (!isValidUrl(baseUrl)) {
      issues.push({ path: 'GITHUB_MODELS_BASE_URL', message: 'must be a valid URL' });
    }
  }

  if (provider === 'openai') {
    if (!env.OPENAI_API_KEY) {
      issues.push({ path: 'OPENAI_API_KEY', message: 'required when AI_PROVIDER=openai' });
    }
    if (!env.OPENAI_MODEL) {
      issues.push({ path: 'OPENAI_MODEL', message: 'required when AI_PROVIDER=openai' });
    }
  }

  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const rateLimitSalt = env.ASSISTANT_RATE_LIMIT_SALT
    ?? (isProduction ? undefined : 'development-only-assistant-salt');

  if (isProduction && !env.ASSISTANT_RATE_LIMIT_SALT) {
    issues.push({ path: 'ASSISTANT_RATE_LIMIT_SALT', message: 'required in production' });
  }

  if (!rateLimitSalt && !issues.some((issue) => issue.path === 'ASSISTANT_RATE_LIMIT_SALT')) {
    issues.push({ path: 'ASSISTANT_RATE_LIMIT_SALT', message: 'required' });
  }

  const diagnostics = buildDiagnostics(env, provider, issues);

  if (issues.length > 0 || !provider || !rateLimitSalt) {
    logConfigurationDiagnostics(diagnostics);
    return { ok: false, config: null, diagnostics };
  }

  if (!env.ASSISTANT_RATE_LIMIT_SALT && !isProduction) {
    warnDevelopmentSaltFallback();
  }

  const config: AssistantConfig = {
    // Widget visibility is client-side; API config does not fail on this flag.
    enabled: env.NEXT_PUBLIC_ASSISTANT_ENABLED !== 'false',
    provider,
    github: {
      token: env.GITHUB_MODELS_TOKEN ?? '',
      model: env.GITHUB_MODELS_MODEL ?? '',
      baseUrl: env.GITHUB_MODELS_BASE_URL ?? ASSISTANT_DEFAULTS.githubBaseUrl,
    },
    openai: {
      apiKey: env.OPENAI_API_KEY ?? '',
      model: env.OPENAI_MODEL ?? '',
    },
    limits: {
      maxInputChars: clampNumber(env.ASSISTANT_MAX_INPUT_CHARS, ASSISTANT_DEFAULTS.maxInputChars, 200, 4000),
      maxHistoryMessages: clampNumber(env.ASSISTANT_MAX_HISTORY_MESSAGES, ASSISTANT_DEFAULTS.maxHistoryMessages, 1, 16),
      maxTotalChars: clampNumber(env.ASSISTANT_MAX_TOTAL_CHARS, ASSISTANT_DEFAULTS.maxTotalChars, 500, 20000),
      maxOutputTokens: clampNumber(env.ASSISTANT_MAX_OUTPUT_TOKENS, ASSISTANT_DEFAULTS.maxOutputTokens, 120, 1200),
      timeoutMs: clampNumber(env.ASSISTANT_TIMEOUT_MS, ASSISTANT_DEFAULTS.timeoutMs, 5000, 60000),
      rateLimitRequests: clampNumber(env.ASSISTANT_RATE_LIMIT_REQUESTS, ASSISTANT_DEFAULTS.rateLimitRequests, 1, 30),
      rateLimitWindowSeconds: clampNumber(
        env.ASSISTANT_RATE_LIMIT_WINDOW_SECONDS,
        ASSISTANT_DEFAULTS.rateLimitWindowSeconds,
        30,
        3600,
      ),
      requestBodyLimitBytes: ASSISTANT_DEFAULTS.requestBodyLimitBytes,
      maxPageTitleChars: ASSISTANT_DEFAULTS.maxPageTitleChars,
      maxKnowledgeContextChars: ASSISTANT_DEFAULTS.maxKnowledgeContextChars,
      maxSelectedKnowledgeEntries: ASSISTANT_DEFAULTS.maxSelectedKnowledgeEntries,
    },
    rateLimitSalt,
  };

  return { ok: true, config, diagnostics };
}

export function assertAssistantRuntimeConfig(config: AssistantConfig): AssistantConfig {
  return config;
}

export function getAssistantConfigHealth() {
  const result = loadAssistantConfig();
  return {
    status: result.ok ? ('configured' as const) : ('misconfigured' as const),
    providerConfigured: Boolean(result.diagnostics.selectedProvider),
    modelConfigured: Boolean(result.diagnostics.selectedModel),
    tokenConfigured:
      result.diagnostics.selectedProvider === 'openai'
        ? result.diagnostics.openAiTokenPresent
        : result.diagnostics.githubTokenPresent,
    saltConfigured: result.diagnostics.rateLimitSaltPresent || result.ok,
    failedFields: result.diagnostics.failedFields,
  };
}

function readNormalizedAssistantEnv(): RawAssistantEnv {
  const result = {} as RawAssistantEnv;
  for (const key of ENV_KEYS) {
    result[key] = normalizeEnvValue(process.env[key], SECRET_KEYS.has(key));
  }
  return result;
}

/**
 * Trim BOM/whitespace. Treat blank as undefined.
 * Strip accidental outer quotes on non-secret values only.
 */
export function normalizeEnvValue(value: string | undefined, isSecret: boolean): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  let normalized = value.replace(/^\uFEFF/, '').trim();
  if (!normalized) {
    return undefined;
  }

  if (!isSecret) {
    normalized = stripOuterQuotes(normalized);
    if (!normalized) {
      return undefined;
    }
  }

  return normalized;
}

function stripOuterQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"') && value.length >= 2)
    || (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
  ) {
    return value.slice(1, -1).trim();
  }
  return value;
}

function clampNumber(raw: string | undefined, fallback: number, min: number, max: number) {
  if (raw === undefined) {
    return fallback;
  }

  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return Math.min(max, Math.max(min, value));
}

function isNumericConfigValid(raw: string | undefined) {
  if (raw === undefined) {
    return true;
  }
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value >= 0;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function buildDiagnostics(
  env: RawAssistantEnv,
  provider: AssistantProviderName | null,
  issues: Array<{ path: string; message: string }>,
): AssistantConfigDiagnostics {
  const selectedModel = provider === 'openai'
    ? (env.OPENAI_MODEL ?? null)
    : provider === 'github'
      ? (env.GITHUB_MODELS_MODEL ?? null)
      : null;

  return {
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    assistantEnabledPresent: env.NEXT_PUBLIC_ASSISTANT_ENABLED !== undefined,
    aiProviderPresent: env.AI_PROVIDER !== undefined,
    aiProviderAccepted: provider !== null,
    githubTokenPresent: env.GITHUB_MODELS_TOKEN !== undefined,
    githubModelPresent: env.GITHUB_MODELS_MODEL !== undefined,
    githubBaseUrlPresent: env.GITHUB_MODELS_BASE_URL !== undefined,
    openAiTokenPresent: env.OPENAI_API_KEY !== undefined,
    openAiModelPresent: env.OPENAI_MODEL !== undefined,
    rateLimitSaltPresent: env.ASSISTANT_RATE_LIMIT_SALT !== undefined,
    maxInputCharsValid: isNumericConfigValid(env.ASSISTANT_MAX_INPUT_CHARS),
    maxHistoryMessagesValid: isNumericConfigValid(env.ASSISTANT_MAX_HISTORY_MESSAGES),
    maxTotalCharsValid: isNumericConfigValid(env.ASSISTANT_MAX_TOTAL_CHARS),
    maxOutputTokensValid: isNumericConfigValid(env.ASSISTANT_MAX_OUTPUT_TOKENS),
    timeoutValid: isNumericConfigValid(env.ASSISTANT_TIMEOUT_MS),
    rateLimitRequestsValid: isNumericConfigValid(env.ASSISTANT_RATE_LIMIT_REQUESTS),
    rateLimitWindowValid: isNumericConfigValid(env.ASSISTANT_RATE_LIMIT_WINDOW_SECONDS),
    selectedProvider: provider,
    selectedModel,
    failedFields: [...new Set(issues.map((issue) => issue.path))],
    valid: issues.length === 0 && provider !== null,
  };
}

function logConfigurationDiagnostics(diagnostics: AssistantConfigDiagnostics) {
  console.warn('[assistant:config]', {
    environment: diagnostics.environment,
    assistantEnabledPresent: diagnostics.assistantEnabledPresent,
    aiProviderPresent: diagnostics.aiProviderPresent,
    aiProviderAccepted: diagnostics.aiProviderAccepted,
    githubTokenPresent: diagnostics.githubTokenPresent,
    githubModelPresent: diagnostics.githubModelPresent,
    githubBaseUrlPresent: diagnostics.githubBaseUrlPresent,
    openAiTokenPresent: diagnostics.openAiTokenPresent,
    openAiModelPresent: diagnostics.openAiModelPresent,
    rateLimitSaltPresent: diagnostics.rateLimitSaltPresent,
    maxInputCharsValid: diagnostics.maxInputCharsValid,
    maxHistoryMessagesValid: diagnostics.maxHistoryMessagesValid,
    maxTotalCharsValid: diagnostics.maxTotalCharsValid,
    maxOutputTokensValid: diagnostics.maxOutputTokensValid,
    timeoutValid: diagnostics.timeoutValid,
    rateLimitRequestsValid: diagnostics.rateLimitRequestsValid,
    rateLimitWindowValid: diagnostics.rateLimitWindowValid,
    selectedProvider: diagnostics.selectedProvider,
    selectedModel: diagnostics.selectedModel,
    failedFields: diagnostics.failedFields,
  });
}

let hasWarnedAboutDevelopmentSaltFallback = false;

function warnDevelopmentSaltFallback() {
  if (hasWarnedAboutDevelopmentSaltFallback || process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return;
  }

  hasWarnedAboutDevelopmentSaltFallback = true;
  console.warn(
    'assistant configuration warning: ASSISTANT_RATE_LIMIT_SALT is missing, using a development-only fallback salt. This fallback is not suitable for production.',
  );
}
