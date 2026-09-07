import { apiClient } from './client';
import { SearchQueryRequest, SearchResponse, ResourceResponse } from '../types/resources';

export const searchApi = {
  search: (data: SearchQueryRequest): Promise<SearchResponse> => {
    return apiClient<SearchResponse>('/search', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  analyzeMedium: (resourceId: string): Promise<ResourceResponse> => {
    return apiClient<ResourceResponse>(`/search/${resourceId}/analyze-medium`, {
      method: 'POST',
    });
  },
};
