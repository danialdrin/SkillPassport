import { apiClient } from './client';
import { ResourceResponse } from '../types/resources';

export interface SelectResourceResponse {
  resource_id: string;
  status: string;
  job_id: string;
  message: string;
}

export interface UploadResourceResponse {
  resource_id: string;
  title: string;
  status: string;
  job_id: string;
  message: string;
}

export const resourcesApi = {
  select: (resourceId: string): Promise<SelectResourceResponse> => {
    return apiClient<SelectResourceResponse>(`/resources/${resourceId}/select`, {
      method: 'POST',
    });
  },

  upload: (formData: FormData): Promise<UploadResourceResponse> => {
    return apiClient<UploadResourceResponse>('/resources/upload', {
      method: 'POST',
      body: formData,
    });
  },

  list: (): Promise<ResourceResponse[]> => {
    return apiClient<ResourceResponse[]>('/resources', {
      method: 'GET',
    });
  },
};
