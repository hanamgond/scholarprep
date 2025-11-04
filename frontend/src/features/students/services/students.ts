// src/features/students/services/students.ts

import { apiClient } from '@/services/http/client';
// ✅ Import ALL types from the single source of truth
import {
  type Student,
  type StudentListItem,
  type StudentMetrics,
  type StudentCreatePayload
} from '@/features/students/types/student';

// ❌ All type/interface definitions are GONE from this file.

// ✅ UPDATED: Map backend data to UI format (with mock metrics)
export function mapStudentToListItem(student: Student): StudentListItem {
  const currentEnrollment = student.enrollments?.[0];

  // --- MOCK DATA ---
  const mockRank = Math.floor(Math.random() * 50) + 1;
  const mockMetrics: StudentMetrics = {
    accuracyPct: Math.floor(Math.random() * 20) + 80,
    accuracyDelta: Math.floor(Math.random() * 10) - 5,
    qpm: Math.floor(Math.random() * 5) + 1,
    qpmDelta: Math.floor(Math.random() * 20) - 10,
    consistencyPct: Math.floor(Math.random() * 20) + 75,
    consistencyDelta: Math.floor(Math.random() * 10) - 5,
  };
  // --- END MOCK DATA ---

  return {
    ...student,
    name: `${student.first_name} ${student.last_name || ''}`.trim(),
    className: currentEnrollment?.section?.class?.name ?? 'N/A',
    sectionName: currentEnrollment?.section?.name ?? 'N/A',
    avatarUrl: `https://i.pravatar.cc/48?u=${student.id}`,
    track: 'Default Track', // Placeholder
    rank: mockRank,         // Placeholder
    metrics: mockMetrics,   // Placeholder
  };
}

// Real API service functions
export const studentsService = {
  // Get all students for current tenant
  async getAll(): Promise<Student[]> {
    const response = await apiClient.get<Student[]>('/students');
    return response.data;
  },

  // Get student by ID
  async getById(id: string): Promise<Student> {
    const response = await apiClient.get<Student>(`/students/${id}`);
    return response.data;
  },

  // ✅ UPDATED: Create new student (using the correct type)
  async create(studentData: StudentCreatePayload): Promise<Student> {
    const response = await apiClient.post<Student>('/students', studentData);
    return response.data;
  },

  // Update student
  async update(id: string, studentData: Partial<Student>): Promise<Student> {
    const response = await apiClient.patch<Student>(`/students/${id}`, studentData);
    return response.data;
  },

  // Delete student (soft delete)
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/students/${id}`);
  },

  // Bulk create students
  async bulkCreate(file: File, sectionId: string, academicYearId: string): Promise<Student[]> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section_id', sectionId);
    formData.append('academic_year_id', academicYearId);

    const response = await apiClient.post<Student[]>('/students/bulk-create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get dashboard metrics
  async getDashboardMetrics() {
    const response = await apiClient.get('/students/dashboard/metrics');
    return response.data;
  },

  // Get bulk template
  async getBulkTemplate() {
    const response = await apiClient.get('/students/bulk-template', {
      responseType: 'blob'
    });
    return response.data;
  }
};