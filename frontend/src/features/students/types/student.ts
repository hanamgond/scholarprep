// --- This is the new API data ---
// This interface MUST match your .NET StudentDto
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionNo: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  campusId: string;
  campusName: string;
  createdAt: string;
  updatedAt: string;
}

// --- This is what your UI components expect ---
export interface StudentListItem {
  id: string;
  name: string;
  avatarUrl: string;
  admission_no: string;
  className?: string;
  sectionName?: string;
  track?: string;
  rank?: number;
  
  // 👇 THIS IS THE FIX 👇
  // We define the properties instead of using an empty object
  metrics?: {
    accuracyPct: number;
    accuracyDelta?: number;
    qpm: number;
    qpmDelta?: number;
    consistencyPct: number;
    consistencyDelta?: number;
  };
}

// --- This is what your "Create" form needs ---
export interface StudentCreatePayload {
  campusId: string;
  firstName: string;
  lastName: string;
  admissionNo: string;
  email: string;
  phone: string;
  dateOfBirth: string; // ISO string
  rollNumber?: string;
  gender?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
}