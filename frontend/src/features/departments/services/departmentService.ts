import type { Department } from '../types';

// Mock Data linked to your Staff Mock Data
const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'Academics',
    code: 'ACAD',
    description: 'Core teaching faculty and curriculum management.',
    hodId: '1', // Matches Alice Johnson from Staff Mock
    hodName: 'Alice Johnson',
    contactEmail: 'academics@school.com',
    location: 'Main Building, Floor 1',
    stats: { totalStaff: 45, totalSubjects: 12, budget: '$50,000' }
  },
  {
    id: 'dept-2',
    name: 'Examinations',
    code: 'EXAM',
    description: 'Handling question papers, scheduling, and results.',
    hodId: '2', // Matches Robert Smith
    hodName: 'Robert Smith',
    contactEmail: 'exams@school.com',
    location: 'Admin Block, Room 204',
    stats: { totalStaff: 8, totalSubjects: 0, budget: '$12,000' }
  },
  {
    id: 'dept-3',
    name: 'Administration',
    code: 'ADMIN',
    description: 'HR, Payroll, and General Operations.',
    hodId: '3',
    hodName: 'Sarah Connor',
    contactEmail: 'admin@school.com',
    location: 'Admin Block, Ground Floor',
    stats: { totalStaff: 15, totalSubjects: 0 }
  }
];

export const getDepartments = async (): Promise<Department[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_DEPARTMENTS), 600));
};

export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
  return new Promise((resolve) => {
    const dept = MOCK_DEPARTMENTS.find((d) => d.id === id);
    setTimeout(() => resolve(dept), 400);
  });
};

export const createDepartment = async (data: unknown): Promise<void> => {
  console.log('Mock: Creating department', data);
  return new Promise((resolve) => setTimeout(resolve, 500));
};