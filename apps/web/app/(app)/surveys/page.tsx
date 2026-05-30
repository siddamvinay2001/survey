'use client';

import {
  Clock01Icon,
  Coins01Icon,
  FilterIcon,
  LockIcon,
  Search01Icon,
  User02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';

import { Badge } from '@survey/ui/components/badge';
import { Button } from '@survey/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@survey/ui/components/card';
import { Input } from '@survey/ui/components/input';
import { cn } from '@survey/ui/lib/utils';

type SurveyStatus = 'open' | 'ending-soon' | 'completed';

interface SurveyCardData {
  id: string;
  title: string;
  description: string;
  rewardPool: string;
  stakeRequired: string;
  participantCount: number;
  status: SurveyStatus;
  timeRemaining: string;
  category: string;
}

const MOCK_SURVEYS: SurveyCardData[] = [
  {
    id: '1',
    title: 'DeFi User Experience Research',
    description:
      'Help us understand pain points in decentralized finance applications. We want honest feedback on onboarding, UX, and trust.',
    rewardPool: '5.0 SOL',
    stakeRequired: '0.1 SOL',
    participantCount: 47,
    status: 'open',
    timeRemaining: '6 days left',
    category: 'DeFi',
  },
  {
    id: '2',
    title: 'NFT Market Sentiment Q3 2024',
    description:
      'Share your current views on the NFT market. Are you buying, holding, or sitting out? Short answer + multiple choice.',
    rewardPool: '2.5 SOL',
    stakeRequired: '0.05 SOL',
    participantCount: 112,
    status: 'ending-soon',
    timeRemaining: '18 hours left',
    category: 'NFT',
  },
  {
    id: '3',
    title: 'Solana Validator Incentive Study',
    description:
      'Academic research on validator economics on Solana. Your answers feed peer-reviewed research on PoS security incentives.',
    rewardPool: '10.0 SOL',
    stakeRequired: '0.2 SOL',
    participantCount: 23,
    status: 'open',
    timeRemaining: '12 days left',
    category: 'Research',
  },
  {
    id: '4',
    title: 'Web3 Gaming Preferences',
    description:
      'What do you want from blockchain games? We survey real players — not bots — about play-to-earn mechanics.',
    rewardPool: '1.5 SOL',
    stakeRequired: '0.05 SOL',
    participantCount: 204,
    status: 'completed',
    timeRemaining: 'Ended',
    category: 'Gaming',
  },
  {
    id: '5',
    title: 'DAO Governance Participation Barriers',
    description:
      'Why do token holders not vote? This survey explores the cognitive and logistical barriers to DAO participation.',
    rewardPool: '3.0 SOL',
    stakeRequired: '0.1 SOL',
    participantCount: 61,
    status: 'open',
    timeRemaining: '4 days left',
    category: 'Governance',
  },
  {
    id: '6',
    title: 'Stablecoin Trust and Usage Patterns',
    description:
      'Multiple choice survey on which stablecoins you use and why. Responses are on-chain verified, no duplicates possible.',
    rewardPool: '4.0 SOL',
    stakeRequired: '0.1 SOL',
    participantCount: 88,
    status: 'ending-soon',
    timeRemaining: '2 days left',
    category: 'DeFi',
  },
  {
    id: '7',
    title: 'Wallet UX Benchmark Study',
    description:
      'Rate your experience with five major Solana wallets. Takes ~5 minutes. Stake is returned if your response passes validation.',
    rewardPool: '6.0 SOL',
    stakeRequired: '0.15 SOL',
    participantCount: 39,
    status: 'open',
    timeRemaining: '9 days left',
    category: 'UX Research',
  },
  {
    id: '8',
    title: 'Cross-chain Bridge Risk Perception',
    description:
      'Have you used a bridge? Lost funds? This survey studies how users perceive and manage bridge risk in practice.',
    rewardPool: '7.5 SOL',
    stakeRequired: '0.2 SOL',
    participantCount: 17,
    status: 'completed',
    timeRemaining: 'Ended',
    category: 'Security',
  },
];

type FilterTab = 'all' | 'open' | 'ending-soon' | 'completed';

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'ending-soon', label: 'Ending Soon' },
  { value: 'completed', label: 'Completed' },
];

