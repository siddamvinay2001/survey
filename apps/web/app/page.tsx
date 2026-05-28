import Link from 'next/link';
import { Button } from '@survey/ui';

export default function HomePage() {
  return (
    <main className="container py-20 space-y-8">
      <header className="space-y-4">
        <h1 className="text-5xl font-semibold tracking-tight">Honest answers, on-chain.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Survey participants stake SOL before answering. Spam is slashed. Quality is rewarded. The
          economics do the work — no captchas, no moderators.
        </p>
      </header>
      <div className="flex gap-3">
        <Link href="/surveys">
          <Button size="lg">Browse surveys</Button>
        </Link>
        <Link href="/create">
          <Button size="lg" variant="ghost">
            Create a survey
          </Button>
        </Link>
      </div>
    </main>
  );
}
