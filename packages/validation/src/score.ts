import type { FinalScore, HeuristicScore, LlmScore, Verdict } from '@survey/types';

export interface CombineInput {
  responseId: string;
  heuristics: HeuristicScore;
  llm: LlmScore | null;
}

// TODO(MVP-4): tune the combination rule with real data.
// Initial proposal:
//   - If ANY heuristic flag is set AND llm.qualityScore < 40  -> spam
//   - If llm is null AND >=2 heuristic flags -> spam (fallback when LLM down)
//   - Otherwise -> honest
export function combineScores(input: CombineInput): FinalScore {
  const flagged =
    input.heuristics.responseTimeFlag ||
    input.heuristics.duplicateFlag ||
    input.heuristics.lengthFlag ||
    input.heuristics.copyFromPromptFlag;

  let verdict: Verdict = 'honest';
  if (flagged && input.llm && input.llm.qualityScore < 40) verdict = 'spam';
  if (!input.llm && countFlags(input.heuristics) >= 2) verdict = 'spam';

  return {
    responseId: input.responseId,
    verdict,
    heuristics: input.heuristics,
    llm: input.llm,
    scoredAt: new Date().toISOString(),
  };
}

function countFlags(h: HeuristicScore): number {
  return [h.responseTimeFlag, h.duplicateFlag, h.lengthFlag, h.copyFromPromptFlag].filter(
    Boolean,
  ).length;
}
