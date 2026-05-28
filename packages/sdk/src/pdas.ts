import { PublicKey } from '@solana/web3.js';

const SURVEY_SEED = Buffer.from('survey');
const STAKE_SEED = Buffer.from('stake');
const VAULT_SEED = Buffer.from('vault');

export function deriveSurveyPda(
  surveyId: Uint8Array,
  programId: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([SURVEY_SEED, Buffer.from(surveyId)], programId);
}

export function deriveStakePda(
  surveyPda: PublicKey,
  participant: PublicKey,
  programId: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [STAKE_SEED, surveyPda.toBuffer(), participant.toBuffer()],
    programId,
  );
}

export function deriveVaultPda(
  surveyPda: PublicKey,
  programId: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([VAULT_SEED, surveyPda.toBuffer()], programId);
}
