// frontend/src/services/healthService.ts
import { apiClient } from '../http/client';

export const healthService = {
  async checkHealth() {
    const response = await apiClient.get('/health');
    return response.data;
  }
};