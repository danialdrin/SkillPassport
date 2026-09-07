import { apiClient } from './client';
import { normalizeSummary, normalizeFlashcards, normalizePracticeQuiz } from '../utils/normalizers';
import { SummaryContent, FlashcardsContent, PracticeQuizContent } from '../types/interactive';

export const interactiveApi = {
  getSummary: async (resourceId: string): Promise<SummaryContent> => {
    const raw = await apiClient<unknown>(`/resources/${resourceId}/summary`, { method: 'GET' });
    return normalizeSummary(raw);
  },

  getFlashcards: async (resourceId: string): Promise<FlashcardsContent> => {
    const raw = await apiClient<unknown>(`/resources/${resourceId}/flashcards`, { method: 'GET' });
    return normalizeFlashcards(raw);
  },

  getPracticeQuiz: async (resourceId: string): Promise<PracticeQuizContent> => {
    const raw = await apiClient<unknown>(`/resources/${resourceId}/quiz`, { method: 'GET' });
    return normalizePracticeQuiz(raw);
  },
};
