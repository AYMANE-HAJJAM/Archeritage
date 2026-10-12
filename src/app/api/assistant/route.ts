import { createTextStreamResponse } from 'ai';

import { buildAssistantKnowledgeContext, formatKnowledgeContext } from '@/lib/assistant/server/context-builder';
import { assertAssistantRuntimeConfig, loadAssistantConfig } from '@/lib/assistant/server/config';
import { createAssistantError, normalizeAssistantError, toAssistantErrorPayload } from '@/lib/assistant/server/errors';
import { buildAssistantKnowledge } from '@/lib/assistant/server/knowledge';
import { getAssistantProvider } from '@/lib/assistant/server/providers';
import { assertAssistantRateLimit } from '@/lib/assistant/server/rate-limit';
import { assertAssistantRequestHeaders, assertSameSiteRequest } from '@/lib/assistant/server/request-guard';
import { parseAssistantRequestBody } from '@/lib/assistant/server/schema';
import { buildAssistantSystemPrompt } from '@/lib/assistant/server/system-prompt';
import {
  detectAssistantLanguage,
  getLocalizedAssistantErrorMessage,
  type AssistantLanguage,
} from '@/lib/assistant/shared/language';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  let logProvider = 'n/a';
  let logModel = 'n/a';
  let logInputChars: number | undefined;
  let logMessageCount: number | undefined;
  let responseLanguage: AssistantLanguage = 'fr';

  try {
    const loaded = loadAssistantConfig();
    const rawConfig = loaded.config;
    const requestBodyLimitBytes = rawConfig?.limits.requestBodyLimitBytes ?? 24 * 1024;

    assertAssistantRequestHeaders(request, requestBodyLimitBytes);
    assertSameSiteRequest(request);

    const body = await parseJson(request);
    const limits = rawConfig?.limits ?? {
      maxInputChars: 1200,
      maxHistoryMessages: 8,
      maxTotalChars: 7000,
      maxPageTitleChars: 120,
    };
    const parsedBody = parseAssistantRequestBody(body, limits);
    if (!parsedBody) {
      throw createAssistantError('invalid_request');
    }

    responseLanguage = detectAssistantLanguage(parsedBody.messages);

    if (!rawConfig) {
      throw createAssistantError('missing_configuration');
    }
    const config = assertAssistantRuntimeConfig(rawConfig);
    logProvider = config.provider;
    logModel = config.provider === 'github' ? config.github.model : config.openai.model;
    logInputChars = parsedBody.messages.reduce((sum, message) => sum + message.content.length, 0);
    logMessageCount = parsedBody.messages.length;

    assertAssistantRateLimit(request, {
      limit: config.limits.rateLimitRequests,
      windowSeconds: config.limits.rateLimitWindowSeconds,
      salt: config.rateLimitSalt,
    });

    const allKnowledge = buildAssistantKnowledge();
    const selectedKnowledge = buildAssistantKnowledgeContext({
      messages: parsedBody.messages,
      pageContext: parsedBody.pageContext,
      knowledge: allKnowledge,
      maxContextChars: config.limits.maxKnowledgeContextChars,
      maxSelectedKnowledgeEntries: config.limits.maxSelectedKnowledgeEntries,
    });

    const system = buildAssistantSystemPrompt({
      knowledgeContext: formatKnowledgeContext(selectedKnowledge),
      pathname: parsedBody.pageContext?.pathname,
      pageTitle: parsedBody.pageContext?.title,
      responseLanguage,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.limits.timeoutMs);
    request.signal.addEventListener('abort', () => controller.abort(), { once: true });

    const provider = getAssistantProvider(config);
    const result = await provider.streamText({
      system,
      messages: parsedBody.messages,
      maxOutputTokens: config.limits.maxOutputTokens,
      timeoutMs: config.limits.timeoutMs,
      abortSignal: controller.signal,
    });

    logAssistantEvent({
      requestId,
      status: 200,
      provider: result.provider,
      model: result.model,
      durationMs: Date.now() - startedAt,
      inputChars: logInputChars,
      messageCount: logMessageCount,
    });

    const response = createTextStreamResponse({
      stream: result.stream.pipeThrough(createCompletionCleanupStream(() => clearTimeout(timeout))),
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('X-Request-Id', requestId);

    return response;
  } catch (error) {
    const normalized = normalizeAssistantError(error);
    const localizedMessage = getLocalizedAssistantErrorMessage(normalized.code, responseLanguage);
    logAssistantEvent({
      requestId,
      status: normalized.status,
      provider: logProvider,
      model: logModel,
      durationMs: Date.now() - startedAt,
      inputChars: logInputChars,
      messageCount: logMessageCount,
      errorCode: normalized.code,
    });

    return Response.json(
      {
        ...toAssistantErrorPayload(normalized),
        message: localizedMessage,
      },
      {
        status: normalized.status,
        headers: {
          'Cache-Control': 'no-store',
          ...(normalized.retryAfterSeconds ? { 'Retry-After': String(normalized.retryAfterSeconds) } : {}),
        },
      },
    );
  }
}

async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw createAssistantError('invalid_request');
  }
}

function logAssistantEvent(event: {
  requestId: string;
  status: number;
  provider: string;
  model: string;
  durationMs: number;
  inputChars?: number;
  messageCount?: number;
  errorCode?: string;
}) {
  console.info('[assistant]', {
    requestId: event.requestId,
    provider: event.provider,
    model: event.model,
    status: event.status,
    durationMs: event.durationMs,
    inputChars: event.inputChars,
    messageCount: event.messageCount,
    errorCode: event.errorCode,
  });
}

function createCompletionCleanupStream(callback: () => void) {
  return new TransformStream<string, string>({
    transform(chunk, controller) {
      controller.enqueue(chunk);
    },
    flush() {
      callback();
    },
  });
}
