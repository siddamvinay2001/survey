import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  Add01Icon,
  Coins01Icon,
  CheckmarkCircle01Icon,
  Blockchain01Icon,
  User02Icon,
  Clock01Icon,
  LockIcon,
} from '@hugeicons/core-free-icons';

import { Button } from '@survey/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@survey/ui/components/card';
import { Input } from '@survey/ui/components/input';
import { Textarea } from '@survey/ui/components/textarea';
import { Label } from '@survey/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@survey/ui/components/select';

interface QuestionBlockProps {
  index: number;
  questionText: string;
  type: 'multiple-choice' | 'short-answer';
  options?: string[];
}

function QuestionBlock({ index, questionText, type, options }: QuestionBlockProps) {
  const questionId = `question-${index}`;
  const typeId = `question-type-${index}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Question {index}</CardTitle>
          <span className="text-xs text-muted-foreground">
            {type === 'multiple-choice' ? 'Multiple choice' : 'Short answer'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor={questionId}>Question text</Label>
          <Input
            id={questionId}
            defaultValue={questionText}
            placeholder="Enter your question…"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={typeId}>Question type</Label>
          <Select defaultValue={type}>
            <SelectTrigger id={typeId} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice">Multiple choice</SelectItem>
              <SelectItem value="short-answer">Short answer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === 'multiple-choice' && options && (
          <div className="space-y-2">
            <Label>Answer options</Label>
            <div className="space-y-2">
              {options.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-xs text-muted-foreground shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <Input defaultValue={option} placeholder={`Option ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CostLineProps {
  label: string;
  value: string;
  isBold?: boolean;
}

function CostLine({ label, value, isBold }: CostLineProps) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className={isBold ? 'font-medium text-foreground' : 'text-muted-foreground'}>
        {label}
      </span>
      <span className={isBold ? 'font-semibold text-foreground' : 'text-foreground'}>{value}</span>
    </div>
  );
}

function CostBreakdown() {
  return (
    <div className="space-y-1.5">
      <CostLine label="Reward pool deposit" value="5.0 SOL" />
      <CostLine label="Platform fee (2%)" value="0.1 SOL" />
      <CostLine label="On-chain storage rent (est.)" value="~0.005 SOL" />
      <div className="my-2 border-t border-border" />
      <CostLine label="Total to deploy" value="5.105 SOL" isBold />
    </div>
  );
}

interface SectionHeadingProps {
  step: number;
  id: string;
  children: React.ReactNode;
}

function SectionHeading({ step, id, children }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold shrink-0 ring-2 ring-primary/30">
        {step}
      </span>
      <h2 id={id} className="text-base font-semibold text-foreground">
        {children}
      </h2>
    </div>
  );
}

interface LabelWithIconProps {
  htmlFor: string;
  icon: IconSvgElement;
  children: React.ReactNode;
}

function LabelWithIcon({ htmlFor, icon, children }: LabelWithIconProps) {
  return (
    <Label htmlFor={htmlFor}>
      <div className="flex items-center gap-1.5">
        <HugeiconsIcon icon={icon} size={12} strokeWidth={1.5} aria-hidden="true" />
        {children}
      </div>
    </Label>
  );
}

