export type SurveyState = 'draft' | 'open' | 'closed' | 'settled';

export type QuestionType = 'multiple_choice' | 'short_answer';

export interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple_choice';
  prompt: string;
  options: string[];
}

export interface ShortAnswerQuestion {
  id: string;
  type: 'short_answer';
  prompt: string;
  minLength: number;
  maxLength: number;
}

export type Question = MultipleChoiceQuestion | ShortAnswerQuestion;

export interface SurveyContent {
  version: 1;
  title: string;
  description: string;
  questions: Question[];
}

export interface Survey {
  id: string;
  pdaAddress: string;
  creator: string;
  content: SurveyContent;
  contentHash: string;
  rewardPoolLamports: string;
  stakeLamports: string;
  maxParticipants: number;
  state: SurveyState;
  createdAt: string;
  closedAt: string | null;
}
