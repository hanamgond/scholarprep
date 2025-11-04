import { apiClient } from '../../../services/http/client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    tenantId: string;
    campusId?: string;
    role: string;
    permissions: string[];
  };
  accessToken: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }

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
}

export const authService = new AuthService();
