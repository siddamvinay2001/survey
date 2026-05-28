export type Verdict = 'honest' | 'spam';

export interface HeuristicScore {
  responseTimeMs: number;
  responseTimeFlag: boolean;
  duplicateFlag: boolean;
  lengthFlag: boolean;
  copyFromPromptFlag: boolean;
}

export interface LlmScore {
  model: string;
  promptHash: string;
  qualityScore: number;
  reasoning: string;
}

export interface FinalScore {
  responseId: string;
  verdict: Verdict;
  heuristics: HeuristicScore;
  llm: LlmScore | null;
  scoredAt: string;
}
