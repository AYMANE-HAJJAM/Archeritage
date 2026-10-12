export type AssistantChatRole = 'user' | 'assistant';

export type AssistantClientMessage = {
  role: AssistantChatRole;
  content: string;
};

export type AssistantPageContext = {
  pathname?: string;
  title?: string;
};

export type AssistantRequestBody = {
  messages: AssistantClientMessage[];
  pageContext?: AssistantPageContext;
};

export type AssistantWidgetMessage = {
  id: string;
  role: AssistantChatRole;
  content: string;
  state?: 'streaming' | 'error' | 'done';
};

export type AssistantErrorCode =
  | 'invalid_request'
  | 'missing_configuration'
  | 'disabled'
  | 'rate_limited'
  | 'timeout'
  | 'provider_authentication_failed'
  | 'provider_forbidden'
  | 'provider_unavailable'
  | 'invalid_provider_response'
  | 'internal_error';

export type AssistantErrorPayload = {
  code: AssistantErrorCode;
  message: string;
  retryAfterSeconds?: number;
};
