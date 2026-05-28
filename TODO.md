# TODO — Survey MVP Implementation Roadmap

This is the complete task list from foundation to devnet-ready MVP. Organized by phase. Check off as you complete each task.

---

## Phase 0: Foundation ✅ (DONE)

- [x] Repository scaffolding with pnpm + Turborepo
- [x] CLAUDE.md with coding standards and security guardrails
- [x] README.md with project overview
- [x] Anchor program skeleton (state + instruction stubs)
- [x] Next.js 14 web app scaffolding
- [x] Prisma schema with `User`, `Survey`, `Response`, `Score`, `ValidatorRun` models
- [x] Shared packages: `@survey/types`, `@survey/config`, `@survey/ui`, `@survey/sdk`, `@survey/validation`
- [x] Architecture docs: `architecture.md`, `on-chain-program.md`, `threat-model.md`, `runbook.md`
- [x] CI workflow for lint/typecheck/test + Anchor build

---

## Phase 1: Anchor Program Implementation

### Core Instructions
- [ ] **`create_survey`** handler
  - [ ] Initialize Survey PDA with creator, validator, content hash
  - [ ] Create Vault PDA (system-owned, rent-exempt)
  - [ ] Transfer reward pool lamports from creator → vault
  - [ ] Emit `SurveyCreated` event
  - [ ] Test: happy path + insufficient funds error

- [ ] **`stake_and_commit`** handler
  - [ ] Verify survey state is `Open`
  - [ ] Verify max_participants not reached
  - [ ] Verify no existing Stake PDA for this (survey, participant) — handled by PDA init constraint
  - [ ] Transfer stake lamports from participant → vault
  - [ ] Initialize Stake PDA with commitment hash + verdict=Pending
  - [ ] Increment current_participants
  - [ ] Emit `StakeCommitted` event
  - [ ] Test: happy path + survey full + already staked (should fail on PDA init) + wrong state

- [ ] **`settle`** handler
  - [ ] Verify caller is the authorized validator
  - [ ] Verify survey state is Open or Closed
  - [ ] For each verdict, find corresponding Stake PDA in remaining_accounts
  - [ ] Verify each Stake is in Pending state
  - [ ] Set verdict to Honest or Spam
  - [ ] Increment settled_participants
  - [ ] If all participants settled, set survey.state = Settled
  - [ ] Emit `SurveySettled` event with honest/spam counts
  - [ ] Test: happy path + wrong validator + double-settle attempt + verdict mismatch

- [ ] **`claim_reward`** handler
  - [ ] Verify stake.verdict == Honest
  - [ ] Verify !stake.claimed
  - [ ] Verify survey.state == Settled
  - [ ] Calculate reward share: `reward_pool / honest_count` (need to track honest_count on Survey)
  - [ ] Transfer (locked_lamports + reward_share) from vault → participant
  - [ ] Set claimed = true
  - [ ] Emit `RewardClaimed` event
  - [ ] Test: happy path + not settled + already claimed + wrong verdict

- [ ] **`claim_refund`** handler
  - [ ] Verify survey.state == Closed (timeout refund path)
  - [ ] Verify stake.verdict == Pending
  - [ ] Verify !stake.claimed
  - [ ] Transfer locked_lamports from vault → participant
  - [ ] Set claimed = true
  - [ ] Emit `RefundClaimed` event
  - [ ] Test: happy path + already settled (no refund) + already claimed

### Supporting Work
- [ ] Add `honest_count` + `spam_count` fields to Survey PDA (needed for reward calculation)
- [ ] Add event definitions to lib.rs (anchor_lang::emit!)
- [ ] Math: use `checked_add` / `checked_mul` everywhere, never unwrap
- [ ] Full anchor test suite: happy path + all error cases
- [ ] Build on local validator and confirm no panics

---

## Phase 2: Web Shell + Wallet

### Auth (Sign-In With Solana)
- [ ] **`/api/auth/siws/challenge`** endpoint
  - [ ] Generate random nonce (32 bytes)
  - [ ] Store nonce in HTTP-only cookie
  - [ ] Return `{ nonce }` to client
  - [ ] Test: cookie is set, nonce is random per call

