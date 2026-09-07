import { apiClient } from './client';
import { MaterialKGResponse, StudentKGResponse } from '../types/knowledge_graph';

export const knowledgeGraphApi = {
  getMaterialKG: (analysisId: string): Promise<MaterialKGResponse> => {
    return apiClient<MaterialKGResponse>(`/knowledge-graph/material/${analysisId}`, {
      method: 'GET',
    });
  },

  getStudentKG: (userId: string): Promise<StudentKGResponse> => {
    return apiClient<StudentKGResponse>(`/knowledge-graph/student/${userId}`, {
      method: 'GET',
    });
  },
};
