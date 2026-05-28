import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';

// TODO(MVP-4): the validator endpoint.
// Triggered either by cron (when survey closes) or manually by the creator.
//   1. Load all Responses for the survey
//   2. For each: runHeuristics + scoreWithLlm + combineScores
//   3. Persist Score rows + ValidatorRun row
//   4. Build a `settle` tx with the verdict list, sign with validator key
//   5. Submit to chain, store txSignature on ValidatorRun

export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: 'TODO(MVP-4)' }, { status: 501 });
}
