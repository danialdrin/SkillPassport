import { apiClient } from './client';
import { JobResponse } from '../types/resources';

export const jobsApi = {
  getJobStatus: (jobId: string): Promise<JobResponse> => {
    return apiClient<JobResponse>(`/jobs/${jobId}`, {
      method: 'GET',
    });
  },
};
