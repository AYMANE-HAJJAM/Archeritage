import { loadAssistantConfig, normalizeEnvValue } from '../src/lib/assistant/server/config-loader';

const keys = [
  'AI_PROVIDER',
  'GITHUB_MODELS_TOKEN',
  'GITHUB_MODELS_MODEL',
  'GITHUB_MODELS_BASE_URL',
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'ASSISTANT_RATE_LIMIT_SALT',
  'ASSISTANT_MAX_INPUT_CHARS',
  'ASSISTANT_MAX_HISTORY_MESSAGES',
  'ASSISTANT_MAX_TOTAL_CHARS',
  'ASSISTANT_MAX_OUTPUT_TOKENS',
  'ASSISTANT_TIMEOUT_MS',
  'ASSISTANT_RATE_LIMIT_REQUESTS',
  'ASSISTANT_RATE_LIMIT_WINDOW_SECONDS',
  'NEXT_PUBLIC_ASSISTANT_ENABLED',
] as const;

const snapshot = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

function reset(extra: Record<string, string> = {}) {
  for (const key of keys) {
    delete process.env[key];
  }
  delete process.env.VERCEL_ENV;
  Object.assign(process.env, extra);
  process.env.VERCEL_ENV = 'production';
}

function restore() {
  for (const key of keys) {
    const value = snapshot[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

assert(normalizeEnvValue('"github"', false) === 'github', 'quote strip provider');
assert(normalizeEnvValue('  openai/gpt-4.1  ', false) === 'openai/gpt-4.1', 'trim model');
assert(normalizeEnvValue('"tok"', true) === '"tok"', 'secrets keep quotes');
assert(normalizeEnvValue('   ', false) === undefined, 'blank undefined');

reset({
  AI_PROVIDER: 'github',
  GITHUB_MODELS_TOKEN: 'token',
  GITHUB_MODELS_MODEL: 'openai/gpt-4.1',
  GITHUB_MODELS_BASE_URL: 'https://models.github.ai/inference',
  ASSISTANT_RATE_LIMIT_SALT: 'production-salt-value-32chars-min!!',
});
let result = loadAssistantConfig();
assert(result.ok && result.config.provider === 'github', 'A complete github');

reset({
  AI_PROVIDER: 'github',
  GITHUB_MODELS_TOKEN: 'token',
  GITHUB_MODELS_MODEL: 'openai/gpt-4.1',
  GITHUB_MODELS_BASE_URL: 'https://models.github.ai/inference',
});
result = loadAssistantConfig();
assert(!result.ok && result.diagnostics.failedFields.includes('ASSISTANT_RATE_LIMIT_SALT'), 'B missing salt');

reset({
  AI_PROVIDER: 'github',
  GITHUB_MODELS_MODEL: 'openai/gpt-4.1',
  GITHUB_MODELS_BASE_URL: 'https://models.github.ai/inference',
  ASSISTANT_RATE_LIMIT_SALT: 'production-salt-value-32chars-min!!',
});
result = loadAssistantConfig();
assert(!result.ok && result.diagnostics.failedFields.includes('GITHUB_MODELS_TOKEN'), 'C missing token');

reset({
  AI_PROVIDER: 'github',
  GITHUB_MODELS_TOKEN: 'token',
  GITHUB_MODELS_MODEL: 'openai/gpt-4.1',
  ASSISTANT_RATE_LIMIT_SALT: 'production-salt-value-32chars-min!!',
});
result = loadAssistantConfig();
assert(
  result.ok
    && result.config.provider === 'github'
    && result.config.github.baseUrl.includes('models.github.ai'),
  'D openai empty + base default',
);

reset({
  AI_PROVIDER: '  github  ',
  GITHUB_MODELS_TOKEN: 'token',
  GITHUB_MODELS_MODEL: '  openai/gpt-4.1  ',
  GITHUB_MODELS_BASE_URL: '  https://models.github.ai/inference  ',
  ASSISTANT_RATE_LIMIT_SALT: '  production-salt-value-32chars-min!!  ',
});
result = loadAssistantConfig();
assert(result.ok && result.config.github.model === 'openai/gpt-4.1', 'E whitespace');

reset({
  AI_PROVIDER: '"github"',
  GITHUB_MODELS_TOKEN: 'token',
  GITHUB_MODELS_MODEL: '"openai/gpt-4.1"',
  GITHUB_MODELS_BASE_URL: '"https://models.github.ai/inference"',
  ASSISTANT_RATE_LIMIT_SALT: 'production-salt-value-32chars-min!!',
});
result = loadAssistantConfig();
assert(result.ok && result.config.provider === 'github' && result.config.github.model === 'openai/gpt-4.1', 'F quoted');

reset({
  AI_PROVIDER: 'azure',
  GITHUB_MODELS_TOKEN: 'token',
  GITHUB_MODELS_MODEL: 'openai/gpt-4.1',
  ASSISTANT_RATE_LIMIT_SALT: 'production-salt-value-32chars-min!!',
});
result = loadAssistantConfig();
assert(!result.ok && result.diagnostics.failedFields.includes('AI_PROVIDER'), 'G invalid provider');

restore();
console.log('ALL MATRIX TESTS PASSED');