- [ ] **`/api/auth/siws`** endpoint (POST)
  - [ ] Accept `{ wallet: string, signature: string, nonce: string }`
  - [ ] Verify signature with tweetnacl: `nacl.sign.open(signature, wallet_pubkey)`
  - [ ] Verify nonce matches cookie
  - [ ] Invalidate nonce (delete cookie)
  - [ ] Upsert User row in DB
  - [ ] Issue JWT with HS256 (jose library): `{ wallet, exp: now + 7 days }`
  - [ ] Set JWT in HTTP-only cookie
  - [ ] Return `{ success: true, wallet }`
  - [ ] Test: valid signature → JWT issued; invalid signature → 401; nonce replay → 401

### Frontend Wallet Integration
- [ ] Wire up `@solana/wallet-adapter-react` providers in `apps/web/lib/providers.tsx`
  - [ ] ConnectionProvider + WalletProvider + WalletModalProvider
  - [ ] Include Phantom, Solflare, Backpack wallet adapters
  - [ ] Set `NEXT_PUBLIC_RPC_URL` to devnet RPC
- [ ] Replace `WalletButton` stub with actual `WalletMultiButton` from wallet-adapter
- [ ] Add "Connect Wallet" flow:
  - [ ] Show SIWS challenge UI
  - [ ] Sign nonce with wallet
  - [ ] Post signature to `/api/auth/siws`
  - [ ] Store JWT in cookie (automatic after response)
  - [ ] Show authenticated state in header
- [ ] Test: connect Phantom → sign nonce → JWT issued → navigate to `/surveys`

### Pages + Navigation
- [ ] **`/surveys`** (browse open surveys)
  - [ ] Fetch from `/api/surveys?state=open`
  - [ ] Render list with survey title, creator, reward pool, stake amount, participant count
  - [ ] Link each to `/surveys/[id]` (detail page — defer to phase 3)
  - [ ] "No surveys yet" fallback
- [ ] **`/create`** (survey creation form)
  - [ ] Form fields: title, description, questions array (start with 1 multiple-choice + 1 short answer)
  - [ ] Question editor: prompt, options (for MC), min/max length (for short answer)
  - [ ] Reward pool + stake amount inputs
  - [ ] "Create" button builds the Survey PDA tx (client-side, user signs)
  - [ ] Optimistic redirect to dashboard after tx confirmed
  - [ ] See phase 2 API work below
- [ ] **`/dashboard`** (user activity)
  - [ ] Show surveys created by logged-in user
  - [ ] Show surveys the user has participated in (status: pending, settled, claimed)
  - [ ] Link to details / claim actions
- [ ] Navbar: logo, "Browse" / "Create" / "Dashboard" links + wallet button

### API
- [ ] **`GET /api/surveys`** (list open surveys)
  - [ ] Fetch all surveys with `state='open'` from DB
  - [ ] Return paginated JSON: `{ surveys: [...], total, hasMore }`
  - [ ] Each survey includes: id, pdaAddress, creator, title, reward, stake, participantCount
  
- [ ] **`POST /api/surveys`** (create draft survey)
  - [ ] Authenticate: verify JWT cookie, extract wallet
  - [ ] Accept `{ title, description, questions, rewardPoolLamports, stakeLamports }`
  - [ ] Validate with zod schema (required fields, reasonable bounds)
  - [ ] Compute `contentHash = sha256(canonical_json(content))`
  - [ ] Persist Survey row: creator=wallet, state='draft', contentHash
  - [ ] Return `{ id, contentHash, surveyId: [u8; 32] }` (surveyId is the seed for the PDA)
  - [ ] Note: actual on-chain creation happens client-side (creator signs the tx); backend just stores content

- [ ] **`GET /api/surveys/[id]`** (survey detail)
  - [ ] Fetch Survey + Response count + current user's response (if any)
  - [ ] Return full content JSON + metadata
  - [ ] For authed user: show if they've already answered

---

## Phase 3: Response Flow

