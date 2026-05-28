import 'server-only';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// In production this must read from a secret manager (AWS Secrets Manager,
// Doppler, Vault) — never directly from process.env. The env-file path here
// is a local-dev convenience only.

let cached: Keypair | null = null;

export function getValidatorKeypair(): Keypair {
  if (cached) return cached;
  const secret = process.env.VALIDATOR_KEYPAIR;
  if (!secret) {
    throw new Error(
      'VALIDATOR_KEYPAIR is not set. In dev, generate one with `solana-keygen new -o validator.json` and base58-encode the secret.',
    );
  }
  cached = Keypair.fromSecretKey(bs58.decode(secret));
  return cached;
}
