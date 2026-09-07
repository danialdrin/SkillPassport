import { apiClient } from './client';
import { AnalysisResponse } from '../types/analysis';

export const analysesApi = {
  getLatestForResource: (resourceId: string): Promise<AnalysisResponse> => {
    return apiClient<AnalysisResponse>(`/resources/${resourceId}/analysis`, {
      method: 'GET',
    });
  },
  getAnalysis: (analysisId: string): Promise<AnalysisResponse> => {
    return apiClient<AnalysisResponse>(`/analyses/${analysisId}`, {
      method: 'GET',
    });
  },
};
