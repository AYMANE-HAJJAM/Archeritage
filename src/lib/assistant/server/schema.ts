import { z } from 'zod';

import type { AssistantClientMessage, AssistantRequestBody } from '@/lib/assistant/shared/types';

type AssistantSchemaLimits = {
  maxInputChars: number;
  maxHistoryMessages: number;
  maxTotalChars: number;
  maxPageTitleChars: number;
};

const sanitizedPathnameSchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .refine((value) => value.startsWith('/'), {
    message: 'Invalid pathname.',
  })
  .transform((value) => value.replace(/[\u0000-\u001F\u007F]/g, ''));

export function createAssistantRequestSchema(limits: AssistantSchemaLimits) {
  const messageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z
      .string()
      .trim()
      .min(1)
      .max(limits.maxInputChars),
  });

  return z.object({
    messages: z
      .array(messageSchema)
      .min(1)
      .max(limits.maxHistoryMessages)
      .superRefine((messages, ctx) => {
        const totalChars = messages.reduce((sum, message) => sum + message.content.length, 0);

        if (messages[messages.length - 1]?.role !== 'user') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Last message must be from user.',
          });
        }

        if (totalChars > limits.maxTotalChars) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Conversation too large.',
          });
        }
      }),
    pageContext: z
      .object({
        pathname: sanitizedPathnameSchema.optional(),
        title: z
          .string()
          .trim()
          .min(1)
          .max(limits.maxPageTitleChars)
          .transform((value) => value.replace(/[\u0000-\u001F\u007F]/g, ''))
          .optional(),
      })
      .strict()
      .optional(),
  }).strict();
}

export function parseAssistantRequestBody(input: unknown, limits: AssistantSchemaLimits): AssistantRequestBody | null {
  const schema = createAssistantRequestSchema(limits);
  const result = schema.safeParse(input);

  if (!result.success) {
    return null;
  }

  return {
    messages: trimHistory(result.data.messages, limits.maxHistoryMessages),
    pageContext: result.data.pageContext,
  };
}

function trimHistory(messages: AssistantClientMessage[], maxHistoryMessages: number) {
  return messages.slice(-maxHistoryMessages);
}
