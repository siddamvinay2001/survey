# Runbook

Step-by-step procedures for local dev, devnet deploy, and incident response.

## Prerequisites

Install once per machine:
- Node 20+ (`nvm use` will pick it from `.nvmrc`)
- pnpm 9 (`corepack enable && corepack prepare pnpm@9.12.0 --activate`)
- Rust 1.79+ (`rustup install 1.79 && rustup default 1.79`)
- Solana CLI 1.18 (`sh -c "$(curl -sSfL https://release.solana.com/v1.18.26/install)"`)
- Anchor 0.30 (`cargo install --git https://github.com/coral-xyz/anchor avm --force && avm install 0.30.1 && avm use 0.30.1`)

Or use [`asdf`](https://asdf-vm.com/) with the `.tool-versions` file:
```bash
asdf install
```

## Local development

```bash
# One-time setup
pnpm install
cp .env.example .env
# fill in DATABASE_URL (Supabase project), ANTHROPIC_API_KEY, etc.

# Generate Prisma client + run migrations against the configured DB
pnpm db:generate
pnpm db:migrate

# Build the Solana program (target/idl is committed for the SDK)
pnpm anchor:build

# Run the web app
pnpm dev
# → http://localhost:3000
```

### Running tests against a local Solana validator

```bash
# In one terminal: start a local validator
solana-test-validator --reset

# In another: run anchor tests against it
pnpm anchor:test
```

### Generating a dev validator keypair

```bash
solana-keygen new -o ./validator.json --no-bip39-passphrase
# Convert to base58 for VALIDATOR_KEYPAIR env var:
node -e "console.log(require('bs58').default.encode(Uint8Array.from(require('./validator.json'))))"
# Copy output into .env as VALIDATOR_KEYPAIR=...
# DO NOT commit validator.json — it's in .gitignore.
```

## Devnet deploy

```bash
solana config set --url devnet
solana airdrop 5  # may need to retry; devnet faucet is rate-limited

# First-time deploy
pnpm --filter @survey/anchor anchor:deploy:devnet
# Copy the program ID from the output into:
#   - apps/web env: NEXT_PUBLIC_PROGRAM_ID
#   - Anchor.toml: [programs.devnet] survey = "..."

# Subsequent upgrades
pnpm anchor:build
pnpm --filter @survey/anchor anchor:deploy:devnet
```

## Database migrations

```bash
# Author a new migration
pnpm db:migrate --name add_some_column
# Generates packages/db/prisma/migrations/<timestamp>_add_some_column/migration.sql
# COMMIT this file.

# Apply migrations on a remote env (CI / preview / prod)
pnpm --filter @survey/db prisma migrate deploy
```

## Incident: validator key compromise

1. **Immediately** rotate the key in the secret manager. Generate a new keypair locally, push to Doppler/Vault, redeploy the backend.
2. Update the `validator` field on all open `Survey` PDAs. This requires a one-time migration instruction (TODO: add `rotate_validator` instruction in MVP-1) signed by the survey creator.
3. Audit recent `ValidatorRun` rows for unexpected `settle` txs. Cross-check signers on-chain.
4. If unauthorized settlements occurred, pause new surveys (feature flag) and publicly disclose. Affected participants can dispute via the (yet-to-be-built) dispute path; for MVP we'll refund manually from the team treasury.

## Incident: DB outage mid-validation

`ValidatorRun` rows are written before the on-chain `settle` tx is built, and the tx signature is stored after success. On restart:
1. Find `ValidatorRun` rows with `completedAt IS NULL`.
2. Re-fetch the survey + responses; recompute scores; rebuild the `settle` tx.
3. Submit. The `settled_participants` counter on-chain prevents double-settlement.

## Common gotchas

- **`anchor build` fails with "linker `cc` not found"** on Mac: `xcode-select --install`.
- **`pnpm install` complains about peer deps for React 18**: `.npmrc` has `auto-install-peers=true`; if you see it persist, `rm -rf node_modules pnpm-lock.yaml && pnpm install`.
- **Prisma client missing types after schema change**: `pnpm db:generate`.
- **Wallet button shows "wallet not connected" forever**: clear localStorage; the wallet-adapter caches a stale wallet name.
