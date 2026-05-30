import 'server-only';
import { type NextRequest, NextResponse } from 'next/server';

// TODO(MVP-3): accept a response from a participant.
//   Required body: { surveyId, encryptedPayload, commitmentHash, txSignature }
//   - Verify txSignature is a confirmed stake_and_commit for this (survey, wallet)
//   - Verify the on-chain commitment_hash matches the body commitmentHash
//   - Persist Response row (one per wallet+survey enforced by unique index)

export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: 'TODO(MVP-3)' }, { status: 501 });
}
