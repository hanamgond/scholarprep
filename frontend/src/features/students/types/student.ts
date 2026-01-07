// --- This is the new API data ---
// This interface MUST match your .NET StudentDto
export interface Student {
  // Core Fields (From Backend)
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
  
  // Derived Fields (From Joins)
  className?: string;
  sectionName?: string;

  // Extended Details (Optional - might be null in DB)
  rollNumber?: string;
  gender?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  
  // Note: The UI uses 'contactNumber' for the parent's phone in the details view
  contactNumber?: string; 

  // Dashboard/Performance Stats (Optional / Calculated)
  rank?: number;
  accuracyPercent?: number;
  questionsPerMinute?: number;
  
  // Old fields (kept for compatibility if needed, or can be removed later)
  track?: string;
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
  sectionId: string; 

  rollNumber?: string;
  gender?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
}

// --- For the Modal ---
export interface CreateStudentInput {
  name: string;
  admission_no: string;
  rollNumber: string;
  className: string;
  section: string;
  dob: string;
  fatherName: string;
  motherName: string;
  contactNumber: string;
  email: string;
  address: string;
  gender: string;
}

export type UpdateStudentInput = Partial<CreateStudentInput>;