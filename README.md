# Survey

A Solana-based survey and market-research platform with **economic spam resistance**. Participants stake SOL before answering; off-chain validators (heuristics + Claude) score response quality; an on-chain Anchor program slashes spammy stakes and pays out honest participants.

> **Status:** Pre-MVP foundation. Repository scaffolding only — no application logic yet. See [`docs/architecture.md`](docs/architecture.md) for the full design.

---

## Why

Traditional survey apps can't enforce response quality. There's no cost to typing "asdf" five times to claim a reward, so data is noisy. Putting real money at stake — refundable if your answer is honest, slashed if it's spam — flips the incentive.

## How it works (one paragraph)

A creator funds an on-chain reward pool and publishes a survey. Each participant locks a fixed amount of SOL into a per-(survey, wallet) escrow PDA, submits a wallet-signed commitment hash of their answer on-chain, then sends the plaintext answer to the backend. The backend runs heuristic + LLM scoring, builds a settlement transaction listing honest vs spam participants, signs it with the validator key, and submits to the program. The program pays rewards + refunds stakes to honest participants and slashes spam stakes into the reward pool.

## Tech stack

- **Smart contracts:** Anchor (Rust) on Solana
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
- **Wallet:** `@solana/wallet-adapter` (Phantom, Solflare, Backpack)
- **Backend:** Next.js route handlers (MVP); can be extracted later
- **Database:** Supabase Postgres + Prisma
- **Indexer:** Helius webhooks → Postgres
- **Auth:** Sign-In With Solana (SIWS) → JWT
- **Validation:** Anthropic Claude + heuristics
- **Monorepo:** pnpm + Turborepo

See [`CLAUDE.md`](CLAUDE.md) for conventions and [`docs/`](docs/) for design docs.

---

## Repository layout

```
apps/
  web/                  Next.js frontend + API routes (MVP backend)
packages/
  anchor/               Solana program (Rust + Anchor)
  sdk/                  Typesafe TS client wrapping the IDL
  db/                   Prisma schema + client
  validation/           Spam/quality scoring engine (pure functions)
  ui/                   Shared shadcn React components
  config/               Shared tsconfig / biome / tailwind preset
  types/                Cross-package TS types
docs/                   Architecture, threat model, runbook
```

## Quickstart

> Requires: Node 20+, pnpm 9, Rust 1.79, Solana CLI 1.18, Anchor 0.30. See [`.tool-versions`](.tool-versions). Use `asdf` or install manually.

```bash
# 1. Install deps
pnpm install

# 2. Configure env
cp .env.example .env
# fill in DATABASE_URL, ANTHROPIC_API_KEY, etc.

# 3. Generate Prisma client
pnpm db:generate

# 4. Build the Solana program
pnpm anchor:build

# 5. Run the web app
pnpm dev
# → http://localhost:3000
```

To run the full stack against a local Solana validator, see [`docs/runbook.md`](docs/runbook.md).

## Roadmap

| Phase | Scope |
|---|---|
| **0.** Foundation (you are here) | Repo skeleton, CLAUDE.md, docs, CI |
| **1.** Anchor program v1 | Survey/Stake PDAs + create/stake/settle/claim instructions |
| **2.** Web shell + wallet | SIWS auth, survey list/create UI, devnet |
| **3.** Response flow | Commit-then-reveal, encrypted Postgres storage |
| **4.** Validation pipeline | Heuristics + Claude → signed settlement tx |
| **5.** End-to-end devnet | Helius indexer → dashboard, Playwright e2e |

Total Lean MVP: ~4–5 weeks of focused work.

## License

TBD.