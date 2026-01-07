import { apiClient } from '@/services/http/client';
import type { Student, StudentCreatePayload, StudentListItem } from '../types/student';

export const studentsService = {
  async getAll(page: number = 1, pageSize: number = 10): Promise<{
    items: Student[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    try {
      const { data } = await apiClient.get(`/api/students?page=${page}&pageSize=${pageSize}`);
      
      console.log('📡 Students API Response:', data);
      
      // Handle different response formats
      if (Array.isArray(data)) {
        // If backend returns just an array (fallback)
        return {
          items: data,
          totalCount: data.length,
          page,
          pageSize,
          totalPages: Math.ceil(data.length / pageSize),
        };
      } else if (data && data.items) {
        // If backend returns the expected paginated format
        return data;
      } else {
        // Fallback for unexpected format
        console.warn('Unexpected API response format:', data);
        return {
          items: [],
          totalCount: 0,
          page,
          pageSize,
          totalPages: 0,
        };
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw error;
    }
  },

  async create(studentData: StudentCreatePayload): Promise<Student> {
    const { data } = await apiClient.post<Student>('/api/students', studentData);
    return data;
  },

  getById: async (id: string): Promise<Student> => {
    try {
      const { data } = await apiClient.get<Student>(`/api/students/${id}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch student ${id}:`, error);
      throw error;
    }
  },
};

export function mapStudentToListItem(student: Student): StudentListItem {
  return {
    id: student.id,
    name: `${student.firstName} ${student.lastName}`.trim(),
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.firstName + ' ' + student.lastName)}&background=random`,
    admission_no: student.admissionNo,
    className: student.className || 'N/A',
    sectionName: student.sectionName || 'N/A',
    track: 'Beginner', // Default value
    rank: 1, // Default value
    metrics: {
      accuracyPct: 75, // Default value
      qpm: 45, // Default value
      consistencyPct: 80, // Default value
    },
  };
}