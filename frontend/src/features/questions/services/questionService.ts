import { apiClient } from '../../../services/http/client';
import type { Question, CreateQuestionRequest } from '../types/question';

export const questionService = {
  getAll: async (): Promise<Question[]> => {
    try {
      const response = await apiClient.get<Question[]>('/api/questions');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Question> => {
    try {
      const response = await apiClient.get<Question>(`/api/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch question ${id}:`, error);
      throw error;
    }
  },

  create: async (payload: CreateQuestionRequest): Promise<Question> => {
    try {
      const response = await apiClient.post<Question>('/api/questions', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to create question:', error);
      throw error;
    }
  },

  update: async (id: string, payload: Partial<CreateQuestionRequest>): Promise<Question> => {
    try {
      const response = await apiClient.put<Question>(`/api/questions/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Failed to update question ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/questions/${id}`);
    } catch (error) {
      console.error(`Failed to delete question ${id}:`, error);
      throw error;
    }
  }
};