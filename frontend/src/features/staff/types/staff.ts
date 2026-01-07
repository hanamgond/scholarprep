// src/features/staff/types/staff.ts

// REPLACEMENT FOR ENUMS (Erasable Syntax Compatible)
export const StaffRole = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  CONTENT_CREATOR: 'CONTENT_CREATOR',
  ANALYST: 'ANALYST',
  SUPPORT: 'SUPPORT',
} as const;
export type StaffRole = (typeof StaffRole)[keyof typeof StaffRole];

export const Department = {
  ADMINISTRATION: 'Administration',
  ACADEMICS: 'Academics',
  EXAMINATIONS: 'Examinations',
  ANALYTICS: 'Analytics',
  IT: 'IT',
  TRANSPORT: 'Transport',
} as const;
export type Department = (typeof Department)[keyof typeof Department];

export const StaffStatus = {
  ACTIVE: 'Active',
  ON_LEAVE: 'On Leave',
  TERMINATED: 'Terminated',
  SUSPENDED: 'Suspended',
} as const;
export type StaffStatus = (typeof StaffStatus)[keyof typeof StaffStatus];

// INTERFACES
export interface AcademicAssignment {
  id: string;
  type: 'ClassTeacher' | 'SubjectTeacher' | 'StudyHourManager';
  classId: string;
  sectionId: string;
  subjectId?: string;
  hoursPerWeek: number;
}

export interface ContentPermissions {
  canCreateQuestions: boolean;
  canGeneratePapers: boolean;
  accessibleSubjects: string[]; 
}

export interface Staff {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: StaffRole;
  department: Department;
  status: StaffStatus;
  joinDate: string;
  avatarUrl?: string;
  academicAssignments: AcademicAssignment[];
  contentPermissions: ContentPermissions;
}

export interface CreateStaffDTO {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: StaffRole;
  department: Department;
  joinDate: string;
}