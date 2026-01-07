import { mockDb } from '../../../mocks/db';
import type { Class, AttendanceStudent } from '../types';

export const attendanceService = {
  // 1. Fetch all Classes and their Sections
  getClasses: async (): Promise<Class[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const dbClasses = mockDb.getClasses();
    return dbClasses.map(c => ({
      id: c.id,
      name: c.name,
      sections: c.sections.map(s => ({
        id: s.id,
        name: s.name,
        studentCount: s.studentCount
      }))
    }));
  },

  // 2. Fetch Students for a specific Section
  getStudentsForAttendance: async (sectionId: string): Promise<AttendanceStudent[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const students = mockDb.getStudentsBySection(sectionId);
    
    // FIX: Add '||' fallback to handle potential undefined values
    return students.map(s => ({
      id: s.id,
      firstName: s.firstName,
      lastName: s.lastName,
      admissionNo: s.admissionNo,
      // If className/sectionName is undefined, fallback to 'N/A' to satisfy the type
      className: s.className || 'N/A', 
      sectionName: s.sectionName || 'N/A',
      status: 'Present',
      remarks: ''
    }));
  },

  // 3. Save Attendance (Mock)
  saveAttendance: async (sectionId: string, date: string, records: AttendanceStudent[]) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`[Mock API] Saved attendance for Section ${sectionId} on ${date}`, records);
    return { success: true };
  }
};