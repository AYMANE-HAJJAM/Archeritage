'use client';

import dynamic from 'next/dynamic';

const AssistantWidget = dynamic(
  () => import('@/components/assistant/AssistantWidget').then((module) => module.AssistantWidget),
  { ssr: false },
);

export function AssistantWidgetMount() {
  return <AssistantWidget />;
}
