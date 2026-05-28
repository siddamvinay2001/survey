# On-chain program reference

This doc describes the Anchor program in `packages/anchor`. When you add or change an instruction, update this file in the same PR.

## Program ID

- **Devnet:** `SurveyProgram111111111111111111111111111111` (placeholder — set after first deploy)
- **Mainnet:** not yet deployed

## Accounts

### `Survey` PDA
Seeds: `[b"survey", survey_id: [u8; 32]]`

| Field | Type | Notes |
|---|---|---|
| `creator` | `Pubkey` | Original signer of `create_survey`. |
| `validator` | `Pubkey` | Authorized signer for `settle`. |
| `content_hash` | `[u8; 32]` | sha256 of the off-chain survey JSON. |
| `stake_lamports` | `u64` | Required lock amount per participant. |
| `reward_pool_lamports` | `u64` | Total reward to distribute among honest participants. |
| `max_participants` | `u32` | Cap on `stake_and_commit` calls. |
| `current_participants` | `u32` | Increments on each `stake_and_commit`. |
| `settled_participants` | `u32` | Increments on each `settle` verdict. |
| `state` | `SurveyState` | `Open` → `Closed` → `Settled`. |
| `bump` | `u8` | Self bump. |
| `vault_bump` | `u8` | Bump for the associated vault PDA. |
| `created_at` | `i64` | Unix seconds. |

### `Stake` PDA
Seeds: `[b"stake", survey: Pubkey, participant: Pubkey]`

| Field | Type | Notes |
|---|---|---|
| `survey` | `Pubkey` | Parent survey PDA. |
| `participant` | `Pubkey` | The staking wallet. |
| `locked_lamports` | `u64` | Equal to `survey.stake_lamports` at commit time. |
| `commitment_hash` | `[u8; 32]` | sha256 of the response JSON (canonical serialization). |
| `verdict` | `StakeVerdict` | `Pending` → `Honest` \| `Spam`. |
| `claimed` | `bool` | True after `claim_reward`/`claim_refund`. |
| `bump` | `u8` | Self bump. |
| `committed_at` | `i64` | Unix seconds. |

### `Vault` (system-owned, no data)
Seeds: `[b"vault", survey: Pubkey]`. Holds the reward pool + every participant stake until settlement.

## Instructions

### `create_survey(params: CreateSurveyParams)`
- Signers: `creator`
- Effects: inits `Survey` PDA, inits `Vault` PDA, transfers `reward_pool_lamports` from creator → vault.
- Errors: rent / system-program failures.

### `stake_and_commit(commitment_hash: [u8; 32])`
- Signers: `participant`
- Preconditions: `survey.state == Open`, `current_participants < max_participants`, no existing `Stake` PDA for this `(survey, participant)`.
- Effects: inits `Stake` PDA, transfers `stake_lamports` from participant → vault, increments `current_participants`.
- Errors: `InvalidSurveyState`, `SurveyFull`, `AlreadyStaked` (via PDA init).

### `settle(verdicts: Vec<Verdict>)`
- Signers: `validator` (matches `survey.validator`)
- Preconditions: `survey.state == Open` or `Closed`; each referenced `Stake.verdict == Pending`.
- Effects: for each verdict, set the corresponding `Stake.verdict`; bump `survey.settled_participants`; if all participants settled, set `survey.state = Settled`.
- Errors: `UnauthorizedValidator`, `InvalidSurveyState`, `StakeAlreadySettled`, `VerdictCountMismatch`.

### `claim_reward()`
- Signers: `participant`
- Preconditions: `stake.verdict == Honest`, `!stake.claimed`, `survey.state == Settled`.
- Effects: transfers `locked_lamports + (reward_pool / honest_count)` from vault → participant; sets `claimed = true`.
- Errors: `StakeNotSettled`, `InsufficientRewardPool`.

### `claim_refund()`
- Signers: `participant`
- Preconditions: `survey.state == Closed` (closed without settlement, e.g. timeout), `!stake.claimed`.
- Effects: transfers `locked_lamports` from vault → participant; sets `claimed = true`.

## Events (planned)

`SurveyCreated`, `StakeCommitted`, `SurveySettled`, `RewardClaimed`, `RefundClaimed`. The Helius webhook handler maps each to a DB write.

## Storage costs (rough)

| Account | Bytes | Lamports rent |
|---|---|---|
| `Survey` | ~180 | ~0.0013 SOL |
| `Stake` | ~110 | ~0.0009 SOL |

These are per-survey and per-participant respectively. The creator covers the survey rent; participants cover their own stake rent. Vault PDAs are system-owned and need only enough lamports to be rent-exempt as a 0-byte account.
