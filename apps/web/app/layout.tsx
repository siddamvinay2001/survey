import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Providers } from '~/lib/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Survey — Honest answers, on-chain',
  description: 'Solana-based survey platform with stake-and-slash spam resistance.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
