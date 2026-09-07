import { apiClient } from './client';
import {
  QuizStartResponse,
  QuizSubmitRequest,
  AttemptResponse,
  InterviewTurnResponse,
  InterviewHistoryItem,
} from '../types/assessment';

export const examsApi = {
  startQuiz: (resourceId: string): Promise<QuizStartResponse> => {
    return apiClient<QuizStartResponse>('/exams/quiz/start', {
      method: 'POST',
      body: JSON.stringify({ resource_id: resourceId }),
    });
  },

  submitQuiz: (assessmentId: string, body: QuizSubmitRequest): Promise<AttemptResponse> => {
    return apiClient<AttemptResponse>(`/exams/quiz/${assessmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  startInterview: (resourceId: string): Promise<InterviewTurnResponse> => {
    return apiClient<InterviewTurnResponse>('/exams/interview/start', {
      method: 'POST',
      body: JSON.stringify({ resource_id: resourceId }),
    });
  },

  answerInterviewTurn: (sessionId: string, answer: string): Promise<InterviewTurnResponse> => {
    return apiClient<InterviewTurnResponse>(`/exams/interview/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ answer }),
    });
  },

  getInterviewHistory: (userId: string): Promise<InterviewHistoryItem[]> => {
    return apiClient<InterviewHistoryItem[]>(`/exams/interview/history/${userId}`, {
      method: 'GET',
    });
  },
};
