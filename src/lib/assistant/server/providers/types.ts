import type { AssistantProviderName } from '@/lib/assistant/server/config';
import type { AssistantClientMessage } from '@/lib/assistant/shared/types';

export type AssistantProviderGenerateParams = {
  system: string;
  messages: AssistantClientMessage[];
  maxOutputTokens: number;
  timeoutMs: number;
  abortSignal: AbortSignal;
};

export type AssistantProviderResult = {
  provider: AssistantProviderName;
  model: string;
  stream: ReadableStream<string>;
};

export interface AssistantProvider {
  readonly provider: AssistantProviderName;
  readonly model: string;
  streamText(params: AssistantProviderGenerateParams): Promise<AssistantProviderResult>;
}
