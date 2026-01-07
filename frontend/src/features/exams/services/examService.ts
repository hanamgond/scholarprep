import { apiClient } from '../../../services/http/client';
import type { Exam, CreateExamRequest } from '../types/exam';

export const examService = {
  getAll: async (): Promise<Exam[]> => {
    const { data } = await apiClient.get<Exam[]>('/api/exams');
    return data;
  },

  getById: async (id: string): Promise<Exam> => {
    const { data } = await apiClient.get<Exam>(`/api/exams/${id}`);
    return data;
  },

  create: async (payload: CreateExamRequest): Promise<Exam> => {
    const { data } = await apiClient.post<Exam>('/api/exams', payload);
    return data;
  },
  
  // 👇 Added missing update method
  update: async (id: string, payload: Partial<Exam>): Promise<Exam> => {
    const { data } = await apiClient.put<Exam>(`/api/exams/${id}`, payload);
    return data;
  },

  // 👇 Added missing delete method (used in ExamList)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/exams/${id}`);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateStructure: async (id: string, sections: any) => {
    const { data } = await apiClient.put<Exam>(`/api/exams/${id}/structure`, { sections });
    return data;
  }
};