### On-chain: Participant Stakes
- [ ] Client-side flow: "Take survey" button
  - [ ] User clicks → show survey questions (read-only for now)
  - [ ] Build `stake_and_commit` tx:
    - [ ] Create a ResponsePayload with answers
    - [ ] Compute `commitmentHash = sha256(canonical_json(payload))`
    - [ ] User signs the tx (stake_and_commit instruction requires `participant` signer)
    - [ ] Submit to chain (via `@solana/web3.js`)
  - [ ] Confirm tx on-chain (Helius webhook in phase 5 will update dashboard; for now, refresh manually)

### Off-chain: Store Encrypted Response
- [ ] **`POST /api/responses`** endpoint
  - [ ] Authenticate: verify JWT, extract wallet
  - [ ] Accept `{ surveyId, encryptedPayload, commitmentHash, txSignature }`
  - [ ] Verify txSignature is confirmed on-chain:
    - [ ] Parse tx from RPC
    - [ ] Confirm instruction is `stake_and_commit` for this survey + participant
    - [ ] Confirm the on-chain `commitmentHash` matches the request `commitmentHash`
  - [ ] Validate one-response-per-user (Postgres unique constraint on (surveyId, participantWallet))
  - [ ] Persist Response row: encrypted payload + commitment hash
  - [ ] Return `{ responseId, confirmedAt }`
  - [ ] Test: valid tx → stored; duplicate wallet → 409 conflict; tampered commitment → 400

### Encryption (implementation choice)
- [ ] Decide cipher: recommend AES-256-GCM
  - [ ] Key derivation: `HKDF-SHA256(survey_secret, survey_id + participant_wallet + nonce)`
  - [ ] Store nonce in the encrypted blob (standard practice)
  - [ ] Survey secret is stored in secret manager (Doppler) and rotated per deployment
- [ ] OR: use a simple reversible scheme for MVP (e.g., ChaCha20 + the survey secret)
- [ ] **TODO:** Document the chosen scheme in `docs/security.md` (to be created)

### Database
- [ ] Add Response migration: run `pnpm db:migrate --name add_responses_table` (already in schema, just needs migration)
- [ ] Verify unique constraint on (surveyId, participantWallet)

---

## Phase 4: Validation Pipeline

### Heuristics Engine
- [ ] Implement `packages/validation/src/heuristics.ts::runHeuristics`
  - [ ] `responseTimeFlag`: time_to_submit < 5 seconds for multi-question survey?
  - [ ] `duplicateFlag`: exact match with any prior response in otherResponses?
  - [ ] `lengthFlag`: short_answer < minLength or only whitespace?
  - [ ] `copyFromPromptFlag`: substring match between answer and question prompt?
  - [ ] Return HeuristicScore with all flags
  - [ ] Unit tests in Vitest with 4 fixture responses (spam, honest, edge cases)

### LLM Scoring (Claude)
- [ ] Implement `packages/validation/src/llm.ts::scoreWithLlm`
  - [ ] Use Anthropic SDK: `new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })`
  - [ ] System prompt: explain the survey context + scoring rubric (clarity, relevance, depth)
  - [ ] User message: `<question>...</question>\n<answer>...</answer>`
  - [ ] Prompt caching: cache the survey content block (system prompt) so repeated calls on same survey hit cache
  - [ ] Parse response JSON: `{ qualityScore: 0-100, reasoning: string }`
  - [ ] Return LlmScore with model, promptHash, score, reasoning
  - [ ] Handle API errors gracefully (timeout → return null LLM score, use heuristics only)
  - [ ] Test with 2–3 real-world-ish responses

### Score Combination
- [ ] Implement `packages/validation/src/score.ts::combineScores`
  - [ ] Rule 1: if any heuristic flag AND llm.qualityScore < 40 → spam
  - [ ] Rule 2: if no LLM score AND >=2 heuristic flags → spam
  - [ ] Otherwise → honest
  - [ ] Unit tests covering all branches

