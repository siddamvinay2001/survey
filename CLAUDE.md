# CLAUDE.md — Survey Platform

This file is loaded by Claude Code in every session for this repo. Keep it lean, accurate, and free of duplication with `docs/`. When something here goes stale, fix it — wrong instructions are worse than missing ones.

---

## 1. Project goals

A Solana-based survey and market-research platform built on **economic spam resistance**: participants stake SOL before answering a survey, off-chain validators (heuristics + Claude) score responses, and an on-chain Anchor program slashes spammy stakes and pays out honest participants.

- **MVP scope (Lean):** Single survey type (multiple-choice + short answer), fixed stake amount, single validator (our backend), devnet only.
- **Deferred to v2+:** Reputation NFTs, multi-validator quorum, dispute resolution, analytics dashboard, mainnet deploy + audit.

See `docs/architecture.md` for the full picture and `docs/threat-model.md` for the security thinking.

---

## 2. The on-chain vs off-chain rule

**Before adding a field or feature, ask: does this need a cryptographic or economic guarantee?**

- **Yes** → it goes on-chain (Anchor program PDA). Examples: locked SOL, reward pool balance, slashing decision, content hash commitment.
- **No** → it goes in Postgres. Examples: survey questions, encrypted responses, LLM scores, reputation, analytics, user profile.

Solana storage is expensive (~0.007 SOL/KB rent). When in doubt, off-chain wins. Use a `sha256` hash commitment on-chain to keep the off-chain content tamper-evident.

---

## 3. Coding standards

### TypeScript
- `strict: true` everywhere — no `any`, no implicit returns.
- No default exports for components. Use named exports. **Exception:** Next.js App Router requires default exports for `page.tsx` and `layout.tsx` routing files — this is a framework constraint, not a violation.
- Import via workspace aliases (`@survey/sdk`, `@survey/db`, `@survey/types`). Do not reach across packages with deep relative paths.
- Server-only code lives in `apps/web/server/` or files with `import 'server-only'`. Never import the validator signer or Prisma client into a client component.

### Rust / Anchor
- Use `require!(condition, ErrorCode::Variant)` for invariants. Never `panic!` in instruction handlers.
- Every account constraint gets a `#[account(...)]` attribute — explain non-obvious constraints with a one-line comment.
- PDA seeds live in `state/seeds.rs` as constants. Do not stringly-type seeds at call sites.
- Math must use `checked_add` / `checked_sub` / `checked_mul`. Overflow = silent fund loss.

### General
- No commented-out code. Delete it; git remembers.
- No comments that re-narrate the code. Comments explain *why* (a constraint, a workaround), not *what*.
- One file per exported public API. Split when a module grows past ~300 lines.

---

## 4. Security guardrails (Sybil + incentive design)

These are non-negotiable. If you find yourself wanting to bend one, raise it in a PR description first.

1. **Backend never holds user keys.** All chain mutations originate from the user's wallet. The backend signs *only* settlement transactions with the validator key.
2. **The validator keypair is the trust bottleneck in MVP.** Store it in a secret manager (AWS Secrets Manager / Doppler / Vault) — never in `.env` in production. Local dev uses a generated keypair under `apps/web/server/keypairs/` (gitignored).
3. **Commit-then-reveal for responses.** The wallet signs a `sha256(response_json)` commitment hash before sending content off-chain. The on-chain `stake_and_commit` instruction stores this hash. If a response is ever disputed, the hash proves what was actually submitted.
4. **Rate limit response submissions** per (wallet, survey) — at most one. Enforced both in Postgres (unique constraint) and on-chain (PDA per wallet+survey can only be initialized once).
5. **LLM scoring is reproducible-enough for audit.** Cache `{prompt, model, response, score, timestamp}` in the `ValidatorRun` table. Disputes must be replayable.
6. **No `transfer` from program-owned PDAs without a matching invariant check.** Use the helper in `programs/survey/src/instructions/transfer.rs` (once written) — never raw CPI.
7. **Treat all RPC inputs as untrusted.** Validate question payloads against a zod schema at the API boundary.

---

## 5. Workflow

### Local dev
```bash
pnpm install                    # one-time, after clone
pnpm dev                        # runs web app at :3000
pnpm anchor:build               # compiles the Solana program
pnpm anchor:test                # runs anchor tests on a local validator
```

### Making Anchor program changes
1. Edit Rust under `packages/anchor/programs/survey/src/`.
2. `pnpm anchor:build` regenerates the IDL.
3. The TS types in `packages/sdk/src/idl/` are git-committed — re-export the regenerated IDL there.
4. `pnpm anchor:test` before pushing.

### Making DB changes
1. Edit `packages/db/prisma/schema.prisma`.
2. `pnpm db:migrate --name <descriptive_name>` — commits the SQL migration.
3. `pnpm db:generate` regenerates the Prisma client.

### Never commit
- `.env`, `.env.local`, any file matching `*-keypair.json`
- `target/`, `.anchor/`, `*.so`, `test-ledger/`
- Production validator keys (even encrypted — use the secret manager)

---

## 6. Testing expectations

| Layer | Tool | Bar |
|---|---|---|
| Anchor instructions | `anchor test` | Every instruction has a happy-path test **and** at least one failure test (wrong signer, double-init, insufficient funds, etc.). |
| Validation engine | Vitest | Pure-function tests with fixture responses. Cover: short response, repeated chars, copy-pasted-from-question, normal answer. |
| API route handlers | Vitest | Unit-test the handler with a mocked Prisma + mocked Anchor client. |
| E2E | Playwright | One smoke flow: create → stake → answer → settle → claim. Devnet only. |

Coverage isn't a target. **One meaningful failure test per public surface** is.

---

## 7. PR conventions

- Small PRs. If your diff is over ~400 lines of substantive code, split it.
- Conventional commits: `feat(anchor): add slash instruction`, `fix(web): wallet disconnect race`, `docs(threat-model): clarify validator key rotation`.
- PR description links to the section of `docs/` it touches.
- Anchor program changes require a screenshot of `anchor test` output and an explanation of the storage cost impact (account size delta).

---

## 8. Where things live

| You want to... | Look in |
|---|---|
| Add a new on-chain instruction | `packages/anchor/programs/survey/src/instructions/` |
| Change the survey data model | `packages/db/prisma/schema.prisma` + maybe `packages/types/` |
| Add a heuristic to spam detection | `packages/validation/src/heuristics.ts` |
| Wire up a new API endpoint | `apps/web/app/api/` |
| Add a shared UI component | `packages/ui/` |
| Document a security decision | `docs/threat-model.md` |
| Document a deploy step | `docs/runbook.md` |

---

## 9. AI assistant notes (you, future Claude)

- This `CLAUDE.md` is the source of truth on conventions. If a user request conflicts with it, surface the conflict before just complying.
- Prefer editing existing files. Do not create new docs files unless a `docs/` entry is clearly missing.
- When proposing on-chain changes, always estimate the account size and rent cost impact.
- The MVP intentionally has a centralized validator. Do not propose "decentralizing" it unless explicitly asked — that's a v2 conversation with audit/budget implications.