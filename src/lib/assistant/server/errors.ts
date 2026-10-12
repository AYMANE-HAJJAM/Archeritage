import { AISDKError } from 'ai';

import { ASSISTANT_ERROR_MESSAGES } from '@/lib/assistant/shared/constants';
import type { AssistantErrorCode, AssistantErrorPayload } from '@/lib/assistant/shared/types';

export class AssistantError extends Error {
  readonly code: AssistantErrorCode;
  readonly status: number;
  readonly retryAfterSeconds?: number;

  constructor(code: AssistantErrorCode, message: string, status: number, retryAfterSeconds?: number) {
    super(message);
    this.name = 'AssistantError';
    this.code = code;
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function createAssistantError(
  code: AssistantErrorCode,
  overrides?: Partial<Pick<AssistantError, 'status' | 'retryAfterSeconds'>> & { message?: string },
) {
  const status = overrides?.status ?? defaultStatusByCode[code];
  const message = overrides?.message ?? defaultMessageByCode[code];
  return new AssistantError(code, message, status, overrides?.retryAfterSeconds);
}

export function normalizeAssistantError(error: unknown): AssistantError {
  if (error instanceof AssistantError) {
    return error;
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return createAssistantError('timeout');
  }

  if (error instanceof AISDKError) {
    const candidate = error as AISDKError & { statusCode?: number; cause?: unknown };
    const statusCode = candidate.statusCode ?? extractStatusCode(candidate.cause);

    if (statusCode === 400 || error.name === 'InvalidPromptError') {
      return createAssistantError('invalid_request');
    }

    if (statusCode === 408) {
      return createAssistantError('timeout');
    }

    if (statusCode === 401) {
      return createAssistantError('provider_authentication_failed');
    }

    if (statusCode === 403) {
      return createAssistantError('provider_forbidden');
    }

    if (statusCode === 429) {
      return createAssistantError('rate_limited');
    }

    if (statusCode && statusCode >= 500) {
      return createAssistantError('provider_unavailable');
    }

    if (error.name === 'InvalidResponseDataError' || error.name === 'EmptyResponseBodyError') {
      return createAssistantError('invalid_provider_response');
    }
  }

  if (error instanceof Error) {
    const statusCode = extractStatusCode(error);

    if (statusCode === 429) {
      return createAssistantError('rate_limited');
    }

    if (statusCode === 401) {
      return createAssistantError('provider_authentication_failed');
    }

    if (statusCode === 403) {
      return createAssistantError('provider_forbidden');
    }

    if (statusCode === 408) {
      return createAssistantError('timeout');
    }

    if (statusCode && statusCode >= 500) {
      return createAssistantError('provider_unavailable');
    }
  }

  return createAssistantError('internal_error');
}

export function toAssistantErrorPayload(error: AssistantError): AssistantErrorPayload {
  return {
    code: error.code,
    message: error.message,
    retryAfterSeconds: error.retryAfterSeconds,
  };
}

function extractStatusCode(error: unknown) {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const candidate = error as { status?: unknown; statusCode?: unknown };
  if (typeof candidate.statusCode === 'number') {
    return candidate.statusCode;
  }

  if (typeof candidate.status === 'number') {
    return candidate.status;
  }

  return undefined;
}

const defaultStatusByCode: Record<AssistantErrorCode, number> = {
  invalid_request: 400,
  missing_configuration: 503,
  disabled: 503,
  rate_limited: 429,
  timeout: 504,
  provider_authentication_failed: 502,
  provider_forbidden: 502,
  provider_unavailable: 503,
  invalid_provider_response: 502,
  internal_error: 500,
};

const defaultMessageByCode: Record<AssistantErrorCode, string> = {
  invalid_request: ASSISTANT_ERROR_MESSAGES.invalidRequest,
  missing_configuration: ASSISTANT_ERROR_MESSAGES.unavailable,
  disabled: ASSISTANT_ERROR_MESSAGES.unavailable,
  rate_limited: ASSISTANT_ERROR_MESSAGES.rateLimited,
  timeout: ASSISTANT_ERROR_MESSAGES.timeout,
  provider_authentication_failed: ASSISTANT_ERROR_MESSAGES.providerUnavailable,
  provider_forbidden: ASSISTANT_ERROR_MESSAGES.providerUnavailable,
  provider_unavailable: ASSISTANT_ERROR_MESSAGES.providerUnavailable,
  invalid_provider_response: ASSISTANT_ERROR_MESSAGES.providerUnavailable,
  internal_error: ASSISTANT_ERROR_MESSAGES.providerUnavailable,
};
