import { apiClient } from '@/services/http/client';
// 1. This import is now correct
import type { Student, StudentListItem, StudentCreatePayload } from '../types/student';

/**
 * 2. THIS FUNCTION WAS MISSING
 * This "translator" function takes the backend 'Student' object
 * and converts it into the 'StudentListItem' object that your
 * UI components (like Overview.tsx) expect.
 */
export function mapStudentToListItem(student: Student): StudentListItem {
  return {
    // Direct Mappings
    id: student.id,
    admission_no: student.admissionNo,

    // Transformed/Created Data
    name: `${student.firstName} ${student.lastName}`,
    avatarUrl: `https://i.pravatar.cc/48?u=${student.id}`, // Generates a placeholder avatar

    // "Hidden" Data (set to defaults)
    // Your UI expects these, but the new API doesn't have them yet.
    className: "Class TBD", // Placeholder
    sectionName: "Section TBD", // Placeholder
    track: "Track TBD", // Placeholder
    rank: 0,
    metrics: {
      accuracyPct: 0,
      accuracyDelta: 0,
      qpm: 0,
      qpmDelta: 0,
      consistencyPct: 0,
      consistencyDelta: 0,
    },
  };
}


// This service object holds all your student-related API calls
export const studentsService = {
  
  getAll: async (): Promise<Student[]> => {
    try {
      const { data } = await apiClient.get<Student[]>('/api/Students');
      return data;
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw error;
    }
  },

  create: async (studentData: StudentCreatePayload): Promise<Student> => {
    try {
      // Calls: POST http://localhost:5168/api/Students
      const { data } = await apiClient.post<Student>('/api/Students', studentData);
      return data;
    } catch (error) {
      console.error('Failed to create student:', error);
      throw error;
    }
  },
  
  // ... other methods like getById, update, delete will go here
};