import type { HeuristicScore, ResponsePayload, SurveyContent } from '@survey/types';

export interface HeuristicInput {
  survey: SurveyContent;
  payload: ResponsePayload;
  surveyOpenedAt: Date;
  submittedAt: Date;
  otherResponses: ResponsePayload[];
}

// TODO(MVP-4): implement these checks. Each one is a pure function over the
// input. Flag rules (initial proposal — tune with real data):
//   - responseTimeFlag: < 5 seconds for a >1-question survey
//   - duplicateFlag: identical answers to an existing response in otherResponses
//   - lengthFlag: short_answer below minLength or non-meaningful (all whitespace)
//   - copyFromPromptFlag: answer is substring of the question prompt
export function runHeuristics(_input: HeuristicInput): HeuristicScore {
  throw new Error('TODO(MVP-4): implement heuristic checks');
}
