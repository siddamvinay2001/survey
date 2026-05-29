'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@survey/ui/components/button';
import { cn } from '@survey/ui/lib/utils';

function truncate(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function WalletButton({ className }: { className?: string }) {
  const { publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  if (connecting) {
    return (
      <Button
        variant="outline"
        size="default"
        disabled
        className={cn('min-w-24', className)}
        aria-label="Connecting wallet"
      >
        Connecting…
      </Button>
    );
  }

  if (publicKey) {
    return (
      <Button
        variant="secondary"
        size="default"
        onClick={() => disconnect()}
        className={cn('min-w-24 font-mono', className)}
        aria-label={`Disconnect wallet ${publicKey.toBase58()}`}
      >
        {truncate(publicKey.toBase58())}
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      size="lg"
      onClick={() => setVisible(true)}
      className={cn('min-w-24', className)}
      aria-label="Connect wallet"
    >
      Connect wallet
    </Button>
  );
}
