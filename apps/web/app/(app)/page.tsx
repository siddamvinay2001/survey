import {
  Analytics01Icon,
  ArrowRight01Icon,
  Award01Icon,
  Blockchain01Icon,
  CheckmarkCircle01Icon,
  Coins01Icon,
  LockIcon,
  MoneyBag01Icon,
  Search01Icon,
  Shield01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import Link from 'next/link';

import { Button } from '@survey/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@survey/ui/components/card';

interface StatCardProps {
  value: string;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <span className="text-3xl font-bold text-secondary-foreground">{value}</span>
      <span className="text-sm text-secondary-foreground/70">{label}</span>
    </div>
  );
}

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: IconSvgElement;
}

function StepCard({ step, title, description, icon }: StepCardProps) {
  return (
    <Card className="flex-1 transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0 ring-4 ring-primary/20">
            {step}
          </span>
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={icon}
              size={16}
              strokeWidth={1.5}
              className="text-primary"
              aria-hidden="true"
            />
            <CardTitle>{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: IconSvgElement;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="flex-1 transition-shadow duration-200 hover:shadow-md bg-card border-accent/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={icon}
            size={20}
            strokeWidth={1.5}
            className="text-accent-foreground"
            aria-hidden="true"
          />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default function LandingPage() {
  return (
    <main className="animate-in fade-in duration-300">
      {/* Hero — olive-tinted warm section */}
      <section className="bg-primary/10 rounded-2xl py-20 md:py-28 px-8 sm:px-12 mb-6">
        <div className="space-y-6 text-center sm:text-left max-w-3xl">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Honest answers, on-chain.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Survey participants stake SOL before answering. Spam is slashed. Quality is rewarded.
              The economics do the work — no captchas, no moderators.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/surveys">
              <Button size="lg" className="gap-2 px-8">
                <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={1.5} aria-hidden="true" />
                Browse surveys
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Button>
            </Link>
            <Link href="/create">
              <Button size="lg" variant="outline" className="gap-2 px-8">
                <HugeiconsIcon
                  icon={Blockchain01Icon}
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                Create a survey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats — teal surface */}
      <section aria-label="Platform statistics" className="bg-secondary rounded-2xl px-8 py-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-secondary-foreground/20">
          <StatCard value="1,234" label="surveys created" />
          <StatCard value="89,432" label="responses submitted" />
          <StatCard value="0.5 SOL" label="average reward" />
        </div>
      </section>

      {/* How it works — warm olive-cream */}
      <section className="bg-muted rounded-2xl px-8 py-10 mb-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">How it works</h2>
          <p className="text-muted-foreground">Three steps to quality, on-chain.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <StepCard
            step={1}
            icon={LockIcon}
            title="Stake SOL"
            description="Put skin in the game. Participants lock a small amount of SOL before answering. This aligns incentives from the start."
          />
          <StepCard
            step={2}
            icon={CheckmarkCircle01Icon}
            title="Answer honestly"
            description="Respond to survey questions. Our LLM-powered validator scores each response for quality and relevance."
          />
          <StepCard
            step={3}
            icon={MoneyBag01Icon}
            title="Claim rewards"
            description="Quality answers earn from the reward pool. Spam gets slashed. Honest participants walk away with more than they staked."
          />
        </div>
      </section>

      {/* Why it works — light teal accent surface */}
      <section className="bg-accent/30 rounded-2xl px-8 py-10 mb-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Why it works</h2>
          <p className="text-muted-foreground">Economic guarantees baked into every survey.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <FeatureCard
            icon={Shield01Icon}
            title="Economic spam resistance"
            description="Staking makes spam expensive. Bad actors lose their stake; good actors gain. No blocklist needed."
          />
          <FeatureCard
            icon={Blockchain01Icon}
            title="On-chain transparency"
            description="Staking, slashing, and payouts happen on Solana. Every decision is public, auditable, and tamper-evident."
          />
          <FeatureCard
            icon={Analytics01Icon}
            title="LLM-powered validation"
            description="Each response is scored by Claude with a reproducible audit trail — not a black box. Disputes can be replayed."
          />
        </div>
      </section>

      {/* CTA banner — solid olive primary */}
      <section className="mb-6">
        <div className="bg-primary text-primary-foreground rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <HugeiconsIcon icon={Award01Icon} size={20} strokeWidth={1.5} aria-hidden="true" />
              <h2 className="text-xl font-semibold text-primary-foreground">
                Ready to get quality data?
              </h2>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Launch a survey on Solana devnet today. No spam, no bots — just honest answers.
            </p>
          </div>
          <Link href="/create">
            <Button variant="secondary" size="lg" className="whitespace-nowrap gap-2 px-8">
              <HugeiconsIcon icon={Coins01Icon} size={14} strokeWidth={1.5} aria-hidden="true" />
              Create a survey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-8 text-center">
        <p className="text-sm text-muted-foreground">Built on Solana</p>
      </footer>
    </main>
  );
}
