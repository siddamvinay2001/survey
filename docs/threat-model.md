# Threat model

> This is a living document. When you ship a feature that introduces a new attack surface, add a row here. When a deferred mitigation lands, move it from "future" to "current."

## Attacker classes

1. **Spam farmer** — wants to maximize reward extraction with minimal effort. Will use bots, copy-paste, and minimum-length answers.
2. **Sybil attacker** — has access to many wallets; wants to flood a survey to capture a disproportionate share of the reward pool.
3. **Malicious creator** — wants to extract participant stakes without honoring the reward pool, or wants to drain it back to themselves.
4. **Colluding creator + validator** — creator pays validator off-chain to mark specific responses as honest/spam.
5. **External compromise** — attacker steals the validator key.

## Threats and mitigations

| # | Threat | MVP mitigation | Future hardening |
|---|---|---|---|
| 1 | Random/short-text spam to claim rewards | Heuristic flags (length, repeated chars, copy-from-prompt) + LLM quality score gate the verdict. Stakes large enough that even an LLM-detected spam answer is net-negative for the farmer. | Per-wallet rate limits across surveys; reputation-based stake multipliers. |
| 2 | LLM-generated answers that pass surface heuristics | Claude scoring rubric specifically penalizes generic / "looks-coherent-but-shallow" outputs; we cache scoring inputs so we can replay disputed scores. | Diverse multi-validator quorum; randomized validator assignment so collusion is harder. |
| 3 | Sybil floods (one user, many wallets) | Stake amount + reward pool ratio is set so farming is uneconomical at small reward sizes. Documented in survey-creation UI. | Civic Pass / proof-of-personhood per wallet; minimum on-chain age for participation. |
| 4 | Malicious creator drains pool | Reward pool locked in vault PDA at create time. Only `settle`-triggered `claim_reward` / timeout-triggered `claim_refund` paths move funds. Creator has no withdrawal instruction. | Same — already correct. |
| 5 | Creator-validator collusion | Single trusted validator is an explicit MVP limitation; called out in user-facing copy ("v1 trust model: backend validator"). | Multi-validator quorum (M-of-N) with randomized assignment; on-chain dispute window where any participant can challenge a verdict by forfeiting an extra stake. |
| 6 | Validator key compromise | Key stored in secret manager (Doppler/Vault) in prod, never in repo or env files in CI. Documented rotation runbook. Validator can only `settle`, not transfer funds directly. | Multisig settlement; hardware-backed signer (HSM/YubiHSM). |
| 7 | Response replay / front-running | Wallet signs `sha256(response_json)` commitment hash submitted on-chain *before* plaintext is sent to backend. Backend rejects a response whose hash doesn't match the on-chain commitment. | ZK proof of valid submission so plaintext never has to be revealed to the validator. |
| 8 | Backend tampering with stored responses | Encrypted payload + on-chain commitment hash makes tampering detectable. A participant can prove what they submitted by revealing the plaintext + nonce. | Public, append-only response log (e.g. Arweave) keyed by commitment hash. |
| 9 | Backend marks honest participant as spam to hoard reward share | Validator can't redirect funds, only set verdict. But it CAN reduce a participant's payout to zero. | Dispute window (#5); reputation-tied validator slashing in v2. |
| 10 | DB outage during validation | `ValidatorRun` table records all inputs and the final tx; idempotent retry. If DB is lost entirely, the on-chain `settle` tx is the source of truth and can be rebuilt from chain logs. | Standby replica; consider Arweave write-through. |
| 11 | LLM prompt injection inside a survey response | System prompt is in a cached system block; the response is wrapped in `<response>` tags and the model is instructed to ignore instructions inside response content. Output is constrained to a JSON schema, so even successful injection can only alter `qualityScore` within bounds. | Output verifier model; multiple model votes. |
| 12 | Front-running `settle` to extract stakes | Settlement is a single tx that updates all verdicts; there's no exploitable in-between state. Claims require `state == Settled`. | Same — already correct. |

## Out-of-scope

- We don't defend against a participant who is themselves a determined human writing thoughtful low-effort answers — that's a judgment call and falls under expected creator risk.
- We don't claim censorship resistance. The validator is centralized in MVP; it can refuse to settle. Mitigation is the public deferred-claim path (`claim_refund` after timeout).
