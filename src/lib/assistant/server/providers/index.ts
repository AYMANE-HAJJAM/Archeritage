import type { AssistantConfig } from '@/lib/assistant/server/config';
import { GithubModelsAssistantProvider } from '@/lib/assistant/server/providers/github-models';
import { OpenAIAssistantProvider } from '@/lib/assistant/server/providers/openai';

export function getAssistantProvider(config: AssistantConfig) {
  return config.provider === 'openai'
    ? new OpenAIAssistantProvider(config)
    : new GithubModelsAssistantProvider(config);
}

export type { AssistantProvider } from '@/lib/assistant/server/providers/types';
