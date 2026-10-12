import { createHash } from 'node:crypto';

import { createAssistantError } from '@/lib/assistant/server/errors';

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, RateLimitBucket>();
const MAX_RATE_LIMIT_ENTRIES = 5_000;

export function assertAssistantRateLimit(request: Request, options: {
  limit: number;
  windowSeconds: number;
  salt: string;
}) {
  const now = Date.now();
  const key = createRateLimitKey(request, options.salt);

  pruneExpiredBuckets(now, key);

  const bucket = attempts.get(key);
  if (bucket && bucket.resetAt > now && bucket.count >= options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    throw createAssistantError('rate_limited', { retryAfterSeconds });
  }

  attempts.set(
    key,
    bucket && bucket.resetAt > now
      ? { ...bucket, count: bucket.count + 1 }
      : { count: 1, resetAt: now + options.windowSeconds * 1000 },
  );
}

function createRateLimitKey(request: Request, salt: string) {
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim() ?? '';
  const userAgent = request.headers.get('user-agent') ?? '';
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '';
  const value = [salt, host, ip, userAgent].join('|');

  return createHash('sha256').update(value).digest('hex');
}

function pruneExpiredBuckets(now: number, currentKey: string) {
  for (const [key, bucket] of attempts) {
    if (bucket.resetAt <= now) {
      attempts.delete(key);
    }
  }

  if (attempts.size >= MAX_RATE_LIMIT_ENTRIES && !attempts.has(currentKey)) {
    const oldestKey = attempts.keys().next().value;
    if (oldestKey) {
      attempts.delete(oldestKey);
    }
  }
}
