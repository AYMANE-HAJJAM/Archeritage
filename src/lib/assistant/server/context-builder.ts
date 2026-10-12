import type { AssistantClientMessage, AssistantPageContext } from '@/lib/assistant/shared/types';
import type { AssistantKnowledgeEntry } from '@/lib/assistant/server/knowledge';

type ContextBuilderOptions = {
  messages: AssistantClientMessage[];
  pageContext?: AssistantPageContext;
  knowledge: AssistantKnowledgeEntry[];
  maxContextChars: number;
  maxSelectedKnowledgeEntries: number;
};

export function buildAssistantKnowledgeContext(options: ContextBuilderOptions) {
  const totalKnowledgeChars = options.knowledge.reduce((sum, entry) => sum + entry.content.length, 0);
  if (totalKnowledgeChars <= options.maxContextChars) {
    return options.knowledge;
  }

  const query = [
    options.messages.map((message) => message.content).join(' '),
    options.pageContext?.pathname ?? '',
    options.pageContext?.title ?? '',
  ].join(' ');

  const normalizedQuery = normalizeForSearch(query);
  const queryTokens = tokenize(normalizedQuery);
  const pathname = options.pageContext?.pathname ?? '';

  const scored = options.knowledge.map((entry) => ({
    entry,
    score: scoreEntry(entry, normalizedQuery, queryTokens, pathname),
  }));

  const alwaysInclude = new Set(
    options.knowledge
      .filter((entry) => entry.id === 'company-identity' || entry.id === 'contact-details')
      .map((entry) => entry.id),
  );

  return scored
    .sort((left, right) => right.score - left.score)
    .filter(({ entry, score }) => alwaysInclude.has(entry.id) || score > 0)
    .slice(0, options.maxSelectedKnowledgeEntries)
    .map(({ entry }) => entry);
}

export function formatKnowledgeContext(entries: AssistantKnowledgeEntry[]) {
  return entries
    .map((entry) => {
      const route = entry.route ? `\nRoute interne approuvée: ${entry.route}` : '';
      return `[${entry.category.toUpperCase()}] ${entry.title}${route}\n${entry.content}`;
    })
    .join('\n\n');
}

function scoreEntry(
  entry: AssistantKnowledgeEntry,
  normalizedQuery: string,
  queryTokens: Set<string>,
  pathname: string,
) {
  const title = normalizeForSearch(entry.title);
  const content = normalizeForSearch(entry.content);
  const keywords = entry.keywords.map(normalizeForSearch);

  let score = 0;

  if (pathname && entry.route === pathname) {
    score += 14;
  } else if (pathname && entry.route && pathname.startsWith(entry.route) && entry.route !== '/') {
    score += 8;
  }

  if (normalizedQuery.includes(title)) {
    score += 22;
  }

  for (const keyword of keywords) {
    if (!keyword) {
      continue;
    }

    if (normalizedQuery.includes(keyword)) {
      score += keyword.length > 6 ? 9 : 6;
    }
  }

  for (const token of queryTokens) {
    if (title.includes(token)) {
      score += 5;
    }
    if (content.includes(token)) {
      score += 2;
    }
  }

  return score;
}

function tokenize(value: string) {
  return new Set(value.split(/\s+/).filter((token) => token.length >= 2));
}

function normalizeForSearch(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^\p{L}\p{N}\s/.-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