interface StatusBadgeProps {
  status: SurveyStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'open') {
    return (
      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
        Open
      </Badge>
    );
  }
  if (status === 'ending-soon') {
    return (
      <Badge
        variant="secondary"
        className="bg-destructive/10 text-destructive border-destructive/20"
      >
        Ending Soon
      </Badge>
    );
  }
  return <Badge variant="outline">Completed</Badge>;
}

interface SurveyCardProps {
  survey: SurveyCardData;
}

function SurveyCard({ survey }: SurveyCardProps) {
  const isCompleted = survey.status === 'completed';

  return (
    <Card className="flex flex-col h-full transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm leading-snug">{survey.title}</CardTitle>
          <StatusBadge status={survey.status} />
        </div>
        <CardDescription className="line-clamp-2 mt-1">{survey.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Coins01Icon} size={13} strokeWidth={1.5} aria-hidden="true" />
            <span>{survey.rewardPool} pool</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon icon={LockIcon} size={13} strokeWidth={1.5} aria-hidden="true" />
            <span>{survey.stakeRequired} stake</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon icon={User02Icon} size={13} strokeWidth={1.5} aria-hidden="true" />
            <span>{survey.participantCount} responses</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Clock01Icon} size={13} strokeWidth={1.5} aria-hidden="true" />
            <span>{survey.timeRemaining}</span>
          </div>
        </div>
        <div>
          <Badge variant="outline" className="text-xs">
            {survey.category}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border mt-2 pt-3">
        <Button
          size="lg"
          className="w-full px-8 transition-all duration-150"
          disabled={isCompleted}
          aria-label={
            isCompleted ? `${survey.title} — survey completed` : `Participate in ${survey.title}`
          }
        >
          {isCompleted ? 'Survey ended' : 'Participate'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  return (
    <output
      aria-live="polite"
      className="col-span-full flex flex-col items-center gap-4 py-16 text-center"
    >
      <HugeiconsIcon
        icon={Search01Icon}
        size={40}
        strokeWidth={1}
        className="text-muted-foreground"
        aria-hidden="true"
      />
      <div className="space-y-1">
        <p className="font-medium text-foreground">No surveys found</p>
        <p className="text-sm text-muted-foreground">
          Try a different filter or check back soon — new surveys launch every day.
        </p>
      </div>
    </output>
  );
}

export default function SurveysPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredSurveys =
    activeFilter === 'all' ? MOCK_SURVEYS : MOCK_SURVEYS.filter((s) => s.status === activeFilter);

  return (
    <main className="space-y-8 animate-in fade-in duration-300">
      <header className="space-y-2 pb-6 border-b border-border">
        <h1 className="text-2xl font-semibold text-foreground">Browse Surveys</h1>
        <p className="text-muted-foreground">
          Stake SOL, answer honestly, and earn rewards. Every response is on-chain verified.
        </p>
      </header>

      <section aria-label="Filter surveys" className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <Input
              type="search"
              placeholder="Search surveys…"
              className="pl-7"
              aria-label="Search surveys"
            />
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground" aria-hidden="true">
            <HugeiconsIcon icon={FilterIcon} size={13} strokeWidth={1.5} />
            <span>Filter:</span>
          </div>
        </div>

        <div role="tablist" aria-label="Filter surveys by status" className="flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={activeFilter === tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                'rounded-full border border-border px-3 py-1 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                activeFilter === tab.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Survey listings">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurveys.length > 0 ? (
            filteredSurveys.map((survey) => <SurveyCard key={survey.id} survey={survey} />)
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </main>
  );
}
