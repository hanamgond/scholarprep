// src/features/departments/types/index.ts

export interface DepartmentStats {
  totalStaff: number;
  totalSubjects: number; // e.g., Physics, Chem, Bio inside Science
  budget?: string;       // Optional financial tracking
}

export interface Department {
  id: string;
  name: string;
  code: string;           // e.g., "SCI", "MATH", "ADMIN"
  description: string;
  hodId?: string;         // Link to a Staff ID
  hodName?: string;       // Denormalized for display
  stats: DepartmentStats;
  contactEmail: string;
  location: string;       // e.g., "Block A, 2nd Floor"
}

export interface CreateDepartmentDTO {
  name: string;
  code: string;
  description: string;
  hodId?: string;
  contactEmail: string;
  location: string;
}