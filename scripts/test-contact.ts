import assert from 'node:assert/strict';
import { POST } from '../src/app/api/contact/route';
import { contactSchema } from '../src/lib/validation';
import { getContactInitialValues, projectTypeKeys } from '../src/content/site/contact-form';

async function main() {
  const values = { fullName: 'QA Example', organization: 'Test organisation', email: 'qa@example.test', phone: '+212 (661) 04-71-30', profile: 'proprietaire', projectType: 'architecture', projectLocation: 'Casablanca', message: '<script>test</script>', privacyConsent: true, publicationsConsent: false, context: 'potentiel-foncier' };
  assert(contactSchema.safeParse(values).success);
  for (const key of ['fullName', 'email', 'profile', 'projectType', 'message', 'privacyConsent']) {
    assert(!contactSchema.safeParse({ ...values, [key]: key === 'privacyConsent' ? false : '' }).success, key);
  }
  assert(!contactSchema.safeParse({ ...values, phone: 'invalid' }).success);
  assert(contactSchema.safeParse({ ...values, phone: '+44 20 7946 0958 ext. 123' }).success);
  for (const key of projectTypeKeys) assert.equal(getContactInitialValues({ solution: key }).projectType, key);
  assert.equal(getContactInitialValues({ type: 'rehabilitation' }).projectType, 'patrimoine');
  assert.equal(getContactInitialValues({ besoin: 'cadrage-mission' }).projectType, 'cadrage-mission');
  assert.equal(getContactInitialValues({ profil: 'collectivite' }).profile, 'collectivite');
  assert.equal(getContactInitialValues({ solution: 'invalid' }).projectType, undefined);
  let requestNumber = 0;
  const send = (overrides = {}, locale = 'fr') => {
    const form = new FormData();
    Object.entries({ ...values, ...overrides, locale }).forEach(([key, value]) => form.append(key, String(value)));
    return POST(new Request('http://localhost/api/contact', { method: 'POST', body: form, headers: { 'x-forwarded-for': `contact-test-${++requestNumber}` } }));
  };
  for (const locale of ['fr', 'en', 'ar']) {
    const response = await send({ privacyConsent: false }, locale);
    assert.equal(response.status, 400);
    assert((await response.json()).errors.privacyConsent);
  }
  assert.equal((await send({ website: 'spam' })).status, 400);
  const originalFetch = globalThis.fetch;
  const keys = ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL'] as const;
  const originalEnv = keys.map((key) => process.env[key]);
  try {
    keys.forEach((key) => delete process.env[key]);
    assert.equal((await send()).status, 503);
    process.env.RESEND_API_KEY = 'test-only';
    process.env.CONTACT_TO_EMAIL = 'recipient@example.test';
    process.env.CONTACT_FROM_EMAIL = 'sender@example.test';
    let payload: Record<string, unknown> = {};
    globalThis.fetch = async (_url, init) => {
      payload = JSON.parse(String(init?.body));
      return Response.json({ id: 'mock-provider-id' });
    };
    const response = await send();
    assert.equal(response.status, 200);
    assert.equal((await response.json()).success, true);
    assert.equal(payload.reply_to, values.email);
    assert.deepEqual(payload.to, ['recipient@example.test']);
    assert(String(payload.html).includes('QA Example'));
    assert(String(payload.html).includes('Potentiel Foncier'));
    assert(String(payload.html).includes('&lt;script&gt;'));
    assert(String(payload.html).includes('false'));
    assert(!('attachments' in payload));
    globalThis.fetch = async () => new Response(null, { status: 500 });
    assert.equal((await send()).status, 502);
    globalThis.fetch = async () => { throw new Error('offline'); };
    assert.equal((await send()).status, 503);
    globalThis.fetch = async () => Response.json({ id: 'retry-mock-id' });
    assert.equal((await send()).status, 200);
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, index) => { if (originalEnv[index] === undefined) delete process.env[key]; else process.env[key] = originalEnv[index]; });
  }
  console.log('Contact validation, links, localized API errors, mocked provider success/failure/retry and email payload checks passed. No email was sent.');
}
void main();
