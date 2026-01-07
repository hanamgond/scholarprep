// src/features/staff/services/staffService.ts
import { StaffRole, Department, StaffStatus } from '../types/staff';
import type { Staff, CreateStaffDTO } from '../types/staff';

const MOCK_STAFF: Staff[] = [
  {
    id: '1',
    fullName: 'Alice Johnson',
    email: 'alice@school.com',
    phoneNumber: '9876543210',
    role: StaffRole.TEACHER,
    department: Department.ACADEMICS,
    status: StaffStatus.ACTIVE,
    joinDate: '2023-01-15',
    academicAssignments: [
      { id: 'a1', type: 'ClassTeacher', classId: 'Class 10', sectionId: 'A', hoursPerWeek: 0 },
      { id: 'a2', type: 'SubjectTeacher', classId: 'Class 10', sectionId: 'A', subjectId: 'Mathematics', hoursPerWeek: 5 },
    ],
    contentPermissions: {
      canCreateQuestions: true,
      canGeneratePapers: false,
      accessibleSubjects: ['Mathematics', 'Physics']
    }
  },
  {
    id: '2',
    fullName: 'Robert Smith',
    email: 'bob@school.com',
    phoneNumber: '1231231234',
    role: StaffRole.CONTENT_CREATOR,
    department: Department.EXAMINATIONS,
    status: StaffStatus.ACTIVE,
    joinDate: '2022-05-20',
    academicAssignments: [],
    contentPermissions: {
      canCreateQuestions: true,
      canGeneratePapers: true,
      accessibleSubjects: ['All']
    }
  }
];

export const getStaffList = async (): Promise<Staff[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_STAFF), 500));
};

export const getStaffById = async (id: string): Promise<Staff | undefined> => {
  return new Promise((resolve) => {
    const staff = MOCK_STAFF.find((s) => s.id === id);
    setTimeout(() => resolve(staff), 300);
  });
};

// Fixed 'any' to 'CreateStaffDTO'
export const createStaff = async (data: CreateStaffDTO): Promise<void> => {
  console.log("Mock API: Creating staff", data);
  return new Promise((resolve) => setTimeout(resolve, 500));
};

export const updateStaffStatus = async (id: string, status: StaffStatus): Promise<void> => {
  console.log(`Mock API: Updating staff ${id} to ${status}`);
  return new Promise((resolve) => setTimeout(resolve, 300));
};