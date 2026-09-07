export type QuestionType = 'mcq' | 'short_answer' | 'code_explain';

export interface ClientQuestion {
  question_id: string;
  type: QuestionType;
  prompt: string;
  options?: string[] | null;
  node_id: string;
  target_bloom?: string | null;
}

export interface QuizStartResponse {
  assessment_id: string;
  questions: ClientQuestion[];
}

export interface QuestionAnswerSubmit {
  question_id: string;
  user_answer: string;
}

export interface QuizSubmitRequest {
  answers: QuestionAnswerSubmit[];
}

export interface QuestionResultItem {
  question_id: string;
  raw_score: number; // 0.0 to 1.0
  feedback: string;
  node_id: string;
}

export interface AttemptResponse {
  attempt_id: string;
  assessment_id: string;
  user_id: string;
  score: number; // 0 to 100
  per_question_result: QuestionResultItem[];
  created_at: string;
}

export interface InterviewStartRequest {
  resource_id: string;
}

export interface InterviewAnswerRequest {
  answer: string;
}

export interface InterviewTurnResponse {
  session_id: string;
  turn_index: number;
  question?: string | null;
  evaluation?: QuestionResultItem | null;
  status: 'in_progress' | 'completed';
}

export interface InterviewHistoryItem {
  session_id: string;
  resource_id: string;
  status: string;
  turns_count: number;
  turns: Array<{
    turn_index: number;
    question: string;
    answer: string;
    evaluation?: QuestionResultItem;
    ts: string;
  }>;
  created_at: string;
}
