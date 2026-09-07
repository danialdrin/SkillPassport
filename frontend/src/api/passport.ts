import { apiClient } from './client';
import { PassportResponse, GapRecommendationResponse } from '../types/passport';

export const passportApi = {
  getPassport: (userId: string): Promise<PassportResponse> => {
    return apiClient<PassportResponse>(`/passport/${userId}`, {
      method: 'GET',
    });
  },

  getPassportGaps: (userId: string): Promise<GapRecommendationResponse> => {
    return apiClient<GapRecommendationResponse>(`/passport/${userId}/gaps`, {
      method: 'GET',
    });
  },
};
