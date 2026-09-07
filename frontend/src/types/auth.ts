export interface User {
  user_id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';
