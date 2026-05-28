# Architecture

> Companion to [`CLAUDE.md`](../CLAUDE.md) and [`README.md`](../README.md). This doc is the long-form reference for *why* the system looks the way it does. When you change the architecture, change this doc.

## 1. Thesis

Survey platforms cannot enforce response quality without economic friction. Captchas don't stop motivated farmers; LLMs make bot-written answers indistinguishable from low-effort humans; moderation doesn't scale. The only mechanism that consistently improves data quality is **putting the participant's own money at stake**: refundable if the answer is honest, slashed if it's spam.

Solana is a natural host because (a) transactions cost fractions of a cent, (b) settlement finality is fast enough that participants feel paid in real time, and (c) the programming model maps cleanly onto escrow + verdict + payout.

## 2. Actors and lifecycle

```
Creator  ─▶ funds reward pool ─▶ publishes survey on-chain
Participant ─▶ locks stake ─▶ submits commitment hash ─▶ sends encrypted answer off-chain
Validator (backend, MVP) ─▶ scores responses ─▶ signs settle tx
Program ─▶ marks each stake honest/spam ─▶ enables claims
Participants (honest) ─▶ claim refund + reward share
Participants (spam) ─▶ stake stays in reward pool
```

## 3. Components

### 3.1 Anchor program (`packages/anchor`)
The on-chain authority for economic state. Holds two account kinds:
- **Survey PDA** (`[b"survey", survey_id]`) — creator, validator, content hash, stake amount, reward pool, participant counts, state.
- **Stake PDA** (`[b"stake", survey, participant]`) — locked lamports, commitment hash, verdict, claimed flag.
- **Vault PDA** (`[b"vault", survey]`) — system-owned lamport holder, no data; receives both the reward pool and per-participant stakes.

Five instructions: `create_survey`, `stake_and_commit`, `settle`, `claim_reward`, `claim_refund`. See [`on-chain-program.md`](on-chain-program.md) for signatures.

### 3.2 Web app (`apps/web`)
Next.js 14 App Router. Marketing routes live at the root; authed app routes under `app/(app)`. API routes under `app/api` serve as the MVP backend.

Key flows:
1. **Sign-In With Solana** — wallet signs a server-issued nonce, backend verifies + issues JWT.
2. **Create survey** — client posts content JSON; backend persists draft + returns hash; client builds + signs the `create_survey` tx; backend confirms tx and flips survey to `open`.
3. **Stake + respond** — client signs `stake_and_commit` tx with `sha256(answer)`; sends encrypted answer to `/api/responses`.
4. **Settle** — backend cron (or manual trigger) runs scorer; submits `settle` tx with verdict list.
5. **Claim** — participant signs `claim_reward` or `claim_refund` tx based on verdict.

### 3.3 Database (`packages/db`)
Postgres via Supabase. Schema in `packages/db/prisma/schema.prisma`. Key tables: `User`, `Survey`, `Response`, `Score`, `ValidatorRun`. Encrypted response payloads are stored as opaque ciphertext; the key is derived per-survey from a server-held secret + survey ID (rotatable; details in threat model).

### 3.4 Validation engine (`packages/validation`)
Pure functions. Inputs: `(SurveyContent, ResponsePayload, otherResponses)`. Outputs: a `FinalScore`. Two independent stages:
- **Heuristics** — fast, deterministic, no external calls. Flag: response time, duplicates, length, copy-from-prompt.
- **LLM** — Anthropic Claude with prompt caching. Survey content cached as a system-prompt block; per-response calls hit the cache for sub-cent cost.

Combination rules and thresholds live in `score.ts` and will be tuned with real data.

### 3.5 Indexer (Helius webhooks)
Helius pushes program logs to a `/api/webhooks/helius` endpoint (to be added in MVP-5). The handler upserts `Survey.state` + `Response.txSignature` + claim status so the dashboard reflects on-chain reality without polling.

## 4. Data integrity model

The on-chain commitment hash is the contract: *whatever bytes the participant signed, those are the bytes the validator scored*. Off-chain encrypted storage is convenience, not source-of-truth. If Postgres is wiped, surveys still settle correctly using the original commitments.

Key implication: the *plaintext* must be reproducible from what's signed. The wallet signs a hash that's derived from a JSON payload with a stable serialization (sorted keys, no whitespace) so the same answer produces the same hash everywhere.

## 5. Why this stack

| Pick | Considered alternatives | Reason chosen |
|---|---|---|
| Solana / Anchor | Ethereum L2, NEAR, Sui | Lowest fees + fastest finality at the consumer end; Anchor is the most polished smart-contract DX in the ecosystem |
| Next.js | Remix, SvelteKit, Astro | App Router gives us server actions + route handlers so MVP doesn't need a separate backend service |
| Supabase Postgres | Self-hosted PG, PlanetScale | Generous free tier; we ignore their auth/storage and use just the DB |
| Prisma | Drizzle, Kysely | Migrations + DX maturity; the perf gap with Drizzle isn't load-bearing at our scale yet |
| Helius webhooks | Custom Geyser, Triton | We don't need a custom indexer for MVP; Helius gives us reliable event streaming for free up to limits |
| Claude (Anthropic) | OpenAI, Gemini, local model | Best quality/cost for short-text scoring; prompt caching cuts repeat-survey cost dramatically |
| pnpm + Turborepo | npm + Lerna, Bun monorepo | Mature, well-documented, fast |

## 6. Out of scope for MVP

These come later, not because they're not important, but because making them work without a real userbase is premature:
- Multi-validator quorum + on-chain dispute resolution
- Reputation NFTs / proof-of-personhood (Civic Pass)
- Multiple question types beyond multiple-choice + short answer
- Analytics dashboard (creator-side aggregations)
- Mainnet deployment + third-party audit
- Cross-chain reward delivery
