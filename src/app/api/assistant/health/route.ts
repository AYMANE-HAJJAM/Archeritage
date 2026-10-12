import { getAssistantConfigHealth } from '@/lib/assistant/server/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Safe configuration presence probe for production diagnosis.
 * Returns booleans and failed field names only — never values.
 * Remove once Vercel Production assistant configuration is confirmed healthy.
 */
export async function GET() {
  const health = getAssistantConfigHealth();

  return Response.json(health, {
    status: health.status === 'configured' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
