import { streamText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

import type { AssistantConfig } from '@/lib/assistant/server/config';
import type { AssistantProvider, AssistantProviderGenerateParams } from '@/lib/assistant/server/providers/types';

export class GithubModelsAssistantProvider implements AssistantProvider {
  readonly provider = 'github' as const;
  readonly model: string;
  private readonly client;

  constructor(private readonly config: AssistantConfig) {
    this.model = config.github.model;
    this.client = createOpenAICompatible({
      name: 'github-models',
      apiKey: config.github.token,
      baseURL: config.github.baseUrl,
      includeUsage: true,
    });
  }

  async streamText(params: AssistantProviderGenerateParams) {
    const result = streamText({
      model: this.client(this.model),
      system: params.system,
      messages: params.messages,
      maxOutputTokens: params.maxOutputTokens,
      temperature: 0.2,
      abortSignal: params.abortSignal,
      timeout: params.timeoutMs,
    });

    return {
      provider: this.provider,
      model: this.model,
      stream: result.textStream,
    };
  }
}
