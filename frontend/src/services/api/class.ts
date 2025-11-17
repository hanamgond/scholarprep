// The import path must go up one level to find 'http/client'
import { apiClient } from '../http/client';

// This is the DTO from your .NET backend (ClassesController.cs)
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
}

export const classService = {
  /**
   * Fetches all classes for the current tenant.
   * Calls: GET /api/classes
   */
  async getClasses(): Promise<Class[]> {
    try {
      const { data } = await apiClient.get<Class[]>('/api/classes');
      return data;
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      throw error;
    }
  }
};