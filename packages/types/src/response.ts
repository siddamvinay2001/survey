export interface AnswerValue {
  questionId: string;
  value: string | string[];
}

export interface ResponsePayload {
  surveyId: string;
  answers: AnswerValue[];
  submittedAt: string;
}

export interface Response {
  id: string;
  surveyId: string;
  participant: string;
  commitmentHash: string;
  encryptedPayload: string;
  submittedAt: string;
  stakeLamports: string;
}
