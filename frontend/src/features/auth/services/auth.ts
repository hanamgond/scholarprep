import { apiClient } from '../../../services/http/client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

// REMOVED: Unused 'DecodedToken' interface.
// It will be moved to AuthContext.tsx where it's actually used.

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  // REMOVED: Unused 'register' stub to fix linting errors.
  /*
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    tenantName: string;
  }) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  }
  */
}

export const authService = new AuthService();