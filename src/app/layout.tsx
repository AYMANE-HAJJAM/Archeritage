import type { ReactNode } from 'react';

import { site } from '@/data/site';

export const metadata = {
  metadataBase: new URL(site.url),
};

/** Root layout passes through; html/body live in `[locale]/layout`. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
