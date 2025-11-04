// src/features/students/types/student.ts

// The complete data shape from your backend
export interface Student {
  id: string;
  tenant_id: string;
  campus_id: string;
  first_name: string;
  last_name?: string;
  admission_no: string;
  email?: string;
  gender?: string;
  dob?: string;
  status: string;
  created_at: string;
  updated_at: string;
  enrollments: {
    id: string;
    academic_year_id: string;
    roll_number: string;
    status: string;
    section: {
      id: string;
      name: string;
      class: {
        id: string;
        name: string;
      };
    };
  }[];
}

// The metrics shape
export interface StudentMetrics {
  accuracyPct: number;
  accuracyDelta: number;
  qpm: number;
  qpmDelta: number;
  consistencyPct: number;
  consistencyDelta: number;
}

// The shape your UI components will use
export type StudentListItem = Student & {
  name: string;
  avatarUrl: string;
  className: string;
  sectionName: string;
  track: string;
  rank: number;
  metrics: StudentMetrics;
};

// This is the exact shape the 'create' service function expects
export type StudentCreatePayload = {
  first_name: string;
  last_name?: string;
  email?: string;
  gender?: string;
  dob?: string;
  section_id: string;
  academic_year_id: string;
};