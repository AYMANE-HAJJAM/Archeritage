import { createAssistantError } from '@/lib/assistant/server/errors';

export function assertAssistantRequestHeaders(request: Request, requestBodyLimitBytes: number) {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw createAssistantError('invalid_request');
  }

  const contentLength = Number.parseInt(request.headers.get('content-length') ?? '', 10);
  if (Number.isFinite(contentLength) && contentLength > requestBodyLimitBytes) {
    throw createAssistantError('invalid_request', { status: 413 });
  }
}

export function assertSameSiteRequest(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) {
    return;
  }

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    throw createAssistantError('invalid_request');
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const host = forwardedHost ?? request.headers.get('host');

  if (!host) {
    return;
  }

  const expectedOrigin = `${forwardedProto ?? originUrl.protocol.replace(':', '')}://${host}`;
  if (originUrl.origin !== expectedOrigin) {
    throw createAssistantError('invalid_request', { status: 403 });
  }
}
