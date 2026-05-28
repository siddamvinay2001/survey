import type { LlmScore, ResponsePayload, SurveyContent } from '@survey/types';

export interface LlmScoreInput {
  survey: SurveyContent;
  payload: ResponsePayload;
  apiKey: string;
  model?: string;
}

// TODO(MVP-4): wire to Anthropic SDK with prompt caching.
//   - System prompt describes the scoring rubric (clarity, on-topic, depth)
//   - User message contains the question + answer pair(s)
//   - Output: JSON { qualityScore: 0-100, reasoning: string }
//   - Cache the survey content as a system prompt block so repeated scorings
//     within the same survey hit the cache (5-minute TTL).
//   - Default model: 'claude-sonnet-4-6'. Override allowed for cheaper batch.
export async function scoreWithLlm(_input: LlmScoreInput): Promise<LlmScore> {
  throw new Error('TODO(MVP-4): implement Claude scoring with prompt caching');
}
