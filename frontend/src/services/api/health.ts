// frontend/src/services/healthService.ts
import { apiClient } from '../http/client';

export const healthService = {
  async checkHealth() {
    const response = await apiClient.get('/api/health');
    return response.data;
  }
};