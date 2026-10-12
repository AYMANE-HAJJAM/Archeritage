import { NextResponse } from 'next/server';
import {
  createContactSchema,
  type ContactValidationMessages,
} from '@/lib/validation';
import { isAppLocale, type AppLocale } from '@/i18n/routing';

const attempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_MAX_ENTRIES = 5_000;
const MAX_REQUEST_SIZE = 32 * 1024;
const RESEND_TIMEOUT_MS = 10_000;

type ContactMessages = {
  form: Record<string, string>;
  profiles: Record<string, string>;
  projectTypes: Record<string, string>;
  validation: ContactValidationMessages;
  status: Record<string, string>;
};

async function loadContactMessages(locale: string): Promise<ContactMessages> {
  const appLocale: AppLocale = isAppLocale(locale) ? locale : 'fr';
  return (await import(`../../../../messages/${appLocale}/contact.json`)).default as ContactMessages;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  pruneAttempts(now, ip);
  const current = attempts.get(ip);

  const contentLength = Number(request.headers.get('content-length'));

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    const messages = await loadContactMessages('fr');
    return NextResponse.json({ message: messages.status.unreadable }, { status: 400 });
  }

  const locale = String(form.get('locale') ?? 'fr');
  const messages = await loadContactMessages(locale);

  if (current && current.resetAt > now && current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return NextResponse.json({ message: messages.status.rateLimited }, { status: 429 });
  }
  attempts.set(ip, current && current.resetAt > now
    ? { ...current, count: current.count + 1 }
    : { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_SIZE) {
    return NextResponse.json({ message: messages.status.unreadable }, { status: 413 });
  }

  const contactSchema = createContactSchema(messages.validation);
  const parsed = contactSchema.safeParse({ ...Object.fromEntries([
    'fullName',
    'organization',
    'profile',
    'email',
    'phone',
    'projectType',
    'projectLocation',
    'message',
    'website',
  ].map((key) => [key, String(form.get(key) ?? '')])),
    privacyConsent: form.get('privacyConsent') === 'true',
    publicationsConsent: form.get('publicationsConsent') === 'true',
    context: form.get('context') || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ message: messages.status.invalid, errors: Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])) }, { status: 400 });
  }
  if (parsed.data.website) {
    return NextResponse.json({ message: messages.status.invalid }, { status: 400 });
  }

  if ([...form.values()].some((value) => value instanceof File)) {
    return NextResponse.json({ message: messages.status.noAttachments }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return NextResponse.json({
      message: messages.status.unavailable,
    }, { status: 503 });
  }

  const profileLabel = messages.profiles[parsed.data.profile] ?? parsed.data.profile;
  const projectTypeLabel = messages.projectTypes[parsed.data.projectType] ?? parsed.data.projectType;
  const emailFields: Array<[string, string | undefined]> = [
    [messages.form.fullName, parsed.data.fullName],
    [messages.form.organization, parsed.data.organization],
    [messages.form.profile, profileLabel],
    [messages.form.email, parsed.data.email],
    [messages.form.phone, parsed.data.phone],
    [messages.form.projectType, projectTypeLabel],
    [messages.form.projectLocation, parsed.data.projectLocation],
    [messages.form.message, parsed.data.message],
    ['Privacy consent (UTC)', new Date(now).toISOString()],
    ['Privacy consent', String(parsed.data.privacyConsent)],
    ['Publications opt-in', String(parsed.data.publicationsConsent)],
    ['Initial Solution / Mission', parsed.data.context ? messages.projectTypes[parsed.data.context] : undefined],
  ];
  const lines = emailFields
    .map(([label, value]) => `<p><strong>${escapeHtml(label)} :</strong> ${escapeHtml(value || '—')}</p>`)
    .join('');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: parsed.data.email,
        subject: `Nouvelle demande Archeritage — ${projectTypeLabel}`,
        html: `<h1>Nouvelle demande qualifiée</h1>${lines}`,
      }),
      signal: controller.signal,
    });
  } catch {
    return NextResponse.json({ message: messages.status.unavailable }, { status: 503 });
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    return NextResponse.json({ message: messages.status.transmissionFailed }, { status: 502 });
  }
  return NextResponse.json({ success: true, message: messages.status.success });
}

function pruneAttempts(now: number, currentIp: string) {
  for (const [ip, attempt] of attempts) {
    if (attempt.resetAt <= now) attempts.delete(ip);
  }

  if (attempts.size >= RATE_LIMIT_MAX_ENTRIES && !attempts.has(currentIp)) {
    const oldestIp = attempts.keys().next().value;
    if (oldestIp) attempts.delete(oldestIp);
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] || character);
}