### Backend Settlement Endpoint
- [ ] **`POST /api/validate`** endpoint
  - [ ] Authenticate: verify admin/validator key (hardcoded for MVP)
  - [ ] Accept `{ surveyId }` (or POST with no body to process all ready surveys)
  - [ ] Fetch all Responses for surveyId from DB
  - [ ] For each Response:
    - [ ] Fetch the Survey + its content
    - [ ] Fetch all other Responses (for duplicate detection)
    - [ ] Call `runHeuristics(survey, response, others)`
    - [ ] Call `scoreWithLlm(survey, response)` (or skip if no API key)
    - [ ] Call `combineScores(heuristics, llm)` → `verdict: 'honest' | 'spam'`
    - [ ] Persist Score row in DB
  - [ ] Build settlement tx:
    - [ ] Map each (responseId → verdict) to (Participant Pubkey → is_honest bool)
    - [ ] Call `@survey/sdk` to build the `settle` instruction
    - [ ] Sign with validator keypair (from `getValidatorKeypair()`)
    - [ ] Submit to chain via RPC
  - [ ] Persist ValidatorRun row: surveyId, verdicts, txSignature
  - [ ] Return `{ txSignature, settledCount, honestCount, spamCount }`
  - [ ] Test: 2–3 responses → scores computed → settle tx submitted → verdicts on-chain

### Infrastructure
- [ ] Move validator keypair to env (for now); prepare secret manager integration for prod
- [ ] Error handling: if settle tx fails, log + alert (can retry)
- [ ] Idempotency: if ValidatorRun already exists for (surveyId, batchId), return cached result

---

## Phase 5: End-to-End + Indexer

### Helius Webhooks
- [ ] Set up Helius account → get API key + webhook URL for devnet
- [ ] **`POST /api/webhooks/helius`** endpoint
  - [ ] Verify webhook signature (Helius signs with a secret)
  - [ ] Parse logs: look for `SurveyCreated`, `StakeCommitted`, `SurveySettled`, `RewardClaimed`, `RefundClaimed` events
  - [ ] For each event:
    - [ ] Update corresponding DB row (Survey state, Response txSignature, Stake claim status)
    - [ ] Idempotent: check if already processed (store event hash in DB or use tx signature)
  - [ ] Return 200 (Helius expects quick responses)
  - [ ] Test: manually push a test webhook payload

### Dashboard Updates
- [ ] Update `/dashboard` to query real DB state (not chain RPC directly)
  - [ ] Show user's created surveys with live state from Helius sync
  - [ ] Show user's responses + verdicts + claim status
  - [ ] If verdict=Honest: show "Claim reward" button → trigger `claim_reward` tx
  - [ ] If verdict=Spam: show "Stake slashed"
  - [ ] If state=Closed + not settled: show "Claim refund" button → trigger `claim_refund` tx

### E2E Test (Playwright)
- [ ] Scenario: create survey → stake → respond → settle → claim
  - [ ] User A creates survey on `/create`
  - [ ] Confirm on-chain (Survey PDA exists)
  - [ ] User B connects wallet, navigates to `/surveys`
  - [ ] User B clicks survey, answers questions, signs `stake_and_commit` tx
  - [ ] Confirm on-chain (Stake PDA exists with commitment hash)
  - [ ] User B submits encrypted response via `/api/responses`
  - [ ] Manually trigger `/api/validate` (or set up cron for MVP)
  - [ ] Confirm on-chain (Stake.verdict set)
  - [ ] User B claims reward: signs `claim_reward` tx
  - [ ] Confirm lamports transferred to User B wallet
  - [ ] Test runs against **devnet only** (not production)

### DevNet Setup
- [ ] Get devnet SOL: `solana airdrop 5 --url devnet` (may need multiple retries)
- [ ] Deploy Anchor program to devnet: `pnpm anchor:deploy:devnet`
- [ ] Update `NEXT_PUBLIC_PROGRAM_ID` in `.env` with deployed program ID
- [ ] Create Supabase project for devnet testing (free tier)
- [ ] Populate `.env`: `DATABASE_URL`, `ANTHROPIC_API_KEY`, `HELIUS_API_KEY`, `NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com`

