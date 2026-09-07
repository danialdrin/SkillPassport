import { apiClient } from './client';
import { User, UserRegisterRequest, UserLoginRequest, TokenResponse } from '../types/auth';

export const authApi = {
  register: (data: UserRegisterRequest): Promise<User> => {
    return apiClient<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: (data: UserLoginRequest): Promise<TokenResponse> => {
    return apiClient<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: (): Promise<User> => {
    return apiClient<User>('/auth/me', {
      method: 'GET',
    });
  },
};
