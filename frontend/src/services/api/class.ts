import { apiClient } from '../http/client';
import type { Student } from '../../features/students/types/student';

export interface Class {
  id: string;
  name: string;
  studentCount: number;
  avgAccuracy: number;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  studentCount?: number;
  avgAccuracy?: number;
}

export const classService = {
  // --- Classes ---
  async getClasses(): Promise<Class[]> {
    try {
      const { data } = await apiClient.get<Class[]>('/api/classes');
      return data;
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      throw error;
    }
  },

  async createClass(name: string): Promise<Class> {
    try {
      const { data } = await apiClient.post<Class>('/api/classes', { name });
      return data;
    } catch (error) {
      console.error('Failed to create class:', error);
      throw error;
    }
  },

  async updateClass(id: string, name: string): Promise<Class> {
    try {
      const { data } = await apiClient.patch<Class>(`/api/classes/${id}`, { name });
      return data;
    } catch (error) {
      console.error('Failed to update class:', error);
      throw error;
    }
  },

  async deleteClass(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/classes/${id}`);
    } catch (error) {
      console.error('Failed to delete class:', error);
      throw error;
    }
  },

  // --- Sections ---
  async createSection(classId: string, name: string): Promise<Section> {
    try {
      const { data } = await apiClient.post<Section>('/api/sections', { class_id: classId, name });
      return data;
    } catch (error) {
      console.error('Failed to create section:', error);
      throw error;
    }
  },

  async deleteSection(sectionId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/sections/${sectionId}`);
    } catch (error) {
      console.error('Failed to delete section:', error);
      throw error;
    }
  },

  // 👇 NEW: Get Students for a Section
  async getStudentsBySection(sectionId: string): Promise<Student[]> {
    try {
      const { data } = await apiClient.get<Student[]>(`/api/sections/${sectionId}/students`);
      return data;
    } catch (error) {
      console.error('Failed to fetch section students:', error);
      return [];
    }
  }
};

export const getClasses = classService.getClasses;
export const createClass = classService.createClass;