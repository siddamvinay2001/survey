import Link from 'next/link';
import type { ReactNode } from 'react';

import { WalletButton } from '~/components/wallet-button';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="container flex h-14 items-center justify-between">
          <Link href="/" className="font-semibold">
            Survey
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/surveys">Browse</Link>
            <Link href="/create">Create</Link>
            <Link href="/dashboard">Dashboard</Link>
            <WalletButton />
          </div>
        </nav>
      </header>
      <div className="container py-8">{children}</div>
    </div>
  );
}
