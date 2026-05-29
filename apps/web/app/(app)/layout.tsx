import type { ReactNode } from 'react';

import { NavBar } from '@/components/navbar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">{children}</div>
    </div>
  );
}
