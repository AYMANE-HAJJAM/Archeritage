import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

import type { AssistantConfig } from '@/lib/assistant/server/config';
import type { AssistantProvider, AssistantProviderGenerateParams } from '@/lib/assistant/server/providers/types';

export class OpenAIAssistantProvider implements AssistantProvider {
  readonly provider = 'openai' as const;
  readonly model: string;
  private readonly client;

  constructor(private readonly config: AssistantConfig) {
    this.model = config.openai.model;
    this.client = createOpenAI({
      apiKey: config.openai.apiKey,
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