export default function CreateSurveyPage() {
  return (
    <main className="space-y-8 animate-in fade-in duration-300">
      {/* Page header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Create a Survey</h1>
        <p className="text-muted-foreground">
          Reach quality respondents through economic incentives. No bots, no spam — participants
          stake SOL and earn rewards for honest answers.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main form */}
        <div className="flex-1 space-y-8 min-w-0">

          {/* Section 1: Survey details */}
          <section aria-labelledby="section-details" className="space-y-4">
            <SectionHeading step={1} id="section-details">Survey details</SectionHeading>

            <Card>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="survey-title">Title</Label>
                  <Input
                    id="survey-title"
                    placeholder="e.g. DeFi User Experience Research"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="survey-description">Description</Label>
                  <Textarea
                    id="survey-description"
                    placeholder="Explain what you're researching and why respondents should participate…"
                    rows={3}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="survey-category">Category</Label>
                  <Select>
                    <SelectTrigger id="survey-category" className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defi">DeFi</SelectItem>
                      <SelectItem value="nft">NFT</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="governance">Governance</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="ux">UX Research</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Questions */}
          <section aria-labelledby="section-questions" className="space-y-4">
            <SectionHeading step={2} id="section-questions">Questions</SectionHeading>

            <div className="space-y-4">
              <QuestionBlock
                index={1}
                questionText="How long have you been using DeFi protocols?"
                type="multiple-choice"
                options={[
                  'Less than 6 months',
                  '6 months – 1 year',
                  '1 – 3 years',
                  'More than 3 years',
                ]}
              />
              <QuestionBlock
                index={2}
                questionText="What is the biggest friction point you experience when using DeFi apps?"
                type="short-answer"
              />
              <QuestionBlock
                index={3}
                questionText="Which DeFi category do you use most frequently?"
                type="multiple-choice"
                options={[
                  'DEX / Swaps',
                  'Lending / Borrowing',
                  'Yield Farming',
                  'Liquid Staking',
                ]}
              />
            </div>

            <Button type="button" variant="outline" size="lg" className="gap-2 px-8 w-full sm:w-auto">
              <HugeiconsIcon icon={Add01Icon} size={13} strokeWidth={1.5} aria-hidden="true" />
              Add question
            </Button>
          </section>

          {/* Section 3: Economics */}
          <section aria-labelledby="section-economics" className="space-y-4">
            <SectionHeading step={3} id="section-economics">Economics</SectionHeading>

            <Card>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Stake per participant */}
                  <div className="space-y-1.5">
                    <LabelWithIcon htmlFor="stake-amount" icon={LockIcon}>
                      Stake per participant
                    </LabelWithIcon>
                    <div className="relative">
                      <Input
                        id="stake-amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        defaultValue="0.1"
                        className="pr-12"
                        aria-describedby="stake-amount-suffix"
                      />
                      <span
                        id="stake-amount-suffix"
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                      >
                        SOL
                      </span>
                    </div>
                  </div>

                  {/* Reward pool */}
                  <div className="space-y-1.5">
                    <LabelWithIcon htmlFor="reward-pool" icon={Coins01Icon}>
                      Reward pool total
                    </LabelWithIcon>
                    <div className="relative">
                      <Input
                        id="reward-pool"
                        type="number"
                        min="0.1"
                        step="0.1"
                        defaultValue="5.0"
                        className="pr-12"
                        aria-describedby="reward-pool-suffix"
                      />
                      <span
                        id="reward-pool-suffix"
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                      >
                        SOL
                      </span>
                    </div>
                  </div>

                  {/* Max participants */}
                  <div className="space-y-1.5">
                    <LabelWithIcon htmlFor="max-participants" icon={User02Icon}>
                      Max participants
                    </LabelWithIcon>
                    <Input
                      id="max-participants"
                      type="number"
                      min="1"
                      defaultValue="100"
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-1.5">
                    <LabelWithIcon htmlFor="survey-duration" icon={Clock01Icon}>
                      Duration
                    </LabelWithIcon>
                    <Select defaultValue="7">
                      <SelectTrigger id="survey-duration" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 4: Review & Deploy */}
          <section aria-labelledby="section-deploy" className="space-y-4">
            <SectionHeading step={4} id="section-deploy">Review &amp; Deploy</SectionHeading>

            <Card>
              <CardHeader>
                <CardTitle>Survey summary</CardTitle>
                <CardDescription>
                  Review your settings before deploying. Once deployed to Solana, the reward pool is
                  locked on-chain.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Questions</p>
                    <p className="font-medium text-foreground">3 questions</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium text-foreground">7 days</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Stake required</p>
                    <p className="font-medium text-foreground">0.1 SOL / participant</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Max participants</p>
                    <p className="font-medium text-foreground">100 respondents</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <CostBreakdown />
                </div>

                <Button
                  type="button"
                  size="lg"
                  className="w-full gap-2 px-8 mt-2"
                  aria-label="Deploy survey to Solana devnet"
                >
                  <HugeiconsIcon icon={Blockchain01Icon} size={14} strokeWidth={1.5} aria-hidden="true" />
                  Deploy Survey
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar: cost breakdown (lg+) */}
        <aside
          aria-label="Cost breakdown"
          className="hidden lg:block w-72 shrink-0 sticky top-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Coins01Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="text-primary"
                  aria-hidden="true"
                />
                <CardTitle>Cost breakdown</CardTitle>
              </div>
              <CardDescription>Estimated costs at 100 participants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <CostBreakdown />

              <div className="pt-2 border-t border-border">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <p>Slash revenue from spam offsets your pool top-up cost over time.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
