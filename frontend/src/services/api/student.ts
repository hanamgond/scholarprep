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
// This matches your .NET 'CreateStudentCommand'
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

// --- 👇 ADD THESE TYPES FOR THE OLD MODAL ---
// This is the type your 'StudentFormModal' expects.
// It uses the old field names from your original frontend.
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

// This is the update type your 'StudentFormModal' expects
export type UpdateStudentInput = Partial<CreateStudentInput>;