---

## Phase 6: Polish & Ship

### Testing
- [ ] Anchor test coverage: every instruction + error path
- [ ] Validation unit tests: heuristics, LLM, combination rules
- [ ] E2E Playwright: full happy path + key error scenarios
- [ ] Load test (optional for MVP): 10–20 parallel responses on one survey

### Security
- [ ] Code review checklist (from CLAUDE.md)
  - [ ] No `panic!` in instruction handlers
  - [ ] All math is `checked_*`
  - [ ] Account constraints are documented
  - [ ] No `unsafe` Rust
- [ ] Security review of validation logic
  - [ ] LLM prompts can't be injected via response content
  - [ ] Commitment hash is tamper-proof
  - [ ] Validator key is in secret manager (not env file in prod)
- [ ] Vulnerability scan: `npm audit` (pnpm will inherit)

### Documentation
- [ ] Update `CLAUDE.md` if any conventions changed
- [ ] Update `docs/architecture.md` if any design decisions changed
- [ ] Add `docs/security.md` with encryption details + key rotation procedure
- [ ] Update `docs/runbook.md` with validation triggers (manual vs. cron)

### Deployment
- [ ] Deploy web app to Vercel
  - [ ] Set env vars: `DATABASE_URL`, `ANTHROPIC_API_KEY`, `HELIUS_API_KEY`, `VALIDATOR_KEYPAIR`, `JWT_SECRET`, `NEXT_PUBLIC_RPC_URL`, `NEXT_PUBLIC_PROGRAM_ID`
  - [ ] Run migrations on prod DB: `pnpm db:migrate deploy`
  - [ ] Seed test data (optional)
  - [ ] Health check: `/surveys` returns empty list
- [ ] Deploy Anchor program to devnet (already done in phase 5)
- [ ] Configure Helius webhooks to post to prod Vercel URL

### Launch Checklist
- [ ] CI is green (all tests pass)
- [ ] E2E flow succeeds on devnet
- [ ] Dashboard reflects Helius-synced state
- [ ] Reward payouts work end-to-end
- [ ] Error messages are user-facing (not stack traces)
- [ ] README updated with devnet access instructions
- [ ] Public link ready for beta testers

---

## Post-MVP (v2+)

These are explicitly deferred:
- [ ] Multi-validator quorum + on-chain dispute resolution
- [ ] Reputation NFTs / proof-of-personhood
- [ ] Multiple question types beyond MC + short answer
- [ ] Analytics dashboard (creator-side aggregations)
- [ ] Mainnet audit + deployment
- [ ] Cross-chain reward delivery
- [ ] Advanced Sybil resistance (Civic Pass, proof of personhood)
- [ ] DAO governance for validator changes

---

## Key Dependencies & Blockers

- **Anchor program must pass tests before web can call it** (phase 1 blocks phases 2–5)
- **SIWS auth must work before any API requires authentication** (early phase 2)
- **Validator signer must be set up before validation endpoint works** (early phase 4)
- **Helius webhook URL must be live before dashboard can sync state** (late phase 5)
- **Devnet deployment is prerequisite for E2E tests** (phase 5)

---

## Effort Estimate

| Phase | Tasks | Effort |
|---|---|---|
| 0 (Foundation) | Scaffolding, docs | ✅ Done |
| 1 (Anchor) | 5 instructions + tests | ~1 week |
| 2 (Web + Wallet) | Auth, pages, API | ~1 week |
| 3 (Responses) | Commitment hash, encryption, DB | ~3–4 days |
| 4 (Validation) | Heuristics + LLM scoring + settle | ~1 week |
| 5 (E2E + Indexer) | Helius, Playwright, dashboard | ~1 week |
| 6 (Polish + Ship) | Security, testing, docs, deploy | ~3–4 days |
| **Total** | | **~4–5 weeks** |

Each phase is mostly independent once the previous is complete. Parallelization is limited (Anchor must come first), but within phases, tasks can overlap.

---

**Last updated:** 2026-05-28  
**Status:** Foundation complete, ready for Phase 1
