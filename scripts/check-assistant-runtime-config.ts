/**
 * Safe assistant runtime configuration check.
 * Prints presence booleans and failed field names only — never secret values.
 *
 * Usage: npm run assistant:config-check
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { loadAssistantConfig } from '../src/lib/assistant/server/config-loader';

loadLocalEnvFile('.env.local');
loadLocalEnvFile('.env');

const result = loadAssistantConfig();
const { diagnostics } = result;

const summary = {
  valid: diagnostics.valid,
  provider: diagnostics.selectedProvider,
  modelConfigured: Boolean(diagnostics.selectedModel),
  tokenConfigured:
    diagnostics.selectedProvider === 'openai'
      ? diagnostics.openAiTokenPresent
      : diagnostics.githubTokenPresent,
  saltConfigured: diagnostics.rateLimitSaltPresent || result.ok,
  failedFields: diagnostics.failedFields,
  environment: diagnostics.environment,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(result.ok ? 0 : 1);

function loadLocalEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) {
    return;
  }

  const content = readFileSync(path, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const separator = trimmed.indexOf('=');
    if (separator <= 0) {
      continue;
    }
    const key = trimmed.slice(0, separator).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }
    let value = trimmed.slice(separator + 1);
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}
