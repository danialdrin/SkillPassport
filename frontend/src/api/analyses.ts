import { apiClient } from './client';
import { AnalysisResponse } from '../types/analysis';

export const analysesApi = {
  getAnalysis: (analysisId: string): Promise<AnalysisResponse> => {
    return apiClient<AnalysisResponse>(`/analyses/${analysisId}`, {
      method: 'GET',
    });
  },
};
